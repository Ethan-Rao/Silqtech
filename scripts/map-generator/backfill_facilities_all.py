#!/usr/bin/env python3
"""
One-off add-only backfill: Facilities_All.xlsx sites missing from live rep JSON.

Does not regenerate the national CMS corpus. Existing live facility objects are
left untouched. Urology clinics are skipped. MI/DC (and any other state without
a live slug) go to public/data/pending-states/.
"""

from __future__ import annotations

import csv
import json
import math
import re
import sys
from collections import Counter, defaultdict
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Set, Tuple

import pandas as pd

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
WEBDEV_ROOT = REPO_ROOT.parent
ARCHIVE_JULY = (
    WEBDEV_ROOT
    / "archive"
    / "webdev-root-20260916"
    / "new maps"
    / "July2026Data"
)
THEME = ARCHIVE_JULY / "theme_hospitals_current"
CONSOLIDATED = (
    WEBDEV_ROOT
    / "archive"
    / "webdev-root-20260916"
    / "hospital_hac_cauti_qualitative_consolidated.csv"
)

XLSX_PATH = WEBDEV_ROOT / "Facilities_All.xlsx"
PUBLIC_REPS = REPO_ROOT / "public" / "data" / "reps"
OUTPUT_REPS = SCRIPT_DIR / "output" / "reps"
PENDING_DIR = REPO_ROOT / "public" / "data" / "pending-states"
MANIFEST_PATH = REPO_ROOT / "public" / "data" / "rep-manifest.json"
REPORT_PATH = REPO_ROOT / "prompts" / "FACILITIES_ALL_BACKFILL_REPORT_SEP2026.md"
AUDIT_CSV_PATH = REPO_ROOT / "prompts" / "FACILITIES_ALL_BACKFILL_AUDIT_SEP2026.csv"
CATHETER_CACHE = SCRIPT_DIR / "output" / "catheter_hcpcs_npis.json"

HGI_PATH = THEME / "Hospital_General_Information.csv"
HAI_PATH = THEME / "Healthcare_Associated_Infections-Hospital.csv"
PCH_PATH = THEME / "PCH_HEALTHCARE_ASSOCIATED_INFECTIONS_HOSPITAL.csv"
HAC_PATH = THEME / "FY_2026_HAC_Reduction_Program_Hospital.csv"
HVBP_PATH = THEME / "hvbp_safety.csv"
AFFIL_PATH = ARCHIVE_JULY / "Facility_Affiliation.csv"
PROVIDER_PATH = (
    ARCHIVE_JULY
    / "Medicare Physician & Other Practitioners - by Provider"
    / "Medicare Physician & Other Practitioners - by Provider"
    / "2024"
    / "MUP_PHY_R26_P05_V10_D24_Prov.csv"
)

INCLUDE_TYPES = {
    "Hospital/ Medical Center",
    "VA Medical Center",
    "Rehabilitation Hospital",
}
SKIP_TYPE = "Urology Clinic"
TYPE_TO_HOSPITAL_TYPE = {
    "Hospital/ Medical Center": "Acute Care Hospitals",
    "VA Medical Center": "VA Medical Center",
    "Rehabilitation Hospital": "Rehabilitation",
}
TARGET_SPECIALTIES = {"Urology", "Infectious Disease"}
SPOT_CHECK_IDS = ("260032", "510023", "010001")

PUNCT_RE = re.compile(r"[^\w\s]")
NOISE_RE = re.compile(
    r"\b(INC|LLC|LTD|LP|LLP|CORP|CORPORATION|INCORPORATED|THE|DBA)\b"
)
STREET_ABBR = [
    (r"\bSTREET\b", "ST"),
    (r"\bAVENUE\b", "AVE"),
    (r"\bBOULEVARD\b", "BLVD"),
    (r"\bDRIVE\b", "DR"),
    (r"\bROAD\b", "RD"),
    (r"\bLANE\b", "LN"),
    (r"\bPARKWAY\b", "PKWY"),
    (r"\bHIGHWAY\b", "HWY"),
    (r"\bSUITE\b", "STE"),
    (r"\bNORTH\b", "N"),
    (r"\bSOUTH\b", "S"),
    (r"\bEAST\b", "E"),
    (r"\bWEST\b", "W"),
    (r"\bNORTHEAST\b", "NE"),
    (r"\bNORTHWEST\b", "NW"),
    (r"\bSOUTHEAST\b", "SE"),
    (r"\bSOUTHWEST\b", "SW"),
]
CITY_ALIASES = {
    "SAINT LOUIS": "ST LOUIS",
    "SAINT PAUL": "ST PAUL",
    "SAINT PETERSBURG": "ST PETERSBURG",
    "SAINT CLOUD": "ST CLOUD",
    "SAINT JOSEPH": "ST JOSEPH",
    "SAINT CHARLES": "ST CHARLES",
    "SAINT GEORGE": "ST GEORGE",
    "FORT WORTH": "FT WORTH",
    "FORT LAUDERDALE": "FT LAUDERDALE",
    "FORT WAYNE": "FT WAYNE",
    "FORT MYERS": "FT MYERS",
    "FORT SMITH": "FT SMITH",
    "FORT COLLINS": "FT COLLINS",
    "FORT PIERCE": "FT PIERCE",
    "MOUNT VERNON": "MT VERNON",
    "MOUNT PLEASANT": "MT PLEASANT",
    "WASHINGTON DC": "WASHINGTON",
    "NEW YORK CITY": "NEW YORK",
    "NYC": "NEW YORK",
    "HOLLYWOOD": "HOLLYWOOD",
}
NAME_STOPWORDS = {
    "HOSPITAL",
    "HOSPITALS",
    "MEDICAL",
    "CENTER",
    "CENTERS",
    "CENTRE",
    "HEALTH",
    "HEALTHCARE",
    "SYSTEM",
    "SYSTEMS",
    "CAMPUS",
    "OF",
    "AT",
    "AND",
    "THE",
    "INC",
    "LLC",
    "FOR",
    "GROUP",
    "SERVICES",
    "SERVICE",
    "REGIONAL",
    "COMMUNITY",
    "MEMORIAL",
    "GENERAL",
    "UNIVERSITY",
}
ENCOMPASS_RE = re.compile(
    r"encompass|healthsouth|affiliate of encompass", re.IGNORECASE
)
DISTINCT_REHAB_RE = re.compile(
    r"encompass|healthsouth|affiliate of encompass|"
    r"rehabilitation hospital of|\brehab(?:ilitation)? hospital\b",
    re.IGNORECASE,
)
VA_NAME_RE = re.compile(r"\bVA\b|VETERANS", re.IGNORECASE)


# ---------------------------------------------------------------------------
# Small helpers
# ---------------------------------------------------------------------------

def utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def cell_str(val: Any) -> str:
    if val is None:
        return ""
    try:
        if isinstance(val, float) and pd.isna(val):
            return ""
    except (TypeError, ValueError):
        pass
    if isinstance(val, float) and val.is_integer():
        return str(int(val))
    if isinstance(val, int):
        return str(val)
    text = str(val).strip()
    if text.lower() in ("nan", "none", "nat"):
        return ""
    return text


