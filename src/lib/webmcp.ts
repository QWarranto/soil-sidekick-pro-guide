/**
 * WebMCP tool registration for /docs.
 *
 * WebMCP exposes MCP tools *inside the page* via `navigator.modelContext`, so a
 * browser-side agent can call documented operations instead of scraping the DOM.
 *
 * Guardrails:
 *  1. Feature-flagged: dev, or VITE_ENABLE_WEBMCP=true in the build.
 *  2. Feature-detected: no-op when the browser has no `navigator.modelContext`.
 *  3. Docs tools read only from src/lib/publicDocs.ts (the allowlist boundary),
 *     so internal docs are unreachable by agents as well as by URL.
 *  4. Data tools proxy the same free-tier edge functions the public pages use
 *     and are tagged `source: webmcp` for the developer-funnel telemetry.
 */
import { supabase } from '@/integrations/supabase/client';
import { docBySlug, publicDocs, searchPublicDocs } from '@/lib/publicDocs';

const WEBMCP_SOURCE = 'webmcp';

export const isWebMCPEnabled = (): boolean =>
  import.meta.env.DEV === true || import.meta.env.VITE_ENABLE_WEBMCP === 'true';

type ToolResult = { content: Array<{ type: 'text'; text: string }> };

type WebMCPTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, any>) => Promise<ToolResult>;
};

type ModelContext = {
  registerTool?: (tool: WebMCPTool) => { unregister?: () => void } | void;
  provideContext?: (context: { tools: WebMCPTool[] }) => void;
};

const asText = (value: unknown): ToolResult => ({
  content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }],
});

/**
 * Free-tier allowances surfaced to agents when a call is throttled or capped.
 * Keep in sync with the published free-tier quotas on /docs.
 */
const FREE_TIER_ALLOWANCES: Record<string, string> = {
  county_lookup: '3 county lookups per month (60 requests/minute burst limit)',
  get_soil_data: '3 soil profile lookups per month (free tier)',
  planting_calendar: '3 planting-calendar lookups per month (free tier)',
};

const UPGRADE_URL = 'https://app.soilsidekickpro.com/api-keys';
const PRICING_DOC = '/docs/get-started/quick-start';

class ToolCallError extends Error {
  status?: number;
  retryAfterSeconds?: number;
  details?: unknown;

  constructor(message: string, init: { status?: number; retryAfterSeconds?: number; details?: unknown } = {}) {
    super(message);
    this.name = 'ToolCallError';
    this.status = init.status;
    this.retryAfterSeconds = init.retryAfterSeconds;
    this.details = init.details;
  }
}

const parseRetryAfter = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, Math.round(seconds));
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, Math.round((date - Date.now()) / 1000));
};

const formatWait = (seconds?: number): string => {
  if (!seconds) return 'a few seconds';
  if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
};

const callFunction = async (
  name: string,
  body: Record<string, unknown>,
  opts: { freeTierHeader?: boolean } = {}
) => {
  // Source is tagged in the body, not headers: functions built on the shared
  // request-handler only allow a narrow CORS header list, so custom headers
  // (and x-free-tier on those routes) fail preflight.
  const { data, error } = await supabase.functions.invoke(name, {
    body: { ...body, source: WEBMCP_SOURCE, sdk: 'webmcp/1.0' },
    ...(opts.freeTierHeader ? { headers: { 'x-free-tier': 'true' } } : {}),
  });

  if (error) {
    // supabase-js wraps non-2xx responses in FunctionsHttpError with the raw
    // Response on `context` — read status/headers/body so throttling can be
    // explained instead of collapsing into "Edge Function returned a non-2xx".
    const response: Response | undefined = (error as any)?.context instanceof Response
      ? (error as any).context
      : undefined;

    let payload: any;
    if (response) {
      try {
        payload = await response.clone().json();
      } catch {
        payload = undefined;
      }
    }

    throw new ToolCallError(
      payload?.error?.message ?? payload?.error ?? payload?.message ?? error.message ?? `${name} failed`,
      {
        status: response?.status,
        retryAfterSeconds:
          parseRetryAfter(response?.headers.get('retry-after') ?? null) ??
          (() => {
            const reset = Number(response?.headers.get('x-ratelimit-reset'));
            if (!Number.isFinite(reset) || reset <= 0) return undefined;
            const ms = reset > 1e12 ? reset - Date.now() : reset * 1000 - Date.now();
            return ms > 0 ? Math.round(ms / 1000) : undefined;
          })(),
        details: payload,
      }
    );
  }

  // Some functions answer 200 with an error envelope (free-tier soft failures);
  // route those through the same explanation path.
  const envelope = data as any;
  if (envelope && typeof envelope === 'object' && envelope.success === false && envelope.error) {
    const envelopeMessage =
      typeof envelope.error === 'string' ? envelope.error : envelope.error?.message ?? `${name} failed`;
    throw new ToolCallError(envelopeMessage, { status: envelope.status, details: envelope });
  }

  return data;

};

