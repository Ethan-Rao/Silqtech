# Dev Agent Prompt: Ordering Buttons, Rep Videos, and Full Testimonials

**Priority:** High  
**Branch:** Push to both `main` AND `staging`

---

## Overview

Four updates needed:
1. Homepage: Change "FDA Platform" to "FDA Cleared Platform"
2. ClearTract page & Homepage: Split "Ordering Information" into two buttons
3. Rep Page Template: Add second video (Surface Treatment in Action)
4. Testimonials: Add "Read Full Testimonial" popup functionality with PDF content

---

## Task 1: Homepage - FDA Cleared Platform

**File:** `src/app/page.tsx`

### Change:
Find `label: 'FDA Platform'` and change to `label: 'FDA Cleared Platform'`

---

## Task 2: Split Ordering Information Button

### Affected Files:
- `src/app/page.tsx` (homepage ClearTract section)
- `src/app/products/cleartract/page.tsx`

### Current:
Single "Ordering Information" button

### Change To:
**Two buttons on the same line**, same styling:
- **"Facility Ordering Information"** → links to `/contact`
- **"Patient Ordering Information"** → links to `/contact`

Both buttons should have the same teal styling and be visually balanced.

```tsx
{/* Example implementation */}
<div className="flex flex-wrap gap-3 justify-center">
  <Link href="/contact">
    <Button variant="teal" size="lg">Facility Ordering Information</Button>
  </Link>
  <Link href="/contact">
    <Button variant="teal" size="lg">Patient Ordering Information</Button>
  </Link>
</div>
```

Apply this pattern to ALL locations where "Ordering Information" currently appears:
1. Homepage ClearTract section 
2. ClearTract page (both hero area and bottom CTA section)

---

## Task 3: Rep Page - Add Second Video

**File:** `src/app/rep/[slug]/page.tsx`

### Current:
The Videos Section shows a single video (Silq Technologies Overview - vimeoId="869354523")

### Change:
Add the **"Surface Treatment in Action"** video next to the overview video, displayed side-by-side.

```tsx
{/* Videos Section - Two videos side by side */}
<section className="section-padding bg-white">
  <div className="container-silq">
    <div className="text-center mb-12">
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
    
    {/* Two videos side by side */}
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Overview Video */}
      <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-xl">
        <VideoEmbed 
          vimeoId="869354523"
          title="Silq Technologies Overview"
        />
        <div className="p-6">
          <h3 className="text-xl font-bold text-silq-dark">Silq Technologies Overview</h3>
          <p className="text-silq-dark/60 mt-2">
            See how our zwitterionic coating transforms medical device surfaces.
          </p>
        </div>
      </div>
      
      {/* Surface Treatment in Action */}
      <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-xl">
        <VideoEmbed 
          vimeoId="710986413"
          title="Surface Treatment in Action"
        />
        <div className="p-6">
          <h3 className="text-xl font-bold text-silq-dark">Surface Treatment in Action</h3>
          <p className="text-silq-dark/60 mt-2">
            Watch our coating technology reduce friction and repel contaminants.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Task 4: Full Testimonials with Popup

This is the most complex task. You'll need to:
1. Copy testimonial PDFs to the public folder
2. Create a testimonial popup component
3. Update testimonial data with proper content
4. Add "Read Full Testimonial" button to cards

### Step 4.1: Copy Testimonial PDFs

Copy all PDFs from `C:\Users\Ethan\OneDrive\Desktop\Webdev\Testimonials Full\` to `public/pdfs/testimonials/`

Files to copy:
- `Ana Garcia.pdf`
- `Dulce Garcia.pdf`
- `Evgeniy Kreydin.pdf`
- `Linnehan.pdf`
- `Lora A. Plaskon.pdf`
- `Maria Luisa Trevino.pdf`
- `Matthew Bui.pdf`
- `Stephen, Delores and Nathan Newhouse.pdf`

Rename for web-friendly paths:
- `ana-garcia.pdf`
- `dulce-garcia.pdf`
- `evgeniy-kreydin.pdf`
- `linnehan.pdf`
- `lora-plaskon.pdf`
- `maria-luisa-trevino.pdf`
- `matthew-bui.pdf`
- `newhouse-family.pdf`

### Step 4.2: Create TestimonialModal Component

**File:** `src/components/ui/TestimonialModal.tsx`

Create a modal component that displays the full testimonial content in a popup:

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface TestimonialModalProps {
  isOpen: boolean
  onClose: () => void
  testimonial: {
    fullContent: string
    author: string
    role: string
  }
}

export function TestimonialModal({ isOpen, onClose, testimonial }: TestimonialModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-silq-dark">{testimonial.author}</h3>
                <p className="text-silq-dark/60">{testimonial.role}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6 text-silq-dark/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="text-silq-teal/30 text-5xl font-serif leading-none mb-4">&ldquo;</div>
              <div className="prose prose-lg max-w-none text-silq-dark/80 whitespace-pre-line">
                {testimonial.fullContent}
              </div>
              <div className="text-silq-teal/30 text-5xl font-serif leading-none text-right mt-4">&rdquo;</div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={onClose}
                className="w-full py-3 bg-silq-blue text-white rounded-lg font-medium hover:bg-silq-blue/90 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### Step 4.3: Update Testimonial Data

Read each PDF and extract the full testimonial content. Update the testimonials array with:
- `quote`: Most impactful 1-2 sentences (SHORT - for the card preview)
- `fullContent`: Complete testimonial text from PDF
- `author`: Name
- `role`: Appropriate title (see rules below)
- `initials`: First letter of first and last name

**Role/Title Rules:**
- **Physician testimonials**: Use their medical title and affiliation (from top of PDF)
  - Example: "Evgeniy Kreydin, M.D." → role: "Urologist, Cedars-Sinai"
- **Patient testimonials**: Use one of these based on context:
  - "Long-term ClearTract Patient" (for patients who use the catheter themselves)
  - "Caregiver to ClearTract Patient" (for family members/caregivers)
  - Based on the PDF content, determine which is appropriate

### Step 4.4: Update TestimonialCarousel Component

**File:** `src/components/ui/TestimonialCarousel.tsx`

Add a "Read Full Testimonial" button to each card and modal functionality:

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TestimonialModal } from './TestimonialModal'

interface Testimonial {
  quote: string
  fullContent?: string  // NEW: Full testimonial text
  author: string
  role: string
  initials: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  autoAdvanceMs?: number
  className?: string
}

export function TestimonialCarousel({
  testimonials,
  autoAdvanceMs = 6000,
  className = '',
}: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  // ... existing navigation logic ...

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Card */}
      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            /* ... existing animation props ... */
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            {/* Quote Icon */}
            <div className="text-silq-teal/30 text-4xl font-serif leading-none mb-2">&ldquo;</div>

            {/* Quote Text */}
            <blockquote className="text-white/90 text-lg leading-relaxed mb-4">
              {testimonials[current].quote}
            </blockquote>

            {/* Author + Read Full Button */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-silq-teal/20 flex items-center justify-center">
                  <span className="text-silq-teal font-semibold text-sm">
                    {testimonials[current].initials}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonials[current].author}</p>
                  <p className="text-sm text-white/60">{testimonials[current].role}</p>
                </div>
              </div>
              
              {/* Read Full Testimonial Button - Bottom Right */}
              {testimonials[current].fullContent && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="text-sm text-silq-teal hover:text-silq-teal/80 font-medium transition-colors whitespace-nowrap"
                >
                  Read Full Testimonial →
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots and arrows... */}
      
      {/* Modal */}
      <TestimonialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        testimonial={testimonials[current]}
      />
    </div>
  )
}
```

