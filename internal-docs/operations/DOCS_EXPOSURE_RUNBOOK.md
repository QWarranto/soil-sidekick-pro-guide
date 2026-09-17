> Internal Only

# Public Docs Exposure Runbook

Prevents the original failure mode: `src/pages/DocsHub.tsx` globbed `docs/**/*.md`,
so every markdown file in `docs/` was bundled into the client and reachable at
`/docs/<slug>` — whether or not it was linked in the sidebar.

## Current controls

1. **Explicit allowlist** — `scripts/docs-allowlist.mjs` lists the docs that may be
   published (currently 65). Nothing else is bundled.
2. **Generated imports** — `src/content/publicDocs.generated.ts` holds one `?raw`
   import per allowlisted file. Regenerate with `bun run docs:generate`.
   Never hand-edit.
3. **CI guard** — `.github/workflows/docs-allowlist.yml` runs `bun run docs:check`,
   which fails on: any `import.meta.glob` over `docs/` in `src/`, a doc in `docs/`
   missing from the allowlist, an allowlist entry missing on disk, a stale
   generated module, or an allowlisted file marked `Internal Only`/`Confidential`.
4. **Runtime safety net** — DocsHub still skips any allowlisted file whose first
   2 KB carries an internal/confidential marker.
5. **Inventory** — `internal-docs/operations/DOCS_EXPOSURE_INVENTORY.csv`
   (classification, path, title, bytes, served URL). Regenerate when docs move.

## Publishing a new doc

1. Put the file in `docs/<category>/<NAME>.md` (never in `public/`).
2. Get a publication review — assume internal until reviewed.
3. Add the path to `PUBLIC_DOCS` in `scripts/docs-allowlist.mjs`.
4. `bun run docs:generate && bun run docs:check`.
5. Add a sidebar link in `src/pages/DocsHub.tsx` if it should be discoverable.

## Un-publishing / incident response

1. `git mv docs/<path> internal-docs/<category>/<NAME>.md`.
2. Remove the path from `PUBLIC_DOCS`, then `bun run docs:generate`.
3. Add a redirect for the old `/docs/<slug>` if it was externally linked.
4. Re-run `bun run docs:check` and republish so the bundle no longer contains it.
5. Note the removal in the inventory CSV commit message.

## Open decision (not remediated here)

DIU and named-partner materials are held pending a disclosure decision; they are
left as-is by design. Do not add them to the allowlist without written sign-off.
