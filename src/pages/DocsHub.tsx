import { useMemo } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DocEntry = {
  slug: string;
  title: string;
  category: string;
  content: string;
  blurb: string;
};

type NavLink = {
  label: string;
  to: string;
  blurb?: string;
  external?: boolean;
};

const rawDocs = import.meta.glob("../../docs/**/*.md", { as: "raw", eager: true }) as Record<string, string>;

const docs: DocEntry[] = Object.entries(rawDocs)
  .map(([path, content]) => {
    const relativePath = path.replace("../../docs/", "").replace(/\.md$/, "");
    const slug = relativePath
      .split("/")
      .map((segment) => segment.replace(/^\d+_?/, "").replace(/_/g, "-").toLowerCase())
      .join("/");

    const titleMatch = content.match(/^#\s+(.+)$/m);
    const bodyLines = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && !line.startsWith("![") && !line.startsWith("```") && !line.startsWith(">"));

    return {
      slug,
      title: titleMatch?.[1]?.trim() || relativePath.split("/").at(-1)?.replace(/_/g, " ") || "Document",
      category: relativePath.split("/")[0] || "general",
      content,
      blurb: bodyLines[0]?.replace(/[*_`]/g, "").slice(0, 160) || "Implementation guide and reference documentation.",
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

const docBySlug = (slug: string) => docs.find((d) => d.slug === slug);

const getStarted: NavLink[] = [
  { label: "Announcements", to: "/announcements", blurb: "Latest releases, roadmap updates, and platform news.", external: true },
  { label: "Quick Start (5 min)", to: "/docs/get-started/quick-start", blurb: docBySlug("get-started/quick-start")?.blurb },
  { label: "API Key", to: "/api-keys", blurb: "Generate and manage your LeafEngines API keys.", external: true },
  { label: "Sample Reports", to: "/docs/sample-reports", blurb: "Example soil, environmental, and VRT reports.", external: true },
  { label: "Pricing", to: "/pricing", blurb: "Plans, tiers, and metered usage.", external: true },
];

const useCases: NavLink[] = [
  { label: "LeafEngines MCP — 10 Use Cases", to: "/docs/partnerships/leafengines-mcp-10-use-cases", blurb: "Ten production-ready agent workflows chaining the 10 MCP tools." },
  { label: "B2B API — Marketing Overview", to: "/docs/b2b-pitch-deck-content", blurb: "Outcomes by vertical: Urban Forestry, Insurance, Nutraceuticals, Precision Ag." },
  { label: "Consumer Pain Point Solutions", to: "/docs/consumer-pain-point-solutions", blurb: docBySlug("consumer-pain-point-solutions")?.blurb },
  { label: "Case Study — SDK Integration Under 4 Hours", to: "/docs/case-studies/sdk-integration-under-4-hours", blurb: docBySlug("case-studies/sdk-integration-under-4-hours")?.blurb },
  { label: "Composio Enterprise Onboarding", to: "/docs/partnerships/composio-enterprise-onboarding", blurb: docBySlug("partnerships/composio-enterprise-onboarding")?.blurb },
  { label: "Claude MCP Deep Dive", to: "/docs/partnerships/claude-mcp-deep-dive", blurb: docBySlug("partnerships/claude-mcp-deep-dive")?.blurb },
  { label: "ClawHub & OpenClaw Deep Dive", to: "/docs/partnerships/clawhub-openclaw-deep-dive", blurb: docBySlug("partnerships/clawhub-openclaw-deep-dive")?.blurb },
  { label: "n8n Deep Dive", to: "/docs/partnerships/n8n-deep-dive", blurb: docBySlug("partnerships/n8n-deep-dive")?.blurb },
  { label: "n8n — 10 Use Cases by Tier", to: "/docs/partnerships/n8n-10-use-cases", blurb: "Tier-mapped n8n workflows with measurable ROI per use case." },
];

const sidebarSections: { title: string; links: NavLink[] }[] = [
  {
    title: "LeafEngines Docs",
    links: [
      { label: "Quick Start", to: "/docs/get-started/quick-start" },
      { label: "API Documentation", to: "/api-docs", external: true },
      { label: "MCP Server", to: "/docs/mcp-server-specification" },
    ],
  },
  {
    title: "Use Cases",
    links: [
      { label: "LeafEngines MCP", to: "/docs/partnerships/leafengines-mcp-10-use-cases" },
      { label: "QGIS Use Cases", to: "/docs/partnerships/qgis-10-use-cases" },
      { label: "n8n Use Cases", to: "/docs/partnerships/n8n-10-use-cases" },
      { label: "Node-RED Use Cases", to: "/docs/partnerships/node-red-10-use-cases" },
      { label: "Composio Onboarding", to: "/docs/partnerships/composio-enterprise-onboarding" },
      { label: "Claude MCP Deep Dive", to: "/docs/partnerships/claude-mcp-deep-dive" },
    ],
  },
  {
    title: "Workflows",
    links: [
      { label: "First-Time Setup", to: "/docs/workflows/first-time-setup" },
      { label: "Satellite Field Monitoring", to: "/docs/workflows/satellite-field-monitoring" },
      { label: "Environmental Assessment", to: "/docs/workflows/environmental-assessment" },
      { label: "Seasonal Planning", to: "/docs/workflows/seasonal-planning" },
      { label: "VRT Prescriptions", to: "/docs/workflows/vrt-prescriptions" },
      { label: "Offline AI", to: "/docs/workflows/offline-ai" },
      { label: "Carbon Credits", to: "/docs/workflows/carbon-credits" },
      { label: "Sensor Integration", to: "/docs/workflows/sensor-integration" },
      { label: "API & Equipment Integration", to: "/docs/workflows/api-equipment-integration" },
      { label: "Full-Season Workflow", to: "/docs/workflows/full-season-workflow" },
      { label: "QGIS Implementation Guide", to: "/docs/workflows/qgis-implementation-guide" },
    ],
  },
  {
    title: "SDK",
    links: [
      { label: "SDK Quickstart", to: "/docs/sdk-quickstart" },
      { label: "SDK Integration Guide", to: "/docs/sdk-integration-guide" },
      { label: "SDK Generation Guide", to: "/docs/sdk-generation-guide" },
      { label: "Client Configurations", to: "/docs/sdk/client-configurations" },
      { label: "SDK Changelog", to: "/sdk-changelog", external: true },
    ],
  },
  {
    title: "Developer Guides",
    links: [
      { label: "Agent Integration", to: "/docs/agent-integration-guide" },
      { label: "Developer Sandbox", to: "/developer-sandbox", external: true },
      { label: "API Usage Analytics", to: "/api-usage-analytics", external: true },
      { label: "Lazy Loading", to: "/docs/lazy-loading" },
      { label: "Push Notifications", to: "/docs/push-notifications" },
      { label: "Offline Usage Monitoring", to: "/docs/offline-usage-monitoring" },
    ],
  },
];

function SectionLinks({ links }: { links: NavLink[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {links.map((link) => (
        <Link key={link.to + link.label} to={link.to} className="block">
          <Card className="h-full border-border transition-colors hover:border-primary/50 hover:bg-muted/30">
            <CardContent className="space-y-2 p-5">
              <h3 className="text-base font-semibold text-foreground">{link.label}</h3>
              {link.blurb && <p className="text-sm leading-6 text-muted-foreground">{link.blurb}</p>}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function DocsHub() {
  const params = useParams();
  const location = useLocation();
  const slug = params["*"]?.replace(/\/$/, "") || "";
  const isIndex = slug.length === 0;

  const selectedDoc = useMemo(() => docs.find((doc) => doc.slug === slug), [slug]);

  if (!isIndex && !selectedDoc) {
    return <Navigate to="/docs" replace state={{ from: location.pathname }} />;
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge variant="outline">Documentation</Badge>
              <h1 className="text-4xl font-bold text-foreground">
                {isIndex ? "LeafEngines Documentation" : selectedDoc?.title}
              </h1>
              <p className="max-w-3xl text-lg text-muted-foreground">
                {isIndex
                  ? "Quick starts, workflows, SDK references, and partner playbooks for the LeafEngines agricultural intelligence platform."
                  : "SoilSidekick Pro & LeafEngines implementation guide."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/docs/get-started/quick-start">Quick Start</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/docs">Docs Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-6">
          {sidebarSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.links.map((link) => {
                  const active = !link.external && location.pathname === link.to;
                  return (
                    <li key={link.to + link.label}>
                      <Link
                        to={link.to}
                        className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${active ? "bg-primary/10 text-foreground font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </aside>

        <section className="min-w-0">
          {isIndex ? (
            <div className="space-y-10">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Get Started</h2>
                  <p className="text-sm text-muted-foreground">Start here — onboarding, keys, and first reports.</p>
                </div>
                <SectionLinks links={getStarted} />
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Use Cases & Partnerships</h2>
                  <p className="text-sm text-muted-foreground">Production deployments, MCP tooling, and partner playbooks.</p>
                </div>
                <SectionLinks links={useCases} />
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="prose prose-sm max-w-none px-6 py-8 dark:prose-invert sm:prose-base">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedDoc?.content ?? ""}</ReactMarkdown>
              </CardContent>
            </Card>
          )}
        </section>
      </section>
    </main>
  );
}
