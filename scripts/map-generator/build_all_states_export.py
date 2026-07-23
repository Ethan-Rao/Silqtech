#!/usr/bin/env python3
"""
Build all-states-facility-export.csv:
  - All facilities already covered by reps  (from public/data/reps/*.json)
  - Facilities in GA, HI, MI               (from raw HAI + hospital info source data)

Deduplicates by CMS facility id. Columns match the rep portal Export CSV.
"""
import csv
import json
import re
import pandas as pd
import numpy as np
from pathlib import Path

ROOT       = Path(__file__).resolve().parents[2]
REPS_DIR   = ROOT / "public" / "data" / "reps"
HAI_PATH   = Path(__file__).parent / "data" / "hospitals" / "Healthcare_Associated_Infections-Hospital.csv"
INFO_PATH  = Path(__file__).parent / "data" / "hospitals" / "Hospital_General_Information.csv"
OUT_PATH   = ROOT / "all-states-facility-export.csv"

MISSING_STATES = {"GA", "HI", "MI"}

HEADERS = [
    "Facility Name",
    "Address",
    "City",
    "State",
    "ZIP Code",
    "Phone",
    "Priority",
    "HAC Status",
    "Catheter Days",
    "SIR Score",
    "CAUTI Status",
    "GPO",
    "Physician Count",
]

# ── helpers ──────────────────────────────────────────────────────────────────

def safe_int(v, default=0):
    try:
        if pd.isna(v) or v in ("Not Available", "N/A", ""):
            return default
        return int(float(v))
    except Exception:
        return default

def safe_float(v):
    try:
        if pd.isna(v) or v in ("Not Available", "N/A", ""):
            return None
        return float(v)
    except Exception:
        return None

def format_phone(p):
    if not p or pd.isna(p):
        return ""
    digits = re.sub(r"\D", "", str(p))
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    return str(p)

def get_priority(row):
    name   = str(row.get("Name", "")).upper()
    status = str(row.get("CAUTI_Status", ""))
    days   = row.get("CatheterDays", 0)
    if "VA MEDICAL" in name or "VETERANS" in name:
        return "VA"
    if "Worse" in status:
        return "HIGH_CAUTI"
    # High-volume threshold is set globally; we use a simple placeholder here
    return "STANDARD"

# ── load existing rep facilities ─────────────────────────────────────────────

