#!/usr/bin/env python3
"""
Build a single CSV matching the rep portal "Export CSV" columns from all
public/data/reps/*.json files. Deduplicates by facility id (same hospital can
appear on multiple rep territories).
"""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPS_DIR = ROOT / "public" / "data" / "reps"
OUT_PATH = ROOT / "all-rep-facilities-export.csv"

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


def csv_cell(value: str) -> str:
    return value.replace('"', '""')


def facility_row(f: dict) -> list:
    sir = f.get("sir")
    sir_str = "N/A" if sir is None or sir == "" else sir
    hac = f.get("hacStatus") or ""
    return [
        f.get("name", ""),
        f.get("address", ""),
        f.get("city", ""),
        f.get("state", ""),
        f.get("zipCode", ""),
        f.get("phone", ""),
        f.get("priority", ""),
        hac,
        f.get("catheterDays", 0),
        sir_str,
        f.get("cautiStatus", ""),
        f.get("gpo", "") or "",
        f.get("physicianCount", 0),
    ]


def main() -> None:
  by_id: dict[str, dict] = {}

  for path in sorted(REPS_DIR.glob("*.json")):
    data = json.loads(path.read_text(encoding="utf-8"))
    for fac in data.get("facilities", []):
      fid = str(fac.get("id", "")).strip()
      if not fid:
        continue
      # Keep first seen (stable sort by rep filename); same id => same facility
      if fid not in by_id:
        by_id[fid] = fac

  facilities = sorted(by_id.values(), key=lambda f: (f.get("state", ""), f.get("name", "")))

  with OUT_PATH.open("w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
    writer.writerow(HEADERS)
    for fac in facilities:
      row = facility_row(fac)
      # Quote text fields like the browser export (name, address, city, cauti, gpo)
      writer.writerow(row)

  print(f"Wrote {OUT_PATH}")
  print(f"  Unique facilities: {len(facilities)}")
  states = sorted({f.get("state", "") for f in facilities if f.get("state")})
  print(f"  States: {len(states)} ({', '.join(states)})")


if __name__ == "__main__":
  main()
