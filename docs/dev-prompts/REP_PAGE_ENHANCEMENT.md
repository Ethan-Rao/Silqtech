# Rep Page Enhancement - Developer Agent Prompt

**Date:** February 2026  
**Priority:** High  
**File:** `src/app/rep/[slug]/page.tsx`

---

## Overview

Enhance the rep pages with a comprehensive PDF downloads section in the hero area, restructure the layout to a two-column format, add CSV export functionality, and include video resources at the bottom.

---

## Task 1: PDF Downloads Table in Hero Section (Black Area)

### Current State
The PDF downloads are currently in a light section below the map with only 4 items.

### Required Change
Move the PDF downloads into the dark hero section and expand to include ALL available documents in a structured table format.

### PDF Downloads to Include (Reference: Squarespace Page)

Create a downloads table with these categories:

**Pricing Sheets:**
| Document | File Path (Placeholder) | Description |
|----------|------------------------|-------------|
| Premier Facility Pricing Sheet | `/pdfs/pricing/premier-pricing.pdf` | Pricing for Premier GPO facilities |
| Vizient Facility Pricing Sheet | `/pdfs/pricing/vizient-pricing.pdf` | Pricing for Vizient GPO facilities |
| VA Facility Pricing Sheet | `/pdfs/pricing/va-pricing.pdf` | Pricing for VA Medical Centers |

**Informational Materials:**
| Document | File Path (Placeholder) | Description |
|----------|------------------------|-------------|
| ClearTract IFU | `/pdfs/cleartract-ifu.pdf` | Instructions for Use |
| ClearTract Bi-Fold PDF | `/pdfs/cleartract-bifold.pdf` | Product brochure bi-fold |
| Sales & Marketing Slides | `/pdfs/sales-marketing-slides.pdf` | Sales presentation deck |
| Technology Overview | `/pdfs/technology-overview.pdf` | Platform technology summary |
| Physician & Patient Testimonial PDF | `/pdfs/testimonials.pdf` | Clinical testimonials |

### Implementation Spec

Add a new section INSIDE the dark hero area, below the stats bar:

```tsx
{/* PDF Downloads Table - Inside Hero Section */}
<motion.div 
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.4 }}
  className="mt-12 max-w-5xl mx-auto"
>
  <h3 className="text-xl font-semibold text-white mb-6 text-center">
    Sales Resources & Downloads
  </h3>
  
  {/* Two-column grid for download categories */}
  <div className="grid md:grid-cols-2 gap-8">
    {/* Pricing Sheets Column */}
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
      <h4 className="text-lg font-semibold text-silq-teal mb-4">Pricing Sheets</h4>
      <div className="space-y-3">
        {pricingSheets.map(pdf => (
          <a 
            key={pdf.name}
            href={pdf.path}
            target="_blank"
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-silq-blue/20 flex items-center justify-center text-silq-blue group-hover:bg-silq-blue group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8ZM13,9V3.5L18.5,9Z"/>
              </svg>
            </div>
            <span className="text-white/90 text-sm font-medium group-hover:text-white">
              {pdf.name}
            </span>
          </a>
        ))}
      </div>
    </div>
    
    {/* Informational Materials Column */}
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
      <h4 className="text-lg font-semibold text-silq-teal mb-4">Informational Materials</h4>
      <div className="space-y-3">
        {infoMaterials.map(pdf => (
          <a 
            key={pdf.name}
            href={pdf.path}
            target="_blank"
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-silq-teal/20 flex items-center justify-center text-silq-teal group-hover:bg-silq-teal group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8ZM13,9V3.5L18.5,9Z"/>
              </svg>
            </div>
            <span className="text-white/90 text-sm font-medium group-hover:text-white">
              {pdf.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  </div>
</motion.div>
```

### PDF Data Arrays (Add to component)

```tsx
const pricingSheets = [
  { name: 'Premier Facility Pricing Sheet', path: '/pdfs/pricing/premier-pricing.pdf' },
  { name: 'Vizient Facility Pricing Sheet', path: '/pdfs/pricing/vizient-pricing.pdf' },
  { name: 'VA Facility Pricing Sheet', path: '/pdfs/pricing/va-pricing.pdf' },
]

const infoMaterials = [
  { name: 'ClearTract IFU', path: '/pdfs/cleartract-ifu.pdf' },
  { name: 'ClearTract Bi-Fold PDF', path: '/pdfs/cleartract-bifold.pdf' },
  { name: 'Sales & Marketing Slides', path: '/pdfs/sales-marketing-slides.pdf' },
  { name: 'Technology Overview', path: '/pdfs/technology-overview.pdf' },
  { name: 'Physician & Patient Testimonial', path: '/pdfs/testimonials.pdf' },
]
```

