# Dev Agent Prompt: July 2026 Rep Page Data Regeneration

## Role

You are a full-stack dev agent. Your task is to update the Silq website's data pipeline and frontend components to use the July 2026 CMS dataset, regenerate all rep page JSON files, and deploy to production. This is a significant upgrade: new data sources, a richer facility schema, updated priority logic, and improved Top Targets CSV downloads.

**Repository:** `c:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website\`

---

## Overview of Changes

| Layer | What changes |
|-------|-------------|
| **Python generator** | New file paths, new data sources (HAC FY2026, HVBP Safety, new physician PUF), new fields, updated logic |
| **Facility JSON schema** | 7 new fields per facility entry |
| **Physician records** | 1 new field (`billsCatheterProcedures`) |
| **FacilitiesTable.tsx** | New fields in expandable row detail; Facility interface update |
| **rep/[slug]/page.tsx** | Updated sort logic, new CSV columns |
| **rep/page.tsx** | Updated `buildTopTargetsCsv` to match |
| **Multi-rep combined scripts** | Update to use new data paths |
| **All ~65 rep JSON files** | Full regeneration |
| **rep-manifest.json** | Regenerated; `dataVersion` updated to `"07_2026"` |

---

## Part 1: Python — Update `generate-rep-data.py`

File: `scripts/map-generator/generate-rep-data.py`

Read the existing file in full first. Then apply ALL of the following changes.

### 1.1 CONFIG — New Paths

Replace the `CONFIG` dict entirely:

```python
NEW_DATA   = r"c:\Users\Ethan\OneDrive\Desktop\Webdev\new maps\July2026Data"
THEME      = NEW_DATA + r"\theme_hospitals_current"
OLD_DATA   = os.path.join(os.path.dirname(__file__), "data")  # for GPO reuse

