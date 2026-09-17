// Free-tier planting calendar endpoint.
// Public, keyless, no persistence. Signals to freemium funnel via `x-free-tier` header
// or absence of Authorization. Returns crop-specific window + zone + frost + tips.
// Upsell fields hint at what Hobby/Grower/Pro tiers unlock (yield, risk, sustainability).

import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-free-tier, x-client-instance-id, x-sdk',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ---------- Reference data ----------

function getClimateRegion(stateCode: string): string {
  const regions: Record<string, string> = {
    '01': 'southeast', '04': 'southwest', '05': 'south_central', '06': 'pacific', '08': 'mountain',
    '09': 'northeast', '10': 'northeast', '12': 'southeast', '13': 'southeast', '16': 'mountain',
    '17': 'midwest', '18': 'midwest', '19': 'midwest', '20': 'plains', '21': 'southeast',
    '22': 'south_central', '23': 'northeast', '24': 'northeast', '25': 'northeast', '26': 'midwest',
    '27': 'midwest', '28': 'southeast', '29': 'midwest', '30': 'mountain', '31': 'plains',
    '32': 'southwest', '33': 'northeast', '34': 'northeast', '35': 'southwest', '36': 'northeast',
    '37': 'southeast', '38': 'plains', '39': 'midwest', '40': 'south_central', '41': 'pacific',
    '42': 'northeast', '44': 'northeast', '45': 'southeast', '46': 'plains', '47': 'southeast',
    '48': 'south_central', '49': 'mountain', '50': 'northeast', '51': 'southeast', '53': 'pacific',
    '54': 'northeast', '55': 'midwest', '56': 'mountain',
  };
  return regions[stateCode] || 'temperate';
}

function getHardinessZone(stateCode: string): string {
  const zones: Record<string, string> = {
    '01': '7b-8a', '04': '9a-10a', '05': '7a-8a', '06': '8b-10b', '08': '4b-6a',
    '12': '9a-11a', '13': '8a-8b', '17': '5b-6b', '18': '5b-6b', '19': '4b-5b',
    '21': '6a-7a', '22': '8a-9a', '26': '4b-6a', '27': '3a-4b', '28': '7b-9a',
    '29': '5b-7a', '31': '4b-5b', '36': '5a-7a', '37': '7a-8a', '39': '5b-6b',
    '40': '6b-7b', '42': '5b-7a', '45': '7b-8b', '47': '6b-7b', '48': '6b-9b',
    '51': '6a-7b', '55': '4a-5b',
  };
  return zones[stateCode] || '5b-6b';
}

function getFrostDates(region: string): { last_spring: string; first_fall: string } {
  const y = new Date().getFullYear();
  const map: Record<string, [string, string]> = {
    southeast: ['03-15', '11-15'],
    southwest: ['02-15', '12-01'],
    south_central: ['03-20', '11-10'],
    pacific: ['02-28', '11-30'],
    mountain: ['05-15', '09-15'],
    midwest: ['04-20', '10-15'],
    northeast: ['04-30', '10-01'],
    plains: ['04-25', '10-10'],
    temperate: ['04-15', '10-20'],
  };
  const [ls, ff] = map[region] || map.temperate;
  return { last_spring: `${y}-${ls}`, first_fall: `${y}-${ff}` };
}

// Crop database — expanded from the paid endpoint to cover common home/market-garden crops.
// season: 'cool' (plant before last frost / after summer heat), 'warm' (plant after last frost),
// 'perennial' or 'overwinter'. `windows` are relative-day offsets from frost dates.
interface CropSpec {
  category: string;
  season: 'cool' | 'warm' | 'overwinter';
  spring_days_from_last_frost: [number, number] | null; // [start, end]
  fall_days_before_first_frost: [number, number] | null;
  soil_temp_f: [number, number];
  days_to_maturity: number;
  notes: string;
}

