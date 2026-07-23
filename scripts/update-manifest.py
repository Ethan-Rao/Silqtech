#!/usr/bin/env python3
"""Update rep-manifest.json for July 2026 roster revision."""
import json
import copy
import os

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
MANIFEST_PATH = os.path.join(ROOT, "public", "data", "rep-manifest.json")

with open(MANIFEST_PATH, encoding="utf-8") as f:
    manifest = json.load(f)

reps = manifest["reps"]

# ── 1. Remove reps no longer in 1099 ────────────────────────────────────────
REMOVE_SLUGS = {"jordan-distribution", "gollar-medical", "fladmo", "mjfhealth", "hubgroup", "onpoint"}
REMOVE_NAMES = {"Christy Bland"}

new_reps = []
for r in reps:
    if r["slug"] in REMOVE_SLUGS:
        print(f"  REMOVED: {r['name']} ({r['slug']})")
        continue
    if r["name"].strip() in REMOVE_NAMES:
        print(f"  REMOVED: {r['name']} ({r['slug']})")
        continue
    new_reps.append(r)

# ── 2. Update Healthcare Cellutions territory + stats ───────────────────────
HC_STATS = {
    "facilityCount": 726,
    "physicianCount": 4047,
    "highCautiCount": 2,
    "highVolumeCount": 50,
    "hacPenalizedCount": 86,
    "hacAtRiskCount": 15,
}
for r in new_reps:
    if r["slug"] == "healthcare-cellutions":
        r["territory"] = ["AR", "LA", "OK", "TX"]
        r.update(HC_STATS)
        print(f"  UPDATED HC territory+stats: {r['name']}")

# ── 3. Fix David Hoffman (stengel) territory to MO only ────────────────────
for r in new_reps:
    if r["slug"] == "stengel" and r["name"].strip() == "David Hoffman":
        r["territory"] = ["MO"]
        print(f"  FIXED territory: David Hoffman -> MO only")

# ── 4. Add Heather Gaspar to tplconsulting ──────────────────────────────────
tpl_template = next((r for r in new_reps if r["slug"] == "tplconsulting"), None)
if tpl_template:
    heather = copy.deepcopy(tpl_template)
    heather["name"] = "Heather Gaspar"
    heather["email"] = "heather.gaspar26@gmail.com"
    heather["primaryState"] = "FL"
    idx = new_reps.index(tpl_template)
    new_reps.insert(idx, heather)
    print(f"  ADDED: Heather Gaspar (tplconsulting)")

# ── 5. Write updated manifest ────────────────────────────────────────────────
manifest["reps"] = new_reps
manifest["totalReps"] = len(new_reps)
manifest["generated"] = "2026-07-23T00:00:00Z"

print(f"  Total manifest entries: {len(new_reps)}")

with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)
print("Manifest written.")