def safe_int(val: Any, default: int = 0) -> int:
    text = cell_str(val)
    if not text or text in ("Not Available", "N/A"):
        return default
    try:
        return int(float(text.replace(",", "")))
    except (ValueError, TypeError):
        return default


def safe_float(val: Any, default: Optional[float] = None) -> Optional[float]:
    text = cell_str(val)
    if not text or text in ("Not Available", "N/A"):
        return default
    try:
        number = float(text.replace(",", ""))
        if math.isnan(number) or math.isinf(number):
            return default
        return number
    except (ValueError, TypeError):
        return default


def normalize_facility_id(fid: Any) -> str:
    s = cell_str(fid)
    if not s:
        return ""
    if s.isdigit():
        return s.zfill(6)
    return s


def format_phone(phone: Any) -> str:
    digits = re.sub(r"\D", "", cell_str(phone))
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    return cell_str(phone)


def normalize_text(val: Any) -> str:
    s = cell_str(val).upper()
    s = s.replace("&", " AND ")
    s = PUNCT_RE.sub(" ", s)
    s = NOISE_RE.sub(" ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def normalize_city(val: Any) -> str:
    s = normalize_text(val)
    s = CITY_ALIASES.get(s, s)
    if s.startswith("SAINT "):
        s = "ST " + s[6:]
    if s.startswith("FORT "):
        s = "FT " + s[5:]
    if s.startswith("MOUNT "):
        s = "MT " + s[6:]
    return s


def normalize_address(val: Any) -> str:
    s = normalize_text(val)
    for pattern, repl in STREET_ABBR:
        s = re.sub(pattern, repl, s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def name_tokens(val: Any) -> Set[str]:
    return {t for t in normalize_text(val).split() if t and t not in NAME_STOPWORDS}


def token_jaccard(a: Any, b: Any) -> float:
    ta, tb = name_tokens(a), name_tokens(b)
    if not ta or not tb:
        na, nb = set(normalize_text(a).split()), set(normalize_text(b).split())
        if not na or not nb:
            return 0.0
        return len(na & nb) / len(na | nb)
    return len(ta & tb) / len(ta | tb)


def is_encompass(name: str) -> bool:
    return bool(ENCOMPASS_RE.search(name or ""))


def is_distinct_rehab_brand(name: str) -> bool:
    """Encompass / HealthSouth / standalone 'Rehabilitation Hospital of …'."""
    return bool(DISTINCT_REHAB_RE.search(name or ""))


def is_campus_name(a: str, b: str) -> bool:
    na, nb = normalize_text(a), normalize_text(b)
    if not na or not nb:
        return False
    if na == nb:
        return True
    shorter, longer = (na, nb) if len(na) <= len(nb) else (nb, na)
    if len(shorter) >= 12 and longer.startswith(shorter):
        return True
    if len(shorter) >= 16 and shorter in longer:
        return True
    jac = token_jaccard(a, b)
    if jac >= 0.7:
        return True
    ta, tb = name_tokens(a), name_tokens(b)
    if ta and tb and (ta <= tb or tb <= ta):
        return True
    return False


def sanitize(obj: Any) -> Any:
    if isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
        return None
    if isinstance(obj, dict):
        return {k: sanitize(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [sanitize(v) for v in obj]
    return obj


def dump_json(path: Path, obj: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = sanitize(obj)
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False, allow_nan=False)
        f.write("\n")


def recompute_stats(data: dict) -> None:
    facilities = data.get("facilities") or []
    data["stats"] = {
        "facilityCount": len(facilities),
        "totalCatheterDays": sum(int(f.get("catheterDays") or 0) for f in facilities),
        "highCautiCount": sum(1 for f in facilities if f.get("priority") == "HIGH_CAUTI"),
        "highVolumeCount": sum(1 for f in facilities if f.get("priority") == "HIGH_VOLUME"),
        "hacPenalizedCount": sum(1 for f in facilities if f.get("hacStatus") == "HAC_PENALIZED"),
        "hacAtRiskCount": sum(1 for f in facilities if f.get("hacStatus") == "HAC_AT_RISK"),
        "physicianCount": sum(int(f.get("physicianCount") or 0) for f in facilities),
    }
    types = sorted(
        {
            str(f.get("hospitalType") or "")
            for f in facilities
            if f.get("hospitalType")
        }
    )
    map_config = data.get("mapConfig") or {}
    map_config["facilityTypes"] = types
    if "priorityColors" not in map_config:
        map_config["priorityColors"] = {
            "HIGH_CAUTI": "#e41a1c",
            "HIGH_VOLUME": "#377eb8",
            "STANDARD": "#4daf4a",
            "VA": "#ff7f00",
        }
    data["mapConfig"] = map_config


# ---------------------------------------------------------------------------
# CMS loaders
# ---------------------------------------------------------------------------

def load_hgi() -> Tuple[pd.DataFrame, Dict[str, dict]]:
    print(f"Loading HGI from {HGI_PATH}...")
    df = pd.read_csv(HGI_PATH, dtype=str, encoding="utf-8", encoding_errors="replace").fillna("")
    df.columns = df.columns.str.strip()
    df["Facility ID"] = df["Facility ID"].apply(normalize_facility_id)
    by_id: Dict[str, dict] = {}
    for _, row in df.iterrows():
        fid = row["Facility ID"]
        if fid:
            by_id[fid] = row.to_dict()
    print(f"  {len(by_id)} CMS hospitals")
    return df, by_id


def load_hai_by_id() -> Dict[str, dict]:
    print(f"Loading HAI from {HAI_PATH}...")
    out: Dict[str, dict] = {}

    def ingest(path: Path, prefixes: Tuple[str, ...], rename: Dict[str, str]) -> None:
        if not path.is_file():
            print(f"  missing {path.name}")
            return
        df = pd.read_csv(path, dtype=str, encoding="utf-8", encoding_errors="replace").fillna("")
        df.columns = df.columns.str.strip()
        subset = df[df["Measure ID"].str.startswith(prefixes)].copy()
        if subset.empty:
            return
        for fid, group in subset.groupby("Facility ID"):
            nid = normalize_facility_id(fid)
            if not nid:
                continue
            scores = {
                rename.get(str(r["Measure ID"]), str(r["Measure ID"])): r.get("Score", "")
                for _, r in group.iterrows()
            }
            comparison = ""
            for _, r in group.iterrows():
                mid = str(r.get("Measure ID", ""))
                if mid.endswith("_SIR"):
                    comparison = cell_str(r.get("Compared to National", ""))
                    break
            first = group.iloc[0]
            rec = out.setdefault(nid, {})
            rec.update(
                {
                    "name": cell_str(first.get("Facility Name", rec.get("name", ""))),
                    "address": cell_str(first.get("Address", rec.get("address", ""))),
                    "city": cell_str(first.get("City/Town", rec.get("city", ""))),
                    "state": cell_str(first.get("State", rec.get("state", ""))).upper()[:2],
                    "zip": cell_str(first.get("ZIP Code", rec.get("zip", "")))[:5],
                    "phone": format_phone(first.get("Telephone Number", rec.get("phone", ""))),
                    "catheterDays": safe_int(scores.get("HAI_2_DOPC"), 0),
                    "observedCAUTI": safe_int(scores.get("HAI_2_NUMERATOR"), 0),
                    "predictedCAUTI": safe_float(scores.get("HAI_2_ELIGCASES"), 0.0) or 0.0,
                    "sir": safe_float(scores.get("HAI_2_SIR"), None),
                    "cautiStatus": comparison,
                }
            )

    ingest(
        HAI_PATH,
        ("HAI_2_",),
        {},
    )
    ingest(
        PCH_PATH,
        ("PCH_5_",),
        {
            "PCH_5_DOPC": "HAI_2_DOPC",
            "PCH_5_NUMERATOR": "HAI_2_NUMERATOR",
            "PCH_5_ELIGCASES": "HAI_2_ELIGCASES",
            "PCH_5_SIR": "HAI_2_SIR",
        },
    )
    print(f"  HAI/PCH records for {len(out)} facilities")
    return out


def load_hac() -> Tuple[Dict[str, str], Dict[str, dict], Set[str]]:
    hac_status: Dict[str, str] = {}
    hac_detail: Dict[str, dict] = {}
    if HAC_PATH.is_file():
        print(f"Loading HAC from {HAC_PATH}...")
        with HAC_PATH.open(encoding="utf-8-sig", errors="replace") as f:
            for row in csv.DictReader(f):
                fid = normalize_facility_id(row.get("Facility ID", ""))
                if not fid or fid == "000000":
                    continue
                if cell_str(row.get("Payment Reduction", "")) == "Yes":
                    hac_status[fid] = "HAC_PENALIZED"
                hac_detail[fid] = {
                    "hacTotalScore": safe_float(row.get("Total HAC Score", ""), None),
                    "cautiSirHac": safe_float(row.get("CAUTI SIR", ""), None),
                    "cautiWzScore": safe_float(row.get("CAUTI W Z Score", ""), None),
                }
        print(f"  HAC detail {len(hac_detail)}, penalized {len(hac_status)}")
    at_risk: Set[str] = set()
    if CONSOLIDATED.is_file():
        print(f"Loading at-risk IDs from {CONSOLIDATED}...")
        with CONSOLIDATED.open(encoding="utf-8-sig", errors="replace") as f:
            for row in csv.DictReader(f):
                if cell_str(row.get("hac_tier_label", "")) == "Tier 2 (elevated HAC risk)":
                    fid = normalize_facility_id(row.get("facility_id", ""))
                    if fid:
                        at_risk.add(fid)
        print(f"  {len(at_risk)} at-risk IDs")
    return hac_status, hac_detail, at_risk


def load_hvbp() -> Dict[str, dict]:
    hvbp: Dict[str, dict] = {}
    if not HVBP_PATH.is_file():
        return hvbp
    print(f"Loading HVBP from {HVBP_PATH}...")
    with HVBP_PATH.open(encoding="utf-8-sig", errors="replace") as f:
        for row in csv.DictReader(f):
            fid = normalize_facility_id(row.get("Facility ID", ""))
            if not fid or fid == "000000":
                continue
            score_str = cell_str(row.get("HAI-2 Measure Score", ""))
            score = None
            if score_str and score_str not in ("Not Available", "N/A"):
                try:
                    score = int(score_str.split()[0])
                except (ValueError, IndexError):
                    pass
            perf = cell_str(row.get("HAI-2 Performance Rate", ""))
            hvbp[fid] = {
                "cautiVbpScore": score,
                "cautiVbpPerformanceRate": (
                    safe_float(perf, None) if perf not in ("Not Available", "N/A", "") else None
                ),
            }
    print(f"  HVBP {len(hvbp)}")
    return hvbp


def load_catheter_npis() -> Set[str]:
    if not CATHETER_CACHE.is_file():
        return set()
    try:
        cached = json.loads(CATHETER_CACHE.read_text(encoding="utf-8"))
        npis = set(cached.get("npis") or [])
        print(f"Loaded {len(npis):,} catheter-procedure NPIs from cache")
        return npis
    except Exception as exc:
        print(f"  catheter cache read failed: {exc}")
        return set()


def load_physicians_for_ccns(ccns: Set[str], catheter_npis: Set[str]) -> Dict[str, List[dict]]:
    """Best-effort: affiliation join + PUF specialty filter. Never raises out."""
    if not ccns:
        print("No new CCNs need physician lookup")
        return {}
    if not AFFIL_PATH.is_file() or not PROVIDER_PATH.is_file():
        print("Physician source files missing; new CCN physicians will be empty")
        return {}

    print(f"Loading affiliations for {len(ccns)} CCNs from {AFFIL_PATH.name}...")
    needed_npis: Set[str] = set()
    fac_to_npis: Dict[str, Set[str]] = defaultdict(set)
    usecols = [
        "NPI",
        "facility_type",
        "Facility Affiliations Certification Number",
    ]
    for chunk in pd.read_csv(
        AFFIL_PATH,
        dtype=str,
        chunksize=200_000,
        encoding="utf-8",
        encoding_errors="replace",
        usecols=lambda c: c.strip() in usecols or c in usecols,
    ):
        chunk.columns = chunk.columns.str.strip()
        hospital = chunk[chunk["facility_type"].str.lower() == "hospital"].copy()
        hospital["fac_id"] = hospital["Facility Affiliations Certification Number"].apply(
            normalize_facility_id
        )
        hospital["NPI"] = hospital["NPI"].astype(str).str.strip()
        hospital = hospital[hospital["fac_id"].isin(ccns) & (hospital["NPI"] != "")]
        for fac_id, npi in zip(hospital["fac_id"], hospital["NPI"]):
            fac_to_npis[fac_id].add(npi)
            needed_npis.add(npi)
    print(f"  {len(needed_npis)} NPIs affiliated to those CCNs")
    if not needed_npis:
        return {}

    print(f"Scanning Provider PUF ({PROVIDER_PATH.name}) for target specialties...")
    npi_to_physician: Dict[str, dict] = {}
    rows_scanned = 0
    for chunk in pd.read_csv(
        PROVIDER_PATH,
        dtype=str,
        chunksize=100_000,
        on_bad_lines="skip",
        encoding="utf-8",
        encoding_errors="replace",
        usecols=lambda c: c.strip()
        in {
            "Rndrng_NPI",
            "Rndrng_Prvdr_First_Name",
            "Rndrng_Prvdr_Last_Org_Name",
            "Rndrng_Prvdr_Type",
        },
    ):
        chunk.columns = chunk.columns.str.strip()
        rows_scanned += len(chunk)
        if "Rndrng_Prvdr_Type" not in chunk.columns:
            continue
        filtered = chunk[chunk["Rndrng_Prvdr_Type"].str.strip().isin(TARGET_SPECIALTIES)]
        for _, row in filtered.iterrows():
            npi = cell_str(row.get("Rndrng_NPI", ""))
            if npi in needed_npis and npi not in npi_to_physician:
                npi_to_physician[npi] = {
                    "name": (
                        f"{cell_str(row.get('Rndrng_Prvdr_First_Name', '')).title()} "
                        f"{cell_str(row.get('Rndrng_Prvdr_Last_Org_Name', '')).title()}"
                    ).strip(),
                    "npi": npi,
                    "specialty": cell_str(row.get("Rndrng_Prvdr_Type", "")),
                    "billsCatheterProcedures": npi in catheter_npis,
                }
        if rows_scanned % 1_000_000 == 0:
            print(f"    ...scanned {rows_scanned:,} PUF rows, {len(npi_to_physician)} hits")

    print(f"  PUF scan {rows_scanned:,} rows -> {len(npi_to_physician)} target-specialty NPIs")
    facility_physicians: Dict[str, List[dict]] = {}
    for fac_id, npis in fac_to_npis.items():
        physicians = [npi_to_physician[n] for n in sorted(npis) if n in npi_to_physician]
        physicians.sort(key=lambda p: (p.get("specialty", ""), p.get("name", "")))
        if physicians:
            facility_physicians[fac_id] = physicians
    print(f"  physicians mapped to {len(facility_physicians)} facilities")
    return facility_physicians


# ---------------------------------------------------------------------------
# Matching
# ---------------------------------------------------------------------------

def build_cms_indexes(hgi_df: pd.DataFrame) -> Tuple[dict, dict, dict]:
    by_state_city: Dict[Tuple[str, str], List[dict]] = defaultdict(list)
    by_state: Dict[str, List[dict]] = defaultdict(list)
    by_addr: Dict[Tuple[str, str, str], List[dict]] = defaultdict(list)
    for _, row in hgi_df.iterrows():
        rec = {
            "id": normalize_facility_id(row.get("Facility ID", "")),
            "name": cell_str(row.get("Facility Name", "")),
            "address": cell_str(row.get("Address", "")),
            "city": cell_str(row.get("City/Town", "")),
            "state": cell_str(row.get("State", "")).upper()[:2],
            "zip": cell_str(row.get("ZIP Code", ""))[:5],
            "phone": format_phone(row.get("Telephone Number", "")),
            "hospitalType": cell_str(row.get("Hospital Type", "")),
            "ownership": cell_str(row.get("Hospital Ownership", "")),
            "starRating": (
                int(cell_str(row.get("Hospital overall rating", "")))
                if cell_str(row.get("Hospital overall rating", "")).isdigit()
                and 1 <= int(cell_str(row.get("Hospital overall rating", ""))) <= 5
                else None
            ),
        }
        if not rec["id"] or not rec["state"]:
            continue
        city_key = normalize_city(rec["city"])
        by_state_city[(rec["state"], city_key)].append(rec)
        by_state[rec["state"]].append(rec)
        addr_key = normalize_address(rec["address"])
        if addr_key:
            by_addr[(rec["state"], city_key, addr_key)].append(rec)
    return by_state_city, by_state, by_addr


def cms_match_score(ss: dict, cms: dict) -> float:
    if ss["state"] != cms["state"]:
        return 0.0
    name_eq = normalize_text(ss["name"]) == normalize_text(cms["name"])
    city_eq = normalize_city(ss["city"]) == normalize_city(cms["city"])
    jac = token_jaccard(ss["name"], cms["name"])
    addr_eq = (
        bool(ss["address"])
        and normalize_address(ss["address"]) == normalize_address(cms["address"])
        and normalize_address(ss["address"]) != ""
    )
    if name_eq and city_eq:
        return 1.0
    if name_eq and addr_eq:
        return 0.97
    if city_eq and jac >= 0.8:
        return 0.92
    if city_eq and addr_eq and jac >= 0.5:
        return 0.9
    if name_eq:
        # Same official CMS name in-state; spreadsheet cities often disagree
        # (McChord vs Tacoma, Oregon vs Cincinnati).
        return 0.93
    if city_eq and jac >= 0.65:
        return 0.86
    if city_eq and jac >= 0.55:
        return 0.7
    return jac * (0.6 if city_eq else 0.3)


def resolve_ccn(
    ss: dict,
    by_state_city: dict,
    by_state: dict,
    by_addr: dict,
    weak_skips: List[dict],
) -> Optional[dict]:
    state = ss["state"]
    city = normalize_city(ss["city"])
    addr = normalize_address(ss["address"])
    candidates: List[dict] = []
    if addr:
        candidates.extend(by_addr.get((state, city, addr), []))
    candidates.extend(by_state_city.get((state, city), []))
    # Unique exact name in state even if city spelling differs
    name_norm = normalize_text(ss["name"])
    name_hits: List[dict] = []
    if name_norm:
        name_hits = [c for c in by_state.get(state, []) if normalize_text(c["name"]) == name_norm]
        candidates.extend(name_hits)
    if not is_encompass(ss["name"]):
        if len(name_hits) == 1:
            return name_hits[0]
        if len(name_hits) > 1:
            city_hits = [c for c in name_hits if normalize_city(c["city"]) == city]
            if len(city_hits) == 1:
                return city_hits[0]

    seen = set()
    uniq: List[dict] = []
    for c in candidates:
        if c["id"] in seen:
            continue
        seen.add(c["id"])
        uniq.append(c)
    if not uniq:
        return None

    ranked = sorted(
        ((cms_match_score(ss, c), c) for c in uniq),
        key=lambda x: (
            x[0],
            1 if normalize_city(x[1]["city"]) == city else 0,
            token_jaccard(ss["name"], x[1]["name"]),
        ),
        reverse=True,
    )
    best_score, best = ranked[0]

    # Encompass/HealthSouth: only attach a CCN if CMS itself looks like that rehab
    if is_encompass(ss["name"]):
        cms_ok = is_encompass(best["name"]) or "rehab" in (best.get("hospitalType") or "").lower()
        if not cms_ok:
            return None

    if best_score >= 0.85:
        return best
    if 0.5 <= best_score < 0.85:
        weak_skips.append(
            {
                "spreadsheet": ss["name"],
                "city": ss["city"],
                "state": state,
                "cms": best["name"],
                "cms_id": best["id"],
                "score": round(best_score, 3),
            }
        )
    return None


def live_duplicate(
    ss: dict,
    resolved: Optional[dict],
    slug_facilities: List[dict],
    slug_ids: Set[str],
    slug_name_keys: Set[Tuple[str, str, str]],
) -> Optional[str]:
    name_key = (normalize_text(ss["name"]), normalize_city(ss["city"]), ss["state"])
    if name_key in slug_name_keys:
        return "name+city+state"
    if resolved and resolved["id"] in slug_ids:
        # Don't treat a wrong acute CCN as a reason to drop Encompass
        if is_encompass(ss["name"]) and not is_encompass(
            next((f["name"] for f in slug_facilities if f.get("id") == resolved["id"]), "")
        ):
            pass
        else:
            return f"ccn:{resolved['id']}"

    city = normalize_city(ss["city"])
    days = ss["days"]
    distinct = is_distinct_rehab_brand(ss["name"])
    for existing in slug_facilities:
        if cell_str(existing.get("state", "")).upper()[:2] != ss["state"]:
            continue
        if normalize_city(existing.get("city", "")) != city:
            continue
        if is_campus_name(ss["name"], existing.get("name", "")):
            if distinct:
                if is_encompass(existing.get("name", "")) or normalize_text(
                    ss["name"]
                ) == normalize_text(existing.get("name", "")):
                    return "exact-rehab-already-present"
                continue
            return "campus"
        if (
            days
            and int(existing.get("catheterDays") or 0) == days
            and token_jaccard(ss["name"], existing.get("name", "")) >= 0.4
            and not distinct
        ):
            return "same-days-overlap"
    return None


# ---------------------------------------------------------------------------
# Facility object
# ---------------------------------------------------------------------------

def build_new_facility(
    ss: dict,
    resolved: Optional[dict],
    hgi_by_id: Dict[str, dict],
    hai_by_id: Dict[str, dict],
    hac_status: Dict[str, str],
    hac_detail: Dict[str, dict],
    at_risk: Set[str],
    hvbp: Dict[str, dict],
    live_by_id: Dict[str, dict],
    physicians_by_ccn: Dict[str, List[dict]],
    city_zip: Dict[Tuple[str, str], str],
) -> dict:
    # If this CCN already lives on another slug, clone the CMS object (no spreadsheet merge)
    if resolved and resolved["id"] in live_by_id:
        cloned = deepcopy(live_by_id[resolved["id"]])
        return cloned

    ccn = resolved["id"] if resolved else ""
    hgi = hgi_by_id.get(ccn, {}) if ccn else {}
    hai = hai_by_id.get(ccn, {}) if ccn else {}

    name = ss["name"]
    if ccn:
        cms_name = cell_str(hgi.get("Facility Name") or (resolved or {}).get("name") or "")
        if cms_name:
            name = cms_name

    address = ss["address"]
    city = ss["city"]
    phone = format_phone(ss["phone"])
    zip_code = ""
    ownership = ""
    hospital_type = TYPE_TO_HOSPITAL_TYPE.get(ss["facility_type"], "Acute Care Hospitals")
    star = None

    if resolved:
        address = resolved.get("address") or address
        city = resolved.get("city") or city
        zip_code = (resolved.get("zip") or "")[:5]
        phone = resolved.get("phone") or phone
        hospital_type = resolved.get("hospitalType") or hospital_type
        ownership = resolved.get("ownership") or ""
        star = resolved.get("starRating")
    if hgi:
        address = cell_str(hgi.get("Address")) or address
        city = cell_str(hgi.get("City/Town")) or city
        zip_code = cell_str(hgi.get("ZIP Code"))[:5] or zip_code
        phone = format_phone(hgi.get("Telephone Number")) or phone
        hospital_type = cell_str(hgi.get("Hospital Type")) or hospital_type
        ownership = cell_str(hgi.get("Hospital Ownership")) or ownership
        rating = cell_str(hgi.get("Hospital overall rating"))
        if rating.isdigit() and 1 <= int(rating) <= 5:
            star = int(rating)
    if not zip_code:
        zip_code = city_zip.get((ss["state"], normalize_city(ss["city"])), "")

    observed = 0
    predicted = 0.0
    sir = None
    cauti_status = ""
    if hai:
        observed = int(hai.get("observedCAUTI") or 0)
        predicted = float(hai.get("predictedCAUTI") or 0)
        sir = hai.get("sir")
        cauti_status = cell_str(hai.get("cautiStatus"))
        if not zip_code:
            zip_code = cell_str(hai.get("zip"))[:5]

    if ss["facility_type"] == "VA Medical Center" or VA_NAME_RE.search(name):
        priority = "VA"
        if hospital_type == "Acute Care Hospitals":
            hospital_type = "VA Medical Center"
    elif cauti_status and "Worse" in cauti_status:
        priority = "HIGH_CAUTI"
    else:
        priority = "STANDARD"

    hac = None
    if ccn and hac_status.get(ccn) == "HAC_PENALIZED":
        hac = "HAC_PENALIZED"
    elif ccn and ccn in at_risk:
        hac = "HAC_AT_RISK"

    detail = hac_detail.get(ccn, {}) if ccn else {}
    hv = hvbp.get(ccn, {}) if ccn else {}
    physicians = physicians_by_ccn.get(ccn, []) if ccn else []

    fid = ccn if ccn else f"FA-{ss['facility_id']}"
    return {
        "id": fid,
        "name": name,
        "address": address,
        "city": city,
        "state": ss["state"],
        "zipCode": zip_code or "",
        "phone": phone,
        "hospitalType": hospital_type,
        "ownership": ownership,
        "gpo": ss["gpo"],
        "catheterDays": ss["days"],
        "observedCAUTI": observed,
        "predictedCAUTI": predicted,
        "sir": sir,
        "cautiStatus": cauti_status,
        "priority": priority,
        "hacStatus": hac,
        "physicians": physicians,
        "physicianCount": len(physicians),
        "hacTierLabel": (
            "Tier 1 (highest HAC risk)"
            if hac == "HAC_PENALIZED"
            else "Tier 2 (elevated HAC risk)"
            if hac == "HAC_AT_RISK"
            else "Tier 3 (lower HAC risk)"
            if ccn and ccn in hac_detail
            else None
        ),
        "hacTotalScore": detail.get("hacTotalScore"),
        "cautiSirHac": detail.get("cautiSirHac"),
        "cautiWzScore": detail.get("cautiWzScore"),
        "cautiVbpScore": hv.get("cautiVbpScore"),
        "cautiVbpPerformanceRate": hv.get("cautiVbpPerformanceRate"),
        "starRating": star,
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def load_live_reps() -> Dict[str, dict]:
    reps: Dict[str, dict] = {}
    for path in sorted(PUBLIC_REPS.glob("*.json")):
        reps[path.stem] = json.loads(path.read_text(encoding="utf-8"))
    print(f"Loaded {len(reps)} live rep JSON files")
    return reps


def index_live(reps: Dict[str, dict]) -> Tuple[dict, dict, dict, dict]:
    state_to_slugs: Dict[str, List[str]] = defaultdict(list)
    live_by_id: Dict[str, dict] = {}
    slug_ids: Dict[str, Set[str]] = {}
    slug_name_keys: Dict[str, Set[Tuple[str, str, str]]] = {}
    for slug, data in reps.items():
        territory = [str(s).upper()[:2] for s in (data.get("meta") or {}).get("territory") or []]
        for st in territory:
            if slug not in state_to_slugs[st]:
                state_to_slugs[st].append(slug)
        ids: Set[str] = set()
        keys: Set[Tuple[str, str, str]] = set()
        for fac in data.get("facilities") or []:
            fid = cell_str(fac.get("id", ""))
            if fid:
                ids.add(fid)
                if fid.isdigit() or (len(fid) == 6 and fid.isalnum()):
                    live_by_id.setdefault(fid, fac)
            keys.add(
                (
                    normalize_text(fac.get("name", "")),
                    normalize_city(fac.get("city", "")),
                    cell_str(fac.get("state", "")).upper()[:2],
                )
            )
        slug_ids[slug] = ids
        slug_name_keys[slug] = keys
    return state_to_slugs, live_by_id, slug_ids, slug_name_keys


def build_city_zip(hgi_df: pd.DataFrame, live_by_id: Dict[str, dict]) -> Dict[Tuple[str, str], str]:
    buckets: Dict[Tuple[str, str], Counter] = defaultdict(Counter)
    for _, row in hgi_df.iterrows():
        st = cell_str(row.get("State", "")).upper()[:2]
        city = normalize_city(row.get("City/Town", ""))
        zip_code = cell_str(row.get("ZIP Code", ""))[:5]
        if st and city and zip_code.isdigit() and len(zip_code) == 5:
            buckets[(st, city)][zip_code] += 1
    for fac in live_by_id.values():
        st = cell_str(fac.get("state", "")).upper()[:2]
        city = normalize_city(fac.get("city", ""))
        zip_code = cell_str(fac.get("zipCode", ""))[:5]
        if st and city and zip_code.isdigit() and len(zip_code) == 5:
            buckets[(st, city)][zip_code] += 1
    return {k: counts.most_common(1)[0][0] for k, counts in buckets.items() if counts}


def snapshot_ids(reps: Dict[str, dict], ids: Iterable[str]) -> Dict[str, dict]:
    wanted = set(ids)
    found: Dict[str, dict] = {}
    for slug, data in reps.items():
        for fac in data.get("facilities") or []:
            fid = cell_str(fac.get("id", ""))
            if fid in wanted and fid not in found:
                found[fid] = {
                    "slug": slug,
                    "name": fac.get("name"),
                    "catheterDays": fac.get("catheterDays"),
                    "gpo": fac.get("gpo"),
                    "sir": fac.get("sir"),
                    "physicianCount": fac.get("physicianCount"),
                    "address": fac.get("address"),
                }
    return found


def main() -> int:
    print("=" * 64)
    print("Facilities_All.xlsx add-only backfill (Sep 2026)")
    print("=" * 64)

    if not XLSX_PATH.is_file():
        print(f"ERROR: spreadsheet not found: {XLSX_PATH}")
        return 1

    reps = load_live_reps()
    before_spot = snapshot_ids(reps, SPOT_CHECK_IDS)
    print("Spot-check before:", json.dumps(before_spot, indent=2))

    state_to_slugs, live_by_id, slug_ids, slug_name_keys = index_live(reps)
    live_states = set(state_to_slugs)
    print(f"Live territory states ({len(live_states)}): {', '.join(sorted(live_states))}")

    hgi_df, hgi_by_id = load_hgi()
    by_state_city, by_state, by_addr = build_cms_indexes(hgi_df)
    city_zip = build_city_zip(hgi_df, live_by_id)
    hai_by_id = load_hai_by_id()
    hac_status, hac_detail, at_risk = load_hac()
    hvbp = load_hvbp()
    catheter_npis = load_catheter_npis()

    print(f"Reading {XLSX_PATH}...")
    df = pd.read_excel(XLSX_PATH, sheet_name="Facility_List_1")
    print(f"  {len(df)} rows")

    audit_rows: List[dict] = []
    weak_skips: List[dict] = []
    pending_by_state: Dict[str, List[dict]] = defaultdict(list)
    adds_by_slug: Dict[str, List[dict]] = defaultdict(list)
    # National unique added IDs
    added_unique: Dict[str, dict] = {}
    resolved_new_ccns: Set[str] = set()

    skipped_clinic = 0
    skipped_duplicate = 0
    skipped_other = 0
    in_scope = 0

    # Pass 1: decide add vs skip and collect CCNs that need physician lookup
    decisions: List[dict] = []
    for _, row in df.iterrows():
        ftype = cell_str(row.get("Facility Type", ""))
        ss = {
            "facility_id": cell_str(row.get("Facility_ID", "")),
            "name": cell_str(row.get("Facility Name", "")),
            "state": cell_str(row.get("State", "")).upper()[:2],
            "city": cell_str(row.get("City", "")),
            "facility_type": ftype,
            "gpo": cell_str(row.get("GPO Membership", "")),
            "address": cell_str(row.get("Address", "")),
            "phone": cell_str(row.get("Phone", "")),
            "days": safe_int(row.get("Days"), 0),
        }
        if ftype == SKIP_TYPE or ftype not in INCLUDE_TYPES:
            skipped_clinic += 1 if ftype == SKIP_TYPE else 0
            if ftype != SKIP_TYPE:
                skipped_other += 1
            audit_rows.append(
                {
                    **ss,
                    "action": "skipped-clinic" if ftype == SKIP_TYPE else "skipped-other-type",
                    "reason": ftype or "blank",
                    "ccn": "",
                    "new_id": "",
                    "slugs": "",
                }
            )
            continue

        in_scope += 1
        resolved = resolve_ccn(ss, by_state_city, by_state, by_addr, weak_skips)
        slugs = state_to_slugs.get(ss["state"], [])
        if not slugs:
            # Pending no-rep: still skip if it is clearly the same campus as a
            # national live CMS hospital (e.g. Mayo listed twice) — but keep
            # unmatched MI/DC sites, including Encompass.
            national_dup = False
            if resolved and resolved["id"] in live_by_id and not is_encompass(ss["name"]):
                national_dup = True
            else:
                for fac in live_by_id.values():
                    if cell_str(fac.get("state", "")).upper()[:2] != ss["state"]:
                        continue
                    if normalize_city(fac.get("city", "")) != normalize_city(ss["city"]):
                        continue
                    if is_campus_name(ss["name"], fac.get("name", "")) and not is_distinct_rehab_brand(
                        ss["name"]
                    ):
                        national_dup = True
                        break
            if national_dup:
                skipped_duplicate += 1
                audit_rows.append(
                    {
                        **ss,
                        "action": "skipped-duplicate",
                        "reason": "pending-state-matches-existing-cms",
                        "ccn": resolved["id"] if resolved else "",
                        "new_id": "",
                        "slugs": "",
                    }
                )
                continue
            decisions.append({"ss": ss, "resolved": resolved, "slugs": [], "pending": True})
            if resolved and resolved["id"] not in live_by_id:
                resolved_new_ccns.add(resolved["id"])
            continue

        skip_reasons = []
        add_slugs = []
        for slug in slugs:
            reason = live_duplicate(
                ss,
                resolved,
                reps[slug].get("facilities") or [],
                slug_ids[slug],
                slug_name_keys[slug],
            )
            if reason:
                skip_reasons.append(f"{slug}:{reason}")
            else:
                add_slugs.append(slug)

        if not add_slugs:
            skipped_duplicate += 1
            audit_rows.append(
                {
                    **ss,
                    "action": "skipped-duplicate",
                    "reason": "; ".join(skip_reasons),
                    "ccn": resolved["id"] if resolved else "",
                    "new_id": "",
                    "slugs": "",
                }
            )
            continue

        decisions.append({"ss": ss, "resolved": resolved, "slugs": add_slugs, "pending": False})
        if resolved and resolved["id"] not in live_by_id:
            resolved_new_ccns.add(resolved["id"])

    physicians_by_ccn: Dict[str, List[dict]] = {}
    try:
        physicians_by_ccn = load_physicians_for_ccns(resolved_new_ccns, catheter_npis)
    except Exception as exc:
        print(f"WARNING: physician load failed ({exc}); continuing with empty lists")

    added_count = 0
    pending_count = 0
    type_counts = Counter()
    encompass_ids: Set[str] = set()
    ccn_ids = 0
    fa_ids = 0
    with_phys = 0
    empty_phys = 0

    for decision in decisions:
        ss = decision["ss"]
        resolved = decision["resolved"]
        new_obj = build_new_facility(
            ss,
            resolved,
            hgi_by_id,
            hai_by_id,
            hac_status,
            hac_detail,
            at_risk,
            hvbp,
            live_by_id,
            physicians_by_ccn,
            city_zip,
        )
        new_id = new_obj["id"]
        # If we cloned a live CMS row, keep that identity; otherwise FA-* / new CCN
        if decision["pending"]:
            pending_by_state[ss["state"]].append(new_obj)
            pending_count += 1
            added_unique[new_id] = new_obj
            type_counts[ss["facility_type"]] += 1
            if is_encompass(ss["name"]) or is_encompass(new_obj.get("name", "")):
                encompass_ids.add(new_id)
            if new_id.startswith("FA-"):
                fa_ids += 1
            else:
                ccn_ids += 1
            if new_obj.get("physicianCount"):
                with_phys += 1
            else:
                empty_phys += 1
            audit_rows.append(
                {
                    **ss,
                    "action": "pending-no-rep",
                    "reason": f"no live slug for {ss['state']}",
                    "ccn": resolved["id"] if resolved else "",
                    "new_id": new_id,
                    "slugs": "",
                }
            )
            continue

        placed = False
        for slug in decision["slugs"]:
            # Re-check in case an earlier row in this run already added it
            if new_id in slug_ids[slug]:
                continue
            name_key = (
                normalize_text(new_obj.get("name", "")),
                normalize_city(new_obj.get("city", "")),
                cell_str(new_obj.get("state", "")).upper()[:2],
            )
            if name_key in slug_name_keys[slug]:
                continue
            obj = deepcopy(new_obj)
            reps[slug]["facilities"].append(obj)
            slug_ids[slug].add(new_id)
            slug_name_keys[slug].add(name_key)
            adds_by_slug[slug].append(obj)
            placed = True
        if not placed:
            skipped_duplicate += 1
            audit_rows.append(
                {
                    **ss,
                    "action": "skipped-duplicate",
                    "reason": "already-added-this-run",
                    "ccn": resolved["id"] if resolved else "",
                    "new_id": new_id,
                    "slugs": "",
                }
            )
            continue

        added_count += 1
        added_unique.setdefault(new_id, new_obj)
        type_counts[ss["facility_type"]] += 1
        if is_encompass(ss["name"]) or is_encompass(new_obj.get("name", "")):
            encompass_ids.add(new_id)
        if new_id.startswith("FA-"):
            fa_ids += 1
        else:
            ccn_ids += 1
        if new_obj.get("physicianCount"):
            with_phys += 1
        else:
            empty_phys += 1
        audit_rows.append(
            {
                **ss,
                "action": "added",
                "reason": "missing-from-slug",
                "ccn": resolved["id"] if resolved else "",
                "new_id": new_id,
                "slugs": ",".join(decision["slugs"]),
            }
        )

    # Write live JSON + output mirrors
    touched_slugs = sorted(adds_by_slug)
    print(f"Writing {len(touched_slugs)} live slug files...")
    for slug in touched_slugs:
        recompute_stats(reps[slug])
        dump_json(PUBLIC_REPS / f"{slug}.json", reps[slug])
        output_path = OUTPUT_REPS / f"{slug}.json"
        if output_path.is_file():
            try:
                mirror = json.loads(output_path.read_text(encoding="utf-8"))
                mirror_ids = {cell_str(f.get("id")) for f in (mirror.get("facilities") or [])}
                appended = 0
                for fac in adds_by_slug[slug]:
                    if fac["id"] not in mirror_ids:
                        mirror.setdefault("facilities", []).append(deepcopy(fac))
                        appended += 1
                if appended:
                    recompute_stats(mirror)
                    dump_json(output_path, mirror)
                    print(f"  output mirror {slug}: +{appended}")
            except Exception as exc:
                print(f"  WARNING: could not update output mirror {slug}: {exc}")
        print(f"  public {slug}: +{len(adds_by_slug[slug])} now {reps[slug]['stats']['facilityCount']}")

    # Pending states
    PENDING_DIR.mkdir(parents=True, exist_ok=True)
    for st, facilities in sorted(pending_by_state.items()):
        facilities_sorted = sorted(
            facilities, key=lambda f: int(f.get("catheterDays") or 0), reverse=True
        )
        payload = {
            "meta": {
                "state": st,
                "generated": utc_now(),
                "source": "Facilities_All.xlsx",
                "facilityCount": len(facilities_sorted),
                "physicianCount": sum(int(f.get("physicianCount") or 0) for f in facilities_sorted),
            },
            "stats": {
                "facilityCount": len(facilities_sorted),
                "totalCatheterDays": sum(int(f.get("catheterDays") or 0) for f in facilities_sorted),
                "physicianCount": sum(int(f.get("physicianCount") or 0) for f in facilities_sorted),
            },
            "facilities": facilities_sorted,
        }
        dump_json(PENDING_DIR / f"{st}.json", payload)
        print(f"  pending {st}: {len(facilities_sorted)}")

    # Manifest counts for touched slugs only; keep totalReps
    if MANIFEST_PATH.is_file() and touched_slugs:
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        total_reps = manifest.get("totalReps", 59)
        by_slug_stats = {
            slug: reps[slug]["stats"] for slug in touched_slugs if slug in reps
        }
        for entry in manifest.get("reps") or []:
            slug = entry.get("slug")
            if slug in by_slug_stats:
                stats = by_slug_stats[slug]
                entry["facilityCount"] = stats["facilityCount"]
                entry["physicianCount"] = stats["physicianCount"]
                entry["highCautiCount"] = stats["highCautiCount"]
                entry["highVolumeCount"] = stats["highVolumeCount"]
                entry["hacPenalizedCount"] = stats["hacPenalizedCount"]
                entry["hacAtRiskCount"] = stats["hacAtRiskCount"]
        manifest["totalReps"] = total_reps
        dump_json(MANIFEST_PATH, manifest)
        print(f"Updated manifest counts for {len(by_slug_stats)} slugs; totalReps={total_reps}")

    # Validate JSON
    print("Validating JSON...")
    for slug in touched_slugs:
        json.loads((PUBLIC_REPS / f"{slug}.json").read_text(encoding="utf-8"))
    for st in pending_by_state:
        json.loads((PENDING_DIR / f"{st}.json").read_text(encoding="utf-8"))
    if MANIFEST_PATH.is_file():
        man = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        assert man.get("totalReps") == 59, man.get("totalReps")

    after_spot = snapshot_ids(
        {s: json.loads((PUBLIC_REPS / f"{s}.json").read_text(encoding="utf-8")) for s in reps},
        SPOT_CHECK_IDS,
    )
    unchanged = []
    for fid in SPOT_CHECK_IDS:
        b, a = before_spot.get(fid), after_spot.get(fid)
        unchanged.append(
            {
                "id": fid,
                "before": b,
                "after": a,
                "catheterDays_unchanged": (b or {}).get("catheterDays") == (a or {}).get("catheterDays"),
            }
        )

    # Audit CSV
    fieldnames = [
        "action",
        "reason",
        "facility_id",
        "name",
        "state",
        "city",
        "facility_type",
        "days",
        "ccn",
        "new_id",
        "slugs",
        "gpo",
        "address",
        "phone",
    ]
    with AUDIT_CSV_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for rec in audit_rows:
            writer.writerow(rec)
    print(f"Wrote {AUDIT_CSV_PATH}")

    slug_add_counts = sorted(
        ((slug, len(items)) for slug, items in adds_by_slug.items()),
        key=lambda x: -x[1],
    )
    unique_added = len(added_unique)
    type_added_unique = Counter()
    for obj in added_unique.values():
        ht = obj.get("hospitalType") or ""
        if ht == "Rehabilitation" or "rehab" in ht.lower():
            type_added_unique["Rehabilitation Hospital"] += 1
        elif "VA" in ht or obj.get("priority") == "VA":
            type_added_unique["VA Medical Center"] += 1
        else:
            type_added_unique["Hospital/ Medical Center"] += 1

    # Unique IDs with CCN vs FA among added_unique
    unique_ccn = sum(1 for i in added_unique if not i.startswith("FA-"))
    unique_fa = sum(1 for i in added_unique if i.startswith("FA-"))
    unique_with_phys = sum(1 for o in added_unique.values() if o.get("physicianCount"))
    unique_empty_phys = unique_added - unique_with_phys

    weak_unique = []
    seen_weak = set()
    for w in weak_skips:
        key = (w["spreadsheet"], w["cms_id"])
        if key in seen_weak:
            continue
        seen_weak.add(key)
        weak_unique.append(w)
    weak_unique = sorted(weak_unique, key=lambda x: -x["score"])[:25]

    pending_summary = {st: len(v) for st, v in sorted(pending_by_state.items())}

    report = f"""# Facilities_All.xlsx backfill report (Sep 2026)

Add-only pass. Existing live CMS hospital rows were not overwritten.
Source: `Facilities_All.xlsx` sheet `Facility_List_1` ({len(df)} rows).
Script: `scripts/map-generator/backfill_facilities_all.py`.
Audit CSV: `prompts/FACILITIES_ALL_BACKFILL_AUDIT_SEP2026.csv`.

## Counts

| Bucket | Count |
|--------|------:|
| Spreadsheet rows | {len(df)} |
| Skipped urology clinics | {skipped_clinic} |
| Skipped other/blank type | {skipped_other} |
| In-scope (hospital / VA / rehab) | {in_scope} |
| Skipped as duplicate of a live pin | {skipped_duplicate} |
| Added onto one or more live slugs (spreadsheet rows) | {added_count} |
| Pending no-rep (MI/DC/other) rows | {pending_count} |
| National unique IDs added (live + pending) | {unique_added} |

### Unique added IDs by spreadsheet type (approx via hospitalType/priority)

| Type | Unique IDs |
|------|----------:|
| Hospital/ Medical Center | {type_added_unique.get('Hospital/ Medical Center', 0)} |
| VA Medical Center | {type_added_unique.get('VA Medical Center', 0)} |
| Rehabilitation Hospital | {type_added_unique.get('Rehabilitation Hospital', 0)} |

Spreadsheet-row type tallies for rows that were added or pending:

| Type | Rows |
|------|-----:|
| Hospital/ Medical Center | {type_counts.get('Hospital/ Medical Center', 0)} |
| VA Medical Center | {type_counts.get('VA Medical Center', 0)} |
| Rehabilitation Hospital | {type_counts.get('Rehabilitation Hospital', 0)} |

## Encompass / HealthSouth

National unique IDs whose name matched Encompass / HealthSouth / affiliate-of-Encompass: **{len(encompass_ids)}**

Live maps had zero Encompass pins before this pass. These IDs are mostly `FA-*` because July 2026 `Hospital_General_Information.csv` has **0** Encompass/HealthSouth rows (IRF rehab is outside that CMS hospital file).

## CCN vs `FA-*` (unique added IDs)

| ID style | Unique IDs |
|----------|----------:|
| CMS CCN (6-digit) | {unique_ccn} |
| `FA-<spreadsheet id>` | {unique_fa} |

New CCNs that were not already on any live slug were eligible for physician join. CCNs that already existed on another slug were cloned from the live CMS object (spreadsheet Days/GPO not merged).

## Physicians (unique added IDs)

| | Unique IDs |
|--|----------:|
| ≥1 physician | {unique_with_phys} |
| `physicians: []` | {unique_empty_phys} |

Physician PUF / affiliation were loaded only for **new** CCNs (not already in the live national index). Encompass rehab without a CCN is expected to have empty physician lists. Physician source files: archive `July2026Data` (`Facility_Affiliation.csv` + Medicare Provider PUF). Catheter HCPCS flags reused `scripts/map-generator/output/catheter_hcpcs_npis.json`.

## Per-slug add counts (top 15)

| Slug | Facilities appended |
|------|--------------------:|
{chr(10).join(f'| `{slug}` | {n} |' for slug, n in slug_add_counts[:15]) or '| _(none)_ | 0 |'}

Touched slugs: {len(touched_slugs)}. `rep-manifest.json` `facilityCount` / `physicianCount` / HAC/CAUTI counts updated for those slugs. **`totalReps` remains 59.**

## Pending states (no live slug)

Wrote `public/data/pending-states/<ST>.json` (uppercase state code). Not registered in `rep-manifest.json`. Not under `public/data/reps/`.

| State | Facilities |
|-------|----------:|
{chr(10).join(f'| {st} | {n} |' for st, n in pending_summary.items()) or '| _(none)_ | 0 |'}

## Weak CMS matches skipped (did not force a CCN)

High-confidence CCN attach required normalized name equality **or** strong token overlap with the same state+city. Below is a short list of the closest misses (score 0.50–0.84). These rows may still have been **added** with `FA-*` if they were not live duplicates.

| Spreadsheet | City, ST | Closest CMS | CCN | Score |
|-------------|----------|-------------|-----|------:|
{chr(10).join(
    f"| {w['spreadsheet']} | {w['city']}, {w['state']} | {w['cms']} | {w['cms_id']} | {w['score']} |"
    for w in weak_unique
) or '| _(none)_ | | | | |'}

## Existing CMS rows unchanged (spot-check)

{chr(10).join(
    f"- `{item['id']}` ({(item['before'] or {}).get('name')}) on `{(item['before'] or {}).get('slug')}`: "
    f"catheterDays {(item['before'] or {}).get('catheterDays')} → {(item['after'] or {}).get('catheterDays')} "
    f"({'unchanged' if item['catheterDays_unchanged'] else 'CHANGED'})"
    for item in unchanged
)}

IDs checked: Barnes Jewish (`260032`), Weirton Medical Center (`510023`), Southeast Health (`010001`) if present.

## Output mirrors

For each touched slug, the same new facility objects were appended to `scripts/map-generator/output/reps/<slug>.json` when that mirror file already existed. Do not copy the output tree over `public/data/reps/` later or Encompass pins will be at risk if a mirror was missing.

## Notes

- Urology clinics: all skipped.
- Mayo-style campus duplicates (rehab row with the same city/days/name family as a live CMS hospital) skipped; Encompass / HealthSouth / “Rehabilitation Hospital of …” still added.
- ZIP: CMS ZIP when a CCN resolved; otherwise the most common ZIP already known for that city+state (live + HGI) so pins are not stuck on the state centroid. Empty ZIP only when the city was unknown to both sources.
- Paul Wilson / `kleamedical.json` / `genesis.json` were not reintroduced.
"""
    REPORT_PATH.write_text(report, encoding="utf-8")
    print(f"Wrote {REPORT_PATH}")
    print("Done.")
    print(f"  clinics skipped={skipped_clinic} duplicates={skipped_duplicate} added_rows={added_count} pending={pending_count}")
    print(f"  unique ids={unique_added} encompass={len(encompass_ids)} ccn={unique_ccn} FA={unique_fa}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