### Step 4.5: Populate Testimonials with Full Content

Based on reading the PDFs, populate the testimonials. Here's the structure you should use:

**ClearTract Page (`src/app/products/cleartract/page.tsx`):**

```tsx
const testimonials = [
  {
    quote: "ClearTract catheters have made a significant difference in reducing catheter-associated infections in my practice.",
    fullContent: `[FULL TEXT FROM evgeniy-kreydin.pdf]`,
    author: "Evgeniy Kreydin, M.D.",
    role: "Urologist, Cedars-Sinai",
    initials: "EK",
  },
  {
    quote: "[MOST IMPACTFUL LINE FROM ana-garcia.pdf]",
    fullContent: `[FULL TEXT FROM ana-garcia.pdf]`,
    author: "Ana Garcia",
    role: "Long-term ClearTract Patient",  // or "Caregiver" based on content
    initials: "AG",
  },
  {
    quote: "[MOST IMPACTFUL LINE FROM newhouse-family.pdf]",
    fullContent: `[FULL TEXT FROM newhouse-family.pdf]`,
    author: "Stephen Newhouse",
    role: "Caregiver to ClearTract Patient",
    initials: "SN",
  },
  // Add remaining testimonials from PDFs:
  // - Dulce Garcia
  // - Linnehan
  // - Lora A. Plaskon
  // - Maria Luisa Trevino
  // - Matthew Bui
]
```

Update both `src/app/products/cleartract/page.tsx` AND `src/app/page.tsx` with the same testimonial data.

### Export the new component

**File:** `src/components/ui/index.ts`

Add: `export { TestimonialModal } from './TestimonialModal'`

---

## Commit & Push

```bash
# Copy testimonial PDFs
mkdir -p public/pdfs/testimonials
# Copy and rename the PDFs from the Testimonials Full folder

git add -A
git commit -m "Add dual ordering buttons, rep video, and full testimonials with popup"
git push origin main
git push origin main:staging --force
```

---

## Verification Checklist

After deployment:

- [ ] Homepage shows "FDA Cleared Platform" (not "FDA Platform")
- [ ] Homepage ClearTract section has two ordering buttons on same line
- [ ] ClearTract page has two ordering buttons in both locations
- [ ] Both ordering buttons link to `/contact`
- [ ] Rep page shows two videos side by side
- [ ] Second video is "Surface Treatment in Action" (vimeoId="710986413")
- [ ] Testimonial cards show "Read Full Testimonial" button in bottom right
- [ ] Clicking button opens popup with full testimonial content
- [ ] Popup is scrollable for long content
- [ ] Popup closes with X button or clicking outside
- [ ] Patient testimonials have appropriate role titles
- [ ] Card quotes are short and impactful

---

## Notes

- The modal displays text content directly - no PDF viewer needed
- The dev agent should read each PDF to extract the full text
- For physician testimonials, titles are at the TOP of the PDF
- For patient testimonials, titles are at the BOTTOM of the PDF
- Keep card preview quotes SHORT (1-2 impactful sentences max)
- The PDFs do NOT need to be downloadable - just viewable in the popup
