#!/usr/bin/env node
// Regenerates src/content/publicDocs.generated.ts from scripts/docs-allowlist.mjs.
// Explicit `?raw` imports replace the old `import.meta.glob("../../docs/**/*.md")`
// so only allowlisted docs are ever bundled into the client.

import { existsSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_DOCS } from "./docs-allowlist.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "src/content/publicDocs.generated.ts");

const missing = PUBLIC_DOCS.filter((p) => !existsSync(resolve(root, "docs", p)));
if (missing.length) {
  console.error("Allowlisted docs missing on disk:\n  " + missing.join("\n  "));
  process.exit(1);
}

const ident = (p, i) => `doc${i}`;
const imports = PUBLIC_DOCS.map((p, i) => `import ${ident(p, i)} from "../../docs/${p}?raw";`).join("\n");
const entries = PUBLIC_DOCS.map((p, i) => `  ["${p}", ${ident(p, i)}],`).join("\n");

writeFileSync(
  out,
  `// GENERATED FILE — do not edit by hand.
// Run \`bun run docs:generate\` after changing scripts/docs-allowlist.mjs.

${imports}

export const PUBLIC_DOC_SOURCES: ReadonlyArray<readonly [string, string]> = [
${entries}
];
`,
);

console.log(`Wrote ${out} with ${PUBLIC_DOCS.length} allowlisted docs.`);
