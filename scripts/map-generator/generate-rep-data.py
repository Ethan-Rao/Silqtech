#!/usr/bin/env python3
"""
Rep Page Data Generator
========================
Generates JSON data files for Next.js rep pages from CMS hospital data,
physician affiliations, GPO membership, and CAUTI metrics.

July 2026 sources:
- Healthcare_Associated_Infections-Hospital.csv (HAI_2_* CAUTI)
- FY_2026_HAC_Reduction_Program_Hospital.csv (authoritative hacStatus)
- hvbp_safety.csv (HAI-2 VBP scores)
- PCH_HEALTHCARE_ASSOCIATED_INFECTIONS_HOSPITAL.csv (11 cancer hospitals)
- Medicare Physician PUF (Rndrng_Prvdr_Type) + Facility_Affiliation.csv
- Provider-and-Service PUF for catheter HCPCS flags (51700/51702/51703)
- Premier.xlsx / Vizient_Full.xlsx (GPO reuse)
"""

import os
import sys
import csv
import json
import re
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, List, Optional, Set, Tuple

# ============================================================================
# CONFIGURATION
# ============================================================================

NEW_DATA = r"c:\Users\Ethan\OneDrive\Desktop\Webdev\new maps\July2026Data"
THEME = NEW_DATA + r"\theme_hospitals_current"
OLD_DATA = os.path.join(os.path.dirname(__file__), "data")  # for GPO reuse

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
    "target_specialties":  ["Urology", "Infectious Disease"],
    "catheter_hcpcs":      ["51700", "51702", "51703"],
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

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def slugify(text: str) -> str:
    """Convert company name to URL-safe slug."""
    if not text or pd.isna(text):
        return ""
    text = str(text).lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def clean_state(s: str) -> str:
    """Normalize state code to uppercase 2-letter."""
    if not s or pd.isna(s):
        return ""
    return str(s).strip().upper()[:2]

def parse_geography(geo: str) -> Set[str]:
    """Parse comma-separated state codes into a set."""
    if not geo or pd.isna(geo):
        return set()
    return {clean_state(s) for s in str(geo).split(",") if s.strip()}

def safe_float(val, default=0.0):
    """Safely convert to float. Pass default=None to preserve missing values."""
    try:
        if val is None or (isinstance(val, float) and pd.isna(val)):
            return default
        if isinstance(val, str) and val.strip() in ("", "Not Available", "N/A", "nan"):
            return default
        if pd.isna(val) or val == "Not Available" or val == "N/A":
            return default
        return float(val)
    except (ValueError, TypeError):
        return default

def safe_int(val, default=0) -> int:
    """Safely convert to int."""
    try:
        if pd.isna(val) or val == "Not Available" or val == "N/A":
            return default
        return int(float(val))
    except (ValueError, TypeError):
        return default

def format_phone(phone: str) -> str:
    """Format phone number for display."""
    if not phone or pd.isna(phone):
        return ""
    digits = re.sub(r'\D', '', str(phone))
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    return str(phone)

def normalize_facility_id(fid) -> str:
    """Normalize CMS Facility ID to 6-digit zero-padded string."""
    s = str(fid).strip() if fid is not None else ""
    if not s or s.lower() == "nan":
        return ""
    if s.isdigit():
        return s.zfill(6)
    return s

# ============================================================================
# DATA LOADING FUNCTIONS
# ============================================================================

def load_1099_master(filepath: str) -> pd.DataFrame:
    """Load rep roster with geography assignments."""
    print(f"Loading 1099 Master from {filepath}...")
    df = pd.read_csv(filepath, dtype=str, encoding="utf-8-sig").fillna("")
    df.columns = df.columns.str.strip()
    print(f"  Loaded {len(df)} reps")
    return df

def load_hai_data(filepath: str) -> pd.DataFrame:
    """
    Load Healthcare-Associated Infections data.
    Pivots from long format to wide format with CAUTI-specific columns.
    """
    print(f"Loading HAI data from {filepath}...")
    df = pd.read_csv(filepath, dtype=str, encoding="utf-8", encoding_errors="replace").fillna("")
    df.columns = df.columns.str.strip()

    cauti_df = df[df["Measure ID"].str.startswith("HAI_2_")].copy()

    pivot_df = cauti_df.pivot_table(
        index=["Facility ID", "Facility Name", "Address", "City/Town", "State", "ZIP Code", "Telephone Number"],
        columns="Measure ID",
        values="Score",
        aggfunc="first"
    ).reset_index()

    sir_comparison = cauti_df[cauti_df["Measure ID"] == "HAI_2_SIR"][
        ["Facility ID", "Compared to National"]
    ].drop_duplicates().set_index("Facility ID")["Compared to National"].to_dict()

    pivot_df["CAUTI_Status"] = pivot_df["Facility ID"].map(sir_comparison)
    pivot_df["Facility ID"] = pivot_df["Facility ID"].apply(normalize_facility_id)

    print(f"  Loaded CAUTI data for {len(pivot_df)} facilities")
    return pivot_df