/**
 * Turns a failed tool call into an actionable, agent-readable explanation.
 * Throttling and quota exhaustion get the free-tier allowance and the upgrade
 * path spelled out, so an agent can tell the user *why* the call stopped.
 */
const describeToolError = (toolName: string, error: any): ToolResult => {
  const status = error instanceof ToolCallError ? error.status : undefined;
  const message = error?.message ?? `${toolName} failed`;
  const allowance = FREE_TIER_ALLOWANCES[toolName];
  const looksThrottled =
    status === 429 ||
    /rate limit|too many requests|throttl/i.test(message);
  const looksQuotaExhausted =
    status === 402 ||
    (status === 403 && /quota|limit|exceeded|upgrade/i.test(message)) ||
    /quota|monthly limit|free tier limit/i.test(message);

  if (looksThrottled || looksQuotaExhausted) {
    const wait = (error as ToolCallError)?.retryAfterSeconds;
    return asText({
      tool: toolName,
      error: looksThrottled ? 'free_tier_rate_limited' : 'free_tier_quota_exhausted',
      reason: looksThrottled
        ? 'This call was throttled by the free-tier rate limit, not by a bug or an outage.'
        : 'The free-tier monthly allowance for this tool is used up.',
      free_tier_allowance: allowance ?? '3 lookups per month per tool (free tier)',
      what_to_tell_the_user: looksThrottled
        ? `Free-tier access allows ${allowance ?? '3 lookups per month'}. Wait ${formatWait(wait)} and try again, or use an API key for higher limits.`
        : `Free-tier access allows ${allowance ?? '3 lookups per month'} and that allowance is now used up. An API key (Starter tier and above) raises the limit immediately.`,
      retry_after_seconds: looksThrottled ? (wait ?? 60) : undefined,
      resets: looksQuotaExhausted ? 'Monthly allowance resets on the 1st of each month (UTC).' : undefined,
      get_higher_limits: UPGRADE_URL,
      pricing_and_quotas: PRICING_DOC,
      original_message: message,
    });
  }

  if (status === 401 || status === 403) {
    return asText({
      tool: toolName,
      error: 'authentication_required',
      reason: 'This tool needs a LeafEngines API key — the keyless free tier does not cover it.',
      what_to_tell_the_user:
        'Create a free API key to call this tool, then pass it as the x-api-key header.',
      get_api_key: UPGRADE_URL,
      original_message: message,
    });
  }

  if (status === 400 || status === 422) {
    return asText({
      tool: toolName,
      error: 'invalid_request',
      reason: 'The arguments were rejected before any quota was consumed.',
      what_to_tell_the_user: `Check the arguments and try again: ${message}`,
      original_message: message,
    });
  }

  if (status && status >= 500) {
    return asText({
      tool: toolName,
      error: 'upstream_unavailable',
      reason: 'A data source is temporarily unavailable. This did not use free-tier allowance.',
      what_to_tell_the_user: 'The data service is temporarily unavailable — retry in a minute.',
      retry_after_seconds: (error as ToolCallError)?.retryAfterSeconds ?? 60,
      original_message: message,
    });
  }

  return asText({ tool: toolName, error: 'tool_failed', original_message: message });
};