---

## Task 2: Two-Column Layout (Facilities + Map)

### Current State
The map and facilities table are in separate full-width sections, stacked vertically.

### Required Change
Create a two-column layout with:
- **Left Column:** Facilities list/table
- **Right Column:** Interactive map

### Implementation Spec

Replace the separate map and table sections with a combined two-column section:

```tsx
{/* Two-Column: Facilities List (Left) + Map (Right) */}
<section className="section-padding bg-silq-cream">
  <div className="container-silq">
    <div className="text-center mb-10">
      <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
        Territory Coverage
      </p>
      <h2 className="text-display-sm md:text-display font-bold text-silq-dark">
        Facilities & Interactive Map
      </h2>
      <p className="mt-4 text-silq-dark/70 max-w-2xl mx-auto">
        Browse facilities on the left, view them on the map. Click markers or table rows to see details.
      </p>
    </div>
    
    {/* Two Column Grid */}
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column: Facilities Table */}
      <div className="order-2 lg:order-1">
        <div className="bg-white rounded-2xl shadow-lg p-6 h-[700px] overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold text-silq-dark mb-4">Facilities List</h3>
          <div className="flex-1 overflow-auto">
            <FacilitiesTable 
              facilities={facilities}
              onFacilitySelect={(facility) => setSelectedFacility(facility)}
              selectedFacilityId={selectedFacility?.id}
              compact={true}  // Add compact mode prop
            />
          </div>
        </div>
      </div>
      
      {/* Right Column: Map + Export Button */}
      <div className="order-1 lg:order-2">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-silq-dark mb-4">Interactive Map</h3>
          
          <RepMap 
            facilities={facilities}
            territory={meta.territory}
            priorityColors={priorityColors}
            onFacilitySelect={(facility) => setSelectedFacility(facility)}
            selectedFacilityId={selectedFacility?.id}
            onVisibleFacilitiesChange={setVisibleFacilities}  // New prop
          />
          
          {/* Export Button */}
          <button
            onClick={handleExportVisibleFacilities}
            className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-silq-blue text-white rounded-xl font-medium hover:bg-silq-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Facilities in View
          </button>
        </div>
        
        {/* Selected Facility Detail Card */}
        {selectedFacility && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-silq-dark/10"
          >
            {/* ... existing selected facility card content ... */}
          </motion.div>
        )}
      </div>
    </div>
  </div>
</section>
```

---

## Task 3: Export Facilities CSV Functionality

### Required Functionality
When user clicks "Export Facilities in View", generate and download a CSV containing only the facilities currently visible on the map.

### Implementation

Add state and handler to the page component:

```tsx
const [visibleFacilities, setVisibleFacilities] = useState<Facility[]>(facilities)

const handleExportVisibleFacilities = () => {
  // Define CSV columns
  const headers = [
    'Facility Name',
    'Address',
    'City',
    'State',
    'ZIP Code',
    'Phone',
    'Priority',
    'Catheter Days',
    'SIR Score',
    'CAUTI Status',
    'GPO',
    'Physician Count'
  ]
  
  // Build CSV rows
  const rows = visibleFacilities.map(f => [
    `"${f.name}"`,
    `"${f.address}"`,
    `"${f.city}"`,
    f.state,
    f.zipCode,
    f.phone,
    f.priority,
    f.catheterDays,
    f.sir || 'N/A',
    `"${f.cautiStatus}"`,
    `"${f.gpo}"`,
    f.physicianCount
  ])
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${meta.company.replace(/\s+/g, '_')}_facilities_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
```

### RepMap Component Update

Update `src/components/ui/RepMap.tsx` to report visible facilities:

```tsx
interface RepMapProps {
  facilities: Facility[]
  territory: string[]
  priorityColors: Record<string, string>
  onFacilitySelect?: (facility: Facility) => void
  selectedFacilityId?: string
  onVisibleFacilitiesChange?: (facilities: Facility[]) => void  // NEW
}

// Inside the component, after map bounds change:
const handleRelayout = useCallback((event: any) => {
  if (event['mapbox.center'] || event['mapbox.zoom'] || event['mapbox._derived']) {
    // Calculate which facilities are within current map bounds
    const bounds = plotRef.current?.el?.layout?.mapbox?.bounds
    if (bounds && onVisibleFacilitiesChange) {
      const visible = facilities.filter(f => {
        // Check if facility is within bounds
        // This requires lat/lon on facilities - if not available, return all
        return true // TODO: Implement bounds checking when geocoding is added
      })
      onVisibleFacilitiesChange(visible)
    }
  }
}, [facilities, onVisibleFacilitiesChange])
```

**Note:** Full bounds-based filtering requires geocoded facilities (lat/lon). For now, export ALL facilities and add a comment that this will be enhanced when geocoding is implemented.