def load_rep_facilities() -> dict:
    """Return {id: facility_dict} for all rep-covered facilities."""
    by_id: dict[str, dict] = {}
    for path in sorted(REPS_DIR.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        for fac in data.get("facilities", []):
            fid = str(fac.get("id", "")).strip()
            if fid and fid not in by_id:
                by_id[fid] = fac
    return by_id

# ── load missing-state facilities from source data ───────────────────────────

def load_missing_state_facilities(existing_ids: set) -> list[dict]:
    """Return facility dicts for GA, HI, MI not already in existing_ids."""
    print(f"Loading HAI data…")
    hai = pd.read_csv(HAI_PATH, dtype=str).fillna("")
    hai.columns = hai.columns.str.strip()

    cauti = hai[hai["Measure ID"].str.startswith("HAI_2_")].copy()
    pivot = cauti.pivot_table(
        index=["Facility ID", "Facility Name", "Address", "City/Town", "State", "ZIP Code", "Telephone Number"],
        columns="Measure ID",
        values="Score",
        aggfunc="first",
    ).reset_index()

    sir_status = (
        cauti[cauti["Measure ID"] == "HAI_2_SIR"][["Facility ID", "Compared to National"]]
        .drop_duplicates()
        .set_index("Facility ID")["Compared to National"]
        .to_dict()
    )
    pivot["CAUTI_Status"] = pivot["Facility ID"].map(sir_status)

    # Keep only missing states
    pivot = pivot[pivot["State"].str.strip().str.upper().isin(MISSING_STATES)].copy()

    # Merge hospital type / ownership
    print(f"Loading hospital info…")
    info = pd.read_csv(INFO_PATH, dtype=str).fillna("")
    info.columns = info.columns.str.strip()
    info = info[["Facility ID", "Hospital Type", "Hospital Ownership"]].rename(
        columns={"Facility ID": "Facility ID"}
    )
    pivot = pivot.merge(info, on="Facility ID", how="left")

    # Parse metrics
    pivot["CatheterDays"]  = pivot.get("HAI_2_DOPC",       pd.Series("")).apply(lambda x: safe_int(x))
    pivot["SIR"]           = pivot.get("HAI_2_SIR",         pd.Series("")).apply(lambda x: safe_float(x))
    pivot["CAUTI_Status"]  = pivot.get("CAUTI_Status",       pd.Series("")).fillna("")

    # Compute high-volume threshold from this slice (no global percentile, so label STANDARD / HIGH_CAUTI)
    pivot["Priority"] = pivot.apply(get_priority, axis=1)
    valid_days = pivot[pivot["CatheterDays"] > 0]["CatheterDays"]
    if len(valid_days):
        threshold = valid_days.quantile(0.90)
        mask = (pivot["CatheterDays"] >= threshold) & (pivot["Priority"] != "HIGH_CAUTI") & (pivot["Priority"] != "VA")
        pivot.loc[mask, "Priority"] = "HIGH_VOLUME"

    pivot["Phone"] = pivot["Telephone Number"].apply(format_phone)

    results = []
    for _, row in pivot.iterrows():
        fid = str(row["Facility ID"]).strip()
        if fid in existing_ids:
            continue
        sir = row["SIR"]
        results.append({
            "id":             fid,
            "name":           str(row["Facility Name"]).strip(),
            "address":        str(row["Address"]).strip(),
            "city":           str(row["City/Town"]).strip(),
            "state":          str(row["State"]).strip().upper(),
            "zipCode":        str(row["ZIP Code"]).strip(),
            "phone":          row["Phone"],
            "priority":       row["Priority"],
            "hacStatus":      None,
            "catheterDays":   int(row["CatheterDays"]),
            "sir":            sir,
            "cautiStatus":    str(row.get("CAUTI_Status", "")).strip(),
            "gpo":            "",
            "physicianCount": 0,
        })
    return results

# ── write CSV ─────────────────────────────────────────────────────────────────

def to_row(f: dict) -> list:
    sir = f.get("sir")
    sir_str = "N/A" if sir is None or sir == "" else sir
    return [
        f.get("name", ""),
        f.get("address", ""),
        f.get("city", ""),
        f.get("state", ""),
        f.get("zipCode", ""),
        f.get("phone", ""),
        f.get("priority", ""),
        f.get("hacStatus") or "",
        f.get("catheterDays", 0),
        sir_str,
        f.get("cautiStatus", ""),
        f.get("gpo", "") or "",
        f.get("physicianCount", 0),
    ]

def main():
    print("Loading rep-covered facilities…")
    by_id = load_rep_facilities()
    print(f"  {len(by_id)} unique facilities from rep territories")

    missing = load_missing_state_facilities(set(by_id.keys()))
    print(f"  {len(missing)} new facilities from {', '.join(sorted(MISSING_STATES))}")

    for fac in missing:
        by_id[fac["id"]] = fac

    all_facs = sorted(by_id.values(), key=lambda f: (f.get("state", ""), f.get("name", "")))

    with OUT_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        writer.writerow(HEADERS)
        for fac in all_facs:
            writer.writerow(to_row(fac))

    print(f"\nWrote {OUT_PATH}")
    print(f"  Total unique facilities: {len(all_facs)}")
    states = sorted({f.get("state", "") for f in all_facs if f.get("state")})
    print(f"  States: {len(states)} ({', '.join(states)})")

if __name__ == "__main__":
    main()
