# Dev Agent Prompt: Interactive Contact Angle Chart & UI Updates

**Priority:** 🔴 HIGH  
**Created:** 2026-02-18  
**Goal:** Create interactive contact angle chart, widen video cards, add ordering button

**IMPORTANT:** Push and commit all changes when finished.

---

## TASK 1: Copy Contact Angle Images to Public Folder

Copy all images from `C:\Users\Ethan\OneDrive\Desktop\Webdev\drive-download-20260218T025407Z-1-001` to `public/images/science/contact-angles/`

```bash
# Create directory
mkdir -p public/images/science/contact-angles

# Copy images (rename for consistency)
copy "C:\Users\Ethan\OneDrive\Desktop\Webdev\drive-download-20260218T025407Z-1-001\*.jpg" "public\images\science\contact-angles\"
```

**Files to copy:**
- `Nylon Contorl.jpg` → `nylon-control.jpg`
- `Nylon Mod.jpg` → `nylon-treated.jpg`
- `PDMS Control.jpg` → `silicone-control.jpg` (Note: PDMS = Silicone)
- `PDMS Mod.jpg` → `silicone-treated.jpg`
- `Polyethylene Control.jpg` → `polyethylene-control.jpg`
- `Polyethylene Mod.jpg` → `polyethylene-treated.jpg`
- `Polystyrene Control.jpg` → `polystyrene-control.jpg`
- `Polystyrene Mod.jpg` → `polystyrene-treated.jpg`
- `PVC Control.jpg` → `pvc-control.jpg`
- `PVC Mod.jpg` → `pvc-treated.jpg`

---

## TASK 2: Create Interactive Contact Angle Chart Component

**Create:** `src/components/ui/ContactAngleChart.tsx`

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface MaterialData {
  name: string
  displayName: string
  untreatedAngle: string
  treatedAngle: string
  untreatedImage: string
  treatedImage: string
}

const materials: MaterialData[] = [
  {
    name: 'silicone',
    displayName: 'Silicone (PDMS)',
    untreatedAngle: '108°',
    treatedAngle: '32°',
    untreatedImage: '/images/science/contact-angles/silicone-control.jpg',
    treatedImage: '/images/science/contact-angles/silicone-treated.jpg',
  },
  {
    name: 'nylon',
    displayName: 'Nylon',
    untreatedAngle: '72°',
    treatedAngle: '25°',
    untreatedImage: '/images/science/contact-angles/nylon-control.jpg',
    treatedImage: '/images/science/contact-angles/nylon-treated.jpg',
  },
  {
    name: 'polyethylene',
    displayName: 'Polyethylene',
    untreatedAngle: '95°',
    treatedAngle: '28°',
    untreatedImage: '/images/science/contact-angles/polyethylene-control.jpg',
    treatedImage: '/images/science/contact-angles/polyethylene-treated.jpg',
  },
  {
    name: 'polystyrene',
    displayName: 'Polystyrene',
    untreatedAngle: '87°',
    treatedAngle: '22°',
    untreatedImage: '/images/science/contact-angles/polystyrene-control.jpg',
    treatedImage: '/images/science/contact-angles/polystyrene-treated.jpg',
  },
  {
    name: 'pvc',
    displayName: 'PVC',
    untreatedAngle: '82°',
    treatedAngle: '26°',
    untreatedImage: '/images/science/contact-angles/pvc-control.jpg',
    treatedImage: '/images/science/contact-angles/pvc-treated.jpg',
  },
]

interface ContactAngleChartProps {
  className?: string
}

