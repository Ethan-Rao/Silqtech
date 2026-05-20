#!/usr/bin/env python3
"""Remove output/reps/*.json whose slug is not present in the current 1099Master.csv."""
import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CSV_PATH = ROOT / "1099Master.csv"
OUT = ROOT / "output" / "reps"


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


def main() -> None:
    allowed: set[str] = set()
    with CSV_PATH.open(newline="", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            row = {k.strip(): (v or "").strip() for k, v in row.items()}
            if not (row.get("1099 Company") or "").strip():
                continue
            s = slug_from_row(row)
            if s:
                allowed.add(s)

    removed = 0
    for path in OUT.glob("*.json"):
        if path.stem not in allowed:
            path.unlink()
            print(f"  [prune] removed stale {path.name}")
            removed += 1
    print(f"Prune complete; allowed={len(allowed)} slugs, removed={removed} files")


if __name__ == "__main__":
    main()
