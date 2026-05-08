import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Eagerly load all docs markdown at build time
const modules = import.meta.glob("/docs/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

type DocEntry = { slug: string; title: string; section: string; content: string; path: string };

function toTitle(name: string): string {
  return name
    .replace(/\.md$/i, "")
    .replace(/^\d+[_-]?/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function buildSlug(filePath: string): string {
  // /docs/get-started/QUICK_START.md -> get-started/quick-start
  const rel = filePath.replace(/^\/docs\//, "").replace(/\.md$/i, "");
  return rel
    .split("/")
    .map((seg) => seg.replace(/^\d+[_-]?/, "").replace(/_/g, "-").toLowerCase())
    .join("/");
}

const docs: DocEntry[] = Object.entries(modules).map(([path, content]) => {
  const rel = path.replace(/^\/docs\//, "");
  const parts = rel.split("/");
  const file = parts.pop() || rel;
  const section = parts.length ? parts.join("/") : "root";
  const titleMatch = (content as string).match(/^#\s+(.+)$/m);
  return {
    slug: buildSlug(path),
    title: titleMatch ? titleMatch[1].trim() : toTitle(file),
    section,
    content: content as string,
    path,
  };
});

const sections = Array.from(new Set(docs.map((d) => d.section))).sort();

export default function DocsHub() {
  const params = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // wildcard slug from /docs/* (react-router v6: params["*"])
  const slug = (params["*"] || "").replace(/^\/+|\/+$/g, "").toLowerCase();
  const current = useMemo(() => docs.find((d) => d.slug === slug), [slug]);

  useEffect(() => {
    document.title = current ? `${current.title} — Docs` : "Documentation — SoilSidekick Pro";
  }, [current]);

  const filtered = useMemo(() => {
    if (!query.trim()) return docs;
    const q = query.toLowerCase();
    return docs.filter((d) => d.title.toLowerCase().includes(q) || d.slug.includes(q));
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-6 grid grid-cols-12 gap-6">
      <aside className="col-span-12 md:col-span-3">
        <Card className="p-4 sticky top-20">
          <h2 className="font-semibold mb-3">Documentation</h2>
          <Input
            placeholder="Search docs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-3"
          />
          <ScrollArea className="h-[70vh] pr-2">
            {sections.map((section) => {
              const items = filtered.filter((d) => d.section === section);
              if (!items.length) return null;
              return (
                <div key={section} className="mb-4">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    {section === "root" ? "Overview" : toTitle(section.split("/").pop() || section)}
                  </div>
                  <ul className="space-y-1">
                    {items.map((d) => (
                      <li key={d.slug}>
                        <button
                          onClick={() => navigate(`/docs/${d.slug}`)}
                          className={`text-left text-sm w-full px-2 py-1 rounded hover:bg-accent ${
                            slug === d.slug ? "bg-accent text-accent-foreground font-medium" : ""
                          }`}
                        >
                          {d.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </ScrollArea>
        </Card>
      </aside>

      <main className="col-span-12 md:col-span-9">
        <Card className="p-6 md:p-8">
          {!current ? (
            <div>
              <h1 className="text-3xl font-bold mb-2">Documentation</h1>
              <p className="text-muted-foreground mb-6">
                Browse guides, workflows, partnerships, and the full API reference.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {docs.slice(0, 12).map((d) => (
                  <Link
                    key={d.slug}
                    to={`/docs/${d.slug}`}
                    className="block p-3 rounded border hover:bg-accent transition"
                  >
                    <div className="font-medium">{d.title}</div>
                    <div className="text-xs text-muted-foreground">{d.section}</div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{current.content}</ReactMarkdown>
            </article>
          )}
        </Card>
      </main>
    </div>
  );
}
