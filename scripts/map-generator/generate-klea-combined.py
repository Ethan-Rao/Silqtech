#!/usr/bin/env python3
"""
Generate combined klea.json for Klea Medical LLC.
Three reps (Derek Colins, Paul Wilson, Joe Rodriguez) all share IN+KY+OH+WV.
Produces a single klea.json with all four-state facilities and a meta.reps array.
"""

import os, sys, json
import importlib.util
import pandas as pd
from datetime import datetime

script_dir = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location(
    "generate_rep_data",
    os.path.join(script_dir, "generate-rep-data.py")
)
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

load_hai_data         = gen.load_hai_data
load_hospital_info    = gen.load_hospital_info
load_gpo_data         = gen.load_gpo_data
load_physician_data   = gen.load_physician_data
build_facility_database = gen.build_facility_database
filter_facilities_for_rep = gen.filter_facilities_for_rep
CONFIG = gen.CONFIG

def main():
    print("Generating combined klea.json (IN + KY + OH + WV)...")

    def p(rel): return os.path.join(script_dir, rel)

    hai_df           = load_hai_data(p(CONFIG["input_hai"]))
    hospital_info_df = load_hospital_info(p(CONFIG["input_hospital_info"]))
    gpo_map          = load_gpo_data(p(CONFIG["input_premier"]), p(CONFIG["input_vizient"]))
    _, facility_physicians = load_physician_data(
        p(CONFIG["input_dac"]), p(CONFIG["input_affiliation"]),
        CONFIG["target_specialties"]
    )
    facilities_df = build_facility_database(hai_df, hospital_info_df, gpo_map, facility_physicians)

    combined_states = {"IN", "KY", "OH", "WV"}
    filtered = filter_facilities_for_rep(facilities_df, combined_states)

    facilities_list = []
    for _, fac in filtered.iterrows():
        sir_val = fac.get("SIR")
        facilities_list.append({
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
            "physicians":    fac.get("Physicians", []),
            "physicianCount":int(fac.get("PhysicianCount", 0)),
        })

    for st in sorted(combined_states):
        count = sum(1 for f in facilities_list if f["state"] == st)
        print(f"  {st}: {count} facilities")
    print(f"  Total: {len(facilities_list)}")

    total_catheter_days = sum(f["catheterDays"] for f in facilities_list)
    high_cauti_count    = sum(1 for f in facilities_list if f["priority"] == "HIGH_CAUTI")
    high_volume_count   = sum(1 for f in facilities_list if f["priority"] == "HIGH_VOLUME")
    total_physicians    = sum(f["physicianCount"] for f in facilities_list)

    # All three reps share the same combined territory
    rep_territory = ["IN", "KY", "OH", "WV"]

    output = {
        "meta": {
            "slug":      "klea",
            "company":   "Klea Medical LLC",
            "name":      "Derek Colins / Paul Wilson / Joe Rodriguez",
            "email":     "derek@kleamedical.com",
            "territory": sorted(list(combined_states)),
            "generated": datetime.utcnow().isoformat() + "Z",
            "dataVersion": "08_2025",
            "reps": [
                {"name": "Derek Colins",  "email": "derek@kleamedical.com",  "territory": rep_territory},
                {"name": "Paul Wilson",   "email": "vmsmedprod@gmail.com",   "territory": rep_territory},
                {"name": "Joe Rodriguez", "email": "joerodmedical@gmail.com", "territory": rep_territory},
            ]
        },
        "stats": {
            "facilityCount":    len(facilities_list),
            "totalCatheterDays": total_catheter_days,
            "highCautiCount":   high_cauti_count,
            "highVolumeCount":  high_volume_count,
            "physicianCount":   total_physicians
        },
        "facilities": facilities_list,
        "mapConfig": {
            "priorityColors": CONFIG["priority_colors"],
            "facilityTypes": list(set(
                f.get("hospitalType", "") for f in facilities_list if f.get("hospitalType")
            ))
        }
    }

    out_paths = [
        p("output/reps/klea.json"),
        os.path.normpath(os.path.join(script_dir, "../../public/data/reps/klea.json")),
    ]
    for out_path in out_paths:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        print(f"  Written: {out_path}")

    print("Done.")

if __name__ == "__main__":
    main()
