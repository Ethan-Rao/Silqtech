#!/usr/bin/env python3
"""
Rep Page Data Generator
========================
Generates JSON data files for Next.js rep pages from CMS hospital data,
physician affiliations, GPO membership, and CAUTI metrics.

Data Sources:
- 1099Master.csv: Rep roster with geography assignments
- Healthcare_Associated_Infections-Hospital.csv: CAUTI data (catheter days, SIR scores)
- Hospital_General_Information.csv: Hospital metadata (address, phone, ownership)
- DAC_NationalDownloadableFile.csv: Physician specialties (Urology, Infectious Disease)
- Facility_Affiliation.csv: Doctor-hospital affiliations via CMS Facility ID
- Premier.xlsx: Premier GPO membership
- Vizient_Full.xlsx: Vizient GPO membership

Output:
- output/rep-manifest.json: Index of all reps
- output/reps/{slug}.json: Per-rep facility and physician data
"""

import os
import sys
import json
import re
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, List, Optional, Set, Tuple
from pathlib import Path

# ============================================================================
# CONFIGURATION
# ============================================================================

CONFIG = {
    # Input files
    "input_1099": "1099Master.csv",
    "input_hai": "data/hospitals/Healthcare_Associated_Infections-Hospital.csv",
    "input_hospital_info": "data/hospitals/Hospital_General_Information.csv",
    "input_dac": "data/doctors/DAC_NationalDownloadableFile.csv",
    "input_affiliation": "data/doctors/Facility_Affiliation.csv",
    "input_premier": "data/Premier.xlsx",
    "input_vizient": "data/Vizient_Full.xlsx",
    
    # Output
    "output_dir": "output/reps",
    "manifest_file": "output/rep-manifest.json",
    
    # Filter settings
    "target_specialties": ["UROLOGY", "INFECTIOUS DISEASE"],
    "high_use_percentile": 0.90,  # Top 10% by catheter days = High Use
    
    # CAUTI benchmark thresholds
    "cauti_measures": {
        "catheter_days": "HAI_2_DOPC",      # Urinary Catheter Days
        "observed_cases": "HAI_2_NUMERATOR", # Observed CAUTI cases
        "predicted_cases": "HAI_2_ELIGCASES", # Predicted cases
        "sir": "HAI_2_SIR",                  # Standardized Infection Ratio
    },
    
    # Map colors by facility priority
    "priority_colors": {
        "HIGH_CAUTI": "#e41a1c",     # Red - Worse than benchmark (immediate opportunity)
        "HIGH_VOLUME": "#377eb8",     # Blue - High catheter days (large opportunity)
        "STANDARD": "#4daf4a",        # Green - Standard facility
        "VA": "#ff7f00",              # Orange - VA facilities
    }
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

def safe_float(val, default=0.0) -> float:
    """Safely convert to float."""
    try:
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
    df = pd.read_csv(filepath, dtype=str).fillna("")
    df.columns = df.columns.str.strip()
    
    # Filter to CAUTI measures only (HAI_2_*)
    cauti_df = df[df["Measure ID"].str.startswith("HAI_2_")].copy()
    
    # Pivot to get one row per facility with all CAUTI measures as columns
    pivot_df = cauti_df.pivot_table(
        index=["Facility ID", "Facility Name", "Address", "City/Town", "State", "ZIP Code", "Telephone Number"],
        columns="Measure ID",
        values="Score",
        aggfunc="first"
    ).reset_index()
    
    # Also get the "Compared to National" status for SIR
    sir_comparison = cauti_df[cauti_df["Measure ID"] == "HAI_2_SIR"][
        ["Facility ID", "Compared to National"]
    ].drop_duplicates().set_index("Facility ID")["Compared to National"].to_dict()
    
    pivot_df["CAUTI_Status"] = pivot_df["Facility ID"].map(sir_comparison)
    
    print(f"  Loaded CAUTI data for {len(pivot_df)} facilities")
    return pivot_df

def load_hospital_info(filepath: str) -> pd.DataFrame:
    """Load hospital general information for additional metadata."""
    print(f"Loading Hospital Info from {filepath}...")
    df = pd.read_csv(filepath, dtype=str).fillna("")
    df.columns = df.columns.str.strip()
    print(f"  Loaded info for {len(df)} hospitals")
    return df

def load_gpo_data(premier_path: str, vizient_path: str) -> Dict[str, List[str]]:
    """
    Load GPO membership data.
    Returns dict mapping facility name (normalized) to list of GPO memberships.
    """
    print("Loading GPO membership data...")
    gpo_map = {}
    
    # Load Premier
    if os.path.exists(premier_path):
        try:
            df = pd.read_excel(premier_path, dtype=str).fillna("")
            for _, row in df.iterrows():
                name = str(row.get("Facility Name", "")).strip().upper()
                if name:
                    if name not in gpo_map:
                        gpo_map[name] = []
                    gpo_map[name].append("Premier")
            print(f"  Loaded Premier: {len(df)} entries")
        except Exception as e:
            print(f"  Warning: Could not load Premier data: {e}")
    
    # Load Vizient
    if os.path.exists(vizient_path):
        try:
            df = pd.read_excel(vizient_path, dtype=str).fillna("")
            for _, row in df.iterrows():
                name = str(row.get("Member Name", "")).strip().upper()
                member_id = str(row.get("Member ID", "")).strip()
                if name:
                    if name not in gpo_map:
                        gpo_map[name] = []
                    gpo_entry = f"Vizient ({member_id})" if member_id else "Vizient"
                    if gpo_entry not in gpo_map[name]:
                        gpo_map[name].append(gpo_entry)
            print(f"  Loaded Vizient: {len(df)} entries")
        except Exception as e:
            print(f"  Warning: Could not load Vizient data: {e}")
    
    return gpo_map

def load_physician_data(dac_path: str, affiliation_path: str, target_specs: List[str]) -> Tuple[pd.DataFrame, Dict[str, List[dict]]]:
    """
    Load physician data filtered to target specialties.
    Returns:
    - DataFrame of physicians
    - Dict mapping Facility ID -> list of physician dicts
    """
    print("Loading physician data...")
    
    # Load affiliations first (smaller file)
    print(f"  Loading affiliations from {affiliation_path}...")
    affil_df = pd.read_csv(affiliation_path, dtype=str).fillna("")
    affil_df.columns = affil_df.columns.str.strip()
    
    # Get set of NPIs that have hospital affiliations
    hospital_affil = affil_df[affil_df["facility_type"].str.lower() == "hospital"]
    affiliated_npis = set(hospital_affil["NPI"].unique())
    print(f"    {len(affiliated_npis)} unique NPIs with hospital affiliations")
    
    # Create mapping: Facility Certification Number -> list of NPIs
    facility_npi_map = {}
    for _, row in hospital_affil.iterrows():
        fac_id = str(row.get("Facility Affiliations Certification Number", "")).strip()
        npi = str(row.get("NPI", "")).strip()
        if fac_id and npi:
            if fac_id not in facility_npi_map:
                facility_npi_map[fac_id] = set()
            facility_npi_map[fac_id].add(npi)
    
    # Load DAC file in chunks (it's huge)
    print(f"  Loading DAC data from {dac_path} (filtering by specialty)...")
    target_specs_upper = [s.upper() for s in target_specs]
    
    physician_data = []
    chunk_size = 100000
    
    for chunk in pd.read_csv(dac_path, dtype=str, chunksize=chunk_size, on_bad_lines='skip'):
        chunk.columns = chunk.columns.str.strip()
        
        # Filter to target specialties
        if "pri_spec" in chunk.columns:
            chunk["pri_spec_upper"] = chunk["pri_spec"].fillna("").str.upper()
            filtered = chunk[chunk["pri_spec_upper"].isin(target_specs_upper)]
            
            for _, row in filtered.iterrows():
                npi = str(row.get("NPI", "")).strip()
                if npi in affiliated_npis:
                    physician_data.append({
                        "NPI": npi,
                        "FirstName": str(row.get("Provider First Name", "")).strip().title(),
                        "LastName": str(row.get("Provider Last Name", "")).strip().title(),
                        "Specialty": str(row.get("pri_spec", "")).strip().title(),
                    })
    
    print(f"    Found {len(physician_data)} physicians in target specialties with affiliations")
    
    # Create NPI -> physician info lookup
    npi_to_physician = {p["NPI"]: p for p in physician_data}
    
    # Build facility -> physicians mapping
    facility_physicians = {}
    for fac_id, npis in facility_npi_map.items():
        physicians = []
        for npi in npis:
            if npi in npi_to_physician:
                p = npi_to_physician[npi]
                physicians.append({
                    "name": f"{p['FirstName']} {p['LastName']}".strip(),
                    "npi": p["NPI"],
                    "specialty": p["Specialty"]
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
    facility_physicians: Dict[str, List[dict]]
) -> pd.DataFrame:
    """
    Build comprehensive facility database combining all data sources.
    """
    print("Building facility database...")
    
    # Start with HAI data (has CAUTI metrics)
    facilities = hai_df.copy()
    
    # Rename columns for consistency
    facilities = facilities.rename(columns={
        "Facility ID": "FacilityID",
        "Facility Name": "Name",
        "City/Town": "City",
        "ZIP Code": "ZipCode",
        "Telephone Number": "Phone",
    })
    
    # Clean state codes
    facilities["State"] = facilities["State"].apply(clean_state)
    
    # Parse CAUTI metrics
    facilities["CatheterDays"] = facilities.get("HAI_2_DOPC", "0").apply(lambda x: safe_int(x, 0))
    facilities["ObservedCAUTI"] = facilities.get("HAI_2_NUMERATOR", "0").apply(lambda x: safe_int(x, 0))
    facilities["PredictedCAUTI"] = facilities.get("HAI_2_ELIGCASES", "0").apply(lambda x: safe_float(x, 0))
    facilities["SIR"] = facilities.get("HAI_2_SIR", "").apply(lambda x: safe_float(x, None))
    
    # Determine CAUTI status priority
    def get_priority(row):
        status = str(row.get("CAUTI_Status", "")).strip()
        if "Worse" in status:
            return "HIGH_CAUTI"
        elif row["CatheterDays"] > 0:
            return "STANDARD"  # Will be upgraded to HIGH_VOLUME later based on percentile
        return "STANDARD"
    
    facilities["Priority"] = facilities.apply(get_priority, axis=1)
    
    # Calculate high-use threshold (top 10% by catheter days)
    valid_days = facilities[facilities["CatheterDays"] > 0]["CatheterDays"]
    if len(valid_days) > 0:
        high_use_threshold = valid_days.quantile(CONFIG["high_use_percentile"])
        print(f"  High-use threshold (90th percentile): {high_use_threshold:,.0f} catheter days")
        
        # Mark high-volume facilities
        facilities.loc[
            (facilities["CatheterDays"] >= high_use_threshold) & 
            (facilities["Priority"] != "HIGH_CAUTI"),
            "Priority"
        ] = "HIGH_VOLUME"
    
    # Mark VA facilities
    facilities.loc[
        facilities["Name"].str.contains("VA MEDICAL|VETERANS", case=False, na=False),
        "Priority"
    ] = "VA"
    
    # Add GPO membership
    facilities["GPO"] = facilities["Name"].str.upper().map(
        lambda x: ", ".join(gpo_map.get(x, [])) if x in gpo_map else ""
    )
    
    # Merge hospital type from general info
    if len(hospital_info_df) > 0:
        info_subset = hospital_info_df[["Facility ID", "Hospital Type", "Hospital Ownership"]].copy()
        info_subset = info_subset.rename(columns={"Facility ID": "FacilityID"})
        facilities = facilities.merge(info_subset, on="FacilityID", how="left")
    else:
        facilities["Hospital Type"] = "Acute Care Hospitals"
        facilities["Hospital Ownership"] = ""
    
    # Add physician data
    facilities["Physicians"] = facilities["FacilityID"].map(
        lambda x: facility_physicians.get(x, [])
    )
    facilities["PhysicianCount"] = facilities["Physicians"].apply(len)
    
    # Format phone numbers
    facilities["Phone"] = facilities["Phone"].apply(format_phone)
    
    # Select and order final columns
    final_columns = [
        "FacilityID", "Name", "Address", "City", "State", "ZipCode", "Phone",
        "Hospital Type", "Hospital Ownership", "GPO",
        "CatheterDays", "ObservedCAUTI", "PredictedCAUTI", "SIR", "CAUTI_Status", "Priority",
        "Physicians", "PhysicianCount"
    ]
    
    # Only include columns that exist
    final_columns = [c for c in final_columns if c in facilities.columns]
    facilities = facilities[final_columns]
    
    print(f"  Built database with {len(facilities)} facilities")
    print(f"    HIGH_CAUTI: {len(facilities[facilities['Priority'] == 'HIGH_CAUTI'])}")
    print(f"    HIGH_VOLUME: {len(facilities[facilities['Priority'] == 'HIGH_VOLUME'])}")
    print(f"    VA: {len(facilities[facilities['Priority'] == 'VA'])}")
    
    return facilities

def filter_facilities_for_rep(facilities_df: pd.DataFrame, states: Set[str]) -> pd.DataFrame:
    """Filter facilities to rep's territory states."""
    if not states:
        return pd.DataFrame()
    
    filtered = facilities_df[facilities_df["State"].isin(states)].copy()
    
    # Sort by priority (HIGH_CAUTI first, then HIGH_VOLUME, then by catheter days)
    priority_order = {"HIGH_CAUTI": 0, "HIGH_VOLUME": 1, "VA": 2, "STANDARD": 3}
    filtered["PriorityOrder"] = filtered["Priority"].map(priority_order)
    filtered = filtered.sort_values(
        by=["PriorityOrder", "CatheterDays"],
        ascending=[True, False]
    ).reset_index(drop=True)
    
    return filtered

def generate_rep_json(rep_row: pd.Series, facilities_df: pd.DataFrame) -> dict:
    """Generate JSON data structure for a single rep."""
    company = str(rep_row.get("1099 Company", "")).strip()
    name = str(rep_row.get("1099 Name", "")).strip()
    email = str(rep_row.get("Email", "")).strip()
    geography = str(rep_row.get("Geography", "")).strip()
    url = str(rep_row.get("URL", "")).strip()
    
    # Parse URL to get slug
    slug = slugify(company)
    if url:
        url_clean = url.replace("https://", "").replace("http://", "").replace("www.", "")
        url_parts = url_clean.replace("silq.tech/", "").split("/")
        if url_parts and url_parts[-1]:
            slug = slugify(url_parts[-1])
    
    states = parse_geography(geography)
    filtered = filter_facilities_for_rep(facilities_df, states)
    
    # Calculate bounds for map
    # We'll need geocoding for actual lat/lon - for now use state centroids
    # TODO: Add geocoding or use ZIP code centroids
    
    facilities_list = []
    for _, fac in filtered.iterrows():
        facilities_list.append({
            "id": fac["FacilityID"],
            "name": fac["Name"],
            "address": fac.get("Address", ""),
            "city": fac.get("City", ""),
            "state": fac.get("State", ""),
            "zipCode": fac.get("ZipCode", ""),
            "phone": fac.get("Phone", ""),
            "hospitalType": fac.get("Hospital Type", ""),
            "ownership": fac.get("Hospital Ownership", ""),
            "gpo": fac.get("GPO", ""),
            "catheterDays": int(fac.get("CatheterDays", 0)),
            "observedCAUTI": int(fac.get("ObservedCAUTI", 0)),
            "predictedCAUTI": float(fac.get("PredictedCAUTI", 0)),
            "sir": fac.get("SIR") if pd.notna(fac.get("SIR")) else None,
            "cautiStatus": fac.get("CAUTI_Status", ""),
            "priority": fac.get("Priority", "STANDARD"),
            "physicians": fac.get("Physicians", []),
            "physicianCount": int(fac.get("PhysicianCount", 0)),
        })
    
    # Calculate statistics
    total_catheter_days = sum(f["catheterDays"] for f in facilities_list)
    high_cauti_count = sum(1 for f in facilities_list if f["priority"] == "HIGH_CAUTI")
    high_volume_count = sum(1 for f in facilities_list if f["priority"] == "HIGH_VOLUME")
    total_physicians = sum(f["physicianCount"] for f in facilities_list)
    
    return {
        "meta": {
            "slug": slug,
            "company": company,
            "name": name,
            "email": email,
            "territory": sorted(list(states)),
            "generated": datetime.utcnow().isoformat() + "Z",
            "dataVersion": "08_2025"
        },
        "stats": {
            "facilityCount": len(facilities_list),
            "totalCatheterDays": total_catheter_days,
            "highCautiCount": high_cauti_count,
            "highVolumeCount": high_volume_count,
            "physicianCount": total_physicians
        },
        "facilities": facilities_list,
        "mapConfig": {
            "priorityColors": CONFIG["priority_colors"],
            "facilityTypes": list(set(f.get("hospitalType", "") for f in facilities_list if f.get("hospitalType")))
        }
    }

# ============================================================================
# MAIN GENERATION FUNCTION
# ============================================================================

def main():
    """Main generation function."""
    print("=" * 60)
    print("Rep Page Data Generator")
    print("=" * 60)
    print(f"Started: {datetime.now().isoformat()}")
    print()
    
    # Ensure output directory exists
    os.makedirs(CONFIG["output_dir"], exist_ok=True)
    os.makedirs("output", exist_ok=True)
    
    # Load all data sources
    print("-" * 40)
    print("LOADING DATA SOURCES")
    print("-" * 40)
    
    reps_df = load_1099_master(CONFIG["input_1099"])
    hai_df = load_hai_data(CONFIG["input_hai"])
    hospital_info_df = load_hospital_info(CONFIG["input_hospital_info"])
    gpo_map = load_gpo_data(CONFIG["input_premier"], CONFIG["input_vizient"])
    _, facility_physicians = load_physician_data(
        CONFIG["input_dac"],
        CONFIG["input_affiliation"],
        CONFIG["target_specialties"]
    )
    
    # Build comprehensive facility database
    print()
    print("-" * 40)
    print("BUILDING FACILITY DATABASE")
    print("-" * 40)
    
    facilities_df = build_facility_database(
        hai_df,
        hospital_info_df,
        gpo_map,
        facility_physicians
    )
    
    # Generate per-rep data files
    print()
    print("-" * 40)
    print("GENERATING REP DATA FILES")
    print("-" * 40)
    
    manifest_reps = []
    errors = []
    
    for idx, rep_row in reps_df.iterrows():
        company = str(rep_row.get("1099 Company", "")).strip()
        if not company:
            continue
        
        try:
            rep_data = generate_rep_json(rep_row, facilities_df)
            slug = rep_data["meta"]["slug"]
            
            if not slug:
                print(f"  ⚠️ Skipping {company}: Could not generate slug")
                continue
            
            # Write rep JSON file
            output_path = os.path.join(CONFIG["output_dir"], f"{slug}.json")
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(rep_data, f, indent=2, ensure_ascii=False)
            
            # Add to manifest
            manifest_reps.append({
                "slug": slug,
                "company": rep_data["meta"]["company"],
                "name": rep_data["meta"]["name"],
                "email": rep_data["meta"]["email"],
                "territory": rep_data["meta"]["territory"],
                "facilityCount": rep_data["stats"]["facilityCount"],
                "physicianCount": rep_data["stats"]["physicianCount"],
                "highCautiCount": rep_data["stats"]["highCautiCount"],
                "highVolumeCount": rep_data["stats"]["highVolumeCount"]
            })
            
            print(f"  [OK] {slug}: {rep_data['stats']['facilityCount']} facilities, "
                  f"{rep_data['stats']['highCautiCount']} high-CAUTI, "
                  f"{rep_data['stats']['physicianCount']} physicians")
            
        except Exception as e:
            errors.append((company, str(e)))
            print(f"  [ERROR] {company}: {e}")
    
    # Write manifest
    manifest = {
        "generated": datetime.utcnow().isoformat() + "Z",
        "dataVersion": "08_2025",
        "totalReps": len(manifest_reps),
        "reps": manifest_reps
    }
    
    with open(CONFIG["manifest_file"], "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    
    # Summary
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
