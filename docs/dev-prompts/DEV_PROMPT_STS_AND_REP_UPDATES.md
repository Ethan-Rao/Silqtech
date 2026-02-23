# Dev Agent Prompt: STS Page & Rep Portal Updates

**Priority:** Medium  
**Branch:** Push to both `main` AND `staging`  

---

## Overview

Three updates needed:
1. Rename section title on Surface Treatment Services page
2. Fix rep portal export functionality to match button text
3. Update rep directory page stats card

---

## Task 1: Surface Treatment Services - Rename Section

**File:** `src/app/products/surface-treatment/page.tsx`

### Change:
Find the section titled **"Surface Wettability"** and rename it to **"Multi-Substrate Compatibility"**

This better reflects that the section demonstrates the technology's ability to work across different substrate materials (shown in the contact angle chart).

---

## Task 2: Rep Portal - Export Functionality

**File:** `src/app/rep/[slug]/page.tsx`

### Current Issue:
The export button says "Export Facilities Within View" but actually exports ALL facilities regardless of the map's current view/zoom level.

### Recommended Solution: Two Export Buttons

Implement two distinct export options:

```tsx
{/* Export Buttons */}
<div className="flex flex-wrap gap-3">
  <button
    onClick={handleExportAllFacilities}
    className="px-4 py-2 bg-silq-blue text-white rounded-lg hover:bg-silq-blue/90 transition-colors text-sm font-medium flex items-center gap-2"
  >
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    Export All Facilities
  </button>
  
  <button
    onClick={handleExportVisibleFacilities}
    className="px-4 py-2 bg-silq-teal text-white rounded-lg hover:bg-silq-teal/90 transition-colors text-sm font-medium flex items-center gap-2"
  >
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
    Export Visible
  </button>
</div>
```

### Implementation Details:

#### Option A: Simple Approach (Recommended for now)
If implementing true map bounds filtering is complex, keep one button with accurate text:

```tsx
<button onClick={handleExportAllFacilities}>
  Export All Facilities ({repData?.facilities.length || 0})
</button>
```

#### Option B: Full Implementation with Map Bounds
If implementing map-aware export:

1. Track the current map bounds in state
2. When the map is panned/zoomed, update the bounds state
3. Filter facilities by checking if their coordinates fall within the bounds

```tsx
// State for tracking visible facilities
const [mapBounds, setMapBounds] = useState<{
  north: number
  south: number
  east: number
  west: number
} | null>(null)

// Filter facilities within bounds
const getVisibleFacilities = useCallback(() => {
  if (!mapBounds || !repData?.facilities) return repData?.facilities || []
  
  return repData.facilities.filter(facility => {
    if (!facility.lat || !facility.lng) return false
    return (
      facility.lat >= mapBounds.south &&
      facility.lat <= mapBounds.north &&
      facility.lng >= mapBounds.west &&
      facility.lng <= mapBounds.east
    )
  })
}, [mapBounds, repData])

// Export handlers
const handleExportAllFacilities = () => {
  exportToCSV(repData?.facilities || [], 'all_facilities')
}

const handleExportVisibleFacilities = () => {
  const visible = getVisibleFacilities()
  exportToCSV(visible, 'visible_facilities')
}
```

### Data Update Consideration:
The user will need to update `1099Master.csv` and the rep data in the future. Ensure:
- The export function uses the facility data from the loaded JSON
- No hardcoded facility data
- The CSV export includes all relevant fields from the facility objects

### CSV Export Function (ensure this exists):
```tsx
const exportToCSV = (facilities: Facility[], filename: string) => {
  const headers = [
    'Facility Name', 'Address', 'City', 'State', 'ZIP', 'Phone',
    'Priority', 'Catheter Days', 'SIR', 'CAUTI Status', 'GPO', 'Physicians'
  ]
  
  const rows = facilities.map(f => [
    `"${(f.name || '').replace(/"/g, '""')}"`,
    `"${(f.address || '').replace(/"/g, '""')}"`,
    `"${f.city || ''}"`,
    f.state || '',
    f.zipCode || '',
    f.phone || '',
    f.priority || '',
    f.catheterDays || '',
    f.sir || '',
    `"${(f.cautiStatus || '').replace(/"/g, '""')}"`,
    `"${(f.gpo || '').replace(/"/g, '""')}"`,
    f.physicianCount || 0
  ])
  
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
```

---

## Task 3: Rep Directory - Stats Card Update

**File:** `src/app/rep/page.tsx`

### Current:
The stats section shows "Territories" 

### Change to:
**"Total Reps"** - showing the count of available rep portals

Find the stats/cards section and update:
- Label: "Territories" → "Total Reps"
- Keep the count the same (number of available rep entries)

Example:
```tsx
// Before
<div className="text-sm text-silq-dark/60">Territories</div>

// After
<div className="text-sm text-silq-dark/60">Total Reps</div>
```

---

## Commit & Push

```bash
git add -A
git commit -m "Update STS section title, fix rep export buttons, update directory stats"
git push origin main
git push origin main:staging --force
```

---

## Verification Checklist

After deployment:

- [ ] STS page shows "Multi-Substrate Compatibility" instead of "Surface Wettability"
- [ ] Rep portal has clear export button(s) with accurate text
- [ ] Export function generates valid CSV with all facility fields
- [ ] Rep directory page shows "Total Reps" instead of "Territories"
- [ ] All changes visible on staging: `https://hammerhead-app-4p3nq.ondigitalocean.app/`

---

## Notes

- **Future-proofing:** The rep data system is designed to be updated via regenerating JSON files from `1099Master.csv`. No code changes needed for data updates - just regenerate the JSON files.
- **Map bounds export:** If implementing full map-aware filtering is too complex for now, the simple "Export All Facilities" approach is acceptable. We can enhance this in a future iteration.
