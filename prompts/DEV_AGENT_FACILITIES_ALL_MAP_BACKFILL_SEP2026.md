# Dev Agent — Backfill missing Facilities_All.xlsx sites onto live rep maps (Sep 2026)

Ethan will paste this into a **new** agent chat. Implement in the Silq public website repo, then **deploy to production**. Ethan reviews on the live site.

You are a **dev agent**, not a coordinator. Do the work. Do **not** regenerate the full national CMS corpus. Surgical add-only.

---

## Role

Add facilities that are on Ethan’s master list (`Facilities_All.xlsx`) but **missing** from live rep-page JSON, so they show on the corresponding territory maps/tables.

This is an **add-only** pass. Existing CMS hospital rows already on the maps win. Do **not** overwrite their catheter days, GPO, HAC, physicians, addresses, or IDs from the spreadsheet.

---

## Locked decisions (from Ethan — do not reopen)

1. **Include** from the spreadsheet: `Hospital/ Medical Center`, `VA Medical Center`, `Rehabilitation Hospital`.
2. **Exclude** all `Urology Clinic` rows. Do not add clinics as map pins in this pass.
3. **Include Encompass / HealthSouth / “affiliate of Encompass” rehab hospitals.** They are the main example of “clearly missing” sites. Live maps currently have **zero** of them.
4. **Duplicates:** skip a spreadsheet row if you are reasonably confident it is the same place as an existing pin (name + state + city, after CMS CCN matching). CMS identity takes priority.
5. **Do not merge spreadsheet fields into existing CMS rows.** Spreadsheet is only a source of *new* facilities.
6. **Physicians:** if you can resolve a CMS CCN, attach affiliated Urology + Infectious Disease physicians using the existing pipeline. If you cannot, **still add** the facility with `physicians: []` and `physicianCount: 0`.
7. **All states:** process every state in the spreadsheet, including MI and DC (no live rep yet). Persist those so they are ready when reps are added. Do **not** invent fake `/rep/mi` or `/rep/dc` pages in this pass.
8. **Deploy to production** (`www.silq.tech`) after `npm run build` succeeds. Ethan reviews live.

---

## System map