def load_pch_hai_data(filepath: str) -> pd.DataFrame:
    """
    Load CAUTI data for PPS-exempt cancer hospitals (PCH).
    Renames PCH_5_* to HAI_2_* so downstream code is uniform.
    """
    print(f"Loading PCH HAI data from {filepath}...")
    df = pd.read_csv(filepath, dtype=str, encoding="utf-8", encoding_errors="replace").fillna("")
    df.columns = df.columns.str.strip()

    pch5 = df[df["Measure ID"].str.startswith("PCH_5_")].copy()
    if "Telephone Number" not in pch5.columns:
        pch5["Telephone Number"] = ""

    index_cols = ["Facility ID", "Facility Name", "Address", "City/Town", "State", "ZIP Code", "Telephone Number"]
    pivot_df = pch5.pivot_table(
        index=index_cols,
        columns="Measure ID",
        values="Score",
        aggfunc="first"
    ).reset_index()

    rename_map = {
        "PCH_5_DOPC":      "HAI_2_DOPC",
        "PCH_5_NUMERATOR": "HAI_2_NUMERATOR",
        "PCH_5_ELIGCASES": "HAI_2_ELIGCASES",
        "PCH_5_SIR":       "HAI_2_SIR",
    }
    pivot_df = pivot_df.rename(columns=rename_map)

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

    # Carry Hospital Type from source if available
    if "Hospital Type" in pch5.columns:
        type_map = (
            pch5[["Facility ID", "Hospital Type"]]
            .drop_duplicates("Facility ID")
            .set_index("Facility ID")["Hospital Type"]
            .to_dict()
        )
        pivot_df["Hospital Type"] = pivot_df["Facility ID"].map(type_map)
    else:
        pivot_df["Hospital Type"] = "Acute Care Hospitals"

    pivot_df["is_pch"] = True
    pivot_df["Facility ID"] = pivot_df["Facility ID"].apply(normalize_facility_id)

    print(f"  Loaded {len(pivot_df)} PCH facilities")
    return pivot_df

def load_hospital_info(filepath: str) -> pd.DataFrame:
    """Load hospital general information for additional metadata."""
    print(f"Loading Hospital Info from {filepath}...")
    df = pd.read_csv(filepath, dtype=str, encoding="utf-8", encoding_errors="replace").fillna("")
    df.columns = df.columns.str.strip()
    df["Facility ID"] = df["Facility ID"].apply(normalize_facility_id)
    print(f"  Loaded info for {len(df)} hospitals")
    return df

def load_hac_data(filepath: str) -> Tuple[Dict[str, str], Dict[str, Dict]]:
    """
    Load FY 2026 HAC Reduction Program data.
    Returns:
      - hac_status_map: {facility_id -> "HAC_PENALIZED"}
      - hac_detail_map: {facility_id -> {hacTotalScore, cautiSirHac, cautiWzScore}}
    """
    print(f"Loading HAC data from {filepath}...")
    hac_status_map: Dict[str, str] = {}
    hac_detail_map: Dict[str, Dict] = {}

    with open(filepath, encoding="utf-8-sig", errors="replace") as f:
        reader = csv.DictReader(f)
        for row in reader:
            fid = normalize_facility_id(row.get("Facility ID", ""))
            if not fid or fid == "000000":
                continue

            payment = str(row.get("Payment Reduction", "")).strip()
            if payment == "Yes":
                hac_status_map[fid] = "HAC_PENALIZED"

            hac_detail_map[fid] = {
                "hacTotalScore": safe_float(row.get("Total HAC Score", ""), None),
                "cautiSirHac":   safe_float(row.get("CAUTI SIR", ""), None),
                "cautiWzScore":  safe_float(row.get("CAUTI W Z Score", ""), None),
            }

    penalized_count = sum(1 for v in hac_status_map.values() if v == "HAC_PENALIZED")
    print(f"  Loaded HAC data: {len(hac_detail_map)} facilities, {penalized_count} penalized")
    return hac_status_map, hac_detail_map

