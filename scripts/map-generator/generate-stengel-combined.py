#!/usr/bin/env python3
"""
Generate combined stengel.json (Brad Stengel: IA+MO; David Hoffman: MO).
"""

import os
import json
import importlib.util
from datetime import datetime

script_dir = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location(
    "generate_rep_data",
    os.path.join(script_dir, "generate-rep-data.py"),
)
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)


def main():
    print("Generating combined stengel.json (IA + MO)...")
    os.chdir(script_dir)

    facilities_df = gen.load_all_facility_sources()
    filtered = gen.filter_facilities_for_rep(facilities_df, {"IA", "MO"})
    facilities_list = [gen.facility_row_to_dict(fac) for _, fac in filtered.iterrows()]

    print(f"  IA: {sum(1 for f in facilities_list if f['state'] == 'IA')} facilities")
    print(f"  MO: {sum(1 for f in facilities_list if f['state'] == 'MO')} facilities")
    print(f"  Total: {len(facilities_list)}")

    output = {
        "meta": {
            "slug": "stengel",
            "company": "Stengel Medical Supply",
            "name": "Brad Stengel",
            "email": "stengelbrad@gmail.com",
            "territory": ["IA", "MO"],
            "generated": datetime.utcnow().isoformat() + "Z",
            "dataVersion": gen.CONFIG["dataVersion"],
            "reps": [
                {"name": "Brad Stengel", "email": "stengelbrad@gmail.com", "territory": ["IA", "MO"]},
                {"name": "David Hoffman", "email": "dave@forefrontmedical.net", "territory": ["MO"]},
            ],
        },
        "stats": {
            "facilityCount": len(facilities_list),
            "totalCatheterDays": sum(f["catheterDays"] for f in facilities_list),
            "highCautiCount": sum(1 for f in facilities_list if f["priority"] == "HIGH_CAUTI"),
            "highVolumeCount": sum(1 for f in facilities_list if f["priority"] == "HIGH_VOLUME"),
            "hacPenalizedCount": sum(1 for f in facilities_list if f["hacStatus"] == "HAC_PENALIZED"),
            "hacAtRiskCount": sum(1 for f in facilities_list if f["hacStatus"] == "HAC_AT_RISK"),
            "physicianCount": sum(f["physicianCount"] for f in facilities_list),
        },
        "facilities": facilities_list,
        "mapConfig": {
            "priorityColors": gen.CONFIG["priority_colors"],
            "facilityTypes": list(set(
                f.get("hospitalType", "") for f in facilities_list if f.get("hospitalType")
            )),
        },
    }

    out_paths = [
        os.path.join(script_dir, "output/reps/stengel.json"),
        os.path.normpath(os.path.join(script_dir, "../../public/data/reps/stengel.json")),
    ]
    for out_path in out_paths:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        print(f"  Written: {out_path}")

    print("Done.")


if __name__ == "__main__":
    main()
