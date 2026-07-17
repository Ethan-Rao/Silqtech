#!/usr/bin/env python3
"""
Build public/data/rep-manifest.json from 1099Master.csv + per-rep JSON stats.
Matches slug rules used in generate-rep-data.py.
"""
import csv
import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CSV_PATH = ROOT / "1099Master.csv"
REPS_DIR = ROOT.parent.parent / "public" / "data" / "reps"
MANIFEST_PATH = ROOT.parent.parent / "public" / "data" / "rep-manifest.json"


def slugify(text: str) -> str:
    if not text:
        return ""
    text = str(text).lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    return text.strip("-")


def slug_from_row(row: dict[str, str]) -> str:
    company = (row.get("1099 Company") or "").strip()
    url = (row.get("URL") or "").strip()
    slug = slugify(company)
    if url:
        url_clean = (
            url.replace("https://", "")
            .replace("http://", "")
            .replace("www.", "")
        )
        parts = url_clean.replace("silq.tech/", "").split("/")
        if parts and parts[-1]:
            slug = slugify(parts[-1])
    return slug


def url_path_from_url(url: str) -> str:
    u = (url or "").strip()
    if not u:
        return ""
    u = re.sub(r"^https?://", "", u, flags=re.I)
    u = re.sub(r"^www\.", "", u, flags=re.I)
    m = re.search(r"silq\.tech/(.+)$", u, flags=re.I)
    if not m:
        return ""
    path = m.group(1).split("?")[0].rstrip("/")
    return "/" + path if path else ""


def parse_states(geography: str) -> list[str]:
    out: list[str] = []
    for part in (geography or "").split(","):
        s = part.strip().upper()[:2]
        if len(s) == 2:
            out.append(s)
    return sorted(set(out))


def main() -> None:
    rows: list[dict[str, str]] = []
    # utf-8-sig so a leading BOM on 1099Master.csv does not break column names
    with CSV_PATH.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for raw in reader:
            row = {k.strip(): (v or "").strip() for k, v in raw.items()}
            if not (row.get("1099 Company") or "").strip():
                continue
            rows.append(row)

    manifest_reps: list[dict] = []
    seen_key: set[tuple[str, str, str]] = set()

    for row in rows:
        slug = slug_from_row(row)
        if not slug:
            continue
        name = (row.get("1099 Name") or "").strip()
        email = (row.get("Email") or "").strip()
        dedupe = (slug, email, name)
        if dedupe in seen_key:
            continue
        seen_key.add(dedupe)

        rep_json_path = REPS_DIR / f"{slug}.json"
        if not rep_json_path.is_file():
            print(f"  [skip manifest] no JSON for slug={slug} ({name})")
            continue

        data = json.loads(rep_json_path.read_text(encoding="utf-8"))
        stats = data.get("stats", {})
        meta = data.get("meta", {})
        territory = meta.get("territory") or parse_states(row.get("Geography", ""))
        primary = (row.get("Primary State") or "").strip().upper()[:2]
        if len(primary) != 2 and territory:
            primary = territory[0]

        manifest_reps.append(
            {
                "slug": slug,
                "urlPath": url_path_from_url(row.get("URL", "")),
                "primaryState": primary,
                "company": (row.get("1099 Company") or "").strip(),
                "name": name,
                "email": email,
                "territory": territory,
                "facilityCount": int(stats.get("facilityCount", 0)),
                "physicianCount": int(stats.get("physicianCount", 0)),
                "highCautiCount": int(stats.get("highCautiCount", 0)),
                "highVolumeCount": int(stats.get("highVolumeCount", 0)),
                "hacPenalizedCount": int(stats.get("hacPenalizedCount", 0)),
                "hacAtRiskCount": int(stats.get("hacAtRiskCount", 0)),
            }
        )

    manifest = {
        "generated": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "dataVersion": "07_2026",
        "totalReps": len(manifest_reps),
        "reps": manifest_reps,
    }
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"Wrote {MANIFEST_PATH} with {len(manifest_reps)} reps")

    slugs_needed = {m["slug"] for m in manifest_reps}
    for path in REPS_DIR.glob("*.json"):
        if path.stem not in slugs_needed:
            path.unlink()
            print(f"  [prune public] removed stale {path.name}")


if __name__ == "__main__":
    main()