def load_at_risk_ids(filepath: str) -> Set[str]:
    """
    Load Tier 2 (at-risk) facility IDs from the consolidated qualitative file.
    Includes all 161 Tier 2 hospitals (including Maryland, per product decision).
    """
    print(f"Loading at-risk IDs from {filepath}...")
    at_risk: Set[str] = set()
    with open(filepath, encoding="utf-8-sig", errors="replace") as f:
        for row in csv.DictReader(f):
            if row.get("hac_tier_label", "").strip() == "Tier 2 (elevated HAC risk)":
                fid = normalize_facility_id(row.get("facility_id", ""))
                if fid:
                    at_risk.add(fid)
    print(f"  Loaded {len(at_risk)} at-risk facility IDs (Tier 2)")
    return at_risk

def load_hvbp_safety(filepath: str) -> Dict[str, Dict]:
    """
    Load HVBP Safety domain data.
    Returns: {facility_id -> {cautiVbpScore: int|None, cautiVbpPerformanceRate: float|None}}
    """
    print(f"Loading HVBP Safety from {filepath}...")
    hvbp_map: Dict[str, Dict] = {}

    with open(filepath, encoding="utf-8-sig", errors="replace") as f:
        for row in csv.DictReader(f):
            fid = normalize_facility_id(row.get("Facility ID", ""))
            if not fid or fid == "000000":
                continue

            score_str = str(row.get("HAI-2 Measure Score", "")).strip()
            score = None
            if score_str and score_str not in ("Not Available", "N/A", ""):
                try:
                    score = int(score_str.split()[0])  # "8 out of 10" → 8
                except (ValueError, IndexError):
                    pass

            perf_rate_str = str(row.get("HAI-2 Performance Rate", "")).strip()
            perf_rate = (
                safe_float(perf_rate_str, None)
                if perf_rate_str not in ("Not Available", "N/A", "")
                else None
            )

            hvbp_map[fid] = {
                "cautiVbpScore": score,
                "cautiVbpPerformanceRate": perf_rate,
            }

    print(f"  Loaded HVBP Safety for {len(hvbp_map)} facilities")
    return hvbp_map

def load_star_ratings(hospital_info_df: pd.DataFrame) -> Dict[str, Optional[int]]:
    """Extract star ratings from Hospital General Information dataframe."""
    ratings: Dict[str, Optional[int]] = {}
    for _, row in hospital_info_df.iterrows():
        fid = normalize_facility_id(row.get("Facility ID", ""))
        if not fid:
            continue
        val = str(row.get("Hospital overall rating", "")).strip()
        if val.isdigit() and 1 <= int(val) <= 5:
            ratings[fid] = int(val)
        else:
            ratings[fid] = None
    return ratings

def load_catheter_hcpcs_npis(filepath: str, hcpcs_codes: List[str]) -> Set[str]:
    """
    Scan the Provider-and-Service PUF for catheter procedure NPIs.
    Filter: HCPCS_Cd in hcpcs_codes (51700, 51702, 51703).
    Caches results next to the script to speed up combined generators.
    """
    cache_path = os.path.join(os.path.dirname(__file__), "output", "catheter_hcpcs_npis.json")
    codes_key = ",".join(sorted(hcpcs_codes))
    if os.path.exists(cache_path):
        try:
            with open(cache_path, encoding="utf-8") as f:
                cached = json.load(f)
            if cached.get("codes") == codes_key and cached.get("npis"):
                print(f"Loading {len(cached['npis']):,} catheter-procedure NPIs from cache...")
                return set(cached["npis"])
        except Exception as e:
            print(f"  Cache read failed ({e}); rescanning PUF...")

    print(f"Scanning catheter HCPCS codes {hcpcs_codes} from provider-service PUF...")
    catheter_npis: Set[str] = set()
    codes_set = set(hcpcs_codes)
    chunk_size = 100_000
    rows_scanned = 0

    for chunk in pd.read_csv(
        filepath,
        dtype=str,
        chunksize=chunk_size,
        on_bad_lines="skip",
        encoding="utf-8",
        encoding_errors="replace",
        usecols=lambda c: c.strip() in ("HCPCS_Cd", "Rndrng_NPI"),
    ):
        chunk.columns = chunk.columns.str.strip()
        if "HCPCS_Cd" in chunk.columns and "Rndrng_NPI" in chunk.columns:
            matches = chunk[chunk["HCPCS_Cd"].isin(codes_set)]
            catheter_npis.update(matches["Rndrng_NPI"].dropna().astype(str).str.strip())
        rows_scanned += len(chunk)
        if rows_scanned % 2_000_000 == 0:
            print(f"    ...scanned {rows_scanned:,} rows, {len(catheter_npis):,} NPIs so far")

    print(f"  Scanned {rows_scanned:,} rows -> {len(catheter_npis):,} catheter-procedure NPIs")
    try:
        os.makedirs(os.path.dirname(cache_path), exist_ok=True)
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump({"codes": codes_key, "npis": sorted(catheter_npis)}, f)
        print(f"  Wrote cache: {cache_path}")
    except Exception as e:
        print(f"  Warning: could not write cache: {e}")
    return catheter_npis