---

## Task 4: Videos Section at Bottom

### Required Change
Add a videos section at the bottom of the page (above the footer) featuring Silq's key demonstration videos.

### Implementation Spec

```tsx
{/* Videos Section */}
<section className="section-padding bg-white">
  <div className="container-silq">
    <div className="text-center mb-10">
      <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
        Product Demonstrations
      </p>
      <h2 className="text-display-sm md:text-display font-bold text-silq-dark">
        Video Resources
      </h2>
      <p className="mt-4 text-silq-dark/70 max-w-2xl mx-auto">
        Watch demonstrations of ClearTract® technology and hear from physicians and patients.
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Silq Treatment Demo */}
      <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-lg">
        <div className="aspect-video">
          <video 
            src="/videos/silq-demo-v1.mp4"
            controls
            poster="/images/video-posters/silq-demo.jpg"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-silq-dark">Silq Surface Treatment Demo</h3>
          <p className="text-sm text-silq-dark/60 mt-1">See how our zwitterionic coating works</p>
        </div>
      </div>
      
      {/* Frictionless Silicone Demo */}
      <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-lg">
        <div className="aspect-video">
          <video 
            src="/videos/frictionless-silicone-v1.mp4"
            controls
            poster="/images/video-posters/frictionless.jpg"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-silq-dark">Frictionless Silicone</h3>
          <p className="text-sm text-silq-dark/60 mt-1">Reduced friction demonstration</p>
        </div>
      </div>
      
      {/* Contact Lens Demo */}
      <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-lg">
        <div className="aspect-video">
          <video 
            src="/videos/contact-lens-drying.mp4"
            controls
            poster="/images/video-posters/contact-lens.jpg"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-silq-dark">Hydrophilicity Demo</h3>
          <p className="text-sm text-silq-dark/60 mt-1">Contact lens drying comparison</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Task 5: Remove Legacy/Unused Code

### Items to Remove

1. **Old PDF Downloads Section** (lines ~360-436)
   - Remove the entire `{/* PDF Downloads Section */}` that is currently in the light background area
   - This is being replaced by the downloads table in the hero section

2. **Duplicate Video Section** (lines ~314-334)
   - Remove the old conditional vimeoId-based video section
   - Replace with the new multi-video section at the bottom

3. **`repVideos` object** (lines ~61-64)
   - This hardcoded video mapping is no longer needed
   - Videos are now sourced from the public folder

4. **Unused state variable**
   - If `vimeoId` is no longer used, remove the line: `const vimeoId = repVideos[params.slug]`

### Legacy Items to Verify

Check and remove if unused:
- Any references to Squarespace-style embedding
- Old sample request form components (if any exist)
- Deprecated styling classes

---

## File Changes Summary

| File | Action |
|------|--------|
| `src/app/rep/[slug]/page.tsx` | Major restructure |
| `src/components/ui/RepMap.tsx` | Add `onVisibleFacilitiesChange` prop |
| `src/components/ui/FacilitiesTable.tsx` | Add `compact` prop for smaller display |
| `public/pdfs/` | Create folder structure for PDFs (placeholders) |

---

## Folder Structure for PDFs

Create this folder structure in `public/`:

```
public/
└── pdfs/
    ├── pricing/
    │   ├── premier-pricing.pdf (placeholder)
    │   ├── vizient-pricing.pdf (placeholder)
    │   └── va-pricing.pdf (placeholder)
    ├── cleartract-ifu.pdf (placeholder)
    ├── cleartract-bifold.pdf (placeholder)
    ├── sales-marketing-slides.pdf (placeholder)
    ├── technology-overview.pdf (placeholder)
    └── testimonials.pdf (placeholder)
```

For now, create empty placeholder files or simple PDFs with "Coming Soon" text.

---

## Acceptance Criteria

- [ ] PDF downloads table appears in the dark hero section with all 8 documents
- [ ] Two-column layout: Facilities table on left, Map on right
- [ ] "Export Facilities in View" button visible below the map
- [ ] CSV download works and includes all relevant facility data
- [ ] Videos section appears at the bottom with 3 video cards
- [ ] All legacy/duplicate code removed
- [ ] No lint errors
- [ ] Mobile responsive (stacks to single column on small screens)
- [ ] All placeholder PDF paths created

---

## Testing Checklist

1. Navigate to `/rep/proactive`
2. Verify hero section shows stats + PDF downloads table
3. Verify two-column layout on desktop (single column on mobile)
4. Click "Export Facilities in View" and verify CSV downloads
5. Scroll to bottom and verify videos section with 3 videos
6. Test video playback
7. Verify no console errors

---

*End of Dev Agent Prompt*
