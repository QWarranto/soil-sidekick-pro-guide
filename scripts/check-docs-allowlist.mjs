#!/usr/bin/env node
// CI guard: fails the build when public documentation exposure drifts.
//
// Checks:
//  1. No `import.meta.glob` over docs/ anywhere in src/ (that is the leak vector).
//  2. Every .md in docs/ is on the allowlist (new docs are opt-in, not automatic).
//  3. Every allowlist entry exists on disk.
//  4. The generated module is in sync with the allowlist.
//  5. No allowlisted doc carries an Internal Only / Confidential marker.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_DOCS } from "./docs-allowlist.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

const walk = (dir, filter) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full, filter);
    return filter(full) ? [full] : [];
  });
};

// 1. glob leak
for (const file of walk(resolve(root, "src"), (f) => /\.(ts|tsx)$/.test(f))) {
  const src = readFileSync(file, "utf8");
  if (/import\.meta\.glob\s*\(\s*["'][^"']*docs\//.test(src)) {
    errors.push(`${relative(root, file)}: import.meta.glob over docs/ is forbidden — use the allowlist.`);
  }
}

// 2 & 3. allowlist vs disk
const onDisk = walk(resolve(root, "docs"), (f) => f.endsWith(".md")).map((f) =>
  relative(resolve(root, "docs"), f).split("\\").join("/"),
);
const allow = new Set(PUBLIC_DOCS);
for (const doc of onDisk) {
  if (!allow.has(doc)) {
    errors.push(`docs/${doc} is not on the public allowlist. Add it to scripts/docs-allowlist.mjs (public) or move it to internal-docs/.`);
  }
}
for (const doc of PUBLIC_DOCS) {
  if (!onDisk.includes(doc)) errors.push(`Allowlisted docs/${doc} does not exist.`);
}

// 4. generated module sync
const generatedPath = resolve(root, "src/content/publicDocs.generated.ts");
if (!existsSync(generatedPath)) {
  errors.push("src/content/publicDocs.generated.ts is missing — run `bun run docs:generate`.");
} else {
  const generated = readFileSync(generatedPath, "utf8");
  const referenced = [...generated.matchAll(/\.\.\/\.\.\/docs\/(.+?)\?raw/g)].map((m) => m[1]);
  const missing = PUBLIC_DOCS.filter((d) => !referenced.includes(d));
  const extra = referenced.filter((d) => !allow.has(d));
  if (missing.length || extra.length) {
    errors.push(
      `Generated docs module out of sync — run \`bun run docs:generate\`. Missing: ${missing.join(", ") || "none"}; unexpected: ${extra.join(", ") || "none"}.`,
    );
  }
}

// 5. internal markers
const INTERNAL_MARKER = /^\s*(?:>|\*\*|#{1,6})?\s*(?:classification:\s*)?(?:internal only|internal use only|confidential)/im;
for (const doc of PUBLIC_DOCS) {
  const full = resolve(root, "docs", doc);
  if (!existsSync(full)) continue;
  if (INTERNAL_MARKER.test(readFileSync(full, "utf8").slice(0, 2000))) {
    errors.push(`docs/${doc} is marked internal/confidential but is allowlisted for public serving.`);
  }
}

if (errors.length) {
  console.error("Public docs exposure check FAILED:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`Public docs exposure check passed (${PUBLIC_DOCS.length} allowlisted docs).`);
