import pandas as pd
import os
from fuzzywuzzy import process

# --- SETTINGS ---
INPUT_1099 = "1099Master.csv"
INPUT_FMASTER = "FMaster1.csv"
INPUT_AFFIL = "Facility_Affiliation.csv"
INPUT_DAC = "DAC_NationalDownloadableFile.csv"
INPUT_HOSPINFO = "Hospital_General_Information.csv"
OUTPUT_DIR = "Filtered_Facilities"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- LOAD DATA ---
df_1099 = pd.read_csv(INPUT_1099)
df_facility = pd.read_csv(INPUT_FMASTER, dtype=str).fillna("")
df_affil = pd.read_csv(INPUT_AFFIL, dtype=str).fillna("")
df_dac = pd.read_csv(INPUT_DAC, dtype=str).fillna("")
df_hospinfo = pd.read_csv(INPUT_HOSPINFO, dtype=str).fillna("")

def clean_string(s):
    return s.upper().strip().replace(",", "").replace(".", "") if isinstance(s, str) else ""

# Clean for matching
df_facility["State"] = df_facility["State"].apply(clean_string)
df_facility["Facility Name"] = df_facility["Facility Name"].apply(clean_string)
df_facility["City"] = df_facility["City"].apply(clean_string)
df_hospinfo["Facility Name"] = df_hospinfo["Facility Name"].apply(clean_string)
df_hospinfo["State"] = df_hospinfo["State"].apply(clean_string)
df_hospinfo["City/Town"] = df_hospinfo["City/Town"].apply(clean_string)
df_hospinfo["Facility ID"] = df_hospinfo["Facility ID"].astype(str).str.strip()
df_affil["Facility Affiliations Certification Number"] = df_affil["Facility Affiliations Certification Number"].astype(str).str.strip()
df_affil["NPI"] = df_affil["NPI"].astype(str).str.strip()
df_dac["NPI"] = df_dac["NPI"].astype(str).str.strip()
df_dac["Provider Last Name"] = df_dac["Provider Last Name"].fillna("").apply(str)
df_dac["Provider First Name"] = df_dac["Provider First Name"].fillna("").apply(str)
df_dac["pri_spec_clean"] = df_dac["pri_spec"].apply(clean_string)

target_specs = {"UROLOGY", "INFECTIOUS DISEASE"}
dac_npis = set(df_dac[df_dac["pri_spec_clean"].isin(target_specs)]["NPI"])
dac_npi_to_spec = df_dac.set_index("NPI")["pri_spec"].to_dict()
dac_npi_to_first = df_dac.set_index("NPI")["Provider First Name"].to_dict()
dac_npi_to_last = df_dac.set_index("NPI")["Provider Last Name"].to_dict()

summary_rows = []
unique_companies = df_1099["1099 Company"].unique()

def title_case(df):
    for col in df.select_dtypes(include='object').columns:
        df[col] = df[col].map(lambda x: x.title() if isinstance(x, str) else x)
    return df

hospital_names = df_hospinfo["Facility Name"].tolist()