def load_gpo_data(premier_path: str, vizient_path: str) -> Dict[str, List[str]]:
    """
    Load GPO membership data.
    Returns dict mapping facility name (normalized) to list of GPO memberships.
    """
    print("Loading GPO membership data...")
    gpo_map: Dict[str, List[str]] = {}

    if os.path.exists(premier_path):
        try:
            df = pd.read_excel(premier_path, dtype=str).fillna("")
            for _, row in df.iterrows():
                name = str(row.get("Facility Name", "")).strip().upper()
                if name:
                    gpo_map.setdefault(name, [])
                    gpo_map[name].append("Premier")
            print(f"  Loaded Premier: {len(df)} entries")
        except Exception as e:
            print(f"  Warning: Could not load Premier data: {e}")

    if os.path.exists(vizient_path):
        try:
            df = pd.read_excel(vizient_path, dtype=str).fillna("")
            for _, row in df.iterrows():
                name = str(row.get("Member Name", "")).strip().upper()
                member_id = str(row.get("Member ID", "")).strip()
                if name:
                    gpo_map.setdefault(name, [])
                    gpo_entry = f"Vizient ({member_id})" if member_id else "Vizient"
                    if gpo_entry not in gpo_map[name]:
                        gpo_map[name].append(gpo_entry)
            print(f"  Loaded Vizient: {len(df)} entries")
        except Exception as e:
            print(f"  Warning: Could not load Vizient data: {e}")

    return gpo_map

def load_physician_data(
    provider_path: str,
    affiliation_path: str,
    target_specs: List[str],
    catheter_npis: Optional[Set[str]] = None,
) -> Tuple[pd.DataFrame, Dict[str, List[dict]]]:
    """
    Load physician data filtered to target specialties from Medicare Provider PUF.
    Returns:
    - DataFrame of physicians
    - Dict mapping Facility ID -> list of physician dicts
    """
    print("Loading physician data...")
    catheter_npis = catheter_npis or set()

    print(f"  Loading affiliations from {affiliation_path}...")
    affil_df = pd.read_csv(
        affiliation_path, dtype=str, encoding="utf-8", encoding_errors="replace"
    ).fillna("")
    affil_df.columns = affil_df.columns.str.strip()

    hospital_affil = affil_df[affil_df["facility_type"].str.lower() == "hospital"].copy()
    hospital_affil["NPI"] = hospital_affil["NPI"].astype(str).str.strip()
    hospital_affil["fac_id"] = hospital_affil[
        "Facility Affiliations Certification Number"
    ].apply(normalize_facility_id)
    hospital_affil = hospital_affil[
        (hospital_affil["NPI"] != "") & (hospital_affil["fac_id"] != "")
    ]
    affiliated_npis = set(hospital_affil["NPI"].unique())
    print(f"    {len(affiliated_npis)} unique NPIs with hospital affiliations")

    facility_npi_map: Dict[str, Set[str]] = (
        hospital_affil.groupby("fac_id")["NPI"].apply(set).to_dict()
    )

    print(f"  Loading Provider PUF from {provider_path} (filtering by specialty)...")
    target_specs_set = set(s.strip() for s in target_specs)

    physician_data = []
    chunk_size = 100_000

    for chunk in pd.read_csv(
        provider_path,
        dtype=str,
        chunksize=chunk_size,
        on_bad_lines="skip",
        encoding="utf-8",
        encoding_errors="replace",
    ):
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

    print(f"    Found {len(physician_data)} physicians in target specialties with affiliations")

    npi_to_physician = {p["NPI"]: p for p in physician_data}

    facility_physicians: Dict[str, List[dict]] = {}
    for fac_id, npis in facility_npi_map.items():
        physicians = []
        for npi in npis:
            if npi in npi_to_physician:
                p = npi_to_physician[npi]
                physicians.append({
                    "name": f"{p['FirstName']} {p['LastName']}".strip(),
                    "npi": p["NPI"],
                    "specialty": p["Specialty"],
                    "billsCatheterProcedures": npi in catheter_npis,
                })
        if physicians:
            facility_physicians[fac_id] = physicians

    print(f"    Mapped physicians to {len(facility_physicians)} facilities")

    return pd.DataFrame(physician_data), facility_physicians