const CROP_DB: Record<string, CropSpec> = {
  collards:   { category: 'brassica', season: 'cool', spring_days_from_last_frost: [-28, -14], fall_days_before_first_frost: [-90, -60], soil_temp_f: [45, 75], days_to_maturity: 60, notes: 'Frost sweetens leaves; fall crop typically superior in the South.' },
  kale:       { category: 'brassica', season: 'cool', spring_days_from_last_frost: [-28, -14], fall_days_before_first_frost: [-85, -60], soil_temp_f: [45, 75], days_to_maturity: 55, notes: 'Very frost-tolerant; light frost improves flavor.' },
  cabbage:    { category: 'brassica', season: 'cool', spring_days_from_last_frost: [-21, -7],  fall_days_before_first_frost: [-100, -80], soil_temp_f: [45, 75], days_to_maturity: 80, notes: 'Transplant seedlings for best results.' },
  broccoli:   { category: 'brassica', season: 'cool', spring_days_from_last_frost: [-28, -14], fall_days_before_first_frost: [-90, -70], soil_temp_f: [45, 75], days_to_maturity: 65, notes: 'Bolts in heat; time so heads form before 75°F daytime highs.' },
  spinach:    { category: 'green',    season: 'cool', spring_days_from_last_frost: [-42, -14], fall_days_before_first_frost: [-60, -40], soil_temp_f: [40, 70], days_to_maturity: 40, notes: 'Bolts quickly in heat; direct-sow.' },
  lettuce:    { category: 'green',    season: 'cool', spring_days_from_last_frost: [-28, 0],   fall_days_before_first_frost: [-70, -45], soil_temp_f: [40, 75], days_to_maturity: 45, notes: 'Succession-plant every 2 weeks.' },
  peas:       { category: 'legume',   season: 'cool', spring_days_from_last_frost: [-35, -14], fall_days_before_first_frost: [-80, -60], soil_temp_f: [40, 70], days_to_maturity: 65, notes: 'Direct-sow; inoculate seed for best nitrogen fixation.' },
  onions:     { category: 'allium',   season: 'cool', spring_days_from_last_frost: [-35, -14], fall_days_before_first_frost: null, soil_temp_f: [45, 85], days_to_maturity: 100, notes: 'Long-day vs short-day varieties matter by latitude.' },
  carrots:    { category: 'root',     season: 'cool', spring_days_from_last_frost: [-21, 14],  fall_days_before_first_frost: [-90, -60], soil_temp_f: [45, 85], days_to_maturity: 70, notes: 'Loose, rock-free soil; keep top inch moist for germination.' },
  potatoes:   { category: 'root',     season: 'cool', spring_days_from_last_frost: [-14, 14],  fall_days_before_first_frost: null, soil_temp_f: [45, 70], days_to_maturity: 90, notes: 'Plant seed potatoes; hill soil as plants grow.' },
  garlic:     { category: 'allium',   season: 'overwinter', spring_days_from_last_frost: null, fall_days_before_first_frost: [-45, -21], soil_temp_f: [40, 60], days_to_maturity: 240, notes: 'Fall-planted, harvested next summer.' },
  corn:       { category: 'grain',    season: 'warm', spring_days_from_last_frost: [0, 21],    fall_days_before_first_frost: null, soil_temp_f: [60, 95], days_to_maturity: 90, notes: 'Direct-sow after soil reaches 60°F.' },
  soybeans:   { category: 'legume',   season: 'warm', spring_days_from_last_frost: [7, 28],    fall_days_before_first_frost: null, soil_temp_f: [55, 90], days_to_maturity: 100, notes: 'Inoculate seed if first time in field.' },
  tomatoes:   { category: 'nightshade', season: 'warm', spring_days_from_last_frost: [7, 28],  fall_days_before_first_frost: null, soil_temp_f: [65, 90], days_to_maturity: 80, notes: 'Transplant after nighttime lows stay above 50°F.' },
  peppers:    { category: 'nightshade', season: 'warm', spring_days_from_last_frost: [14, 35], fall_days_before_first_frost: null, soil_temp_f: [65, 90], days_to_maturity: 75, notes: 'Warm-loving; wait until soil is fully warmed.' },
  squash:     { category: 'cucurbit', season: 'warm', spring_days_from_last_frost: [7, 28],    fall_days_before_first_frost: null, soil_temp_f: [65, 95], days_to_maturity: 55, notes: 'Direct-sow or transplant after last frost.' },
  cucumbers:  { category: 'cucurbit', season: 'warm', spring_days_from_last_frost: [7, 28],    fall_days_before_first_frost: null, soil_temp_f: [65, 90], days_to_maturity: 55, notes: 'Trellis to save space and reduce disease pressure.' },
  beans:      { category: 'legume',   season: 'warm', spring_days_from_last_frost: [0, 28],    fall_days_before_first_frost: [-70, -50], soil_temp_f: [60, 85], days_to_maturity: 55, notes: 'Direct-sow; successive plantings extend harvest.' },
  okra:       { category: 'warm',     season: 'warm', spring_days_from_last_frost: [14, 42],   fall_days_before_first_frost: null, soil_temp_f: [70, 95], days_to_maturity: 60, notes: 'Loves heat; ideal for Southern summers.' },
  sweet_potatoes: { category: 'root', season: 'warm', spring_days_from_last_frost: [21, 42],   fall_days_before_first_frost: null, soil_temp_f: [65, 95], days_to_maturity: 110, notes: 'Plant slips after soil is warm (65°F+).' },
};

