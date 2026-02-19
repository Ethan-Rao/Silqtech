# Dev Agent Prompt: Contact Angle Chart with New Images & Staging Deployment

**Priority:** HIGH  
**Branch:** `staging` (Digital Ocean deploys from staging)  
**Deadline:** Immediate  

---

## Overview

This prompt covers:
1. Copying new contact angle images to the project
2. Building an interactive contact angle chart with all 8 materials
3. UI updates for Technology and Surface Treatment Services pages
4. Pushing all changes to the `staging` branch

---

## Task 1: Copy Contact Angle Images to Project

Copy all images from `C:\Users\Ethan\OneDrive\Desktop\Webdev\drive-download-20260218T025407Z-1-001\` to `silq-website/public/images/science/contact-angles/`

### Files to Copy:

| Material | Untreated Image | Treated Image |
|----------|-----------------|---------------|
| **Nylon** | `Nylon Contorl.jpg` | `Nylon Mod.jpg` |
| **PDMS (Silicone)** | `PDMS Control.jpg` | `PDMS Mod.jpg` |
| **PEEK** | `PEEK Untreated 72.png` | `PEEKTreated35.png` |
| **Polyethylene** | `Polyethylene Control.jpg` | `Polyethylene Mod.jpg` |
| **Polystyrene** | `Polystyrene Control.jpg` | `Polystyrene Mod.jpg` |
| **PVC** | `PVC Control.jpg` | `PVC Mod.jpg` |
| **Stainless Steel** | `StainlessSteelUntreated75.png` | `StainlessSteelTreated33.png` |
| **Titanium** | `TitaniumUntreated68.jpg` | `TitaniumTreated29.jpg` |

Rename files consistently when copying:
- `nylon-untreated.jpg`, `nylon-treated.jpg`
- `pdms-untreated.jpg`, `pdms-treated.jpg`
- `peek-untreated.png`, `peek-treated.png`
- `polyethylene-untreated.jpg`, `polyethylene-treated.jpg`
- `polystyrene-untreated.jpg`, `polystyrene-treated.jpg`
- `pvc-untreated.jpg`, `pvc-treated.jpg`
- `stainless-steel-untreated.png`, `stainless-steel-treated.png`
- `titanium-untreated.jpg`, `titanium-treated.jpg`

---

## Task 2: Create Interactive Contact Angle Chart Component

Create `src/components/ui/ContactAngleChart.tsx`

### Contact Angle Data (from filenames and approximations):

| Material | Untreated (°) | Treated (°) |
|----------|---------------|-------------|
| PDMS (Silicone) | ~105° | ~25° |
| Nylon | ~75° | ~20° |
| PEEK | 72° | 35° |
| Polyethylene | ~95° | ~30° |
| Polystyrene | ~87° | ~22° |
| PVC | ~82° | ~26° |
| Stainless Steel | 75° | 33° |
| Titanium | 68° | 29° |

### Component Requirements:

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Material {
  name: string
  displayName: string
  untreatedAngle: number
  treatedAngle: number
  untreatedImage: string
  treatedImage: string
}

const materials: Material[] = [
  {
    name: 'pdms',
    displayName: 'PDMS (Silicone)',
    untreatedAngle: 105,
    treatedAngle: 25,
    untreatedImage: '/images/science/contact-angles/pdms-untreated.jpg',
    treatedImage: '/images/science/contact-angles/pdms-treated.jpg',
  },
  {
    name: 'nylon',
    displayName: 'Nylon',
    untreatedAngle: 75,
    treatedAngle: 20,
    untreatedImage: '/images/science/contact-angles/nylon-untreated.jpg',
    treatedImage: '/images/science/contact-angles/nylon-treated.jpg',
  },
  {
    name: 'peek',
    displayName: 'PEEK',
    untreatedAngle: 72,
    treatedAngle: 35,
    untreatedImage: '/images/science/contact-angles/peek-untreated.png',
    treatedImage: '/images/science/contact-angles/peek-treated.png',
  },
  {
    name: 'polyethylene',
    displayName: 'Polyethylene',
    untreatedAngle: 95,
    treatedAngle: 30,
    untreatedImage: '/images/science/contact-angles/polyethylene-untreated.jpg',
    treatedImage: '/images/science/contact-angles/polyethylene-treated.jpg',
  },
  {
    name: 'polystyrene',
    displayName: 'Polystyrene',
    untreatedAngle: 87,
    treatedAngle: 22,
    untreatedImage: '/images/science/contact-angles/polystyrene-untreated.jpg',
    treatedImage: '/images/science/contact-angles/polystyrene-treated.jpg',
  },
  {
    name: 'pvc',
    displayName: 'PVC',
    untreatedAngle: 82,
    treatedAngle: 26,
    untreatedImage: '/images/science/contact-angles/pvc-untreated.jpg',
    treatedImage: '/images/science/contact-angles/pvc-treated.jpg',
  },
  {
    name: 'stainless-steel',
    displayName: 'Stainless Steel',
    untreatedAngle: 75,
    treatedAngle: 33,
    untreatedImage: '/images/science/contact-angles/stainless-steel-untreated.png',
    treatedImage: '/images/science/contact-angles/stainless-steel-treated.png',
  },
  {
    name: 'titanium',
    displayName: 'Titanium',
    untreatedAngle: 68,
    treatedAngle: 29,
    untreatedImage: '/images/science/contact-angles/titanium-untreated.jpg',
    treatedImage: '/images/science/contact-angles/titanium-treated.jpg',
  },
]

export function ContactAngleChart() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string
    alt: string
    material: string
    type: 'untreated' | 'treated'
    angle: number
  } | null>(null)

  return (
    <div className="w-full">
      {/* Header Row */}
      <div className="grid grid-cols-3 gap-4 mb-2 text-center">
        <div className="text-sm font-semibold text-silq-dark">Material</div>
        <div className="text-sm font-semibold text-silq-dark">
          Contact Angle
          <div className="flex justify-center gap-8 mt-1 text-xs font-normal text-silq-dark/60">
            <span>Untreated</span>
            <span>Treated</span>
          </div>
        </div>
        <div></div>
      </div>

      {/* Data Rows */}
      <div className="space-y-1">
        {materials.map((material) => (
          <div
            key={material.name}
            className="grid grid-cols-3 gap-4 items-center py-2 px-3 rounded-lg hover:bg-silq-cream/50 transition-colors"
          >
            {/* Material Name */}
            <div className="text-sm font-medium text-silq-dark">
              {material.displayName}
            </div>

            {/* Angles (clickable) */}
            <div className="flex justify-center gap-8">
              <button
                onClick={() => setSelectedImage({
                  src: material.untreatedImage,
                  alt: `${material.displayName} untreated surface`,
                  material: material.displayName,
                  type: 'untreated',
                  angle: material.untreatedAngle,
                })}
                className="text-sm text-silq-blue hover:text-silq-teal hover:underline cursor-pointer font-medium transition-colors"
              >
                {material.untreatedAngle}°
              </button>
              <button
                onClick={() => setSelectedImage({
                  src: material.treatedImage,
                  alt: `${material.displayName} treated surface`,
                  material: material.displayName,
                  type: 'treated',
                  angle: material.treatedAngle,
                })}
                className="text-sm text-silq-teal hover:text-silq-blue hover:underline cursor-pointer font-medium transition-colors"
              >
                {material.treatedAngle}°
              </button>
            </div>

            {/* Visual Bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-silq-blue to-silq-teal rounded-full transition-all"
                  style={{ width: `${100 - (material.treatedAngle / material.untreatedAngle) * 100}%` }}
                />
              </div>
              <span className="text-xs text-silq-dark/50 w-12">
                {Math.round((1 - material.treatedAngle / material.untreatedAngle) * 100)}% ↓
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-silq-dark">{selectedImage.material}</h3>
                  <p className="text-sm text-silq-dark/60">
                    {selectedImage.type === 'untreated' ? 'Untreated Surface' : 'Silq Treated Surface'} — {selectedImage.angle}°
                  </p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="relative aspect-video bg-gray-50">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4 bg-gray-50 text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedImage.type === 'untreated' 
                    ? 'bg-gray-200 text-gray-700' 
                    : 'bg-silq-teal/10 text-silq-teal'
                }`}>
                  {selectedImage.type === 'untreated' ? 'Control' : 'Silq Treated'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

### Export the component:

Add to `src/components/ui/index.ts`:
```ts
export { ContactAngleChart } from './ContactAngleChart'
```

---

## Task 3: Update Technology Page

In `src/app/technology/page.tsx`:

### 3.1 Widen the 3-card row
Change the grid container from `max-w-4xl` to `max-w-5xl`

### 3.2 Enlarge videos by 10%
Change video aspect ratio from `aspect-video` to `aspect-[4/3]`

### 3.3 Update subtitles:
- "Enhanced Lubricity" subtitle → "Easier insertions"
- "Enhanced Hydrophilicity" subtitle → "Extended wetting time"

### 3.4 Replace old contact angle section
Replace the existing contact angle placeholder/chart with the new `<ContactAngleChart />` component

---

## Task 4: Update Surface Treatment Services Page

In `src/app/products/surface-treatment/page.tsx`:

### 4.1 Replace droplet image in "Surface Wettability" section
Replace the droplet image with the `<ContactAngleChart />` component

### 4.2 Clean up blood loop images
Ensure blood loop images use `h-32` fixed height as on Technology page

---

## Task 5: Update ClearTract Page

In `src/app/products/cleartract/page.tsx`:

### 5.1 Add "Ordering Information" button at the bottom
Next to the "Request Samples" button in the final CTA section, add:
```tsx
<Link href="/contact?inquiry=ordering">
  <Button variant="teal" size="lg">
    Ordering Information
  </Button>
</Link>
```

---

## Task 6: Commit and Push to STAGING

**CRITICAL:** Digital Ocean deploys from the `staging` branch, not `main`.

```bash
git add -A
git commit -m "Add interactive contact angle chart with 8 materials, update Technology and STS pages"
git push origin main
git push origin main:staging --force
```

---

## File Summary

### New Files:
- `src/components/ui/ContactAngleChart.tsx`
- `public/images/science/contact-angles/` (8 materials × 2 images = 16 files)

### Modified Files:
- `src/components/ui/index.ts` - export ContactAngleChart
- `src/app/technology/page.tsx` - wider cards, larger videos, new subtitles, contact angle chart
- `src/app/products/surface-treatment/page.tsx` - contact angle chart replaces droplet
- `src/app/products/cleartract/page.tsx` - ordering information button

---

## Verification Checklist

After deployment, verify:

- [ ] Contact angle chart displays all 8 materials
- [ ] Clicking any angle value opens the corresponding image
- [ ] Images load correctly in the modal
- [ ] Technology page videos are 10% larger
- [ ] "Easier insertions" and "Extended wetting time" subtitles appear
- [ ] Surface Treatment Services page shows contact angle chart
- [ ] ClearTract page has "Ordering Information" button at bottom
- [ ] All changes are visible on staging URL: `https://hammerhead-app-4p3nq.ondigitalocean.app/`

---

## Notes for Dev Agent

1. **Image paths:** Ensure all image paths are correct and files are copied to the right location
2. **File extensions:** Preserve original extensions (.jpg, .png) when renaming
3. **Angles:** The angles from filenames (PEEK 72/35, Titanium 68/29, Stainless Steel 75/33) are exact. Others are approximations - adjust if the images clearly show different angles.
4. **Always push to staging:** The production deployment watches the `staging` branch
