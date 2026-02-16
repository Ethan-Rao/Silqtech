# Rep Page Map Generation Strategy
## Developer Agent Handoff Document

**Prepared:** February 2026  
**Purpose:** Comprehensive strategy for automated rep page generation with interactive facility maps  
**Target:** Integrate 1099Master.csv data into Next.js rep pages with CAUTI-focused Plotly maps  
**Status:** ✅ Data sources analyzed, generation script created, ready for implementation

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Data Architecture](#2-data-architecture)
3. [Key Metrics & Prioritization](#3-key-metrics--prioritization)
4. [Generated Script Overview](#4-generated-script-overview)
5. [Rep Page Specification](#5-rep-page-specification)
6. [Implementation Tasks for Dev Agent](#6-implementation-tasks-for-dev-agent)
7. [First Rep: Proactive Representation (NY)](#7-first-rep-proactive-representation-ny)
8. [UX Requirements for Sales Reps](#8-ux-requirements-for-sales-reps)

---

## 1. Executive Summary

### Goal
Create a **sales-focused facility targeting system** that shows each rep:
1. **High-CAUTI facilities** - Hospitals performing worse than national benchmark (immediate sales opportunity)
2. **High-volume facilities** - Hospitals with the most catheter days (largest potential customers)
3. **Relevant physicians** - Urologists and Infectious Disease specialists at each facility

### Data Sources Available (All Copied to `scripts/map-generator/data/`)

| File | Purpose | Key Fields |
|------|---------|------------|
| `1099Master.csv` | Rep roster | Company, Geography (states), Email, URL |
| `Healthcare_Associated_Infections-Hospital.csv` | CAUTI metrics | Catheter days, SIR, "Worse than Benchmark" flag |
| `Hospital_General_Information.csv` | Hospital metadata | Address, phone, ownership type |
| `DAC_NationalDownloadableFile.csv` | Physician specialties | NPI, pri_spec (UROLOGY, INFECTIOUS DISEASE) |
| `Facility_Affiliation.csv` | Doctor-hospital links | NPI → Facility Certification Number |
| `Premier.xlsx` | Premier GPO membership | Facility Name → Premier |
| `Vizient_Full.xlsx` | Vizient GPO membership | Member Name → Vizient ID |

### Ready-to-Run Script
The Python generation script is complete: `scripts/map-generator/generate-rep-data.py`

---

## 2. Data Architecture

### 2.1 Healthcare-Associated Infections Data (CORE)

**File:** `Healthcare_Associated_Infections-Hospital.csv`  
**Size:** 171,182 rows (multiple measures per hospital)  
**Key Insight:** This is the **primary ranking source** for facility prioritization.

**CAUTI-Specific Measures (HAI_2_*):**

| Measure ID | Description | Use Case |
|------------|-------------|----------|
| `HAI_2_DOPC` | **Urinary Catheter Days** | Primary ranking metric - larger = bigger opportunity |
| `HAI_2_SIR` | Standardized Infection Ratio | Performance vs. benchmark |
| `HAI_2_NUMERATOR` | Observed CAUTI cases | Actual infections |
| `HAI_2_ELIGCASES` | Predicted CAUTI cases | Expected based on case mix |

**Benchmark Status Values:**
- `"Better than the National Benchmark"` - Low priority (they're doing well)
- `"No Different than National Benchmark"` - Standard priority
- `"Worse than the National Benchmark"` - **HIGH PRIORITY** (immediate opportunity)
- `"Not Available"` - Limited data

**Sample Data Row:**
```csv
010001,SOUTHEAST HEALTH MEDICAL CENTER,1108 ROSS CLARK CIRCLE,DOTHAN,AL,36301,HOUSTON,(334) 793-8701,
HAI_2_DOPC,Catheter Associated Urinary Tract Infections: Number of Urinary Catheter Days,
Better than the National Benchmark,15644,,10/01/2023,09/30/2024
```

### 2.2 Hospital General Information

**File:** `Hospital_General_Information.csv`  
**Size:** 5,383 hospitals

**Key Fields:**
- `Facility ID` - Links to HAI data (e.g., "010001")
- `Facility Name`, `Address`, `City/Town`, `State`, `ZIP Code`
- `Hospital Type` - "Acute Care Hospitals", etc.
- `Hospital Ownership` - "Government", "Proprietary", "Voluntary non-profit"
- `Emergency Services` - Yes/No
- `Hospital overall rating` - 1-5 stars

### 2.3 Physician Affiliation Data

**File:** `Facility_Affiliation.csv`  
**Size:** 1,593,329 affiliations

**Structure:**
```csv
NPI,Ind_PAC_ID,Provider Last Name,Provider First Name,Provider Middle Name,suff,
facility_type,Facility Affiliations Certification Number,Facility Type Certification Number
```

**Key Insight:** The `Facility Affiliations Certification Number` maps to `Facility ID` in hospital data.

### 2.4 Physician Specialty Data

**File:** `DAC_NationalDownloadableFile.csv`  
**Size:** ~200MB+ (huge file)

**Key Fields:**
- `NPI` - National Provider Identifier (links to affiliations)
- `Provider First Name`, `Provider Last Name`
- `pri_spec` - Primary specialty (filter for "UROLOGY", "INFECTIOUS DISEASE")

**Target Specialties:**
- `UROLOGY` - Directly manages catheterized patients
- `INFECTIOUS DISEASE` - CAUTI prevention champions, often drive purchasing decisions

### 2.5 GPO Membership Data

**Premier.xlsx Columns:**
```
Facility Name, Facility Address, City, State, Phone
```

**Vizient_Full.xlsx Columns:**
```
Member ID, LIC, GLN, HIN, Member Name, Address, City, State, Zip Code, Member Phone,
System ID, System Name, Parent ID, Parent Name, Facility Category, Facility Type...
```

---

## 3. Key Metrics & Prioritization

### 3.1 Facility Priority Ranking

The rep map should sort/color facilities by **sales opportunity priority:**

| Priority | Color | Criteria | Rep Action |
|----------|-------|----------|------------|
| **HIGH_CAUTI** | 🔴 Red | SIR status = "Worse than the National Benchmark" | **Immediate outreach** - facility has documented CAUTI problem |
| **HIGH_VOLUME** | 🔵 Blue | Top 10% by catheter days | **Large opportunity** - high catheter usage = high potential |
| **VA** | 🟠 Orange | Name contains "VA MEDICAL" or "VETERANS" | **Special process** - requires VA contracting |
| **STANDARD** | 🟢 Green | All others | Normal prospecting |

### 3.2 Catheter Days Analysis

From Healthcare_Associated_Infections data, we rank by `HAI_2_DOPC` (catheter days):
- **High-use threshold:** 90th percentile nationally
- A hospital with 15,000+ catheter days/year is a large potential account
- A hospital with 50,000+ catheter days is an enterprise target

### 3.3 CAUTI Problem Identification

Hospitals flagged as **"Worse than the National Benchmark"** for CAUTI have:
1. Public quality ratings showing infection issues
2. Financial penalties (CMS HAC Reduction Program)
3. Strong motivation to adopt new solutions like ClearTract

**Count found in data:** ~200+ hospitals nationally are "Worse than Benchmark"

---

## 4. Generated Script Overview

### 4.1 Location & Execution

**Script:** `silq-website/scripts/map-generator/generate-rep-data.py`

**Run Command:**
```bash
cd silq-website/scripts/map-generator
python generate-rep-data.py
```

**Required Dependencies:**
```bash
pip install pandas numpy openpyxl
```

### 4.2 Script Workflow

```
1. Load 1099Master.csv (rep roster)
2. Load Healthcare_Associated_Infections-Hospital.csv
   → Pivot CAUTI measures (HAI_2_*) per facility
   → Extract catheter days, SIR, benchmark status
3. Load Hospital_General_Information.csv
   → Get hospital type, ownership
4. Load GPO data (Premier.xlsx, Vizient_Full.xlsx)
   → Map facility names to GPO membership
5. Load physician data (DAC + Affiliation)
   → Filter to UROLOGY and INFECTIOUS DISEASE
   → Map NPIs to hospital IDs
6. For each rep:
   → Filter facilities to rep's territory states
   → Sort by priority (HIGH_CAUTI > HIGH_VOLUME > VA > STANDARD)
   → Generate JSON with facility list + stats
7. Write output/reps/{slug}.json and output/rep-manifest.json
```

### 4.3 Output JSON Schema

**Per-rep file (`output/reps/proactive.json`):**
```json
{
  "meta": {
    "slug": "proactive",
    "company": "Proactive Representation",
    "name": "Mike Krym",
    "email": "mikekrym@proactiverep.com",
    "territory": ["NY"],
    "generated": "2026-02-08T12:00:00Z",
    "dataVersion": "08_2025"
  },
  "stats": {
    "facilityCount": 163,
    "totalCatheterDays": 1250000,
    "highCautiCount": 12,
    "highVolumeCount": 25,
    "physicianCount": 287
  },
  "facilities": [
    {
      "id": "330214",
      "name": "NYU LANGONE HOSPITALS",
      "address": "550 FIRST AVENUE",
      "city": "NEW YORK",
      "state": "NY",
      "zipCode": "10016",
      "phone": "(212) 263-7300",
      "hospitalType": "Acute Care Hospitals",
      "ownership": "Voluntary non-profit - Private",
      "gpo": "Vizient (MS1301)",
      "catheterDays": 45000,
      "observedCAUTI": 15,
      "predictedCAUTI": 18.5,
      "sir": 0.81,
      "cautiStatus": "Better than the National Benchmark",
      "priority": "HIGH_VOLUME",
      "physicians": [
        {"name": "John Smith", "npi": "1234567890", "specialty": "Urology"},
        {"name": "Jane Doe", "npi": "0987654321", "specialty": "Infectious Disease"}
      ],
      "physicianCount": 2
    }
  ],
  "mapConfig": {
    "priorityColors": {
      "HIGH_CAUTI": "#e41a1c",
      "HIGH_VOLUME": "#377eb8",
      "STANDARD": "#4daf4a",
      "VA": "#ff7f00"
    },
    "facilityTypes": ["Acute Care Hospitals", "Critical Access Hospitals"]
  }
}
```

---

## 5. Rep Page Specification

### 5.1 Page Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER (Silq Nav - White)                                               │
├─────────────────────────────────────────────────────────────────────────┤
│  HERO SECTION (Dark gradient)                                            │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Company: Proactive Representation                              │    │
│  │  Territory: NY                                                  │    │
│  │  📍 163 Facilities | 🔴 12 High-CAUTI | 📊 1.25M Catheter Days  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────────┤
│  PRIORITY LEGEND (Sticky)                                                │
│  🔴 High CAUTI (Immediate)  🔵 High Volume  🟠 VA  🟢 Standard          │
├─────────────────────────────────────────────────────────────────────────┤
│  INTERACTIVE MAP (Plotly)                                                │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  [Clustered markers - click to expand]                         │    │
│  │  [Box select to highlight facilities]                          │    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────────┤
│  FILTER CONTROLS                                                         │
│  [ ] Show HIGH_CAUTI only  [ ] Show HIGH_VOLUME  [Search: ____]         │
├─────────────────────────────────────────────────────────────────────────┤
│  FACILITIES TABLE (Sorted by priority)                                   │
│  ┌────────┬──────────────┬─────────┬──────────┬──────┬────────────┐    │
│  │ Status │ Hospital     │ City    │ Cath Days│ CAUTI│ Physicians │    │
│  ├────────┼──────────────┼─────────┼──────────┼──────┼────────────┤    │
│  │ 🔴     │ ABC Hospital │ NYC     │ 45,000   │ 1.87 │ [View 5]   │    │
│  │ 🔵     │ XYZ Medical  │ Buffalo │ 32,000   │ 0.92 │ [View 3]   │    │
│  └────────┴──────────────┴─────────┴──────────┴──────┴────────────┘    │
├─────────────────────────────────────────────────────────────────────────┤
│  PDF DOWNLOADS                                                           │
│  [📄 Product Brochure] [📄 Clinical Data] [📄 Ordering Guide] [📄 IFU] │
├─────────────────────────────────────────────────────────────────────────┤
│  QUICK RESOURCES                                                         │
│  [ClearTract® Info] [Technology] [Contact Support]                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Map Requirements

**Technology:** Plotly.js via `react-plotly.js`

**Must-Have Features:**
1. **Clustered markers** at zoom levels 1-6
2. **Color-coded by priority** (see priorityColors)
3. **Hover tooltip:** Facility name + key stats
4. **Click:** Expand cluster or show facility detail card
5. **Box/lasso select:** Highlight multiple facilities
6. **Auto-bounds:** Fit to rep's territory states

**Nice-to-Have:**
- State boundary outlines
- "Highlight Area" button (from original system)
- Export selected facilities to CSV

### 5.3 Table Requirements

**Columns:**
1. Priority indicator (colored dot)
2. Hospital Name (searchable)
3. City
4. Catheter Days (sortable, formatted with commas)
5. SIR / CAUTI Status (color-coded)
6. GPO Membership
7. Physicians (expandable button)

**Sorting:** Default by Priority → Catheter Days DESC

**Filtering:**
- By priority level
- By state (if multi-state territory)
- Text search on facility name

---

## 6. Implementation Tasks for Dev Agent

### 6.1 Immediate Tasks (In Order)

**TASK 1: Run the Generation Script**
```bash
cd silq-website/scripts/map-generator
pip install pandas numpy openpyxl
python generate-rep-data.py
```

This will create:
- `output/rep-manifest.json` - Index of all reps
- `output/reps/{slug}.json` - Data for each rep

**TASK 2: Copy Output to Public Folder**
```bash
mkdir -p public/data/reps
cp -r scripts/map-generator/output/reps/* public/data/reps/
cp scripts/map-generator/output/rep-manifest.json public/data/
```

**TASK 3: Install Plotly Dependencies**
```bash
npm install react-plotly.js plotly.js
npm install --save-dev @types/react-plotly.js
```

**TASK 4: Create RepMap Component**

Create `src/components/ui/RepMap.tsx`:
```tsx
'use client'

import dynamic from 'next/dynamic'
import { useMemo, useCallback } from 'react'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface Facility {
  id: string
  name: string
  address: string
  city: string
  state: string
  catheterDays: number
  priority: 'HIGH_CAUTI' | 'HIGH_VOLUME' | 'VA' | 'STANDARD'
  lat?: number
  lon?: number
}

interface RepMapProps {
  facilities: Facility[]
  priorityColors: Record<string, string>
  onFacilitySelect?: (facilityId: string) => void
}

export function RepMap({ facilities, priorityColors, onFacilitySelect }: RepMapProps) {
  // TODO: Facilities need geocoding (lat/lon)
  // For now, use ZIP code centroids or state centroids
  
  const data = useMemo(() => [{
    type: 'scattermapbox' as const,
    lat: facilities.map(f => f.lat || 40),  // Need real coordinates
    lon: facilities.map(f => f.lon || -74),
    mode: 'markers' as const,
    marker: {
      size: 12,
      color: facilities.map(f => priorityColors[f.priority] || '#4daf4a'),
      opacity: 0.9
    },
    customdata: facilities.map(f => f.id),
    hovertext: facilities.map(f => 
      `${f.name}\n${f.city}, ${f.state}\n${f.catheterDays.toLocaleString()} catheter days`
    ),
    hovertemplate: '%{hovertext}<extra></extra>',
    cluster: {
      enabled: true,
      maxzoom: 8,
      step: 20,
      size: 45,
      color: 'grey',
      opacity: 0.85
    }
  }], [facilities, priorityColors])

  const layout = useMemo(() => ({
    mapbox: {
      style: 'open-street-map',
      zoom: 5,
      center: { lat: 40.7, lon: -74.0 }  // Calculate from facilities
    },
    margin: { l: 0, r: 0, t: 0, b: 0 },
    autosize: true,
    dragmode: 'select'  // Enable box select
  }), [])

  const handleClick = useCallback((event: any) => {
    if (event.points?.[0]?.customdata && onFacilitySelect) {
      onFacilitySelect(event.points[0].customdata)
    }
  }, [onFacilitySelect])

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg">
      <Plot
        data={data}
        layout={layout}
        config={{ 
          scrollZoom: true, 
          displayModeBar: true,
          modeBarButtonsToRemove: ['lasso2d']
        }}
        style={{ width: '100%', height: '100%' }}
        onClick={handleClick}
      />
    </div>
  )
}
```

**TASK 5: Update Rep Page to Load JSON Data**

Update `src/app/rep/[slug]/page.tsx` to:
1. Load data from `public/data/reps/{slug}.json`
2. Pass to RepMap component
3. Render facilities table with sorting/filtering
4. Show stats in hero section

**TASK 6: Add Geocoding**

The script currently doesn't include lat/lon. Options:
1. **Batch geocode** using ZIP codes → centroid lookup table
2. **Runtime geocoding** via API (rate limited)
3. **Pre-computed dataset** of US hospital coordinates

Recommended: Create a ZIP code centroid lookup or use the existing `geocoded_cache_cleaned.csv` pattern from html6.py.

### 6.2 Files Already Created

| File | Status | Description |
|------|--------|-------------|
| `scripts/map-generator/generate-rep-data.py` | ✅ Created | Main generation script |
| `scripts/map-generator/1099Master.csv` | ✅ Copied | Rep roster |
| `scripts/map-generator/data/hospitals/Healthcare_Associated_Infections-Hospital.csv` | ✅ Copied | CAUTI metrics |
| `scripts/map-generator/data/hospitals/Hospital_General_Information.csv` | ✅ Copied | Hospital info |
| `scripts/map-generator/data/doctors/DAC_NationalDownloadableFile.csv` | ✅ Copied | Physician specialties |
| `scripts/map-generator/data/doctors/Facility_Affiliation.csv` | ✅ Copied | Doctor-hospital links |
| `scripts/map-generator/data/Premier.xlsx` | ✅ Copied | Premier GPO |
| `scripts/map-generator/data/Vizient_Full.xlsx` | ✅ Copied | Vizient GPO |
| `src/app/rep/[slug]/page.tsx` | ✅ Enhanced | Added PDF download section |

### 6.3 Testing Checklist

- [ ] Python script runs without errors
- [ ] JSON output generated for all reps
- [ ] Proactive Representation (NY) has 150+ facilities
- [ ] HIGH_CAUTI facilities appear first in list
- [ ] Physician data populated for major hospitals
- [ ] Rep page loads at `/rep/proactive`
- [ ] Map displays with colored markers
- [ ] Table sorts and filters correctly
- [ ] PDF download buttons present (placeholders OK)
- [ ] Mobile responsive

---

## 7. First Rep: Proactive Representation (NY)

### 7.1 Rep Details

From `1099Master.csv` row 2:
- **Name:** Mike Krym
- **Company:** Proactive Representation
- **Email:** mikekrym@proactiverep.com
- **Geography:** NY
- **URL Slug:** `proactive`

### 7.2 Expected Output

**Page URL:** `/rep/proactive`

**Expected Stats (approximate):**
- ~150-200 facilities in NY
- ~10-20 HIGH_CAUTI facilities
- ~20-30 HIGH_VOLUME facilities
- ~300+ affiliated urologists and ID physicians

### 7.3 Sample High-Priority NY Facilities

Based on data analysis, look for these patterns:
- Large NYC academic centers (high catheter volume)
- Any NY hospital flagged "Worse than National Benchmark" for CAUTI
- VA Medical Centers in NY

---

## 8. UX Requirements for Sales Reps

### 8.1 User Profile

**Sales Reps are:**
- Not technically sophisticated
- Often using mobile devices in the field
- Need to quickly identify "who to call"
- Value visual, intuitive interfaces

### 8.2 Key UX Principles

1. **Visual Priority** - Red dots (HIGH_CAUTI) should POP on the map
2. **One-Click Actions** - Tap facility → see physicians → get phone number
3. **Offline-Friendly** - Consider PWA or downloadable PDF territory sheets
4. **Fast Loading** - Map should render in < 2 seconds
5. **Touch-Friendly** - Large tap targets for mobile

### 8.3 Must-Have Interactions

| Action | Result |
|--------|--------|
| Click map marker | Show facility detail card |
| Click "View Physicians" | Expand physician list inline |
| Box-select on map | Highlight selected facilities in table |
| Search box | Filter table by facility name |
| Sort column header | Re-sort table |
| Click phone number | Initiate call (mobile) |

### 8.4 Data Refresh Process

**Current manual process:**
1. User uploads new `1099Master.csv` to `scripts/map-generator/`
2. User (or CI) runs `python generate-rep-data.py`
3. Output copied to `public/data/reps/`
4. Deploy/rebuild site

**Future automation:**
- GitHub Action on push to data files
- Admin API endpoint to trigger refresh
- Scheduled nightly rebuild

---

## Appendix A: File Locations Summary

| File | Location | Size |
|------|----------|------|
| `1099Master.csv` | `scripts/map-generator/` | 74 reps |
| `Healthcare_Associated_Infections-Hospital.csv` | `scripts/map-generator/data/hospitals/` | 171K rows |
| `Hospital_General_Information.csv` | `scripts/map-generator/data/hospitals/` | 5.4K hospitals |
| `DAC_NationalDownloadableFile.csv` | `scripts/map-generator/data/doctors/` | ~200MB |
| `Facility_Affiliation.csv` | `scripts/map-generator/data/doctors/` | 1.6M affiliations |
| `Premier.xlsx` | `scripts/map-generator/data/` | GPO data |
| `Vizient_Full.xlsx` | `scripts/map-generator/data/` | GPO data |
| `generate-rep-data.py` | `scripts/map-generator/` | Generation script |
| Rep page | `src/app/rep/[slug]/page.tsx` | Dynamic page |

## Appendix B: CAUTI Benchmarks Reference

**What does "Worse than National Benchmark" mean?**

The SIR (Standardized Infection Ratio) compares observed infections to predicted:
- SIR < 1.0 = Fewer infections than expected = **Better**
- SIR = 1.0 = As expected = **No Different**
- SIR > 1.0 = More infections than expected = **Worse**

A hospital marked "Worse than National Benchmark" has statistically significantly MORE CAUTIs than predicted, indicating:
1. A documented infection control issue
2. Potential CMS financial penalties
3. Strong motivation to adopt ClearTract

---

*Document prepared by Planning Agent*  
*Generation script created and data files organized*  
*Ready for Dev Agent implementation*