export function ContactAngleChart({ className = '' }: ContactAngleChartProps) {
  const [selectedImage, setSelectedImage] = useState<{
    src: string
    material: string
    type: 'untreated' | 'treated'
    angle: string
  } | null>(null)

  return (
    <div className={className}>
      {/* Table */}
      <div className="bg-gradient-to-br from-silq-cream to-white rounded-2xl p-6 border border-silq-dark/5 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-silq-dark/50 border-b border-silq-dark/10">
              <th className="pb-3 font-medium text-xs uppercase tracking-wider">Material</th>
              <th className="pb-3 font-medium text-center text-xs uppercase tracking-wider" colSpan={2}>
                Contact Angle
              </th>
            </tr>
            <tr className="text-left text-silq-dark/40 border-b border-silq-dark/5">
              <th className="pb-2"></th>
              <th className="pb-2 font-normal text-xs text-center">Untreated</th>
              <th className="pb-2 font-normal text-xs text-center">Treated</th>
            </tr>
          </thead>
          <tbody className="text-silq-dark">
            {materials.map((material, i, arr) => (
              <tr 
                key={material.name} 
                className={`${i < arr.length - 1 ? 'border-b border-silq-dark/5' : ''} hover:bg-silq-blue/[0.02] transition-colors`}
              >
                <td className="py-3 font-medium">{material.displayName}</td>
                <td className="py-3 text-center">
                  <button
                    onClick={() => setSelectedImage({
                      src: material.untreatedImage,
                      material: material.displayName,
                      type: 'untreated',
                      angle: material.untreatedAngle,
                    })}
                    className="text-silq-dark/60 hover:text-silq-blue hover:underline cursor-pointer transition-colors"
                  >
                    {material.untreatedAngle}
                  </button>
                </td>
                <td className="py-3 text-center">
                  <button
                    onClick={() => setSelectedImage({
                      src: material.treatedImage,
                      material: material.displayName,
                      type: 'treated',
                      angle: material.treatedAngle,
                    })}
                    className="inline-flex items-center gap-1.5 text-silq-teal font-semibold hover:underline cursor-pointer transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-silq-teal" />
                    {material.treatedAngle}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-silq-dark/40 mt-4 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Click any angle to view the contact angle measurement. Lower = more hydrophilic.
        </p>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-silq-cream border-b border-silq-dark/10">
                <h3 className="font-semibold text-silq-dark">
                  {selectedImage.material} — {selectedImage.type === 'untreated' ? 'Untreated' : 'Silq Treated'}
                </h3>
                <p className="text-sm text-silq-dark/60">
                  Contact Angle: <span className={selectedImage.type === 'treated' ? 'text-silq-teal font-semibold' : ''}>{selectedImage.angle}</span>
                </p>
              </div>
              <div className="relative aspect-[4/3]">
                <Image
                  src={selectedImage.src}
                  alt={`${selectedImage.material} ${selectedImage.type} contact angle`}
                  fill
                  className="object-contain bg-white"
                />
              </div>
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-4 py-2 text-sm font-medium text-silq-dark/70 hover:text-silq-dark transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

**Export from index.ts:**
```tsx
// Add to src/components/ui/index.ts
export { ContactAngleChart } from './ContactAngleChart'
```

---

## TASK 3: Technology Page Updates

**File:** `src/app/technology/page.tsx`

### 3A: Widen 3-Card Row

Change the grid from `max-w-5xl` to `max-w-6xl` for more width.

**Find:**
```jsx
<div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
```

**Change to:**
```jsx
<div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
```

### 3B: Update Card Subtitles

**Find Enhanced Lubricity card:**
```jsx
<h3 className="text-lg font-bold text-silq-blue">Enhanced Lubricity</h3>
<p className="text-silq-dark/70 text-sm mt-1">Improved patient comfort.</p>
```

**Change to:**
```jsx
<h3 className="text-lg font-bold text-silq-blue">Enhanced Lubricity</h3>
<p className="text-silq-dark/70 text-sm mt-1">Easier insertions</p>
```

**Find Enhanced Hydrophilicity card:**
```jsx
<h3 className="text-lg font-bold text-silq-blue">Enhanced Hydrophilicity</h3>
<p className="text-silq-dark/70 text-sm mt-1">Water-attracting surface prevents fouling.</p>
```

**Change to:**
```jsx
<h3 className="text-lg font-bold text-silq-blue">Enhanced Hydrophilicity</h3>
<p className="text-silq-dark/70 text-sm mt-1">Extended wetting time</p>
```

### 3C: Replace Contact Angle Table with Interactive Component

**Add import at top:**
```jsx
import { ContactAngleChart } from '@/components/ui/ContactAngleChart'
```

**Find the existing contact angle table section (around lines 44-88) and replace with:**
```jsx
{/* Left: Interactive Contact Angle Chart */}
<div>
  <h2 className="text-display-sm font-bold text-silq-dark mb-4">
    Multi-Substrate Compatibility
  </h2>
  <p className="text-silq-dark/70 mb-8">
    Our treatment demonstrates consistent performance across multiple polymer substrates.
  </p>
  
  <ContactAngleChart />
</div>
```

---

## TASK 4: Surface Treatment Services Page Updates

**File:** `src/app/products/surface-treatment/page.tsx`

### 4A: Widen 3-Card Row

Same change as Technology page:

**Find:**
```jsx
<div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
```

**Change to:**
```jsx
<div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
```

### 4B: Update Card Subtitles

Same changes as Technology page - update "Enhanced Lubricity" and "Enhanced Hydrophilicity" subtitles.

### 4C: Replace Surface Wettability Section with Interactive Chart

**Add import at top:**
```jsx
import { ContactAngleChart } from '@/components/ui/ContactAngleChart'
```

**Find the Surface Wettability section (around lines 184-214) and replace entirely:**

```jsx
{/* Contact Angle Chart */}
<div className="mt-12 bg-white rounded-2xl p-8 shadow-lg max-w-5xl mx-auto">
  <div className="grid md:grid-cols-2 gap-8 items-start">
    <div>
      <h3 className="text-xl font-bold text-silq-blue mb-4">Surface Wettability</h3>
      <p className="text-silq-dark/70 mb-6">
        Our treatment dramatically reduces contact angle across multiple substrate materials, 
        creating highly hydrophilic surfaces that resist protein and bacterial adhesion.
      </p>
      <ul className="space-y-2">
        <li className="flex items-center gap-2 text-sm text-silq-dark/70">
          <span className="w-2 h-2 bg-silq-blue rounded-full flex-shrink-0"></span>
          Lower contact angle = more hydrophilic
        </li>
        <li className="flex items-center gap-2 text-sm text-silq-dark/70">
          <span className="w-2 h-2 bg-silq-teal rounded-full flex-shrink-0"></span>
          Click any value to see the measurement
        </li>
      </ul>
    </div>
    <ContactAngleChart />
  </div>
</div>
```

---

## TASK 5: ClearTract Page - Add Ordering Information Button

**File:** `src/app/products/cleartract/page.tsx`

### 5A: Add Button to CTA Banner at Bottom

Find the CTABanner component at the bottom of the page and add an ordering button.

**Find:**
```jsx
<CTABanner
  title="Ready to Try ClearTract?"
  description="Request samples or speak with our team."
  cta={{ text: 'Request Samples', href: '/contact' }}
  secondaryCta={{ text: 'View Technology', href: '/technology' }}
  variant="gradient"
/>
```

**Change to (add third CTA or modify the existing ones):**

Since CTABanner may not support 3 buttons, add an inline section before the CTABanner:

```jsx
{/* Ordering CTA Section */}
<section className="py-12 bg-white">
  <div className="container-silq">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-silq-dark mb-4">Ready to Order?</h2>
      <p className="text-silq-dark/70 mb-6">
        Contact our team to discuss ordering options and availability.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/contact">
          <Button variant="primary" size="lg">Request Samples</Button>
        </Link>
        <Link href="/contact?inquiry=ordering">
          <Button variant="teal" size="lg">Ordering Information</Button>
        </Link>
      </div>
    </div>
  </div>
</section>

<CTABanner
  title="Learn About Our Technology"
  cta={{ text: 'View Technology', href: '/technology' }}
  secondaryCta={{ text: 'Contact Us', href: '/contact' }}
  variant="gradient"
/>
```

---

## TASK 6: Approximate Contact Angles from Images

When viewing the images, estimate the contact angles based on the droplet shape:
- **< 30°**: Very flat droplet, almost completely spread
- **30-60°**: Moderate spread, dome shape
- **60-90°**: More spherical, partial spread
- **> 90°**: Spherical to beaded, minimal spread (hydrophobic)

**Use these approximate values (adjust as needed after viewing images):**

| Material | Untreated | Treated |
|----------|-----------|---------|
| Silicone (PDMS) | 108° | 32° |
| Nylon | 72° | 25° |
| Polyethylene | 95° | 28° |
| Polystyrene | 87° | 22° |
| PVC | 82° | 26° |

---

## CHECKLIST

- [ ] Images copied to `public/images/science/contact-angles/`
- [ ] `ContactAngleChart.tsx` component created
- [ ] Component exported from `index.ts`
- [ ] Technology page: 3-card row widened to `max-w-6xl`
- [ ] Technology page: Lubricity subtitle = "Easier insertions"
- [ ] Technology page: Hydrophilicity subtitle = "Extended wetting time"
- [ ] Technology page: Interactive contact angle chart integrated
- [ ] STS page: 3-card row widened to `max-w-6xl`
- [ ] STS page: Same subtitle updates
- [ ] STS page: Surface Wettability uses interactive chart (replaces droplet image)
- [ ] ClearTract page: Ordering Information button added
- [ ] All changes committed and pushed

---

## FINAL STEP

```bash
cd C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website
git add .
git commit -m "Interactive contact angle chart, video card widening, ordering button"
git push origin main staging
```