for company in unique_companies:
    company_rows = df_1099[df_1099["1099 Company"] == company]
    state_set = set()
    for geo in company_rows["Geography"]:
        state_set.update([s.strip().upper() for s in str(geo).split(",") if s.strip()])
    if not state_set:
        print(f"⚠️ No states for {company}. Skipping.")
        continue

    filtered_facility = df_facility[df_facility["State"].isin(state_set)].copy()
    facility_combined = filtered_facility.drop_duplicates(subset=["Facility Name", "City", "State"]).reset_index(drop=True)
    if facility_combined.empty:
        print(f"⚠️ No facilities for {company} in states {state_set}. Skipping.")
        continue

    facility_combined = facility_combined.reset_index(drop=True)
    facility_combined["Facility_ID"] = facility_combined.index + 1

    # Fuzzy matching with composite score (name + city + state)
    facility_to_hospid = {}
    facility_to_hospname = {}
    facility_to_match_score = {}

    for idx, row in facility_combined.iterrows():
        fac_name = row["Facility Name"]
        fac_city = clean_string(row["City"])
        fac_state = row["State"]

        # Get top 3 name matches in hospital info
        name_matches = process.extract(fac_name, hospital_names, limit=3)
        best_score = 0
        best_hosp_id = None
        best_hosp_name = ""
        for match_name, name_score in name_matches:
            hosp_rows = df_hospinfo[df_hospinfo["Facility Name"] == match_name]
            for _, hosp_row in hosp_rows.iterrows():
                score = name_score
                hosp_city = hosp_row["City/Town"]
                hosp_state = hosp_row["State"]
                if fac_city and hosp_city and fac_city == hosp_city:
                    score += 30
                if fac_state and hosp_state and fac_state == hosp_state:
                    score += 10
                if score > best_score:
                    best_score = score
                    best_hosp_id = hosp_row["Facility ID"]
                    best_hosp_name = hosp_row["Facility Name"]
        # Accept match if best_score > 100
        if best_hosp_id and best_score > 100:
            facility_to_hospid[row["Facility_ID"]] = best_hosp_id
            facility_to_hospname[row["Facility_ID"]] = best_hosp_name
            facility_to_match_score[row["Facility_ID"]] = best_score
        else:
            facility_to_hospid[row["Facility_ID"]] = None
            facility_to_hospname[row["Facility_ID"]] = ""
            facility_to_match_score[row["Facility_ID"]] = best_score

    # Find all affiliations for these matched facilities
    doctor_rows = []
    for fac_id, hosp_id in facility_to_hospid.items():
        if not hosp_id: continue
        affil_matches = df_affil[df_affil["Facility Affiliations Certification Number"] == hosp_id]
        affil_matches = affil_matches[affil_matches["NPI"].isin(dac_npis)]
        for _, affil_row in affil_matches.iterrows():
            npi = affil_row.get("NPI", "")
            if not npi or npi not in dac_npi_to_first:
                continue
            first = dac_npi_to_first.get(npi, "").title()
            last = dac_npi_to_last.get(npi, "").title()
            specialty = dac_npi_to_spec.get(npi, "")
            doctor_rows.append({
                "Facility_ID": fac_id,
                "Name": f"{first} {last}".strip(),
                "NPI": npi,
                "Primary Specialty": specialty,
                "Matched Facility Name": facility_to_hospname[fac_id]
            })

    matches_df = pd.DataFrame(doctor_rows)
    expected_columns = ["Facility_ID", "Name", "NPI", "Primary Specialty", "Matched Facility Name"]
    if matches_df.empty:
        matches_df = pd.DataFrame(columns=expected_columns)
    else:
        matches_df = matches_df[expected_columns]
        matches_df = title_case(matches_df)

    facility_matched_df = facility_combined.copy()

    # Reorder to put Facility_ID first
    if "Facility_ID" in facility_matched_df.columns:
        fac_cols = ["Facility_ID"] + [c for c in facility_matched_df.columns if c != "Facility_ID"]
        facility_matched_df = facility_matched_df[fac_cols]
    if "Facility_ID" in matches_df.columns:
        doc_cols = ["Facility_ID"] + [c for c in matches_df.columns if c != "Facility_ID"]
        matches_df = matches_df[doc_cols]

    # Sort facility_matched_df by last column (descending)
    last_col = facility_matched_df.columns[-1]
    try:
        facility_matched_df[last_col] = pd.to_numeric(facility_matched_df[last_col], errors="ignore")
    except Exception:
        pass
    facility_matched_df = facility_matched_df.sort_values(by=last_col, ascending=False).reset_index(drop=True)

    # Save Excel
    identifier = str(company).strip().replace(" ", "_").replace("/", "_")
    output_file = os.path.join(OUTPUT_DIR, f"Facilities_{identifier}.xlsx")
    with pd.ExcelWriter(output_file, engine="openpyxl", mode="w") as writer:
        facility_matched_df.to_excel(writer, sheet_name="Facility_List_1", index=False)  # all columns from FMaster1, sorted
        matches_df.to_excel(writer, sheet_name="Doctor_List_1", index=False)  # custom columns

    print(f"  ✅ Wrote: {output_file}")

    summary_rows.append({
        "Company": company,
        "Facilities Matched": len(facility_matched_df),
        "Doctors Matched": len(matches_df),
        "Facility Match Rate": f"{(len(facility_matched_df) / len(filtered_facility) * 100):.1f}%" if len(filtered_facility) else "0%",
        "Doctor Match Rate": f"{(len(matches_df) / len(doctor_rows) * 100):.1f}%" if len(doctor_rows) else "0%"
    })

# Save summary
summary_df = pd.DataFrame(summary_rows)
summary_df.to_excel("Match_Summary.xlsx", index=False)
print("\n📊 Match summary written to Match_Summary.xlsx")
print("\n✅ Matching complete.")