/** Tools must never throw at the agent — surface failures as readable text. */
const guard = (tool: WebMCPTool): WebMCPTool => ({
  ...tool,
  execute: async (args) => {
    try {
      return await tool.execute(args ?? {});
    } catch (error: any) {
      return describeToolError(tool.name, error);
    }
  },
});




const tools = (): WebMCPTool[] => [
  {
    name: 'list_docs',
    description:
      'List the public SoilSidekick Pro / LeafEngines documentation pages (slug, title, category, url).',
    inputSchema: {
      type: 'object',
      properties: { category: { type: 'string', description: 'Optional category filter, e.g. "get-started".' } },
    },
    execute: async ({ category }) =>
      asText(
        publicDocs
          .filter((doc) => !category || doc.category === category)
          .map(({ slug, title, category: cat, blurb }) => ({ slug, title, category: cat, blurb, url: `/docs/${slug}` }))
      ),
  },
  {
    name: 'search_docs',
    description: 'Search the public documentation and return ranked matching pages with slugs and urls.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search terms, e.g. "api key quotas".' },
        limit: { type: 'number', description: 'Max results (default 8).' },
      },
      required: ['query'],
    },
    execute: async ({ query, limit }) => asText(searchPublicDocs(String(query ?? ''), Number(limit) || 8)),
  },
  {
    name: 'get_doc',
    description:
      'Fetch one public documentation page as raw markdown by slug (from list_docs or search_docs).',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string', description: 'Doc slug, e.g. "get-started/quick-start".' } },
      required: ['slug'],
    },
    execute: async ({ slug }) => {
      const doc = docBySlug(String(slug ?? '').replace(/^\/?docs\//, ''));
      if (!doc) return asText({ error: 'Unknown slug. Call list_docs or search_docs first.' });
      return asText(`# ${doc.title}\n\n${doc.content}`);
    },
  },
  {
    name: 'county_lookup',
    description:
      'Resolve a US county name or state to county rows with 5-digit FIPS codes. Free tier (no API key): 3 lookups per month, 60 requests/minute burst.',
    inputSchema: {
      type: 'object',
      properties: { term: { type: 'string', description: 'County or state name, e.g. "Houston".' } },
      required: ['term'],
    },
    execute: async ({ term }) => asText(await callFunction('county-lookup', { term: String(term ?? '').trim() })),
  },
  {
    name: 'get_soil_data',
    description:
      'Free-tier soil profile for a US county FIPS code (texture, pH, organic matter, drainage class). Free tier: 3 lookups per month.',
    inputSchema: {
      type: 'object',
      properties: { county_fips: { type: 'string', description: '5-digit county FIPS, e.g. "13153".' } },
      required: ['county_fips'],
    },
    execute: async ({ county_fips }) => asText(await callFunction('get-soil-data', { county_fips: String(county_fips) }, { freeTierHeader: true })),
  },
  {
    name: 'planting_calendar',
    description:
      'Free-tier planting windows, frost dates, and soil-temperature targets for a crop in a US county. Free tier: 3 lookups per month.',
    inputSchema: {
      type: 'object',
      properties: {
        county_fips: { type: 'string', description: '5-digit county FIPS, e.g. "13153".' },
        crop_type: { type: 'string', description: 'Crop name, e.g. "collards".' },
      },
      required: ['county_fips', 'crop_type'],
    },
    execute: async ({ county_fips, crop_type }) =>
      asText(
        await callFunction('get-planting-calendar', {
          county_fips: String(county_fips),
          crop_type: String(crop_type),
        })
      ),
  },
];

/** Registers the docs + free-tier data tools. Returns a cleanup function. */
export const registerWebMCPTools = (): (() => void) => {
  if (!isWebMCPEnabled() || typeof navigator === 'undefined') return () => {};

  const modelContext = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
  if (!modelContext) return () => {};

  const registered = tools().map(guard);

  if (typeof modelContext.registerTool === 'function') {
    const handles = registered.map((tool) => modelContext.registerTool!(tool));
    return () => handles.forEach((handle) => handle && typeof handle.unregister === 'function' && handle.unregister());
  }

  if (typeof modelContext.provideContext === 'function') {
    modelContext.provideContext({ tools: registered });
    return () => modelContext.provideContext!({ tools: [] });
  }

  return () => {};
};