# ============================================================================
# DATA PROCESSING FUNCTIONS
# ============================================================================

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
    catheter_npis: Set[str],
) -> pd.DataFrame:
    """Build comprehensive facility database combining all data sources."""
    print("Building facility database...")

    facilities = hai_df.copy()

    facilities = facilities.rename(columns={
        "Facility ID": "FacilityID",
        "Facility Name": "Name",
        "City/Town": "City",
        "ZIP Code": "ZipCode",
        "Telephone Number": "Phone",
    })

    facilities["FacilityID"] = facilities["FacilityID"].apply(normalize_facility_id)
    facilities["State"] = facilities["State"].apply(clean_state)

    # Deduplicate if PCH overlap with main HAI
    facilities = facilities.drop_duplicates(subset=["FacilityID"], keep="first")

    facilities["CatheterDays"] = facilities.get("HAI_2_DOPC", pd.Series(["0"] * len(facilities))).apply(
        lambda x: safe_int(x, 0)
    )
    facilities["ObservedCAUTI"] = facilities.get("HAI_2_NUMERATOR", pd.Series(["0"] * len(facilities))).apply(
        lambda x: safe_int(x, 0)
    )
    facilities["PredictedCAUTI"] = facilities.get("HAI_2_ELIGCASES", pd.Series(["0"] * len(facilities))).apply(
        lambda x: safe_float(x, 0)
    )
    facilities["SIR"] = facilities.get("HAI_2_SIR", pd.Series([""] * len(facilities))).apply(
        lambda x: safe_float(x, None)
    )

    def get_priority(row):
        status = str(row.get("CAUTI_Status", "")).strip()
        if "Worse" in status:
            return "HIGH_CAUTI"
        return "STANDARD"

    facilities["Priority"] = facilities.apply(get_priority, axis=1)

    valid_days = facilities[facilities["CatheterDays"] > 0]["CatheterDays"]
    if len(valid_days) > 0:
        high_use_threshold = valid_days.quantile(CONFIG["high_use_percentile"])
        print(f"  High-use threshold (90th percentile): {high_use_threshold:,.0f} catheter days")
        facilities.loc[
            (facilities["CatheterDays"] >= high_use_threshold) &
            (facilities["Priority"] != "HIGH_CAUTI"),
            "Priority"
        ] = "HIGH_VOLUME"

    facilities.loc[
        facilities["Name"].str.contains("VA MEDICAL|VETERANS", case=False, na=False),
        "Priority"
    ] = "VA"

    facilities["GPO"] = facilities["Name"].str.upper().map(
        lambda x: ", ".join(gpo_map.get(x, [])) if x in gpo_map else ""
    )

    # Merge hospital type / ownership (prefer HGI; keep PCH type if already set)
    if len(hospital_info_df) > 0:
        info_subset = hospital_info_df[["Facility ID", "Hospital Type", "Hospital Ownership"]].copy()
        info_subset = info_subset.rename(columns={
            "Facility ID": "FacilityID",
            "Hospital Type": "Hospital Type_hgi",
            "Hospital Ownership": "Hospital Ownership",
        })
        facilities = facilities.merge(info_subset, on="FacilityID", how="left")
        if "Hospital Type" in facilities.columns:
            facilities["Hospital Type"] = facilities["Hospital Type"].fillna(
                facilities.get("Hospital Type_hgi")
            )
            facilities["Hospital Type"] = facilities["Hospital Type"].where(
                facilities["Hospital Type"].astype(str).str.len() > 0,
                facilities["Hospital Type_hgi"],
            )
        else:
            facilities["Hospital Type"] = facilities["Hospital Type_hgi"]
        if "Hospital Type_hgi" in facilities.columns:
            facilities = facilities.drop(columns=["Hospital Type_hgi"])
    else:
        if "Hospital Type" not in facilities.columns:
            facilities["Hospital Type"] = "Acute Care Hospitals"
        facilities["Hospital Ownership"] = ""

    if "Hospital Ownership" not in facilities.columns:
        facilities["Hospital Ownership"] = ""

    # ── HAC Status (FY 2026 authoritative source) ────────────────────────
    def resolve_hac_status(fid):
        if hac_status_map.get(fid) == "HAC_PENALIZED":
            return "HAC_PENALIZED"
        if fid in at_risk_ids:
            return "HAC_AT_RISK"
        return None

    facilities["hacStatus"] = facilities["FacilityID"].apply(resolve_hac_status)

    facilities["hacTierLabel"] = facilities["hacStatus"].map({
        "HAC_PENALIZED": "Tier 1 (highest HAC risk)",
        "HAC_AT_RISK":   "Tier 2 (elevated HAC risk)",
    })
    facilities.loc[
        facilities["hacTierLabel"].isna() &
        facilities["FacilityID"].isin(hac_detail_map.keys()),
        "hacTierLabel"
    ] = "Tier 3 (lower HAC risk)"

    facilities["hacTotalScore"] = facilities["FacilityID"].map(
        lambda fid: hac_detail_map.get(fid, {}).get("hacTotalScore")
    )
    facilities["cautiSirHac"] = facilities["FacilityID"].map(
        lambda fid: hac_detail_map.get(fid, {}).get("cautiSirHac")
    )
    facilities["cautiWzScore"] = facilities["FacilityID"].map(
        lambda fid: hac_detail_map.get(fid, {}).get("cautiWzScore")
    )

    facilities["cautiVbpScore"] = facilities["FacilityID"].map(
        lambda fid: hvbp_map.get(fid, {}).get("cautiVbpScore")
    )
    facilities["cautiVbpPerformanceRate"] = facilities["FacilityID"].map(
        lambda fid: hvbp_map.get(fid, {}).get("cautiVbpPerformanceRate")
    )

    facilities["starRating"] = facilities["FacilityID"].map(star_ratings)

    # Physicians (already include billsCatheterProcedures from load_physician_data)
    facilities["Physicians"] = facilities["FacilityID"].map(
        lambda x: facility_physicians.get(x, [])
    )
    # Ensure flag present even if physician list was built without catheter_npis
    def ensure_cath_flag(phys_list):
        out = []
        for p in (phys_list or []):
            q = dict(p)
            if "billsCatheterProcedures" not in q:
                q["billsCatheterProcedures"] = q.get("npi", "") in catheter_npis
            out.append(q)
        return out

    facilities["Physicians"] = facilities["Physicians"].apply(ensure_cath_flag)
    facilities["PhysicianCount"] = facilities["Physicians"].apply(len)

    facilities["Phone"] = facilities["Phone"].apply(format_phone)

    final_columns = [
        "FacilityID", "Name", "Address", "City", "State", "ZipCode", "Phone",
        "Hospital Type", "Hospital Ownership", "GPO",
        "CatheterDays", "ObservedCAUTI", "PredictedCAUTI", "SIR", "CAUTI_Status",
        "Priority", "hacStatus", "hacTierLabel", "hacTotalScore",
        "cautiSirHac", "cautiWzScore",
        "cautiVbpScore", "cautiVbpPerformanceRate",
        "starRating",
        "Physicians", "PhysicianCount",
    ]
    final_columns = [c for c in final_columns if c in facilities.columns]
    facilities = facilities[final_columns]

    print(f"  Built database with {len(facilities)} facilities")
    print(f"    HIGH_CAUTI: {len(facilities[facilities['Priority'] == 'HIGH_CAUTI'])}")
    print(f"    HIGH_VOLUME: {len(facilities[facilities['Priority'] == 'HIGH_VOLUME'])}")
    print(f"    VA: {len(facilities[facilities['Priority'] == 'VA'])}")
    print(f"    HAC_PENALIZED: {(facilities['hacStatus'] == 'HAC_PENALIZED').sum()}")
    print(f"    HAC_AT_RISK: {(facilities['hacStatus'] == 'HAC_AT_RISK').sum()}")

    return facilities