CONFIG = {
    # ── New July 2026 inputs ────────────────────────────────────────────────
    "input_hai":           THEME + r"\Healthcare_Associated_Infections-Hospital.csv",
    "input_hac":           THEME + r"\FY_2026_HAC_Reduction_Program_Hospital.csv",
    "input_hospital_info": THEME + r"\Hospital_General_Information.csv",
    "input_hvbp_safety":   THEME + r"\hvbp_safety.csv",
    "input_pch":           THEME + r"\PCH_HEALTHCARE_ASSOCIATED_INFECTIONS_HOSPITAL.csv",

    # ── New physician files ──────────────────────────────────────────────────
    "input_affiliation":   NEW_DATA + r"\Facility_Affiliation.csv",
    "input_provider":      (NEW_DATA +
        r"\Medicare Physician & Other Practitioners - by Provider"
        r"\Medicare Physician & Other Practitioners - by Provider"
        r"\2024\MUP_PHY_R26_P05_V10_D24_Prov.csv"),
    "input_provider_svc":  (NEW_DATA +
        r"\Medicare Physician & Other Practitioners - by Provider and Service"
        r"\Medicare Physician & Other Practitioners - by Provider and Service"
        r"\2024\PHY_R26_P05_V10_D24_Prov_Svc.csv"),

    # ── Consolidated qualitative (for Tier 2 at-risk IDs) ───────────────────
    "input_consolidated":  r"c:\Users\Ethan\OneDrive\Desktop\Webdev\hospital_hac_cauti_qualitative_consolidated.csv",

    # ── GPO: reuse existing Jul 2025 files ──────────────────────────────────
    "input_premier":       os.path.join(OLD_DATA, "Premier.xlsx"),
    "input_vizient":       os.path.join(OLD_DATA, "Vizient_Full.xlsx"),

    # ── 1099 rep roster ──────────────────────────────────────────────────────
    "input_1099":          "1099Master.csv",

    # ── Output ───────────────────────────────────────────────────────────────
    "output_dir":          "output/reps",
    "manifest_file":       "output/rep-manifest.json",

    # ── Filter settings ──────────────────────────────────────────────────────
    "target_specialties":  ["Urology", "Infectious Disease"],   # title-case (new PUF)
    "catheter_hcpcs":      ["51700", "51702", "51703"],         # for procedure-active flag
    "high_use_percentile": 0.90,

    # ── CAUTI benchmark thresholds ────────────────────────────────────────────
    "cauti_measures": {
        "catheter_days":    "HAI_2_DOPC",
        "observed_cases":   "HAI_2_NUMERATOR",
        "predicted_cases":  "HAI_2_ELIGCASES",
        "sir":              "HAI_2_SIR",
    },

    # ── PCH CAUTI measures (11 cancer hospitals) ─────────────────────────────
    "pch_cauti_measures": {
        "catheter_days":    "PCH_5_DOPC",
        "observed_cases":   "PCH_5_NUMERATOR",
        "predicted_cases":  "PCH_5_ELIGCASES",
        "sir":              "PCH_5_SIR",
    },

    # ── Priority colors (unchanged) ───────────────────────────────────────────
    "priority_colors": {
        "HIGH_CAUTI": "#e41a1c",
        "HIGH_VOLUME": "#377eb8",
        "STANDARD":   "#4daf4a",
        "VA":         "#ff7f00",
    },

    "dataVersion": "07_2026",
}
```

### 1.2 New Loading Functions

Add these new functions alongside the existing `load_*` functions:

#### `load_hac_data(filepath)`
```python
def load_hac_data(filepath: str) -> Tuple[Dict[str, str], Dict[str, Dict]]:
    """
    Load FY 2026 HAC Reduction Program data.
    Returns:
      - hac_status_map: {facility_id -> "HAC_PENALIZED" | "HAC_AT_RISK" | None}
      - hac_detail_map: {facility_id -> {hacTotalScore, cautiSirHac, cautiWzScore}}
    """
    print(f"Loading HAC data from {filepath}...")
    hac_status_map = {}
    hac_detail_map = {}

    with open(filepath, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            fid = str(row.get("Facility ID", "")).strip().zfill(6)
            if not fid or fid == "000000":
                continue

            payment = str(row.get("Payment Reduction", "")).strip()
            total_score_str = str(row.get("Total HAC Score", "")).strip()
            cauti_sir_str   = str(row.get("CAUTI SIR", "")).strip()
            cauti_wz_str    = str(row.get("CAUTI W Z Score", "")).strip()

            if payment == "Yes":
                hac_status_map[fid] = "HAC_PENALIZED"
            # HAC_AT_RISK assigned later from consolidated file (not here)

            hac_detail_map[fid] = {
                "hacTotalScore": safe_float(total_score_str, None),
                "cautiSirHac":   safe_float(cauti_sir_str, None),
                "cautiWzScore":  safe_float(cauti_wz_str, None),
            }

    penalized_count = sum(1 for v in hac_status_map.values() if v == "HAC_PENALIZED")
    print(f"  Loaded HAC data: {len(hac_detail_map)} facilities, {penalized_count} penalized")
    return hac_status_map, hac_detail_map
```

#### `load_at_risk_ids(filepath)`
```python
def load_at_risk_ids(filepath: str) -> Set[str]:
    """
    Load Tier 2 (at-risk) facility IDs from the consolidated qualitative file.
    Includes all 161 Tier 2 hospitals (including Maryland, per product decision).
    """
    print(f"Loading at-risk IDs from {filepath}...")
    at_risk = set()
    with open(filepath, encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            if row.get("hac_tier_label", "").strip() == "Tier 2 (elevated HAC risk)":
                at_risk.add(row["facility_id"].strip().zfill(6))
    print(f"  Loaded {len(at_risk)} at-risk facility IDs (Tier 2)")
    return at_risk
```

#### `load_hvbp_safety(filepath)`
```python
def load_hvbp_safety(filepath: str) -> Dict[str, Dict]:
    """
    Load HVBP Safety domain data.
    Returns: {facility_id -> {cautiVbpScore: int|None, cautiVbpPerformanceRate: float|None}}
    """
    print(f"Loading HVBP Safety from {filepath}...")
    hvbp_map = {}

    with open(filepath, encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            fid = str(row.get("Facility ID", "")).strip().zfill(6)
            if not fid or fid == "000000":
                continue

            # HAI-2 Measure Score: stored as "N out of 10" → parse integer
            score_str = str(row.get("HAI-2 Measure Score", "")).strip()
            score = None
            if score_str and score_str not in ("Not Available", "N/A", ""):
                try:
                    score = int(score_str.split()[0])   # "8 out of 10" → 8
                except (ValueError, IndexError):
                    pass

            perf_rate_str = str(row.get("HAI-2 Performance Rate", "")).strip()
            perf_rate = safe_float(perf_rate_str, None) if perf_rate_str not in ("Not Available", "N/A", "") else None

            hvbp_map[fid] = {
                "cautiVbpScore": score,
                "cautiVbpPerformanceRate": perf_rate,
            }

    print(f"  Loaded HVBP Safety for {len(hvbp_map)} facilities")
    return hvbp_map
```

#### `load_star_ratings(hospital_info_df)`
```python
def load_star_ratings(hospital_info_df: pd.DataFrame) -> Dict[str, Optional[int]]:
    """
    Extract star ratings from Hospital General Information dataframe.
    Returns: {facility_id -> int (1-5) or None}
    """
    ratings = {}
    for _, row in hospital_info_df.iterrows():
        fid = str(row.get("Facility ID", "")).strip().zfill(6)
        val = str(row.get("Hospital overall rating", "")).strip()
        if val.isdigit() and 1 <= int(val) <= 5:
            ratings[fid] = int(val)
        else:
            ratings[fid] = None
    return ratings
```

#### `load_catheter_hcpcs_npis(filepath, hcpcs_codes)`
```python
def load_catheter_hcpcs_npis(filepath: str, hcpcs_codes: List[str]) -> Set[str]:
    """
    Scan the 3.2 GB Provider-and-Service PUF for catheter procedure NPIs.
    Filter: HCPCS_Cd in hcpcs_codes (51700, 51702, 51703).
    Returns set of NPI strings.
    """
    print(f"Scanning catheter HCPCS codes {hcpcs_codes} from provider-service PUF...")
    catheter_npis: Set[str] = set()
    codes_set = set(hcpcs_codes)
    chunk_size = 100_000
    rows_scanned = 0

    for chunk in pd.read_csv(filepath, dtype=str, chunksize=chunk_size, on_bad_lines="skip",
                              encoding="utf-8-sig"):
        chunk.columns = chunk.columns.str.strip()
        if "HCPCS_Cd" in chunk.columns:
            matches = chunk[chunk["HCPCS_Cd"].isin(codes_set)]
            catheter_npis.update(matches["Rndrng_NPI"].dropna().astype(str).str.strip())
        rows_scanned += len(chunk)

    print(f"  Scanned {rows_scanned:,} rows → {len(catheter_npis):,} catheter-procedure NPIs")
    return catheter_npis
```

#### `load_pch_hai_data(filepath)`
```python
def load_pch_hai_data(filepath: str) -> pd.DataFrame:
    """
    Load CAUTI data for the 11 PPS-exempt cancer hospitals (PCH).
    Schema is similar to HAI but uses PCH_5_* measure IDs and lacks 'Compared to National'.
    Returns pivoted DataFrame in same format as load_hai_data() output,
    with an added 'is_pch' column.
    """
    print(f"Loading PCH HAI data from {filepath}...")
    df = pd.read_csv(filepath, dtype=str).fillna("")
    df.columns = df.columns.str.strip()

    pch5 = df[df["Measure ID"].str.startswith("PCH_5_")].copy()

    pivot_df = pch5.pivot_table(
        index=["Facility ID", "Facility Name", "Address", "City/Town", "State",
               "ZIP Code", "Telephone Number"],
        columns="Measure ID",
        values="Score",
        aggfunc="first"
    ).reset_index()

    # Rename PCH_5_* to HAI_2_* equivalents so downstream code is uniform
    rename_map = {
        "PCH_5_DOPC":      "HAI_2_DOPC",
        "PCH_5_NUMERATOR": "HAI_2_NUMERATOR",
        "PCH_5_ELIGCASES": "HAI_2_ELIGCASES",
        "PCH_5_SIR":       "HAI_2_SIR",
    }
    pivot_df = pivot_df.rename(columns=rename_map)

    # PCH file has no 'Compared to National' — derive from SIR
    def pch_cauti_status(sir_str):
        try:
            sir = float(sir_str)
            if sir > 1.0:
                return "Worse than the National Benchmark"
            elif sir < 1.0:
                return "Better than the National Benchmark"
            else:
                return "No Different than National Benchmark"
        except (ValueError, TypeError):
            return "Not Available"

    if "HAI_2_SIR" in pivot_df.columns:
        pivot_df["CAUTI_Status"] = pivot_df["HAI_2_SIR"].apply(pch_cauti_status)
    else:
        pivot_df["CAUTI_Status"] = "Not Available"

    # PCH file has Hospital Type column directly
    pivot_df["Hospital Type"] = "Childrens"  # overridden; PCH = cancer specialty hospitals

    pivot_df["is_pch"] = True
    pivot_df["County/Parish"] = ""   # fill missing column

    print(f"  Loaded {len(pivot_df)} PCH facilities")
    return pivot_df
```

### 1.3 Update `load_physician_data()`

**Critical column name changes:** old DAC used `pri_spec`; new PUF uses `Rndrng_Prvdr_Type`.
Old names (`Provider First Name`, etc.) also changed.

Replace the DAC-reading section inside `load_physician_data()` with:
```python
# Load provider PUF in chunks (replaces DAC)
print(f"  Loading Provider PUF from {dac_path} (filtering by specialty)...")
target_specs_set = set(s.strip() for s in target_specs)   # title-case now

physician_data = []
chunk_size = 100_000

for chunk in pd.read_csv(dac_path, dtype=str, chunksize=chunk_size, on_bad_lines='skip'):
    chunk.columns = chunk.columns.str.strip()

    if "Rndrng_Prvdr_Type" in chunk.columns:
        filtered = chunk[chunk["Rndrng_Prvdr_Type"].str.strip().isin(target_specs_set)]

        for _, row in filtered.iterrows():
            npi = str(row.get("Rndrng_NPI", "")).strip()
            if npi in affiliated_npis:
                physician_data.append({
                    "NPI":       npi,
                    "FirstName": str(row.get("Rndrng_Prvdr_First_Name", "")).strip().title(),
                    "LastName":  str(row.get("Rndrng_Prvdr_Last_Org_Name", "")).strip().title(),
                    "Specialty": str(row.get("Rndrng_Prvdr_Type", "")).strip(),
                })
```

The `Facility_Affiliation.csv` join key is unchanged: filter `facility_type == "Hospital"`, use `Facility Affiliations Certification Number` → zfill(6) as the CMS Facility ID.

### 1.4 Update `build_facility_database()`

The function signature becomes:
```python
def build_facility_database(
    hai_df: pd.DataFrame,
    hospital_info_df: pd.DataFrame,
    gpo_map: Dict[str, List[str]],
    facility_physicians: Dict[str, List[dict]],
    hac_status_map: Dict[str, str],
    at_risk_ids: Set[str],
    hac_detail_map: Dict[str, Dict],
    hvbp_map: Dict[str, Dict],
    star_ratings: Dict[str, Optional[int]],
    catheter_npis: Set[str],           # NPIs that bill 51702/51703
) -> pd.DataFrame:
```

After all existing merge logic, add the new field assignments before the final `select_columns` step:

```python
# ── HAC Status (FY 2026 authoritative source) ────────────────────────
def resolve_hac_status(fid):
    if hac_status_map.get(fid) == "HAC_PENALIZED":
        return "HAC_PENALIZED"
    if fid in at_risk_ids:
        return "HAC_AT_RISK"
    return None

facilities["hacStatus"] = facilities["FacilityID"].apply(resolve_hac_status)

# ── HAC detail fields ─────────────────────────────────────────────────
facilities["hacTierLabel"] = facilities["hacStatus"].map({
    "HAC_PENALIZED": "Tier 1 (highest HAC risk)",
    "HAC_AT_RISK":   "Tier 2 (elevated HAC risk)",
}).fillna(None)
# For non-penalized, non-at-risk hospitals still in HAC program → Tier 3
facilities.loc[
    facilities["hacTierLabel"].isna() & 
    facilities["FacilityID"].isin(hac_detail_map.keys()),
    "hacTierLabel"
] = "Tier 3 (lower HAC risk)"

facilities["hacTotalScore"] = facilities["FacilityID"].map(
    lambda fid: hac_detail_map.get(fid, {}).get("hacTotalScore"))
facilities["cautiSirHac"] = facilities["FacilityID"].map(
    lambda fid: hac_detail_map.get(fid, {}).get("cautiSirHac"))
facilities["cautiWzScore"] = facilities["FacilityID"].map(
    lambda fid: hac_detail_map.get(fid, {}).get("cautiWzScore"))

# ── HVBP Safety ──────────────────────────────────────────────────────
facilities["cautiVbpScore"] = facilities["FacilityID"].map(
    lambda fid: hvbp_map.get(fid, {}).get("cautiVbpScore"))
facilities["cautiVbpPerformanceRate"] = facilities["FacilityID"].map(
    lambda fid: hvbp_map.get(fid, {}).get("cautiVbpPerformanceRate"))

# ── Star Rating ───────────────────────────────────────────────────────
facilities["starRating"] = facilities["FacilityID"].map(star_ratings)
```

**Update the Physicians column construction** (in the facility-physician merge step): when building each physician dict, add `"billsCatheterProcedures"` flag:
```python
physicians.append({
    "name":                    f"{p['FirstName']} {p['LastName']}".strip(),
    "npi":                     p["NPI"],
    "specialty":               p["Specialty"],
    "billsCatheterProcedures": p["NPI"] in catheter_npis,
})
```

**Update `final_columns`** to include new fields:
```python
final_columns = [
    "FacilityID", "Name", "Address", "City", "State", "ZipCode", "Phone",
    "Hospital Type", "Hospital Ownership", "GPO",
    "CatheterDays", "ObservedCAUTI", "PredictedCAUTI", "SIR", "CAUTI_Status",
    "Priority", "hacStatus", "hacTierLabel", "hacTotalScore",
    "cautiSirHac", "cautiWzScore",
    "cautiVbpScore", "cautiVbpPerformanceRate",
    "starRating",
    "Physicians", "PhysicianCount"
]
```

### 1.5 Update `generate_rep_json()` — New Facility Schema

In the loop building `facilities_list`, add the new fields:
```python
facilities_list.append({
    # ── existing fields (unchanged) ──────────────────────────────────
    "id":            fac["FacilityID"],
    "name":          fac["Name"],
    "address":       fac.get("Address", ""),
    "city":          fac.get("City", ""),
    "state":         fac.get("State", ""),
    "zipCode":       fac.get("ZipCode", ""),
    "phone":         fac.get("Phone", ""),
    "hospitalType":  fac.get("Hospital Type", ""),
    "ownership":     fac.get("Hospital Ownership", ""),
    "gpo":           fac.get("GPO", ""),
    "catheterDays":  int(fac.get("CatheterDays", 0)),
    "observedCAUTI": int(fac.get("ObservedCAUTI", 0)),
    "predictedCAUTI":float(fac.get("PredictedCAUTI", 0)),
    "sir":           float(sir_val) if (sir_val is not None and not pd.isna(sir_val)) else None,
    "cautiStatus":   fac.get("CAUTI_Status", ""),
    "priority":      fac.get("Priority", "STANDARD"),
    "hacStatus":     fac.get("hacStatus") if pd.notna(fac.get("hacStatus")) else None,
    "physicians":    fac.get("Physicians", []),
    "physicianCount":int(fac.get("PhysicianCount", 0)),

    # ── NEW fields ───────────────────────────────────────────────────
    "hacTierLabel":  fac.get("hacTierLabel") if pd.notna(fac.get("hacTierLabel")) else None,
    "hacTotalScore": float(fac["hacTotalScore"]) if pd.notna(fac.get("hacTotalScore")) else None,
    "cautiSirHac":   float(fac["cautiSirHac"])   if pd.notna(fac.get("cautiSirHac"))   else None,
    "cautiWzScore":  float(fac["cautiWzScore"])  if pd.notna(fac.get("cautiWzScore"))  else None,
    "cautiVbpScore": int(fac["cautiVbpScore"])   if pd.notna(fac.get("cautiVbpScore")) else None,
    "cautiVbpPerformanceRate": float(fac["cautiVbpPerformanceRate"]) if pd.notna(fac.get("cautiVbpPerformanceRate")) else None,
    "starRating":    int(fac["starRating"])       if pd.notna(fac.get("starRating"))    else None,
})
```

### 1.6 Update `main()` — Wire New Loaders

```python
def main():
    # ── Load data sources ─────────────────────────────────────────────
    reps_df          = load_1099_master(CONFIG["input_1099"])
    hai_df           = load_hai_data(CONFIG["input_hai"])
    pch_df           = load_pch_hai_data(CONFIG["input_pch"])
    hospital_info_df = load_hospital_info(CONFIG["input_hospital_info"])
    gpo_map          = load_gpo_data(CONFIG["input_premier"], CONFIG["input_vizient"])
    hac_status_map, hac_detail_map = load_hac_data(CONFIG["input_hac"])
    at_risk_ids      = load_at_risk_ids(CONFIG["input_consolidated"])
    hvbp_map         = load_hvbp_safety(CONFIG["input_hvbp_safety"])
    star_ratings     = load_star_ratings(hospital_info_df)
    catheter_npis    = load_catheter_hcpcs_npis(
                           CONFIG["input_provider_svc"],
                           CONFIG["catheter_hcpcs"])
    _, facility_physicians = load_physician_data(
        CONFIG["input_provider"],
        CONFIG["input_affiliation"],
        CONFIG["target_specialties"]
    )

    # ── Merge PCH into main HAI df ───────────────────────────────────
    # PCH hospitals are not in the main HAI file; concatenate after alignment
    hai_df_combined = pd.concat([hai_df, pch_df], ignore_index=True)

    # ── Build facility database ──────────────────────────────────────
    facilities_df = build_facility_database(
        hai_df_combined,
        hospital_info_df,
        gpo_map,
        facility_physicians,
        hac_status_map,
        at_risk_ids,
        hac_detail_map,
        hvbp_map,
        star_ratings,
        catheter_npis,
    )
    # ...rest of generation loop unchanged...
```

### 1.7 Update `dataVersion`

In `generate_rep_json()`, set:
```python
"dataVersion": CONFIG["dataVersion"]   # → "07_2026"
```

### 1.8 Retire Legacy HAC Merge

`merge_hac_from_legacy.py` is **no longer needed** — do not run it. The new pipeline sets `hacStatus` from the FY 2026 HAC file directly.

---

## Part 2: Update Combined Multi-Rep Generator Scripts

The combined scripts for `intuitek`, `klea`, `stengel`, and `genesis` import functions from `generate-rep-data.py`. Because those functions now have updated signatures (new parameters), each combined script must also pass the new arguments.

### For each combined script (`generate-intuitek-combined.py`, `generate-klea-combined.py`):

1. Add loading of new data sources after loading the existing ones:
```python
hac_status_map, hac_detail_map = gen.load_hac_data(p(CONFIG["input_hac"]))
at_risk_ids      = gen.load_at_risk_ids(p(CONFIG["input_consolidated"]))
hvbp_map         = gen.load_hvbp_safety(p(CONFIG["input_hvbp_safety"]))
star_ratings     = gen.load_star_ratings(hospital_info_df)
catheter_npis    = gen.load_catheter_hcpcs_npis(
                       p(CONFIG["input_provider_svc"]),
                       CONFIG["catheter_hcpcs"])
```

2. Update the `build_facility_database()` call to pass all new arguments.

3. In the facility list construction loop, add all new fields (same as Section 1.5).

4. Keep the `meta.reps` arrays and combined territory states as-is:
   - intuitek: GA + SC (Kevin Turner: GA; Jeff Britt: SC)
   - klea: IN + KY + OH + WV (all 3 reps: Derek Colins, Paul Wilson, Joe Rodriguez)
   - stengel: IA + MO (Brad Stengel: IA+MO; David Hoffman: MO only)
   - genesis: OK + TX (both Robert Stitle and Dave Riddle: OK+TX)

For `stengel` and `genesis`, the scripts are simple enough that you can just create minimal combined scripts in the same pattern as `generate-intuitek-combined.py` if they don't exist yet, or update existing ones.

---

## Part 3: TypeScript — Update Facility Interface

### 3.1 `src/components/ui/FacilitiesTable.tsx`

Update the `Facility` interface:
```typescript
interface Facility {
  // ── existing (unchanged) ──────────────────────────────────────────
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  hospitalType: string
  ownership: string
  gpo: string
  catheterDays: number
  observedCAUTI: number
  predictedCAUTI: number
  sir: number | null
  cautiStatus: string
  priority: 'HIGH_CAUTI' | 'HIGH_VOLUME' | 'VA' | 'STANDARD'
  hacStatus: 'HAC_PENALIZED' | 'HAC_AT_RISK' | null
  physicians: Physician[]
  physicianCount: number

  // ── NEW ──────────────────────────────────────────────────────────
  hacTierLabel: string | null
  hacTotalScore: number | null
  cautiSirHac: number | null
  cautiWzScore: number | null
  cautiVbpScore: number | null
  cautiVbpPerformanceRate: number | null
  starRating: number | null
}

interface Physician {
  name: string
  npi: string
  specialty: string
  billsCatheterProcedures: boolean   // NEW
}
```

### 3.2 `FacilitiesTable.tsx` — Expandable Row Detail

The table already has `expandedFacilityId` state and an expanded row. Find the expanded row section and add new fields as a grid of detail items below the existing physician list.

Keep the main table columns **unchanged** (name, city/state, catheter days, HAC status, CAUTI status, GPO, physician count). New fields appear only in the expanded detail panel. Use this pattern for the expanded section additions:

```tsx
{/* ── Expanded Detail: New CMS Metrics ── */}
<div className="mt-4 pt-4 border-t border-gray-100">
  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
    CMS Quality Metrics
  </h4>
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
    
    {/* Star Rating */}
    {facility.starRating != null && (
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 mb-1">Overall Rating</p>
        <p className="text-sm font-semibold">
          {'★'.repeat(facility.starRating)}{'☆'.repeat(5 - facility.starRating)}
          <span className="text-gray-400 text-xs ml-1">({facility.starRating}/5)</span>
        </p>
      </div>
    )}

    {/* HAC Tier */}
    {facility.hacTierLabel && (
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 mb-1">HAC Tier</p>
        <p className="text-sm font-semibold">{facility.hacTierLabel.replace(' (highest HAC risk)', '').replace(' (elevated HAC risk)', '').replace(' (lower HAC risk)', '')}</p>
        <p className="text-xs text-gray-400">{facility.hacTierLabel.match(/\(.*\)/)?.[0] ?? ''}</p>
      </div>
    )}

    {/* HAC Total Score */}
    {facility.hacTotalScore != null && (
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 mb-1">Total HAC Score</p>
        <p className="text-sm font-semibold">{facility.hacTotalScore.toFixed(4)}</p>
      </div>
    )}

    {/* CAUTI SIR (HAC program window) */}
    {facility.cautiSirHac != null && (
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 mb-1">CAUTI SIR (HAC)</p>
        <p className={`text-sm font-semibold ${facility.cautiSirHac > 1 ? 'text-red-600' : 'text-green-600'}`}>
          {facility.cautiSirHac.toFixed(3)}
        </p>
        <p className="text-xs text-gray-400">HAC program window</p>
      </div>
    )}

    {/* CAUTI VBP Score */}
    {facility.cautiVbpScore != null && (
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 mb-1">CAUTI VBP Score</p>
        <p className="text-sm font-semibold">{facility.cautiVbpScore} / 10</p>
        <p className="text-xs text-gray-400">Value-Based Purchasing</p>
      </div>
    )}

  </div>
</div>

{/* ── Physician list: flag catheter-procedure billers ── */}
{/* In the existing physician list rendering, add a small badge for billsCatheterProcedures: */}
{/* Next to each physician name: */}
{/* {physician.billsCatheterProcedures && (
      <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Cath Proc</span>
    )} */}
```

Note: in the physician list section, check `physician.billsCatheterProcedures` and add a small `Cath Proc` badge next to those physicians' names.

### 3.3 `src/app/rep/[slug]/page.tsx` — Update Facility Interface, Sort, and CSV

**Update the `Facility` and `Physician` interfaces** at the top of the file to match the new schema (same additions as Section 3.1).

**Update `handleDownloadTopTargets` — Priority Sort Key and CSV:**

Replace the `sortKey` function with the new 7-level ranking:
```typescript
// v2 priority sort — 7 levels
const sortKey = (f: Facility): [number, number] => {
  const vol = isHighVolume(f) ? 0 : 1
  const worseCAUTI = f.cautiStatus?.includes('Worse') ?? false
  const penalized  = f.hacStatus === 'HAC_PENALIZED'
  const atRisk     = f.hacStatus === 'HAC_AT_RISK'

  if (penalized && worseCAUTI)          return [1, vol]   // super-priority
  if (penalized)                         return [2, vol]   // HAC penalized
  if (worseCAUTI)                        return [3, vol]   // worse CAUTI, non-penalized
  if (atRisk && isHighVolume(f))         return [4, 0]     // at-risk + high volume
  if (isHighVolume(f))                   return [5, 0]     // high volume
  if (atRisk)                            return [6, vol]   // at-risk, low volume
  // Optional tie-break: low VBP score + above-median catheter days
  const medianDays = validDays[Math.floor(validDays.length * 0.5)] ?? 0
  if ((f.cautiVbpScore ?? 10) <= 3 && f.catheterDays > medianDays) return [7, vol]
  return [8, vol]
}

// Update the filter to include atRisk:
const targets = facilities.filter(f =>
  f.hacStatus === 'HAC_PENALIZED' ||
  f.hacStatus === 'HAC_AT_RISK'   ||
  f.cautiStatus?.includes('Worse') ||
  isHighVolume(f)
)
```

**Update CSV headers and row builder:**
```typescript
const headers = [
  'Facility Name',
  'Address',
  'City',
  'State',
  'ZIP Code',
  'Phone',
  'Catheter Days',          // was "Catheter Volume" (vague band) — now numeric
  'Catheter Volume Band',   // keep the High Volume / Standard band too
  'HAC Status',
  'HAC Tier',               // NEW
  'Total HAC Score',        // NEW
  'CAUTI Status',
  'CAUTI VBP Score',        // NEW
  'Star Rating',            // NEW
  'Urologists',
  'Infectious Disease Physicians',
]

const rows = targets.map(f => {
  const urologists  = f.physicians.filter(p => p.specialty === 'Urology').map(p => p.name).join('; ')
  const idPhysicians = f.physicians.filter(p => p.specialty === 'Infectious Disease').map(p => p.name).join('; ')
  const volBand = isHighVolume(f) ? 'High Volume' : 'Standard'
  return [
    `"${f.name.replace(/"/g, '""')}"`,
    `"${f.address.replace(/"/g, '""')}"`,
    `"${f.city}"`,
    f.state,
    f.zipCode,
    f.phone,
    f.catheterDays,
    volBand,
    f.hacStatus || '',
    f.hacTierLabel ? f.hacTierLabel.split(' ')[0] + ' ' + (f.hacTierLabel.match(/\d+/)?.[0] ?? '') : '',
    f.hacTotalScore != null ? f.hacTotalScore.toFixed(4) : '',
    `"${f.cautiStatus}"`,
    f.cautiVbpScore != null ? `${f.cautiVbpScore}/10` : '',
    f.starRating != null ? `${f.starRating}/5` : 'N/A',
    `"${urologists}"`,
    `"${idPhysicians}"`,
  ]
})
```

### 3.4 `src/app/rep/page.tsx` — Update `buildTopTargetsCsv`

Apply the exact same `sortKey` function and CSV header/row builder updates from Section 3.3 to the `buildTopTargetsCsv` function in `rep/page.tsx`. The logic must stay in sync.

Also update the `Facility` and `Physician` interfaces in this file to match.

---

## Part 4: Run All Generators

Run in this order. Each script takes ~3–5 minutes due to the large data files.

### Step 1: Main generator (all regular slugs)
```powershell
cd "c:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website\scripts\map-generator"
python generate-rep-data.py
```
This produces `output/reps/*.json` and `output/rep-manifest.json`.

### Step 2: Copy outputs to public
```powershell
# Copy all rep JSON files
Copy-Item "output\reps\*.json" "..\..\public\data\reps\" -Force
# Copy manifest
Copy-Item "output\rep-manifest.json" "..\..\public\data\rep-manifest.json" -Force
```

### Step 3: Multi-rep combined generators
```powershell
python generate-intuitek-combined.py
python generate-klea-combined.py
```
If `generate-stengel-combined.py` or `generate-genesis-combined.py` do not exist, create minimal ones following the same pattern as `generate-intuitek-combined.py`, using territory states and rep metadata from the existing `public/data/reps/stengel.json` and `public/data/reps/genesis.json`.

These scripts write directly to both `output/reps/` and `public/data/reps/`.

### Step 4: Rebuild chat badge (if needed)
```powershell
node scripts/build-chat-here-badge.mjs
```
Only needed if image assets were touched; otherwise skip.

---

## Part 5: TypeScript Build Check

```powershell
cd "c:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website"
npm run build 2>&1
```

Fix any TypeScript errors before proceeding. Common issues to watch for:
- `Facility` interface mismatch between components
- Null-safety on new optional fields (`?.` and `?? null` patterns)
- The `buildTopTargetsCsv` function in `rep/page.tsx` uses a local `Facility` type — make sure it matches

---

## Part 6: Commit and Deploy

```powershell
git add -A
git commit -m "July 2026 data refresh: HAC FY2026, new CAUTI metrics, star ratings, procedure physician flags"
git push origin main
```

DigitalOcean will auto-deploy on push to `main`.

---

## Summary of New Facility JSON Schema

```typescript
interface Facility {
  // ── Core (unchanged) ──────────────────────────────────────────────
  id, name, address, city, state, zipCode, phone
  hospitalType, ownership, gpo
  catheterDays, observedCAUTI, predictedCAUTI, sir
  cautiStatus   // from HAI_2_SIR "Compared to National" (live HAI file)
  priority      // HIGH_CAUTI | HIGH_VOLUME | VA | STANDARD
  hacStatus     // HAC_PENALIZED (FY2026 Payment Reduction=Yes) | HAC_AT_RISK (Tier 2) | null
  physicians[].name, .npi, .specialty
  physicianCount

  // ── New ────────────────────────────────────────────────────────────
  hacTierLabel              // "Tier 1 (highest HAC risk)" … "Tier 3 (lower HAC risk)" | null
  hacTotalScore             // numeric from FY2026 HAC file | null
  cautiSirHac               // CAUTI SIR from HAC program window (≠ HAI file SIR) | null
  cautiWzScore              // CAUTI W Z Score from HAC file | null
  cautiVbpScore             // 0–10 integer, HAI-2 VBP points | null
  cautiVbpPerformanceRate   // float | null
  starRating                // 1–5 integer | null
  physicians[].billsCatheterProcedures   // boolean (51700/51702/51703 HCPCS biller)
}
```

---

## Key Data Facts for Reference

| Fact | Value |
|------|-------|
| HAI data vintage | 07/01/2024 – 06/30/2025 |
| Facilities with CAUTI data | 4,792 (main) + 11 PCH = 4,803 |
| HAC_PENALIZED hospitals | 719 |
| HAC_AT_RISK hospitals | 161 (including 15 MD waiver hospitals) |
| "Worse than National Benchmark" | 15 hospitals (was 27) |
| Super-priority (penalized + worse) | ~5 hospitals nationally |
| HVBP HAI-2 coverage | 1,894 hospitals |
| Star rating coverage | 3,182 hospitals (2,250 N/A) |
| Catheter-procedure NPIs (51700/51702/51703) | ~4,009 unique NPIs |
| Specialty filter strings | `"Urology"`, `"Infectious Disease"` (title-case) |
| dataVersion | `"07_2026"` |
