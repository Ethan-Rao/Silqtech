#!/usr/bin/env python3
"""
After generate-rep-data.py, copy HAC status from previous public/data/reps JSON
into freshly generated output/reps files (matched by facility id).
Recomputes stats.hacPenalizedCount and stats.hacAtRiskCount.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "output" / "reps"
LEGACY = ROOT.parent.parent / "public" / "data" / "reps"


def main() -> None:
    if not OUT.is_dir():
        raise SystemExit(f"Missing {OUT}; run generate-rep-data.py first.")

    for path in sorted(OUT.glob("*.json")):
        slug = path.stem
        gen = json.loads(path.read_text(encoding="utf-8"))
        legacy_path = LEGACY / f"{slug}.json"
        hac_by_id: dict[str, str | None] = {}
        if legacy_path.is_file():
            legacy = json.loads(legacy_path.read_text(encoding="utf-8"))
            for fac in legacy.get("facilities", []):
                fid = str(fac.get("id", ""))
                if fid:
                    hac_by_id[fid] = fac.get("hacStatus")

        penalized = 0
        at_risk = 0
        for fac in gen.get("facilities", []):
            fid = str(fac.get("id", ""))
            hac = hac_by_id.get(fid) if fid in hac_by_id else None
            fac["hacStatus"] = hac
            if hac == "HAC_PENALIZED":
                penalized += 1
            elif hac == "HAC_AT_RISK":
                at_risk += 1

        stats = gen.setdefault("stats", {})
        stats["hacPenalizedCount"] = penalized
        stats["hacAtRiskCount"] = at_risk

        path.write_text(json.dumps(gen, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"  [merge HAC] {slug}: penalized={penalized}, at_risk={at_risk}")


if __name__ == "__main__":
    main()
