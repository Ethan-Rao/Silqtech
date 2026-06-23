#!/usr/bin/env python3
"""
Generate combined intuitek.json with both Kevin Turner (GA) and Jeff Britt (SC).
Merges all GA and SC facilities into a single file, with a meta.reps array
that maps each individual rep to their specific territory for filtered downloads.
"""

import os
import sys
import json

# Load the main generator module by filename (hyphens prevent normal import)
import importlib.util
script_dir = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location(
    "generate_rep_data",
    os.path.join(script_dir, "generate-rep-data.py")
)
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

load_1099_master = gen.load_1099_master
load_hai_data = gen.load_hai_data
load_hospital_info = gen.load_hospital_info
load_gpo_data = gen.load_gpo_data
load_physician_data = gen.load_physician_data
build_facility_database = gen.build_facility_database
filter_facilities_for_rep = gen.filter_facilities_for_rep
CONFIG = gen.CONFIG
import pandas as pd
from datetime import datetime

def main():
    print("Generating combined intuitek.json (GA + SC)...")

    # Resolve paths relative to script dir
    def p(rel): return os.path.join(script_dir, rel)

    # Load all data sources
    hai_df = load_hai_data(p(CONFIG["input_hai"]))
    hospital_info_df = load_hospital_info(p(CONFIG["input_hospital_info"]))
    gpo_map = load_gpo_data(p(CONFIG["input_premier"]), p(CONFIG["input_vizient"]))
    _, facility_physicians = load_physician_data(
        p(CONFIG["input_dac"]),
        p(CONFIG["input_affiliation"]),
        CONFIG["target_specialties"]
    )
    facilities_df = build_facility_database(hai_df, hospital_info_df, gpo_map, facility_physicians)

    # Filter for combined GA + SC territory
    combined_states = {"GA", "SC"}
    filtered = filter_facilities_for_rep(facilities_df, combined_states)

    facilities_list = []
    for _, fac in filtered.iterrows():
        sir_val = fac.get("SIR")
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
            "sir": float(sir_val) if (sir_val is not None and not pd.isna(sir_val)) else None,
            "cautiStatus": fac.get("CAUTI_Status", ""),
            "priority": fac.get("Priority", "STANDARD"),
            "physicians": fac.get("Physicians", []),
            "physicianCount": int(fac.get("PhysicianCount", 0)),
        })

    ga_count = sum(1 for f in facilities_list if f["state"] == "GA")
    sc_count = sum(1 for f in facilities_list if f["state"] == "SC")
    print(f"  GA facilities: {ga_count}")
    print(f"  SC facilities: {sc_count}")
    print(f"  Total: {len(facilities_list)}")

    total_catheter_days = sum(f["catheterDays"] for f in facilities_list)
    high_cauti_count = sum(1 for f in facilities_list if f["priority"] == "HIGH_CAUTI")
    high_volume_count = sum(1 for f in facilities_list if f["priority"] == "HIGH_VOLUME")
    total_physicians = sum(f["physicianCount"] for f in facilities_list)

    output = {
        "meta": {
            "slug": "intuitek",
            "company": "Intuitek Medical, Inc.",
            "name": "Kevin Turner / Jeff Britt",
            "email": "kturner@intuitekmedical.com",
            "territory": ["GA", "SC"],
            "generated": datetime.utcnow().isoformat() + "Z",
            "dataVersion": "08_2025",
            "reps": [
                {
                    "name": "Kevin Turner",
                    "email": "kturner@intuitekmedical.com",
                    "territory": ["GA"]
                },
                {
                    "name": "Jeff Britt",
                    "email": "Jeffbrittmx3@gmail.com",
                    "territory": ["SC"]
                }
            ]
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

    # Write to both the generator output and the public data folder
    out_paths = [
        p("output/reps/intuitek.json"),
        os.path.join(script_dir, "../../public/data/reps/intuitek.json"),
    ]
    for out_path in out_paths:
        out_path = os.path.normpath(out_path)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        print(f"  Written: {out_path}")

    print("Done.")

if __name__ == "__main__":
    main()
