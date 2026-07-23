#!/usr/bin/env python3
"""
Generate combined healthcare-cellutions.json for Brian McElhany & Rocky Ray
covering the full territory: TX, AR, OK, LA.
"""

import os
import json
import math
import importlib.util
from datetime import datetime

script_dir = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location(
    "generate_rep_data",
    os.path.join(script_dir, "generate-rep-data.py"),
)
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)


def sanitize(obj):
    """Recursively replace NaN/Inf floats with None so json.dump never sees them."""
    if isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
        return None
    if isinstance(obj, dict):
        return {k: sanitize(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [sanitize(v) for v in obj]
    return obj


def main():
    print("Generating combined healthcare-cellutions.json (TX + AR + OK + LA)...")
    os.chdir(script_dir)

    facilities_df = gen.load_all_facility_sources()
    filtered = gen.filter_facilities_for_rep(facilities_df, {"TX", "AR", "OK", "LA"})
    facilities_list = [gen.facility_row_to_dict(fac) for _, fac in filtered.iterrows()]

    for state in ["TX", "AR", "OK", "LA"]:
        count = sum(1 for f in facilities_list if f["state"] == state)
        print(f"  {state} facilities: {count}")
    print(f"  Total: {len(facilities_list)}")

    output = {
        "meta": {
            "slug": "healthcare-cellutions",
            "company": "Healthcare Cellutions of Texas",
            "name": "Brian McElhany / Rocky Ray",
            "email": "brian@bioreach360.com",
            "territory": ["TX", "AR", "OK", "LA"],
            "generated": datetime.utcnow().isoformat() + "Z",
            "dataVersion": gen.CONFIG["dataVersion"],
            "reps": [
                {
                    "name": "Brian McElhany",
                    "email": "brian@bioreach360.com",
                    "territory": ["TX", "AR", "OK", "LA"],
                },
                {
                    "name": "Rocky Ray",
                    "email": "bioreach360@gmail.com",
                    "territory": ["TX", "AR", "OK", "LA"],
                },
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
        os.path.join(script_dir, "output/reps/healthcare-cellutions.json"),
        os.path.normpath(os.path.join(script_dir, "../../public/data/reps/healthcare-cellutions.json")),
    ]
    for out_path in out_paths:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(sanitize(output), f, indent=2, ensure_ascii=False, allow_nan=False)
        print(f"  Written: {out_path}")

    print("Done.")


if __name__ == "__main__":
    main()