| Piece | Path / note |
|--------|-------------|
| Active site repo | `C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website` |
| Git remote | `https://github.com/Ethan-Rao/Silqtech.git` — branch **`main`** |
| Production | **`www.silq.tech`** (apex `silq.tech` still Squarespace-redirects to `www`) — push to `main` auto-deploys |
| Spreadsheet (source of missing sites) | `C:\Users\Ethan\OneDrive\Desktop\Webdev\Facilities_All.xlsx` — sheet `Facility_List_1`, **4,542** rows |
| Live rep JSON | `silq-website\public\data\reps\<slug>.json` |
| Manifest | `silq-website\public\data\rep-manifest.json` (`totalReps` is **59** — do not change that count in this task) |
| Roster (territory → states) | `silq-website\scripts\map-generator\1099Master.csv` (keep in sync with `Webdev\1099Master.csv` if you edit it; **do not** need to edit roster for this task) |
| Map UI | `src\components\ui\RepMap.tsx` — pins from ZIP **prefix** (`getZipCoordinates`) else state centroid |
| Table UI | `src\components\ui\FacilitiesTable.tsx` |
| Existing generator (do **not** run a full regen) | `scripts\map-generator\generate-rep-data.py` |
| CMS / physician sources (may be archived) | Prefer `Webdev\new maps\July2026Data\` if present; else `Webdev\archive\webdev-root-20260916\new maps\July2026Data\` |
| Do **not** touch | `C:\Users\Ethan\OneDrive\Desktop\CMSDataAnalysis` |

### Spreadsheet columns

`Facility_ID`, `Facility Name`, `State`, `City`, `Facility Type`, `GPO Membership`, `Address`, `Phone`, `Days`

**`Facility_ID` is an internal 1–4542 index, not a CMS CCN.** Never use it as the live JSON `id` without a prefix. Live CMS IDs are 6-digit zero-padded strings (`normalize_facility_id` in `generate-rep-data.py`).

### Inventory snapshot (pre-task, name+state naive match)

| Type | Rows | ~Already on maps | ~Unmatched |
|------|------|------------------|------------|
| Hospital/ Medical Center | 1,759 | ~1,628 | ~131 |
| VA Medical Center | 150 | ~67 | ~83 |
| Rehabilitation Hospital | 530 | ~10 | ~520 |
| Urology Clinic | 2,103 | ~0 | ~2,103 — **out of scope, skip all** |

Unmatched hospitals/VA/rehab are the candidate add set. Expect most adds to be **rehab (including Encompass)**, plus remaining hospitals/VA that failed name match. Re-do matching yourself; do not trust this table as the final add list.

Covered live territories currently include 47 states. Spreadsheet rows with **no live slug**: **MI (141)** and **DC (11)**.

---

## Safety constraints (mandatory)

1. **Do not full-regenerate** `public/data/reps/` from `scripts/map-generator/output/`. Do not copy the output tree over live public data.
2. **Add-only on existing facilities.** If a live pin already represents that hospital, leave it untouched.
3. **Do not reintroduce** Paul Wilson, `kleamedical.json`, or Genesis Medical Group distributor (`genesis.json`, `/genesis` rewrite). Hospital names like `GENESIS MEDICAL CENTER-DAVENPORT` are **hospitals** — keep them.
4. **Do not add Urology Clinic rows.**
5. **JSON integrity:** `json.dump(..., allow_nan=False)` (or equivalent). Never write `NaN`. Use `null` for missing SIR/HAC/optional fields. After edits, `python -c "import json; json.load(open(r'...'))"` on every touched file.
6. **IDs:** CMS CCN → 6-digit padded string. Unresolved new sites → stable `FA-<spreadsheet Facility_ID>` (example `FA-1962`). Never raw `203`.
7. **Same facility on multiple reps is OK** when territories overlap (existing behavior). Duplicate means “already on **that** slug’s `facilities[]`,” not “exists somewhere in the US.”
8. **Do not change** `/kleamedical` → `/klea` redirects or remove the `/rep/:slug` catch-all.
9. **Do not change** bifold PDF URLs or other marketing pages.
10. **Manifest:** update per-entry `facilityCount` / `physicianCount` / HAC/CAUTI counts for slugs you change. Keep `"totalReps": 59`. Keep remaining slugs paired with existing JSON files.
11. **Output mirrors:** also append the same new facilities into `scripts/map-generator/output/reps/<slug>.json` for slugs you touch **or** clearly document that those mirrors are stale. Do not let a later copy-from-output wipe Encompass.
12. **Unrelated working tree** (`docs/dev-prompts` deletions, funnel scripts, etc.): leave unstaged. Commit only this backfill.

---

## Matching rules (duplicates)

Goal: add **clearly missing** sites (Encompass rehab is the prototype). Skip anything that is reasonably the same CMS hospital already on the map.

Recommended pipeline:

1. Filter spreadsheet to the three in-scope types.
2. Normalize name/city/state/address (uppercase, strip punctuation, collapse whitespace, drop trailing `, INC` / `LLC` noise).
3. Build an index of **live** facilities per slug **and** a national index of live CMS IDs.
4. Try to resolve a CMS CCN from July-2026 `Hospital_General_Information.csv` (and IRF/rehab-capable CMS hospital files if present) using name+state+city, then address. Require high confidence (normalized name equality **or** strong token overlap **and** same state+city). When two CMS rows compete, prefer exact city match + higher name similarity. **Do not force** a weak match just to attach physicians.
5. **Skip (duplicate)** if:
   - resolved CCN already exists on that slug, **or**
   - normalized name+state+city already exists on that slug, **or**
   - names are clearly the same campus (one name is a near-prefix of the other) **and** same city+state **and** a CMS hospital pin is already there (example: `MAYO CLINIC HOSPITAL ROCHESTER` live vs `MAYO CLINIC - ROCHESTER` listed as rehab with the same `Days` — **skip** the spreadsheet row; do not create a second Mayo pin and do not copy its Days onto the CMS row).
6. **Add** if:
   - Encompass / HealthSouth / affiliate-of-Encompass (unless that exact rehab name+city is already on the slug — it should not be), **or**
   - resolved CCN is **not** in that slug’s list, **or**
   - no confident CMS/live match (standalone rehab, extra VA, extra hospital).

When unsure between skip vs add: **skip** unless the name clearly indicates a distinct rehab/VA/hospital (Encompass, HealthSouth, “Rehabilitation Hospital of …”, a different street address in a different city).

---

## New facility JSON shape

Match existing facility objects. For **new** rows only:

| Field | Rule |
|--------|------|
| `id` | CMS CCN 6-digit if resolved; else `FA-<excel id>` |
| `name` | Spreadsheet name (or CMS name if CCN resolved — prefer CMS official name when CCN is solid) |
| `address`, `city`, `state`, `phone` | Spreadsheet; overlay CMS address/ZIP/phone when CCN resolved |
| `zipCode` | **Required for decent map pins.** Take from CMS when possible. Spreadsheet has no ZIP. Empty ZIP → pin falls back to **state centroid** (worse). Do the CMS ZIP lookup. |
| `hospitalType` | CMS type if known; else `"Rehabilitation"` / `"VA Medical Center"` / `"Acute Care Hospitals"` from spreadsheet type |
| `ownership` | CMS if known; else `""` |
| `gpo` | Spreadsheet `GPO Membership` (string as-is, or `""`) |
| `catheterDays` | Spreadsheet `Days` (int, 0 if missing) |
| `observedCAUTI`, `predictedCAUTI`, `sir`, `cautiStatus` | From CMS HAI if CCN resolved; else `0` / `0` / `null` / `""` |
| `priority` | `VA` if VA; `HIGH_CAUTI` only if CMS comparison is Worse-than-national; otherwise `STANDARD`. **Do not** recompute the global HIGH_VOLUME 90th-percentile on the whole corpus (that would relabel existing hospitals). |
| `hacStatus` and HAC/VBP/star fields | From existing HAC maps if CCN resolved; else `null` |
| `physicians` / `physicianCount` | From `Facility_Affiliation.csv` + Medicare physician PUF, same specialties as `generate-rep-data.py` (`Urology`, `Infectious Disease`), plus catheter HCPCS flag if that cache/code is easy to reuse. If sources missing or CCN unknown: `[]` / `0`. |

After appending, recompute that slug’s `stats` (`facilityCount`, `totalCatheterDays`, `highCautiCount`, `highVolumeCount`, `hacPenalizedCount`, `hacAtRiskCount`, `physicianCount`) from the facilities array. Update `mapConfig.facilityTypes` union. Do **not** rewrite `meta.reps` / Klea names / other meta except you may bump nothing else.

Sort: keep existing order for old rows; append new rows (or sort new ones by `catheterDays` desc). Do not reshuffle the entire existing array unless needed for JSON dump (dumping will re-serialize — acceptable if parse-valid and fields unchanged for old objects).

---

## Assignment to maps

- For each live slug, add a new facility if `facility.state` is in that slug’s `meta.territory` (and not a duplicate on that slug).
- Multi-rep companies sharing a slug (Klea, Wasatch, CoMedical, etc.): **one JSON file per slug** — add once; all named reps on that page see it.
- **MI and DC (and any other state with no slug):** do **not** drop them. Write them to:

  `silq-website/public/data/pending-states/<st>.json`

  Same facility object schema, plus a small `meta` (`state`, `generated`, `source`: `Facilities_All.xlsx`, counts). These must **not** be registered in `rep-manifest.json` and must **not** live under `public/data/reps/` (would be fetchable as a fake rep page).

---

## Physicians (best-effort)

Reuse logic in `scripts/map-generator/generate-rep-data.py` (`load_physician_data`, affiliation join on CCN). Do **not** require a full national regen.

If July 2026 physician PUF / affiliation files are only in `archive\...`, read them from there. If they cannot be loaded, add facilities anyway with empty physician lists and say so in the report. **Never block an add** on physician failure.

Do not invent NPIs. Do not scrape. Do not attach a physician to a facility without a CCN (or an equally strong affiliation key).

---

## Implementation approach (preferred)

1. Write a **one-off script** under `silq-website/scripts/map-generator/` (e.g. `backfill_facilities_all.py`) that:
   - reads the xlsx
   - loads all `public/data/reps/*.json`
   - performs matching
   - appends new objects
   - rewrites stats
   - writes pending-state files
   - writes an audit CSV/markdown under `silq-website/prompts/` (added / skipped-duplicate / skipped-clinic / pending-no-rep)
2. Run the script. Spot-check JSON parse + a few Encompass names present + a known CMS hospital **unchanged**.
3. Update `rep-manifest.json` counts for touched slugs (script or small follow-up).
4. `npm run build` in `silq-website`.
5. Commit **only** task files; push `main`; verify production.

Do not hand-edit 35k-line JSON files in the editor.

---

## Audit Ethan expects

Create `silq-website/prompts/FACILITIES_ALL_BACKFILL_REPORT_SEP2026.md` with:

- Counts in / counts skipped (clinics vs duplicates vs added)
- How many Encompass/HealthSouth added (national unique IDs)
- How many new hospitals / VA / rehab
- How many got a CCN vs `FA-*` ids
- How many got ≥1 physician vs empty
- Per-slug add counts (top 15)
- Pending MI/DC counts
- Any weak matches you skipped (short list)
- Confirmation that existing CMS rows were not mutated (spot-check 2–3 IDs’ `catheterDays` before/after)

---

## Deploy & live verification

1. `npm run build` must succeed.
2. Commit on `main` (normal team practice) with a message like:

   ```
   Add missing Facilities_All hospitals, VA, and rehab to rep maps

   Insert spreadsheet sites that are not already on a slug (including Encompass
   rehab). Leave existing CMS rows untouched; skip urology clinics. Store MI/DC
   in pending-state JSON until those reps exist.
   ```

3. Push to `origin/main`.
4. Live checklist on **https://www.silq.tech**:
   - [ ] `/rep` still lists the same people (no new fake slugs; `totalReps` 59)
   - [ ] A state with Encompass (e.g. TX `/genesis` is **gone** — use a live TX slug such as a remaining OK/TX-adjacent rep if any, otherwise a FL/TX-heavy slug like `southern-surgical` / `healthcare-cellutions`) shows an Encompass rehab in the table/map
   - [ ] `/klea` still 200; Paul Wilson still absent; new OH/KY/IN/WV rehab/hospitals appear if they were missing
   - [ ] `/kleamedical` still redirects to `/klea`
   - [ ] `/genesis` still 404
   - [ ] A known pre-existing hospital’s catheter days unchanged (pick one CMS CCN from the report)
   - [ ] No urology clinic names from the spreadsheet (spot-check a distinctive clinic name)
   - [ ] `https://www.silq.tech/data/pending-states/MI.json` (or `mi.json` — pick one casing and stick to it) exists if you used that path

If DigitalOcean takes a few minutes, poll until the new JSON is live.

No browser MCP is required if curl + JSON inspection prove the facilities are in the live slug file and the page returns 200.

---

## Out of scope

- Urology clinics
- Overwriting CMS metrics from spreadsheet `Days`
- Full `generate-rep-data.py` regen
- Creating MI/DC vanity rep pages or 1099 roster rows
- Encompass **exclusion** (include them)
- CMSDataAnalysis / funnel scripts
- Restyling map legend (rehab uses existing STANDARD/VA/HIGH_CAUTI colors)

---

## Suggested first commands

```text
python -c "import openpyxl, json, pandas; print('ok')"
# inspect spreadsheet types
# inspect one live facility object in public/data/reps/stengel.json
```

Then implement the backfill script; do not start by rewriting `klea.json` by hand.
