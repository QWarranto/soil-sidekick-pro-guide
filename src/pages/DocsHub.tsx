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
      .filter((line) => line && !line.startsWith("#") && !line.startsWith("![") && !line.startsWith("```"));

    return {
      slug,
      title: titleMatch?.[1]?.trim() || relativePath.split("/").at(-1)?.replace(/_/g, " ") || "Document",
      category: relativePath.split("/")[0] || "general",
      content,
      blurb: bodyLines[0] || "Implementation guide and reference documentation.",
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

const sections = [
  {
    title: "Get Started",
    items: ["get-started/quick-start", "sdk-integration-guide", "sdk-quickstart"],
  },
  {
    title: "Use Cases & Partnerships",
    items: [
      "partnerships/leafengines-mcp-10-use-cases",
      "case-studies/sdk-integration-under-4-hours",
      "partnerships/composio-enterprise-onboarding",
      "partnerships/claude-mcp-deep-dive",
    ],
  },
  {
    title: "Workflows",
    items: [
      "workflows/first-time-setup",
      "workflows/qgis-sdk-deep-dive",
      "workflows/qgis-implementation-guide",
      "workflows/full-season-workflow",
    ],
  },
];

const primaryLinks = [
  "get-started/quick-start",
  "workflows/qgis-implementation-guide",
];

export default function DocsHub() {
  const params = useParams();
  const location = useLocation();
  const slug = params["*"]?.replace(/\/$/, "") || "";
  const isIndex = slug.length === 0;

  const selectedDoc = useMemo(() => docs.find((doc) => doc.slug === slug), [slug]);
  const featured = useMemo(
    () => primaryLinks.map((key) => docs.find((doc) => doc.slug === key)).filter(Boolean) as DocEntry[],
    [],
  );

  const groupedSections = useMemo(
    () =>
      sections
        .map((section) => ({
          ...section,
          docs: section.items
            .map((key) => docs.find((doc) => doc.slug === key))
            .filter(Boolean) as DocEntry[],
        }))
        .filter((section) => section.docs.length > 0),
    [],
  );

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
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  {isIndex ? "LeafEngines Documentation" : selectedDoc?.title}
                </h1>
                <p className="mt-2 max-w-3xl text-lg text-muted-foreground">
                  {isIndex
                    ? "Everything you need to build with the LeafEngines agricultural intelligence API — quick starts, workflows, SDK guides, and implementation references."
                    : "SoilSidekick Pro implementation guides, quick starts, and purchase links at the point of action."}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/docs/get-started/quick-start">Quick Start</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/docs/workflows/qgis-implementation-guide">QGIS Guide</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">LeafEngines Docs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {featured.map((doc) => (
                <Link
                  key={doc.slug}
                  to={`/docs/${doc.slug}`}
                  className={`block rounded-md border px-3 py-2 text-sm transition-colors ${doc.slug === selectedDoc?.slug ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:bg-muted"}`}
                >
                  {doc.title}
                </Link>
              ))}
            </CardContent>
          </Card>
        </aside>

        <section className="min-w-0">
          {isIndex ? (
            <div className="space-y-8">
              {groupedSections.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {section.docs.map((doc) => (
                      <Link key={doc.slug} to={`/docs/${doc.slug}`} className="block">
                        <Card className="h-full border-border transition-colors hover:border-primary/50 hover:bg-muted/30">
                          <CardContent className="space-y-3 p-5">
                            <h3 className="text-lg font-semibold text-foreground">{doc.title}</h3>
                            <p className="text-sm leading-6 text-muted-foreground">{doc.blurb}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
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