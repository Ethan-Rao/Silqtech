# Encompass investigation (Sep 2026)

Report only — no live-data exclusion was implemented.

## Method

Searched live rep-page JSON (`public/data/reps/*.json`, 49 files after Paul/Genesis removals) for facility **names** matching:

- `\bEncompass\b` / `\bENCOMPASS\b`
- `\bHealthSouth\b` / `\bHEALTHSOUTH\b`
- `affiliate of Encompass`

Also scanned archived legacy map HTML/text under `Webdev/archive/` (Squarespace-era facility dumps). A naive substring for `health south` was **not** used after it matched unrelated names such as `ORLANDO HEALTH SOUTH LAKE HOSPITAL` and `PEACEHEALTH SOUTHWEST MEDICAL CENTER`.

## Live July-2026 JSON

| Metric | Result |
|--------|--------|
| Encompass / HealthSouth / “affiliate of Encompass” facilities | **0** unique IDs, **0** rows, **0** slugs |
| Facility rows across all live rep files (territory overlap included) | 15,113 |
| `hospitalType` values containing “Rehab” | none |

A handful of live facilities have “REHAB” / “REHABILITATION” in the **name** (children’s hospitals, Kaiser, Wellspan Surgery and Rehabilitation, Rancho Los Amigos, etc.). None are Encompass or HealthSouth. They are typed as Acute Care Hospitals or Childrens, not IRF/rehab specialty hospitals.

**Conclusion:** Encompass-branded rehab hospitals are **not** on live `/rep` pages today. They are not “top offenders” in the current corpus because they are absent.

## Archive vs live

Encompass **does** appear heavily in archived legacy map HTML, especially:

`archive/webdev-root-20260916/new maps/OldMapsSquarespaceCode/`

- 73 Squarespace-era facility dumps mention Encompass/HealthSouth-style names
- Distinct archived name strings: ~375 (many repeats of the same hospitals across rep dumps)
- Typical names: `ENCOMPASS HEALTH REHABILITATION HOSPITAL OF …`, `HEALTHSOUTH …`, `… AN AFFILIATE OF ENCOMPASS HEALTH`

Those files are **not** loaded by the live site. The July 2026 CMS hospital extract used for current JSON already excludes this IRF/rehab chain (or never included it).

## Recommendation

**Leave as-is.** No Encompass scrub is needed on live pages; the July-2026 dataset already dropped them.

Revisit exclusion only if a later regen pulls IRF / rehab specialty files (or a broader “all CMS providers” dump) back into `public/data/reps/`. If that happens, filter on name (`Encompass`, `HealthSouth`, `affiliate of Encompass`) **and** IRF/rehab hospital types — do not use a loose `health south` substring.
