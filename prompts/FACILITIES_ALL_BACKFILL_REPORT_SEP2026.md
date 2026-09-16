# Facilities_All.xlsx backfill report (Sep 2026)

Add-only pass. Existing live CMS hospital rows were not overwritten.
Source: `Facilities_All.xlsx` sheet `Facility_List_1` (4542 rows).
Script: `scripts/map-generator/backfill_facilities_all.py`.
Audit CSV: `prompts/FACILITIES_ALL_BACKFILL_AUDIT_SEP2026.csv`.

## Counts

| Bucket | Count |
|--------|------:|
| Spreadsheet rows | 4542 |
| Skipped urology clinics | 2103 |
| Skipped other/blank type | 0 |
| In-scope (hospital / VA / rehab) | 2439 |
| Skipped as duplicate of a live pin | 1824 |
| Added onto one or more live slugs (spreadsheet rows) | 544 |
| Pending no-rep (MI/DC/other) rows | 71 |
| National unique IDs added (live + pending) | 615 |

### Unique added IDs by spreadsheet type (approx via hospitalType/priority)

| Type | Unique IDs |
|------|----------:|
| Hospital/ Medical Center | 97 |
| VA Medical Center | 54 |
| Rehabilitation Hospital | 464 |

Spreadsheet-row type tallies for rows that were added or pending:

| Type | Rows |
|------|-----:|
| Hospital/ Medical Center | 93 |
| VA Medical Center | 54 |
| Rehabilitation Hospital | 468 |

## Encompass / HealthSouth

National unique IDs whose name matched Encompass / HealthSouth / affiliate-of-Encompass: **198**

Live maps had zero Encompass pins before this pass. These IDs are mostly `FA-*` because July 2026 `Hospital_General_Information.csv` has **0** Encompass/HealthSouth rows (IRF rehab is outside that CMS hospital file).

## CCN vs `FA-*` (unique added IDs)

| ID style | Unique IDs |
|----------|----------:|
| CMS CCN (6-digit) | 65 |
| `FA-<spreadsheet id>` | 550 |

New CCNs that were not already on any live slug were eligible for physician join. CCNs that already existed on another slug were cloned from the live CMS object (spreadsheet Days/GPO not merged).

## Physicians (unique added IDs)

| | Unique IDs |
|--|----------:|
| ≥1 physician | 55 |
| `physicians: []` | 560 |

Physician PUF / affiliation were loaded only for **new** CCNs (not already in the live national index). Encompass rehab without a CCN is expected to have empty physician lists. Physician source files: archive `July2026Data` (`Facility_Affiliation.csv` + Medicare Provider PUF). Catheter HCPCS flags reused `scripts/map-generator/output/catheter_hcpcs_npis.json`.

## Per-slug add counts (top 15)

| Slug | Facilities appended |
|------|--------------------:|
| `healthcare-cellutions` | 109 |
| `southern-surgical` | 100 |
| `franklin-mountain-group` | 99 |
| `sisco` | 92 |
| `streamline` | 86 |
| `martinez` | 84 |
| `meinnovations` | 80 |
| `sandia` | 80 |
| `ju` | 75 |
| `streit` | 75 |
| `uromobile` | 75 |
| `activize` | 72 |
| `ghanem` | 66 |
| `whisner` | 60 |
| `a3-biomedical` | 53 |

Touched slugs: 48. `rep-manifest.json` `facilityCount` / `physicianCount` / HAC/CAUTI counts updated for those slugs. **`totalReps` remains 59.**

## Pending states (no live slug)

Wrote `public/data/pending-states/<ST>.json` (uppercase state code). Not registered in `rep-manifest.json`. Not under `public/data/reps/`.

| State | Facilities |
|-------|----------:|
| DC | 5 |
| MI | 66 |

## Weak CMS matches skipped (did not force a CCN)

High-confidence CCN attach required normalized name equality **or** strong token overlap with the same state+city. Below is a short list of the closest misses (score 0.50–0.84). These rows may still have been **added** with `FA-*` if they were not live duplicates.

| Spreadsheet | City, ST | Closest CMS | CCN | Score |
|-------------|----------|-------------|-----|------:|
| ST LUKE'S HOSPITAL - ANDERSON CAMPUS | EASTON, PA | ST LUKE'S HOSPITAL - EASTON CAMPUS | 390162 | 0.7 |
| CHI ST VINCENT REHABILITATION HOSPITAL - NORTH | SHERWOOD, AR | ST VINCENT MEDICAL CENTER/NORTH | 040137 | 0.7 |
| PSYCH/REHAB HOSPITAL VANDERBILT WILSON COUNTY HOSPITAL | LEBANON, TN | VANDERBILT WILSON COUNTY HOSPITAL | 440193 | 0.7 |

## Existing CMS rows unchanged (spot-check)

- `260032` (BARNES JEWISH HOSPITAL) on `chowning`: catheterDays 53848 → 53848 (unchanged)
- `510023` (WEIRTON MEDICAL CENTER, INC) on `klea`: catheterDays 5213 → 5213 (unchanged)
- `010001` (SOUTHEAST HEALTH MEDICAL CENTER) on `greatdane`: catheterDays 18164 → 18164 (unchanged)

IDs checked: Barnes Jewish (`260032`), Weirton Medical Center (`510023`), Southeast Health (`010001`) if present.

## Output mirrors

For each touched slug, the same new facility objects were appended to `scripts/map-generator/output/reps/<slug>.json` when that mirror file already existed. Do not copy the output tree over `public/data/reps/` later or Encompass pins will be at risk if a mirror was missing.

## Notes

- Urology clinics: all skipped.
- Mayo-style campus duplicates (rehab row with the same city/days/name family as a live CMS hospital) skipped; Encompass / HealthSouth / “Rehabilitation Hospital of …” still added.
- ZIP: CMS ZIP when a CCN resolved; otherwise the most common ZIP already known for that city+state (live + HGI) so pins are not stuck on the state centroid. Empty ZIP only when the city was unknown to both sources.
- Paul Wilson / `kleamedical.json` / `genesis.json` were not reintroduced.