def filter_facilities_for_rep(facilities_df: pd.DataFrame, states: Set[str]) -> pd.DataFrame:
    """Filter facilities to rep's territory states."""
    if not states:
        return pd.DataFrame()

    filtered = facilities_df[facilities_df["State"].isin(states)].copy()

    priority_order = {"HIGH_CAUTI": 0, "HIGH_VOLUME": 1, "VA": 2, "STANDARD": 3}
    filtered["PriorityOrder"] = filtered["Priority"].map(priority_order)
    filtered = filtered.sort_values(
        by=["PriorityOrder", "CatheterDays"],
        ascending=[True, False]
    ).reset_index(drop=True)

    return filtered

def _nullable_float(val):
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return None
    try:
        if pd.isna(val):
            return None
        return float(val)
    except (ValueError, TypeError):
        return None

def _nullable_int(val):
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return None
    try:
        if pd.isna(val):
            return None
        return int(val)
    except (ValueError, TypeError):
        return None

def facility_row_to_dict(fac: pd.Series) -> dict:
    """Convert a facility Series to the JSON facility schema."""
    sir_val = fac.get("SIR")
    return {
        "id":            fac["FacilityID"],
        "name":          fac["Name"],
        "address":       fac.get("Address", "") or "",
        "city":          fac.get("City", "") or "",
        "state":         fac.get("State", "") or "",
        "zipCode":       fac.get("ZipCode", "") or "",
        "phone":         fac.get("Phone", "") or "",
        "hospitalType":  fac.get("Hospital Type", "") or "",
        "ownership":     fac.get("Hospital Ownership", "") or "",
        "gpo":           fac.get("GPO", "") or "",
        "catheterDays":  int(fac.get("CatheterDays", 0) or 0),
        "observedCAUTI": int(fac.get("ObservedCAUTI", 0) or 0),
        "predictedCAUTI": float(fac.get("PredictedCAUTI", 0) or 0),
        "sir":           _nullable_float(sir_val),
        "cautiStatus":   fac.get("CAUTI_Status", "") or "",
        "priority":      fac.get("Priority", "STANDARD") or "STANDARD",
        "hacStatus":     fac.get("hacStatus") if pd.notna(fac.get("hacStatus")) else None,
        "physicians":    fac.get("Physicians", []) or [],
        "physicianCount": int(fac.get("PhysicianCount", 0) or 0),
        "hacTierLabel":  fac.get("hacTierLabel") if pd.notna(fac.get("hacTierLabel")) else None,
        "hacTotalScore": _nullable_float(fac.get("hacTotalScore")),
        "cautiSirHac":   _nullable_float(fac.get("cautiSirHac")),
        "cautiWzScore":  _nullable_float(fac.get("cautiWzScore")),
        "cautiVbpScore": _nullable_int(fac.get("cautiVbpScore")),
        "cautiVbpPerformanceRate": _nullable_float(fac.get("cautiVbpPerformanceRate")),
        "starRating":    _nullable_int(fac.get("starRating")),
    }

