#!/usr/bin/env python3
"""
Generate combined intuitek.json with both Kevin Turner (GA) and Jeff Britt (SC).
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
    print("Generating combined intuitek.json (GA + SC)...")
    os.chdir(script_dir)

    facilities_df = gen.load_all_facility_sources()
    filtered = gen.filter_facilities_for_rep(facilities_df, {"GA", "SC"})
    facilities_list = [gen.facility_row_to_dict(fac) for _, fac in filtered.iterrows()]

    ga_count = sum(1 for f in facilities_list if f["state"] == "GA")
    sc_count = sum(1 for f in facilities_list if f["state"] == "SC")
    print(f"  GA facilities: {ga_count}")
    print(f"  SC facilities: {sc_count}")
    print(f"  Total: {len(facilities_list)}")

    output = {
        "meta": {
            "slug": "intuitek",
            "company": "Intuitek Medical, Inc.",
            "name": "Kevin Turner / Jeff Britt",
            "email": "kturner@intuitekmedical.com",
            "territory": ["GA", "SC"],
            "generated": datetime.utcnow().isoformat() + "Z",
            "dataVersion": gen.CONFIG["dataVersion"],
            "reps": [
                {"name": "Kevin Turner", "email": "kturner@intuitekmedical.com", "territory": ["GA"]},
                {"name": "Jeff Britt", "email": "Jeffbrittmx3@gmail.com", "territory": ["SC"]},
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
        os.path.join(script_dir, "output/reps/intuitek.json"),
        os.path.normpath(os.path.join(script_dir, "../../public/data/reps/intuitek.json")),
    ]
    for out_path in out_paths:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        print(f"  Written: {out_path}")

    print("Done.")


if __name__ == "__main__":
    main()