// Accept common synonyms / plurals.
const CROP_ALIASES: Record<string, string> = {
  collard: 'collards', 'collard greens': 'collards',
  tomato: 'tomatoes', pepper: 'peppers', bean: 'beans',
  cucumber: 'cucumbers', onion: 'onions', carrot: 'carrots',
  potato: 'potatoes', 'sweet potato': 'sweet_potatoes', 'sweet potatoes': 'sweet_potatoes',
  pea: 'peas', soybean: 'soybeans', lettuces: 'lettuce',
};

function normalizeCrop(input: string): string {
  const c = input.trim().toLowerCase().replace(/[_-]+/g, ' ');
  return CROP_ALIASES[c] || c.replace(/\s+/g, '_');
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildWindows(spec: CropSpec, frost: { last_spring: string; first_fall: string }) {
  const windows: Array<{ season: 'spring' | 'fall'; start: string; end: string; harvest_estimate: string }> = [];
  if (spec.spring_days_from_last_frost) {
    const [s, e] = spec.spring_days_from_last_frost;
    const start = addDays(frost.last_spring, s);
    const end = addDays(frost.last_spring, e);
    windows.push({ season: 'spring', start, end, harvest_estimate: addDays(start, spec.days_to_maturity) });
  }
  if (spec.fall_days_before_first_frost) {
    const [s, e] = spec.fall_days_before_first_frost;
    const start = addDays(frost.first_fall, s);
    const end = addDays(frost.first_fall, e);
    windows.push({ season: 'fall', start, end, harvest_estimate: addDays(start, spec.days_to_maturity) });
  }
  return windows;
}

// ---------- Per-IP rate limit (in-memory, per-isolate) ----------
// Ad-hoc guard to protect against scrape/abuse during viral spikes.
// 120 requests / 60s per IP. Legitimate users hit this a few times per session.
const RL_MAX = 120;
const RL_WINDOW_MS = 60_000;
const rlBuckets = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const b = rlBuckets.get(ip);
  if (!b || now > b.reset) {
    rlBuckets.set(ip, { count: 1, reset: now + RL_WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  b.count++;
  if (b.count > RL_MAX) return { ok: false, retryAfter: Math.ceil((b.reset - now) / 1000) };
  return { ok: true, retryAfter: 0 };
}

// ---------- Handler ----------

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const started = Date.now();
  const source = req.headers.get('x-sdk') || (req.headers.get('user-agent') || 'web');
  const clientInstance = req.headers.get('x-client-instance-id') || null;
  const ip =
    (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    req.headers.get('cf-connecting-ip') ||
    'unknown';

  try {
    if (req.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    const rl = checkRateLimit(ip);
    if (!rl.ok) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Free tier allows ${RL_MAX} requests/minute per IP. Retry in ${rl.retryAfter}s.`,
          upgrade_url: 'https://soilsidekickpro.com/plans',
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': String(rl.retryAfter),
          },
        },
      );
    }

    const body = await req.json().catch(() => ({}));
    // Parameter normalization: accept fips, county_fips
    const fips: string = (body.county_fips || body.fips || '').toString().trim();
    const cropRaw: string = (body.crop_type || body.crop || '').toString().trim();

    if (!/^\d{5}$/.test(fips)) {
      return json({
        error: 'Invalid or missing county_fips',
        hint: 'Provide a 5-digit U.S. county FIPS code (e.g. 13153 for Houston County, GA).',
        example: { county_fips: '13153', crop_type: 'collards' },
      }, 400);
    }
    if (!cropRaw) {
      return json({
        error: 'Missing crop_type',
        supported_crops: Object.keys(CROP_DB),
        example: { county_fips: fips, crop_type: 'collards' },
      }, 400);
    }

    const cropKey = normalizeCrop(cropRaw);
    const spec = CROP_DB[cropKey];
    if (!spec) {
      return json({
        error: `Unsupported crop '${cropRaw}' on the free tier`,
        supported_crops: Object.keys(CROP_DB),
        upsell: 'Hobby tier and above unlock 200+ crops, cultivar-specific windows, and multi-parameter optimization. See https://soilsidekickpro.com/plans',
      }, 400);
    }

    const stateCode = fips.substring(0, 2);
    const region = getClimateRegion(stateCode);
    const hardinessZone = getHardinessZone(stateCode);
    const frost = getFrostDates(region);
    const windows = buildWindows(spec, frost);

    const response = {
      county_fips: fips,
      crop: cropKey,
      crop_category: spec.category,
      season_type: spec.season,
      climate: {
        region,
        hardiness_zone: hardinessZone,
        average_last_spring_frost: frost.last_spring,
        average_first_fall_frost: frost.first_fall,
      },
      soil: {
        target_soil_temp_f: { min: spec.soil_temp_f[0], max: spec.soil_temp_f[1] },
      },
      planting_windows: windows,
      days_to_maturity: spec.days_to_maturity,
      notes: spec.notes,
      tier: 'free',
      upsell: {
        message: 'Free tier returns regional averages. Hobby+ unlocks SSURGO-grounded soil temperature, NDVI-adjusted windows, yield prediction, and risk assessment for your exact parcel.',
        upgrade_url: 'https://soilsidekickpro.com/plans',
      },
      meta: {
        source: 'soilsidekickpro-free-tier',
        generated_at: new Date().toISOString(),
        disclaimer: 'Windows are regional averages derived from state-level frost/zone data. Verify against local extension guidance for planting decisions.',
      },
    };

    // Fire-and-forget telemetry (skip if service key missing).
    const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const url = Deno.env.get('SUPABASE_URL');
    if (svc && url) {
      const admin = createClient(url, svc);
      admin.from('mcp_tool_call_log').insert({
        tool_name: 'get_planting_calendar',
        status: 'ok',
        free_tier: true,
        source,
        client_instance_id: clientInstance,
        latency_ms: Date.now() - started,
        params: { county_fips: fips, crop_type: cropKey },
      }).then(() => {}, () => {});
    }

    return json(response, 200);
  } catch (err) {
    console.error('[get-planting-calendar] error', err);
    return json({ error: 'Internal error', message: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