def generate_rep_json(rep_row: pd.Series, facilities_df: pd.DataFrame) -> dict:
    """Generate JSON data structure for a single rep."""
    company = str(rep_row.get("1099 Company", "")).strip()
    name = str(rep_row.get("1099 Name", "")).strip()
    email = str(rep_row.get("Email", "")).strip()
    geography = str(rep_row.get("Geography", "")).strip()
    url = str(rep_row.get("URL", "")).strip()

    slug = slugify(company)
    if url:
        url_clean = url.replace("https://", "").replace("http://", "").replace("www.", "")
        url_parts = url_clean.replace("silq.tech/", "").split("/")
        if url_parts and url_parts[-1]:
            slug = slugify(url_parts[-1])

    states = parse_geography(geography)
    filtered = filter_facilities_for_rep(facilities_df, states)

    facilities_list = [facility_row_to_dict(fac) for _, fac in filtered.iterrows()]

    total_catheter_days = sum(f["catheterDays"] for f in facilities_list)
    high_cauti_count = sum(1 for f in facilities_list if f["priority"] == "HIGH_CAUTI")
    high_volume_count = sum(1 for f in facilities_list if f["priority"] == "HIGH_VOLUME")
    total_physicians = sum(f["physicianCount"] for f in facilities_list)
    hac_penalized_count = sum(1 for f in facilities_list if f["hacStatus"] == "HAC_PENALIZED")
    hac_at_risk_count = sum(1 for f in facilities_list if f["hacStatus"] == "HAC_AT_RISK")

    return {
        "meta": {
            "slug": slug,
            "company": company,
            "name": name,
            "email": email,
            "territory": sorted(list(states)),
            "generated": datetime.utcnow().isoformat() + "Z",
            "dataVersion": CONFIG["dataVersion"],
        },
        "stats": {
            "facilityCount": len(facilities_list),
            "totalCatheterDays": total_catheter_days,
            "highCautiCount": high_cauti_count,
            "highVolumeCount": high_volume_count,
            "hacPenalizedCount": hac_penalized_count,
            "hacAtRiskCount": hac_at_risk_count,
            "physicianCount": total_physicians,
        },
        "facilities": facilities_list,
        "mapConfig": {
            "priorityColors": CONFIG["priority_colors"],
            "facilityTypes": list(set(
                f.get("hospitalType", "") for f in facilities_list if f.get("hospitalType")
            )),
        },
    }

