# Web Dev Coordinator — Rep Page Updates (Sep 2026)

## Role

You are the **web development coordinator** for the Silq Technologies public website. Implement the changes below yourself (or compose narrowly scoped sub-agent prompts if needed), then **deploy to production**. Ethan will review on the live site.

Do **not** change anything in `C:\Users\Ethan\OneDrive\Desktop\CMSDataAnalysis` (separate project). Do **not** regenerate the full national map/rep corpus unless a change absolutely requires it — prefer surgical edits.

---

## System map (read before editing)

| Piece | Path / note |
|--------|-------------|
| Active site repo | `C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website` |
| Git remote | `https://github.com/Ethan-Rao/Silqtech.git` — branch **`main`** |
| Production | **`silq.tech`** — push/merge to `main` auto-deploys (DigitalOcean App Platform; confirm current host in project settings if needed) |
| Roster source of truth (root) | `C:\Users\Ethan\OneDrive\Desktop\Webdev\1099Master.csv` |
| Roster copy used by map tooling | `silq-website\scripts\map-generator\1099Master.csv` — **keep in sync** with the root file |
| Live rep pages | `src\app\rep\[slug]\page.tsx` + vanity rewrites in `next.config.js` |
| Rep overview | `src\app\rep\page.tsx` (driven by `public\data\rep-manifest.json`) |
| Per-rep JSON | `public\data\reps\<slug>.json` |
| Manifest | `public\data\rep-manifest.json` |
| Map-generator outputs (stale mirrors) | `scripts\map-generator\output\` — update or delete mirrors so they do not reintroduce removed people/companies on a later sync |
| New bifold source PDF | `C:\Users\Ethan\OneDrive\Desktop\Webdev\2026 Cleartract bifold brochure.pdf` |
| Live bifold URLs (keep paths) | `/pdfs/cleartract-bifold.pdf` and `/pdfs/cleartract-bifold-comedical.pdf` under `public\pdfs\` |
| Housecleaning archive (already done) | `C:\Users\Ethan\OneDrive\Desktop\Webdev\archive\` — unused root marketing/analysis clutter + old `docs\dev-prompts` |

### Routing notes (current)

- Vanity → app: `/klea` → `/rep/klea`, `/genesis` → `/rep/genesis` (see `next.config.js` `rewrites`).
- `/kleamedical` and `/rep/kleamedical` **permanently redirect to `/klea`**. Keep this behavior.
- CoMedical reps use the comedical bifold asset in `src\app\rep\[slug]\page.tsx`.

### Known current state (inventory for this task)

**Paul Wilson / Klea**

- Present in both `1099Master.csv` copies (URL `www.silq.tech/kleamedical`).
- `public\data\reps\klea.json` — `meta.name` lists “Derek Colins / Paul Wilson / Joe Rodriguez”; `meta.reps[]` includes Paul.
- `public\data\reps\kleamedical.json` — Paul-only slug page.
- `public\data\rep-manifest.json` — entries for Derek/Joe under `klea` plus a **Paul** entry under slug `kleamedical`.

**Genesis Medical Group**

- **Not** present in current `1099Master.csv` (already absent from roster).
- Still live on the site: `public\data\reps\genesis.json`, two `genesis` rows in `rep-manifest.json` (Dave Riddle, Robert Stitle), and rewrite `{ source: '/genesis', destination: '/rep/genesis' }` in `next.config.js`.

**Bifolds**

- Linked from `src\app\rep\[slug]\page.tsx` as:
  - `/pdfs/cleartract-bifold.pdf` (default) — already byte-identical to the 2026 source PDF
  - `/pdfs/cleartract-bifold-comedical.pdf` (CoMedical) — still the older ~11.5 MB file; must be replaced
- Public sitemap (`src/app/sitemap.xml/route.ts`) does **not** list rep vanity URLs — no sitemap edit needed.

**Encompass**

- Investigation only (no removals / no filter changes unless Ethan asks after the report).

---

## Locked decisions (do not reopen)

1. Keep **Klea Medical LLC** live. Keep **`/klea`** and **`/kleamedical`** routing as today (`/kleamedical` → `/klea`). Only remove **Paul Wilson**.
2. Remove **Genesis Medical Group** (the distributor) entirely from the website + overview. **`/genesis` must 404** (no redirect to another rep).
3. Replace bifold **bytes** at the **existing public paths** (do not rename URLs).
4. Update **both** default and CoMedical bifold PDFs to the new 2026 brochure.
5. Deploy to **production**; Ethan reviews live. No staging-only stop.
6. Encompass = **investigate and report only**.

---

## Safety constraints (mandatory — do not skip)

These protect live site behavior. Violating them can break unrelated rep pages.

1. **Do not strip hospital facilities named “Genesis…” from other reps.**  
   Many live JSON files (e.g. `stengel.json`, `acme.json`, `sciotex.json`, `steimel.json`, `chowning.json`) contain facilities such as `GENESIS MEDICAL CENTER-DAVENPORT`. Those are **hospitals**, not the Genesis Medical Group distributor.  
   Only remove the **distributor surfaces**:
   - `public/data/reps/genesis.json`
   - manifest entries with `"slug": "genesis"` / company `Genesis Medical Group`
   - the `/genesis` rewrite in `next.config.js`
   - emails like `genesismedicalgroup.net` / names Dave Riddle & Robert Stitle as distributor contacts  
   **Never** delete facility objects from other `public/data/reps/*.json` because the word “Genesis” appears in a facility name.

2. **Do not regenerate or bulk-overwrite** `public/data/reps/` from `scripts/map-generator/output/`. Surgical edits only. Output mirrors may be cleaned for hygiene, but never copy the whole output tree over live public data.

3. **`klea.json` is huge.** Edit **only** the top-level `meta` block (name + `reps[]`). Do not reformat/rewrite the `facilities` array. After editing, validate JSON parses (`python -c "import json; json.load(open(...))"`).

4. **Manifest integrity:** After removing Paul + both Genesis rows, set `"totalReps"` to `len(reps)` (today: 62 → **59**). Keep every remaining `slug` paired with an existing `public/data/reps/<slug>.json`.

5. **404 mechanics (already wired):**  
   - `next.config.js` has a final redirect `{ source: '/rep/:slug', destination: '/:slug' }`.  
   - Removing **only** the `/genesis` → `/rep/genesis` **rewrite** makes `/genesis` a real Next 404.  
   - `/rep/genesis` then redirects to `/genesis` and also 404s.  
   - Do **not** add a redirect from `/genesis` to `/rep` or another distributor.  
   - Do **not** remove the catch-all `/rep/:slug` rule.

6. **Keep `/kleamedical` redirects** (`/kleamedical` and `/rep/kleamedical` → `/klea`). Deleting `kleamedical.json` is safe because those redirects fire first.

7. **Roster file in git:** The deployable roster copy is `silq-website/scripts/map-generator/1099Master.csv`. Also update `Webdev\1099Master.csv` for local consistency (that root file is **outside** the git repo).

8. **PDF paths must stay identical.** Overwrite files in place; do not change `src/app/rep/[slug]/page.tsx` link paths.

9. **Scope of commit:** Prefer only task-related site files (roster, klea meta, delete genesis/kleamedical data, next.config rewrite line, bifold PDFs, investigation note). Unrelated working-tree changes (e.g. already-archived `docs/dev-prompts` deletions) may be committed separately or left unstaged — they do not affect runtime, but do not mix accidental refactors into this deploy.

10. **Pre-deploy gate:** `npm run build` must succeed. Spot-check `/klea`, `/kleamedical` (redirect), `/genesis` (404), `/rep`, and one CoMedical + one non-CoMedical bifold download on production after deploy.

---

## Workstream A — Remove Paul Wilson (keep Klea)

1. Delete Paul Wilson’s row from:
   - `Webdev\1099Master.csv` (local source of truth)
   - `silq-website\scripts\map-generator\1099Master.csv` (**in-repo**; required for git deploy consistency)
2. Update `public\data\reps\klea.json` **meta only**:
   - Remove Paul from `meta.reps[]`.
   - Update `meta.name` to remaining reps only (Derek Colins / Joe Rodriguez).
   - Validate JSON parses.
3. Remove Paul / kleamedical-only surface:
   - Delete `public\data\reps\kleamedical.json` (and map-generator output twin if present).
   - Remove the `kleamedical` / Paul Wilson object(s) from `public\data\rep-manifest.json` (and output mirror if present).
4. **Do not** remove the `/kleamedical` → `/klea` redirects in `next.config.js`.
5. Confirm `/klea` still works and overview no longer lists Paul / a separate kleamedical card.

---

## Workstream B — Remove Genesis Medical Group distributor (404)

1. Confirm no Genesis **distributor** rows remain in either `1099Master.csv` (expected already clean).
2. Delete `public\data\reps\genesis.json` (+ map-generator output twin if present).
3. Remove **all** `slug: "genesis"` entries from `public\data\rep-manifest.json` (+ mirrors). Update `totalReps`.
4. Remove **only** the `/genesis` → `/rep/genesis` rewrite from `next.config.js`. Leave the catch-all `/rep/:slug` redirect intact.
5. Grep for distributor leftovers only (`"slug": "genesis"`, `Genesis Medical Group`, `genesismedicalgroup`, Dave Riddle / Robert Stitle as rep contacts). **Do not** alter facilities named `GENESIS MEDICAL CENTER…` inside other rep JSON files.
6. Acceptance: `https://silq.tech/genesis` and `https://silq.tech/rep/genesis` return **404**; Genesis Medical Group absent from `/rep` overview; unrelated “Genesis” hospitals elsewhere still present.

---

## Workstream C — Replace ClearTract bifold PDFs

1. Source: `C:\Users\Ethan\OneDrive\Desktop\Webdev\2026 Cleartract bifold brochure.pdf`
2. Overwrite (same filenames / public URLs):
   - `public\pdfs\cleartract-bifold.pdf` — may already match the 2026 source (verify SHA256); overwrite or leave if identical.
   - `public\pdfs\cleartract-bifold-comedical.pdf` — **still the older larger file**; must replace with the 2026 source.
3. Keep link paths in `src\app\rep\[slug]\page.tsx` unchanged.
4. Optionally copy prior CoMedical PDF bytes under `Webdev\archive\` for rollback; do not introduce new public URLs.
5. Spot-check a normal rep page and a CoMedical rep page download the new brochure.

---

## Workstream D — Encompass investigation (report only)

Search the **live rep-page dataset** (`public\data\reps\*.json`, plus any facility lists the pages actually load). Report:

- Count of facilities whose names contain `Encompass` / `ENCOMPASS` / common aliases (`HealthSouth`, “affiliate of Encompass”, etc.).
- Which rep slugs / companies include them (top offenders).
- Whether they appear only in archived legacy map HTML under `Webdev\archive\` vs live July-2026 JSON.
- Recommendation: leave as-is vs exclude rehab/Encompass later — **do not implement exclusion in this task**.

Write findings in the PR/commit body or a short note under `silq-website\prompts\` (e.g. `ENCOMPASS_INVESTIGATION_SEP2026.md`).

---

## Deploy & verification

1. Run a local production build (`npm run build`) and fix breakages.
2. Commit on a branch or directly to `main` per normal team practice; **ship to production** (`silq.tech`).
3. Live checklist:
   - [ ] `/klea` loads; Paul Wilson not shown
   - [ ] `/kleamedical` still redirects to `/klea`
   - [ ] `/genesis` → 404
   - [ ] `/rep` overview has no Genesis and no Paul / kleamedical-only listing
   - [ ] Bifold downloads on a standard rep + CoMedical rep are the 2026 brochure
   - [ ] Encompass investigation note delivered

---

## Out of scope

- CMS / funnel / GPO analysis (`CMSDataAnalysis`, archived `new maps`)
- Full national rep JSON regeneration
- Changing Klea territory geography
- Redirecting `/genesis` to another distributor
- Any Encompass data scrub in this pass

---

## Suggested commit message

```
Remove Paul Wilson and Genesis from rep pages; refresh ClearTract bifolds

Drop Paul from Klea roster/data while keeping /klea and /kleamedical→/klea.
Delete Genesis site surfaces so /genesis 404s. Replace bifold PDFs at existing
public paths (including CoMedical) and document Encompass facility presence.
```
