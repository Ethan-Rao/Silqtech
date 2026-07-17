# Dev Agent Prompt: July 2026 CMS Data Reconnaissance & Pipeline Assessment

## Role

You are a data engineering agent performing a comprehensive audit of a newly downloaded CMS dataset for use in regenerating the Silq website's rep pages. Your sole deliverable is a **structured Markdown summary** saved to:

```
c:\Users\Ethan\OneDrive\Desktop\Webdev\new maps\July2026Data\DATA_AUDIT_SUMMARY.md
```

**Make no changes to the website or any existing data files.** Read and analyze only.

---

## Context: What the Rep Pages Currently Display

The Silq website (`c:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website\`) serves ~65 individual sales rep territory pages. Each page (`/rep/[slug]`) is powered by a JSON file in `public/data/reps/*.json` and displays:

1. **Interactive map** — color-coded facility pins (Red = HIGH_CAUTI, Blue = HIGH_VOLUME, Orange = VA, Green = STANDARD)
2. **Facility table** — sortable columns: name, city, state, catheter days, HAC status, CAUTI status, GPO, physician count
3. **Top Target List download (CSV)** — Rep's prioritized facility list, ranked by: HAC Penalized → Worse CAUTI benchmark → High Volume (top 10% catheter days) → HAC At Risk
4. **Physician list per facility** — urologists and infectious disease physicians affiliated with each hospital

The **current facility JSON schema** per entry:
```json
{
  "id": "CMS Facility ID (6-digit string)",
  "name": "Hospital Name",
  "address": "", "city": "", "state": "", "zipCode": "", "phone": "",
  "hospitalType": "", "ownership": "",
  "gpo": "Premier / Vizient (ID)",
  "catheterDays": 12345,
  "observedCAUTI": 3,
  "predictedCAUTI": 2.1,
  "sir": 1.43,
  "cautiStatus": "Worse than the National Benchmark",
  "priority": "HIGH_CAUTI | HIGH_VOLUME | VA | STANDARD",
  "hacStatus": "HAC_PENALIZED | HAC_AT_RISK | null",
  "physicians": [{"name": "...", "npi": "...", "specialty": "Urology | Infectious Disease"}],
  "physicianCount": 5
}
```

The **current Top Targets CSV columns** (downloaded per rep):
```
Rep Name | Facility Name | Address | City | State | ZIP Code | Phone |
Catheter Volume | HAC Status | CAUTI Status | Urologists | Infectious Disease Physicians
```

Both the facility JSON schema and the Top Targets CSV are expected to gain **new fields** from the July 2026 data — document exactly which ones in your summary (see Task 4 below).

The **current data pipeline** is at:
```
c:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website\scripts\map-generator\generate-rep-data.py
```
Read it in full before investigating the new files.

---

## Current Data Sources (Old Pipeline — for comparison)

Located in `silq-website/scripts/map-generator/data/`:

| File | Purpose | Data Vintage |
|------|----------|-------------|
| `hospitals/Healthcare_Associated_Infections-Hospital.csv` | CAUTI catheter days, SIR, observed/predicted cases (HAI_2_*) | Oct 2023 |
| `hospitals/Hospital_General_Information.csv` | Hospital type, ownership, address | ~2025 |
| `doctors/DAC_NationalDownloadableFile.csv` | Physician NPI + specialty filter | 2024 |
| `doctors/Facility_Affiliation.csv` | Links physician NPIs → hospital CMS Facility IDs | 2024 |
| `data/Premier.xlsx` | GPO membership (Premier) | Unknown |
| `data/Vizient_Full.xlsx` | GPO membership (Vizient) | Unknown |

**Critical gap in old pipeline**: The `FY_2026_HAC_Reduction_Program_Hospital.csv` was never used. The current `hacStatus` field comes from an older legacy merge (`merge_hac_from_legacy.py`). The new HAC file directly and authoritatively resolves this.

---

## New Data Location

```
c:\Users\Ethan\OneDrive\Desktop\Webdev\new maps\July2026Data\
```

Also analyze this pre-processed consolidated file in the root Webdev folder:
```
c:\Users\Ethan\OneDrive\Desktop\Webdev\hospital_hac_cauti_qualitative_consolidated.csv
```

This file has 5,426 rows and schema:
```
facility_id | hospital_name | city | state | zip | county | hospital_type | ownership |
star_rating | hac_penalty_status | hac_cohort_flag | hac_tier_label | cauti_benchmark_status
```
Known values:
- `hac_penalty_status`: "Currently penalized", "At risk (top 30% HAC score)", "Not penalized / not in top 30% HAC cohort"
- `hac_tier_label`: "Tier 1 (highest HAC risk)", "Tier 2 (elevated HAC risk)", "Tier 3 (lower HAC risk)", "No HAC tier data"
- `cauti_benchmark_status`: "Worse than the National Benchmark", "No Different than National Benchmark", "Better than the National Benchmark", "Not Available"

719 hospitals are "Currently penalized", 161 are "At risk". Understand how this file was likely derived and confirm it cross-references cleanly with the theme_hospitals_current files.

---

## Your Investigation Tasks

### Task 1: Core Hospital Files

For each file, document column names, row count, data vintage (date range), and mapping to old pipeline fields.

**`theme_hospitals_current/Healthcare_Associated_Infections-Hospital.csv`**
- Confirm HAI_2_* CAUTI measures: DOPC (catheter days), SIR, NUMERATOR, ELIGCASES, CILOWER, CIUPPER
- Confirm `Compared to National` field with values ("Worse than the National Benchmark", etc.)
- Compare row count and date range vs old file (old: 4,755 facilities, Oct 2023)
- Note any new measure IDs not in the old file

**`theme_hospitals_current/FY_2026_HAC_Reduction_Program_Hospital.csv`** ⭐ HIGH PRIORITY
- This is the most impactful new file. Document full column list.
- Confirm: `Payment Reduction` (Yes/No/N/A), `Total HAC Score`, `CAUTI SIR`, `CAUTI W Z Score`
- Count hospitals by payment reduction status
- Cross-reference: how many HAC-penalized hospitals also appear in the HAI file? Are there penalized hospitals with no CAUTI metric?
- Confirm `Facility ID` format matches the 6-digit format used in HAI and Hospital_General_Information

**`theme_hospitals_current/Hospital_General_Information.csv`**
- The new file has significantly more columns than the old (37 columns vs ~10). Document all new columns.
- Specifically: is `Hospital overall rating` (star rating 1-5) present? This field is new and valuable.
- Confirm address, phone, hospital type, ownership fields still present

**`theme_hospitals_current/hvbp_safety.csv`** ⭐ CAUTI-RELEVANT
- HAI-2 columns directly measure CAUTI performance in the Value-Based Purchasing program
- Document: `HAI-2 Achievement Points`, `HAI-2 Measure Score`, `HAI-2 Performance Rate`, `HAI-2 Benchmark`
- How many hospitals have HAI-2 scores? Date range (Fiscal Year column)?
- Assess: is this additive to the HAI file, or redundant?

**`theme_hospitals_current/Complications_and_Deaths-Hospital.csv`**
- Check for PSI measures. Specifically look for: PSI-11 (postop respiratory failure), PSI-13 (postop sepsis)
- List unique Measure IDs relevant to catheter or urinary complications

### Task 2: Physician Data — New Structure

**`July2026Data/Facility_Affiliation.csv`** — CONFIRMED PRESENT
- Schema: `NPI | Ind_PAC_ID | Provider Last/First/Middle Name | suff | facility_type | Facility Affiliations Certification Number | Facility Type Certification Number`
- This is the physician→hospital link. Confirm: `facility_type` = "Hospital" rows use `Facility Affiliations Certification Number` as the CMS Facility ID join key (matching old pipeline behavior)
- Row count vs old file (old: verify from existing file)

**`Medicare Physician & Other Practitioners - by Provider/.../MUP_PHY_R26_P05_V10_D24_Prov.csv`**
- Column `Rndrng_Prvdr_Type` replaces old `pri_spec`. List ALL unique provider type values in this column.
- Identify which values correspond to: Urology, Infectious Disease, Urogynecology, Nephrology
- Old pipeline filtered for: `["UROLOGY", "INFECTIOUS DISEASE"]` — confirm exact new type strings to use
- Does this file contain any hospital affiliation data, or is it purely provider-level?
- Compare NPI count to old DAC file

**`Medicare Physician & Other Practitioners - by Provider and Service/.../PHY_R26_P05_V10_D24_Prov_Svc.csv`** ⭐ NEW SIGNAL
- Scan for catheter-related HCPCS codes: `51700`, `51702`, `51703`, `A4338`, `A4340`, `A4351`, `A4353`
- For each code found: HCPCS description, total unique NPIs, total services billed, top states
- This identifies physicians who **actually perform catheter procedures** — stronger signal than specialty alone
- Assess feasibility of incorporating into the new pipeline (file size vs value)

**`Medicare Physician & Other Practitioners - by Geography and Service/.../MUP_PHY_R26_P04_V10_D24_Geo.csv`**
- State-level aggregate view. Check for catheter HCPCS codes at geography level.
- Useful for validation: do state-level counts make sense with per-provider data?

### Task 3: Missing Data Assessment

**GPO membership** (Premier.xlsx, Vizient_Full.xlsx) is NOT in the new dataset. These files remain in the old pipeline at `silq-website/scripts/map-generator/data/`. Assess:
- Are they current enough to reuse as-is for the new pipeline?
- Recommend whether to reuse, update, or omit GPO data

### Task 4: Proposed New Fields for Facility JSON & Top Targets CSV ⭐ DELIVERABLE

This is the most important section for the next dev agent. Based on your analysis of all files, document exactly which new fields should be added to:

**A. Facility JSON schema** (additions to the current schema above):

For each proposed new field, specify:
- Field name (camelCase, e.g. `hacTierLabel`)
- Source file and column
- Example value
- Whether it's available for most hospitals or sparse
- Display recommendation (always visible in table? expandable detail? badge/chip?)

Prioritized candidates (confirm and document each):
1. `hacTierLabel` — from `hospital_hac_cauti_qualitative_consolidated.csv`: "Tier 1 (highest HAC risk)" through "No HAC tier data"
2. `starRating` — from `Hospital_General_Information.csv`: hospital overall rating (1-5)
3. `cautiVbpScore` — from `hvbp_safety.csv`: HAI-2 Measure Score (CAUTI performance in VBP program)
4. `hacTotalScore` — from `FY_2026_HAC_Reduction_Program_Hospital.csv`: Total HAC Score (numeric)
5. `cautiSirHac` — from `FY_2026_HAC_Reduction_Program_Hospital.csv`: CAUTI SIR value from HAC file (cross-check vs HAI file SIR)
6. Any additional fields you identify that are highly relevant to Foley catheter targeting

**B. Top Targets CSV** (columns to add or update):

Current columns:
```
Rep Name | Facility Name | Address | City | State | ZIP Code | Phone | Catheter Volume | HAC Status | CAUTI Status | Urologists | Infectious Disease Physicians
```

Proposed additions — confirm availability and recommend column name/placement:
1. HAC Tier (Tier 1/2/3)
2. Hospital Star Rating
3. CAUTI VBP Score
4. Total HAC Score (numeric)
5. Any additional physicians to include (Urogynecology? Nephrology?)

**C. Prioritization logic updates:**

The current Top Targets sort order is: HAC Penalized → Worse CAUTI benchmark → High Volume → HAC At Risk

With the new data, propose an updated ranking that incorporates the richer data. For example:
- Should Tier 1 HAC hospitals rank above generic "HAC Penalized"?
- Should CAUTI VBP score factor in?
- Should hospitals with both HAC penalty AND worse CAUTI benchmark get a combined "super-priority" status?

### Task 5: Cross-File Record Linkage

Verify the Facility ID join key works across all core files:
- How many unique Facility IDs in: HAI file, Hospital General Info, HAC Reduction file, hvbp_safety?
- What is the intersection count? (i.e., how many hospitals appear in all four?)
- Are there HAC-penalized hospitals absent from the HAI file? If so, what explains the gap?
- Does `hospital_hac_cauti_qualitative_consolidated.csv` align with the HAC Reduction file on penalized hospital counts?

### Task 6: Catheter-Specific Signals Across All Files

Scan all files not yet covered above for any measure, column, or data point relevant to Foley/urinary catheter usage, CAUTI prevention, or urologic care:

- `Timely_and_Effective_Care-Hospital.csv` — any catheter insertion measures?
- `Unplanned_Hospital_Visits-Hospital.csv` — readmission measures for UTI?
- `FY_2026_Hospital_Readmissions_Reduction_Program_Hospital.csv` — any UTI-related readmission measures?
- `hvbp_clinical_outcomes.csv` — any relevant outcome measures?
- `PCH_HEALTHCARE_ASSOCIATED_INFECTIONS_HOSPITAL.csv` — post-COVID hospitals, CAUTI measures?

For each, provide: measure IDs found, relevance score (1-5), and recommendation (incorporate / note for future / skip).

---

## Output Format

Save as `DATA_AUDIT_SUMMARY.md` in the July2026Data folder. Use this structure:

```markdown
# July 2026 CMS Data Audit — Silq Rep Page Regeneration

## Executive Summary
[5-7 bullet points: data readiness, key improvements over old pipeline, critical gaps resolved, open questions]

## Section 1: File Inventory
[Table: file name | row count | date range | old-pipeline equivalent or "NEW" | relevance score 1–5]

## Section 2: Core Hospital Data — Schema & Coverage Analysis
[Per-file findings, schema diffs vs old pipeline, row counts, date ranges]

## Section 3: HAC Reduction Program (FY 2026) — Deep Dive
[Full column list, penalized/at-risk counts, CAUTI SIR analysis, cross-file coverage]

## Section 4: Physician Data — Column Mapping Old → New
[Exact column name mappings, Rndrng_Prvdr_Type values for target specialties, Facility_Affiliation confirmation]

## Section 5: New Catheter-Specific Signals
[HCPCS codes found, HVBP safety scores, any other foley-relevant signals]

## Section 6: Proposed New Facility JSON Fields
[Schema additions table with source, example value, coverage, display recommendation]

## Section 7: Proposed Top Targets CSV Updates
[New columns, updated sort/prioritization logic]

## Section 8: Record Linkage Analysis
[Facility ID coverage and cross-file overlap counts]

## Section 9: GPO Data Assessment
[Reuse recommendation for Premier/Vizient files]

## Section 10: Open Questions for Ethan
[Business decisions needed: GPO reuse, physician scope expansion, new field display choices]
```

---

## Technical Notes

- All CSVs: UTF-8 encoding, use `errors='replace'`; for large files read in chunks of 100,000 rows
- HAI file is long-format — pivot on `Measure ID` to get one row per hospital
- HAC file: `Facility ID` is column 2 (not column 1 — Facility Name is first)
- Physician files are very large (millions of rows); filter on `Rndrng_Prvdr_Type` or `HCPCS_Cd` early
- `Facility_Affiliation.csv` join key: `Facility Affiliations Certification Number` = CMS Facility ID (filter `facility_type == "Hospital"` first)
- Python available; use `pandas` and `csv`; `openpyxl` or `xlrd` for any xlsx files

---

## What Happens After You Finish

The parent agent will review your `DATA_AUDIT_SUMMARY.md` and compose a second prompt to:
1. Update `generate-rep-data.py` to use the new data sources with new column mappings
2. Add the new facility JSON fields you recommend
3. Update the Top Targets CSV columns and prioritization logic
4. Regenerate all ~65 rep JSON files

Your summary is the sole input for that implementation prompt. Be specific on column names, example values, and row counts — the next agent will depend on this to write working code without needing to re-examine the raw files.