def load_all_facility_sources() -> pd.DataFrame:
    """
    Convenience helper used by combined generators:
    load every source and return the built facility database.
    """
    hai_df = load_hai_data(CONFIG["input_hai"])
    pch_df = load_pch_hai_data(CONFIG["input_pch"])
    hospital_info_df = load_hospital_info(CONFIG["input_hospital_info"])
    gpo_map = load_gpo_data(CONFIG["input_premier"], CONFIG["input_vizient"])
    hac_status_map, hac_detail_map = load_hac_data(CONFIG["input_hac"])
    at_risk_ids = load_at_risk_ids(CONFIG["input_consolidated"])
    hvbp_map = load_hvbp_safety(CONFIG["input_hvbp_safety"])
    star_ratings = load_star_ratings(hospital_info_df)
    catheter_npis = load_catheter_hcpcs_npis(
        CONFIG["input_provider_svc"],
        CONFIG["catheter_hcpcs"],
    )
    _, facility_physicians = load_physician_data(
        CONFIG["input_provider"],
        CONFIG["input_affiliation"],
        CONFIG["target_specialties"],
        catheter_npis,
    )
    hai_df_combined = pd.concat([hai_df, pch_df], ignore_index=True)
    return build_facility_database(
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

# ============================================================================
# MAIN GENERATION FUNCTION
# ============================================================================

def main():
    """Main generation function."""
    print("=" * 60)
    print("Rep Page Data Generator — July 2026")
    print("=" * 60)
    print(f"Started: {datetime.now().isoformat()}")
    print()

    os.makedirs(CONFIG["output_dir"], exist_ok=True)
    os.makedirs("output", exist_ok=True)

    print("-" * 40)
    print("LOADING DATA SOURCES")
    print("-" * 40)

    reps_df = load_1099_master(CONFIG["input_1099"])
    hai_df = load_hai_data(CONFIG["input_hai"])
    pch_df = load_pch_hai_data(CONFIG["input_pch"])
    hospital_info_df = load_hospital_info(CONFIG["input_hospital_info"])
    gpo_map = load_gpo_data(CONFIG["input_premier"], CONFIG["input_vizient"])
    hac_status_map, hac_detail_map = load_hac_data(CONFIG["input_hac"])
    at_risk_ids = load_at_risk_ids(CONFIG["input_consolidated"])
    hvbp_map = load_hvbp_safety(CONFIG["input_hvbp_safety"])
    star_ratings = load_star_ratings(hospital_info_df)
    catheter_npis = load_catheter_hcpcs_npis(
        CONFIG["input_provider_svc"],
        CONFIG["catheter_hcpcs"],
    )
    _, facility_physicians = load_physician_data(
        CONFIG["input_provider"],
        CONFIG["input_affiliation"],
        CONFIG["target_specialties"],
        catheter_npis,
    )

    hai_df_combined = pd.concat([hai_df, pch_df], ignore_index=True)

    print()
    print("-" * 40)
    print("BUILDING FACILITY DATABASE")
    print("-" * 40)

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

    print()
    print("-" * 40)
    print("GENERATING REP DATA FILES")
    print("-" * 40)

    manifest_reps = []
    errors = []

    for _, rep_row in reps_df.iterrows():
        company = str(rep_row.get("1099 Company", "")).strip()
        if not company:
            continue

        try:
            rep_data = generate_rep_json(rep_row, facilities_df)
            slug = rep_data["meta"]["slug"]

            if not slug:
                print(f"  Skipping {company}: Could not generate slug")
                continue

            output_path = os.path.join(CONFIG["output_dir"], f"{slug}.json")
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(rep_data, f, indent=2, ensure_ascii=False)

            manifest_reps.append({
                "slug": slug,
                "company": rep_data["meta"]["company"],
                "name": rep_data["meta"]["name"],
                "email": rep_data["meta"]["email"],
                "territory": rep_data["meta"]["territory"],
                "facilityCount": rep_data["stats"]["facilityCount"],
                "physicianCount": rep_data["stats"]["physicianCount"],
                "highCautiCount": rep_data["stats"]["highCautiCount"],
                "highVolumeCount": rep_data["stats"]["highVolumeCount"],
                "hacPenalizedCount": rep_data["stats"]["hacPenalizedCount"],
                "hacAtRiskCount": rep_data["stats"]["hacAtRiskCount"],
            })

            print(
                f"  [OK] {slug}: {rep_data['stats']['facilityCount']} facilities, "
                f"{rep_data['stats']['highCautiCount']} high-CAUTI, "
                f"{rep_data['stats']['hacPenalizedCount']} HAC-penalized, "
                f"{rep_data['stats']['physicianCount']} physicians"
            )

        except Exception as e:
            errors.append((company, str(e)))
            print(f"  [ERROR] {company}: {e}")

    manifest = {
        "generated": datetime.utcnow().isoformat() + "Z",
        "dataVersion": CONFIG["dataVersion"],
        "totalReps": len(manifest_reps),
        "reps": manifest_reps,
    }

    with open(CONFIG["manifest_file"], "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print()
    print("=" * 60)
    print("GENERATION COMPLETE")
    print("=" * 60)
    print(f"Generated: {len(manifest_reps)} rep data files")
    print(f"Errors: {len(errors)}")
    print(f"Output directory: {CONFIG['output_dir']}")
    print(f"Manifest: {CONFIG['manifest_file']}")
    print(f"Finished: {datetime.now().isoformat()}")

    if errors:
        print()
        print("Errors encountered:")
        for company, error in errors:
            print(f"  - {company}: {error}")

    return len(errors) == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
