# Visual Quality Overhaul - Developer Agent Prompt

**Date:** February 2026  
**Priority:** 🔴 CRITICAL  
**Scope:** All pages EXCEPT `/rep/[slug]` pages (those are fine — do NOT touch them)

---

## Project Context

Silq Technologies is a high-tech medical device company seeking VC funding. This website must look **premium, modern, and investor-ready**. The site is built with Next.js 14 (App Router), Tailwind CSS, and Framer Motion.

The site has regressed visually. Images that were once acceptable have degraded or were replaced with poor-quality AI-generated/placeholder images. The testimonials—once a visual cornerstone—now look cheap and generic. The overall impression has gone from "promising startup" to "amateur project."

**Your job:** Restore visual quality by replacing degraded images with clean placeholders, overhauling the testimonials presentation, and cleaning up dead code—all while keeping the existing page structure and layout logic intact.

---

## Table of Contents

1. [Image Overhaul Strategy](#1-image-overhaul-strategy)
2. [Complete Image Audit by Page](#2-complete-image-audit-by-page)
3. [Testimonials Overhaul](#3-testimonials-overhaul)
4. [Dead Component Cleanup](#4-dead-component-cleanup)
5. [Page-by-Page Instructions](#5-page-by-page-instructions)
6. [Placeholder Image System](#6-placeholder-image-system)
7. [Files to Modify Summary](#7-files-to-modify-summary)
8. [Acceptance Criteria](#8-acceptance-criteria)

---

## 1. Image Overhaul Strategy

### The Problem

Multiple images across the site are degraded, low-resolution, or poorly generated. Rather than continuing to patch bad images, we are transitioning to a **placeholder image system**. The owner will supply final high-quality images later.

### The Approach

1. **Replace all degraded/questionable images** with styled placeholder containers
2. **Keep images that are confirmed good quality:** logos (`/images/logos/*`), the product box photo (`/images/products/boxnew.jpg`)
3. **Use gradient/branded placeholder boxes** with descriptive labels instead of broken images
4. **Preserve all image `src` paths as comments** so the owner knows what to replace later

### Images to KEEP (confirmed good quality)
- `/images/logos/logo-main.png` — Main header logo
- `/images/logos/logo-oneline.png` — Footer logo
- `/images/logos/silq-monogram.png` — Monogram watermark
- `/images/products/boxnew.jpg` — ClearTract product box photo
- `/images/trust/fda.png` — FDA badge
- `/images/trust/ucla.jpg` — UCLA logo
- `/images/trust/verizon-award.png` — Verizon award badge

### Images to REPLACE with placeholders
- `/images/textures/tech-overview.gif` — Hero background GIF (blurry, distracting)
- `/images/textures/brand-texture-1.jpg` — Products page hero bg
- `/images/textures/brand-texture-2.jpg` — Surface Treatment hero bg
- `/images/science/contact-angle-comparison.jpg` — Key visual on Technology + Surface Treatment pages
- `/images/science/microbial-adhesion.png` — ClearTract benefits card
- `/images/science/encrusted-catheter-comparison.png` — Used on Home page + ClearTract page
- `/images/products/manufacturing-cleanroom.png` — Investors page
- `/images/products/manufacturing-scale.png` — Investors page
- `/images/science/contact-angle.png` — Products page card
- `/images/ui/divider.png` — Decorative divider on Investors page
- `/images/team/*.jpg` — All 6 team member photos (review quality; replace if degraded)

### Source Images Available

The owner has a folder of original/source images at:
```
C:\Users\Ethan\OneDrive\Desktop\Webdev\Images\
```

This contains higher-quality originals (e.g., `Droplet+Angle.jpg.jpeg`, `Surface+Droplet.jpg.jpeg`, `Bacteria Panel.png`, `Encrusted catheter comparison.png`, etc.) that may be used as replacements. However, the filenames are messy (URL-encoded from Squarespace). **Do not use these directly** — the owner will manually select and place final images.

---

## 2. Complete Image Audit by Page

### Home Page (`src/app/page.tsx`)

| Image | Current Path | Status | Action |
|-------|-------------|--------|--------|
| Hero background GIF | `/images/textures/tech-overview.gif` | ❌ Blurry, low quality | Replace: remove `backgroundGif` prop, use gradient-only hero |
| Product box | `/images/products/boxnew.jpg` | ✅ Good | Keep |
| Encrustation comparison | `/images/science/encrusted-catheter-comparison.png` | ❌ Degraded | Replace with placeholder |
| FDA badge | `/images/trust/fda.png` | ✅ Good | Keep |
| UCLA logo | `/images/trust/ucla.jpg` | ✅ Good | Keep |

### Technology Page (`src/app/technology/page.tsx`)

| Image | Current Path | Status | Action |
|-------|-------------|--------|--------|
| Contact angle comparison | `/images/science/contact-angle-comparison.jpg` | ❌ Degraded | Replace with placeholder |
| Demo video | `/videos/silq-technology-demo.mp4` | ✅ OK (video) | Keep |

### Products Landing Page (`src/app/products/page.tsx`)

| Image | Current Path | Status | Action |
|-------|-------------|--------|--------|
| Hero texture bg | `/images/textures/brand-texture-1.jpg` | ❌ Low quality | Remove texture, use gradient-only |
| ClearTract card | `/images/products/boxnew.jpg` | ✅ Good | Keep |
| Surface Treatment card | `/images/science/contact-angle.png` | ❌ Degraded | Replace with placeholder |
| FDA badge | `/images/trust/fda.png` | ✅ Good | Keep |
| UCLA logo | `/images/trust/ucla.jpg` | ✅ Good | Keep |
| Verizon award | `/images/trust/verizon-award.png` | ✅ OK | Keep |

### ClearTract Page (`src/app/products/cleartract/page.tsx`)

| Image | Current Path | Status | Action |
|-------|-------------|--------|--------|
| Product box | `/images/products/boxnew.jpg` | ✅ Good | Keep |
| Microbial adhesion | `/images/science/microbial-adhesion.png` | ❌ Degraded | Replace with placeholder |
| Encrustation comparison | `/images/science/encrusted-catheter-comparison.png` | ❌ Degraded | Replace with placeholder |

### Surface Treatment Page (`src/app/products/surface-treatment/page.tsx`)

| Image | Current Path | Status | Action |
|-------|-------------|--------|--------|
| Hero texture bg | `/images/textures/brand-texture-2.jpg` | ❌ Low quality | Remove texture, use gradient-only |
| Contact angle comparison | `/images/science/contact-angle-comparison.jpg` | ❌ Degraded | Replace with placeholder |

### Team Page (`src/app/about/team/page.tsx`)

| Image | Current Path | Status | Action |
|-------|-------------|--------|--------|
| Monogram watermark | `/images/logos/silq-monogram.png` | ✅ Good | Keep |
| Team photos (6) | `/images/team/*.jpg` | ⚠️ Review | Replace with placeholder if degraded; keep if acceptable |

### Investors Page (`src/app/about/investors/page.tsx`)

| Image | Current Path | Status | Action |
|-------|-------------|--------|--------|
| Divider image | `/images/ui/divider.png` | ❌ Unnecessary | Remove entirely |
| Manufacturing cleanroom | `/images/products/manufacturing-cleanroom.png` | ❌ Likely AI-generated | Replace with placeholder |
| Manufacturing scale | `/images/products/manufacturing-scale.png` | ❌ Likely AI-generated | Replace with placeholder |
| UCLA logo | `/images/trust/ucla.jpg` | ✅ Good | Keep |
| FDA badge | `/images/trust/fda.png` | ✅ Good | Keep |
| Verizon award | `/images/trust/verizon-award.png` | ✅ OK | Keep |

### Contact Page (`src/app/contact/page.tsx`)

| Image | Current Path | Status | Action |
|-------|-------------|--------|--------|
| Monogram watermark | `/images/logos/silq-monogram.png` | ✅ Good | Keep |

### 404 Page (`src/app/not-found.tsx`)

| Image | Current Path | Status | Action |
|-------|-------------|--------|--------|
| Monogram watermark | `/images/logos/silq-monogram.png` | ✅ Good | Keep |

---

## 3. Testimonials Overhaul

### Current State

Testimonials appear on two pages:
- **Home page** (`src/app/page.tsx`, lines 50-66, rendered at lines 202-227)
- **ClearTract page** (`src/app/products/cleartract/page.tsx`, lines 13-29, rendered at lines 152-170)

Both use the same 3 quotes rendered as simple `<div>` cards with italic text. They look:
- Generic and low-effort
- Like placeholder content
- Completely lacking visual hierarchy or credibility signals
- No photos, no visual differentiation, no star ratings, no credential badges

Meanwhile, a `TestimonialsCarousel` component exists at `src/components/sections/TestimonialsCarousel.tsx` but is **not used anywhere**.

### Required Changes

#### Option A: Redesign Inline Testimonials (Recommended)

Replace the current flat card grid with a visually striking testimonial section. Here's the design spec:

```tsx
{/* Testimonials Section - Redesigned */}
<section className="py-20 bg-gradient-to-br from-silq-blue-900 via-silq-dark to-silq-blue-800 text-white relative overflow-hidden">
  {/* Decorative quote mark */}
  <div className="absolute top-8 left-8 opacity-5">
    <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  </div>
  
  <div className="container-silq relative">
    <div className="text-center mb-12">
      <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-teal bg-silq-teal/20 rounded-full">
        Real Experiences
      </span>
      <h2 className="text-display-sm font-bold">
        What People Are Saying
      </h2>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {testimonials.map((t, i) => (
        <motion.div
          key={i}
          className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-colors"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
        >
          {/* Quote icon */}
          <div className="w-10 h-10 rounded-full bg-silq-teal/20 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-silq-teal" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          
          <blockquote className="text-white/90 text-base leading-relaxed mb-6">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            {/* Placeholder avatar */}
            <div className="w-10 h-10 rounded-full bg-silq-teal/30 flex items-center justify-center text-sm font-bold text-white">
              {t.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{t.author}</p>
              <p className="text-white/50 text-xs">{t.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

Key differences from current:
- **Dark gradient background** instead of plain `bg-silq-cream` — adds depth and VC-appeal
- **Glassmorphism cards** with `bg-white/10 backdrop-blur-sm` and border glow
- **Quote icon** on each card for visual hierarchy
- **Avatar initials circle** to add human feel without needing actual photos
- **Section badge** ("Real Experiences") for context
- **Subtle decorative giant quote mark** in background
- **Border-separated attribution** for clean hierarchy

#### Apply to Both Pages

Apply this same design to:
1. `src/app/page.tsx` — Section 4 (lines 202-227)
2. `src/app/products/cleartract/page.tsx` — Testimonials section (lines 152-170)

On the ClearTract page, change the section heading from "What Patients Say" to "What People Are Saying" for consistency (or keep it different if you prefer — both are fine).

---

## 4. Dead Component Cleanup

### Components NOT Used Anywhere

The following components exist in `src/components/sections/` but are **NOT imported or used by ANY page file**:

| Component | File | Status |
|-----------|------|--------|
| `TestimonialsCarousel` | `TestimonialsCarousel.tsx` | ❌ Unused — remove or optionally repurpose |
| `ScienceShowcase` | `ScienceShowcase.tsx` | ❌ Unused — remove |
| `ResearchEvidence` | `ResearchEvidence.tsx` | ❌ Unused — remove |
| `ImageTextSplit` | `ImageTextSplit.tsx` | ❌ Unused — remove |
| `FeatureGrid` | `FeatureGrid.tsx` | ❌ Unused — remove |
| `VideoShowcase` | `VideoShowcase.tsx` | ❌ Unused — remove |
| `TrustLogos` | `TrustLogos.tsx` | ❌ Unused — remove |
| `MetricsStrip` | `MetricsStrip.tsx` | ❌ Unused — remove |

### Action Items

1. **Delete** the 8 unused component files listed above
2. **Update** `src/components/sections/index.ts` to remove the exports for deleted components
3. The barrel file should only export what's actually used:

```ts
// src/components/sections/index.ts — AFTER cleanup
export { Hero } from './Hero'
export { TeamGrid } from './TeamGrid'
export { ContactForm } from './ContactForm'
export { InvestorForm } from './InvestorForm'
export { CTABanner } from './CTABanner'
export { Accordion } from './Accordion'
```

---

## 5. Page-by-Page Instructions

### 5.1 Home Page (`src/app/page.tsx`)

**Changes:**

1. **Remove `backgroundGif` prop from Hero** — The GIF is blurry and distracting. Use the gradient-only hero instead:
   ```tsx
   // BEFORE:
   backgroundGif="/images/textures/tech-overview.gif"
   
   // AFTER: Remove this line entirely. Optionally add:
   gradientAnimation={true}
   ```

2. **Replace encrustation image** in Section 3 with a placeholder:
   ```tsx
   // BEFORE:
   <Image
     src="/images/science/encrusted-catheter-comparison.png"
     alt="Encrustation comparison"
     width={400}
     height={200}
     className="rounded-lg w-full"
   />
   
   // AFTER: Replace with branded placeholder
   {/* TODO: Replace with actual encrustation comparison image */}
   <div className="w-full h-48 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10">
     <div className="text-center">
       <svg className="w-8 h-8 mx-auto text-white/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
       </svg>
       <p className="text-xs text-white/40">Encrustation Comparison</p>
     </div>
   </div>
   ```

3. **Overhaul testimonials** (Section 4) — Use the redesigned testimonials from [Section 3](#3-testimonials-overhaul) above

### 5.2 Technology Page (`src/app/technology/page.tsx`)

**Changes:**

1. **Replace contact angle comparison image** with a placeholder:
   ```tsx
   // BEFORE:
   <Image
     src="/images/science/contact-angle-comparison.jpg"
     alt="Contact angle comparison across materials"
     width={1000}
     height={400}
     className="rounded-2xl shadow-lg"
   />
   
   // AFTER:
   {/* TODO: Replace with actual contact angle comparison image */}
   <div className="w-full h-64 md:h-80 rounded-2xl shadow-lg bg-gradient-to-br from-silq-cream to-silq-blue/5 flex items-center justify-center border border-silq-dark/10">
     <div className="text-center">
       <svg className="w-12 h-12 mx-auto text-silq-blue/20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.772.136a17.996 17.996 0 01-6.366-.001l-.772-.136c-1.717-.293-2.3-2.379-1.067-3.61L12 15" />
       </svg>
       <p className="text-sm text-silq-dark/30 font-medium">Contact Angle Comparison</p>
       <p className="text-xs text-silq-dark/20 mt-1">Image will be provided</p>
     </div>
   </div>
   ```

### 5.3 Products Landing Page (`src/app/products/page.tsx`)

**Changes:**

1. **Remove texture background** from hero — Replace the `<Image>` overlay in the hero with nothing (the gradient is sufficient):
   ```tsx
   // DELETE this block (lines 38-44):
   <div className="absolute inset-0 opacity-10 pointer-events-none">
     <Image
       src="/images/textures/brand-texture-1.jpg"
       alt=""
       fill
       className="object-cover"
     />
   </div>
   ```

2. **Replace Surface Treatment card image** — The `contact-angle.png` reference in the products array:
   ```tsx
   // BEFORE:
   image: '/images/science/contact-angle.png',
   
   // AFTER: Use a placeholder or null and handle in render
   image: null, // TODO: Replace with actual surface treatment image
   ```
   
   Then update the card rendering to handle null images with a branded placeholder:
   ```tsx
   {product.image ? (
     <Image src={product.image} alt={product.title} fill className="object-cover ..." />
   ) : (
     <div className="w-full h-full bg-gradient-to-br from-silq-blue/10 to-silq-teal/10 flex items-center justify-center">
       <div className="text-center p-6">
         <svg className="w-12 h-12 mx-auto text-silq-blue/30 mb-2" ...>...</svg>
         <p className="text-sm text-silq-dark/30 font-medium">{product.title}</p>
       </div>
     </div>
   )}
   ```

### 5.4 ClearTract Page (`src/app/products/cleartract/page.tsx`)

**Changes:**

1. **Replace microbial adhesion image** in benefits card (line 117-123):
   ```tsx
   // BEFORE:
   <Image src="/images/science/microbial-adhesion.png" ... />
   
   // AFTER: Branded placeholder
   {/* TODO: Replace with actual microbial adhesion comparison image */}
   <div className="w-full h-48 rounded-xl bg-gradient-to-br from-silq-cream to-silq-blue/5 flex items-center justify-center border border-silq-dark/5">
     <div className="text-center">
       <svg className="w-10 h-10 mx-auto text-silq-blue/20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
       </svg>
       <p className="text-xs text-silq-dark/30">Microbial Adhesion Data</p>
     </div>
   </div>
   ```

2. **Replace encrustation comparison image** in benefits card (line 139-145) — Same placeholder pattern as above but with label "Encrustation Comparison"

3. **Overhaul testimonials** — Use the redesigned testimonials from [Section 3](#3-testimonials-overhaul)

### 5.5 Surface Treatment Page (`src/app/products/surface-treatment/page.tsx`)

**Changes:**

1. **Remove texture background image** from hero (lines 15-22):
   ```tsx
   // DELETE:
   <div className="absolute inset-0 opacity-20">
     <Image src="/images/textures/brand-texture-2.jpg" alt="" fill className="object-cover" />
   </div>
   ```

2. **Replace contact angle comparison image** (lines 61-67):
   ```tsx
   // BEFORE:
   <Image src="/images/science/contact-angle-comparison.jpg" ... />
   
   // AFTER: Same placeholder pattern as Technology page
   ```

### 5.6 Team Page (`src/app/about/team/page.tsx`)

**Changes:**

1. **Audit team photos** — Check each of the 6 images in `/images/team/`:
   - `verne-sharma.jpg`
   - `jack-kavanaugh.jpg`
   - `richard-kaner.jpg`
   - `brian-mcverry.jpg`
   - `mahi-desilva.jpg`
   - `robert-snukal.jpg`
   
   If they are real photos and look acceptable, **keep them**. If any look AI-generated or degraded, replace with an initials-based placeholder:
   ```tsx
   // Placeholder for team member with no photo:
   <div className="w-full h-full bg-gradient-to-br from-silq-blue/20 to-silq-teal/10 flex items-center justify-center">
     <span className="text-5xl font-bold text-silq-blue/30">
       {member.name.split(' ').map(n => n[0]).join('')}
     </span>
   </div>
   ```

### 5.7 Investors Page (`src/app/about/investors/page.tsx`)

**Changes:**

1. **Remove decorative divider image** (lines 25-33):
   ```tsx
   // DELETE this entire block:
   <div className="mt-8 flex justify-center">
     <Image src="/images/ui/divider.png" alt="" width={200} height={20} className="opacity-50" />
   </div>
   ```
   Replace with a CSS divider if any visual break is needed:
   ```tsx
   <div className="mt-8 flex justify-center">
     <div className="w-24 h-1 bg-gradient-to-r from-silq-blue to-silq-teal rounded-full" />
   </div>
   ```

2. **Replace manufacturing images** (lines 137-169) — Both `manufacturing-cleanroom.png` and `manufacturing-scale.png`:
   ```tsx
   // Replace each <Image> with:
   {/* TODO: Replace with actual manufacturing facility photo */}
   <div className="w-full h-64 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center rounded-t-2xl border border-white/10">
     <div className="text-center">
       <svg className="w-10 h-10 mx-auto text-white/20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
       </svg>
       <p className="text-xs text-white/30">Facility Photo</p>
     </div>
   </div>
   ```

### 5.8 Contact Page (`src/app/contact/page.tsx`)

**No image changes needed.** The contact page only uses the monogram watermark which is fine.

### 5.9 404 Page (`src/app/not-found.tsx`)

**No changes needed.** This page is clean.

---

## 6. Placeholder Image System

### Reusable Placeholder Component

Create a small utility component to standardize placeholders across the site:

**File:** `src/components/ui/ImagePlaceholder.tsx`

```tsx
import { cn } from '@/lib/utils'

interface ImagePlaceholderProps {
  label: string
  sublabel?: string
  className?: string
  variant?: 'light' | 'dark'
  icon?: 'image' | 'science' | 'building' | 'shield'
}

const icons = {
  image: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
  ),
  science: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A17.996 17.996 0 0112 21a17.996 17.996 0 01-6.365-1.397c-1.717-.293-2.3-2.379-1.067-3.61L12 15" />
  ),
  building: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  ),
  shield: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  ),
}

export function ImagePlaceholder({
  label,
  sublabel = 'Image will be provided',
  className,
  variant = 'light',
  icon = 'image',
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl',
        variant === 'light'
          ? 'bg-gradient-to-br from-silq-cream to-silq-blue/5 border border-silq-dark/5'
          : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10',
        className
      )}
    >
      <div className="text-center p-4">
        <svg
          className={cn(
            'w-10 h-10 mx-auto mb-2',
            variant === 'light' ? 'text-silq-blue/20' : 'text-white/20'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {icons[icon]}
        </svg>
        <p className={cn(
          'text-sm font-medium',
          variant === 'light' ? 'text-silq-dark/30' : 'text-white/30'
        )}>
          {label}
        </p>
        <p className={cn(
          'text-xs mt-1',
          variant === 'light' ? 'text-silq-dark/20' : 'text-white/20'
        )}>
          {sublabel}
        </p>
      </div>
    </div>
  )
}
```

**Usage examples:**
```tsx
<ImagePlaceholder label="Contact Angle Comparison" icon="science" className="w-full h-64" />
<ImagePlaceholder label="Manufacturing Facility" icon="building" variant="dark" className="w-full h-64" />
<ImagePlaceholder label="Encrustation Data" icon="shield" className="w-full h-48" />
```

---

## 7. Files to Modify Summary

| File | Action | Priority |
|------|--------|----------|
| `src/components/ui/ImagePlaceholder.tsx` | **CREATE** — New placeholder component | Critical |
| `src/app/page.tsx` | Remove GIF bg, replace encrustation image, overhaul testimonials | Critical |
| `src/app/products/cleartract/page.tsx` | Replace 2 science images, overhaul testimonials | Critical |
| `src/app/technology/page.tsx` | Replace contact angle image | High |
| `src/app/products/page.tsx` | Remove texture bg, replace surface treatment card image | High |
| `src/app/products/surface-treatment/page.tsx` | Remove texture bg, replace contact angle image | High |
| `src/app/about/investors/page.tsx` | Remove divider, replace manufacturing images | High |
| `src/app/about/team/page.tsx` | Audit team photos, replace if degraded | Medium |
| `src/components/sections/index.ts` | Remove dead exports | Medium |
| `src/components/sections/TestimonialsCarousel.tsx` | **DELETE** — Unused | Low |
| `src/components/sections/ScienceShowcase.tsx` | **DELETE** — Unused | Low |
| `src/components/sections/ResearchEvidence.tsx` | **DELETE** — Unused | Low |
| `src/components/sections/ImageTextSplit.tsx` | **DELETE** — Unused | Low |
| `src/components/sections/FeatureGrid.tsx` | **DELETE** — Unused | Low |
| `src/components/sections/VideoShowcase.tsx` | **DELETE** — Unused | Low |
| `src/components/sections/TrustLogos.tsx` | **DELETE** — Unused | Low |
| `src/components/sections/MetricsStrip.tsx` | **DELETE** — Unused | Low |

---

## 8. Acceptance Criteria

### Image Quality
- [ ] No blurry/degraded images visible on any non-rep page
- [ ] Hero background GIF removed from home page
- [ ] All texture background images removed (heroes use gradients only)
- [ ] Science images replaced with branded placeholders
- [ ] Manufacturing images replaced with branded placeholders
- [ ] Decorative divider image removed from investors page
- [ ] Product box photo (`boxnew.jpg`) still intact and looking good
- [ ] All logos (FDA, UCLA, Verizon, Silq) still intact
- [ ] Every replaced image has a `{/* TODO: Replace with actual ... */}` comment

### Testimonials
- [ ] Home page testimonials use redesigned dark gradient section with glassmorphism cards
- [ ] ClearTract page testimonials use same redesigned pattern
- [ ] Testimonial cards include quote icon, avatar initials, and border-separated attribution
- [ ] Testimonials section has clear visual hierarchy and looks premium

### Dead Code
- [ ] 8 unused section components deleted
- [ ] `src/components/sections/index.ts` updated to only export used components
- [ ] No import errors anywhere
- [ ] No orphaned component files

### New Component
- [ ] `ImagePlaceholder` component created at `src/components/ui/ImagePlaceholder.tsx`
- [ ] Component supports `light` and `dark` variants
- [ ] Component supports 4 icon types: image, science, building, shield
- [ ] Component is used consistently across all placeholder replacements

### General
- [ ] `npm run build` succeeds with no errors
- [ ] No console warnings about missing images
- [ ] All pages load and render correctly
- [ ] Mobile responsive — all changes work on mobile viewports
- [ ] Rep pages (`/rep/*`) are completely untouched

---

## Testing Checklist

1. Navigate to every non-rep page and visually verify no degraded images appear
2. Verify home page hero uses gradient animation (no blurry GIF)
3. Verify testimonials on home page look premium (dark bg, glassmorphism cards)
4. Verify testimonials on ClearTract page match the same design
5. Verify all placeholder boxes display correctly with appropriate icons and labels
6. Verify all trust badges/logos still render correctly
7. Verify `boxnew.jpg` product image still displays correctly
8. Navigate to `/rep/proactive` and verify nothing changed
9. Run `npm run build` — should succeed
10. Check mobile viewport on all pages
11. Search codebase for imports of deleted components — should find none

---

## Important Notes

- **DO NOT modify any files in `src/app/rep/`** — Rep pages are complete and approved
- **DO NOT delete any image files** from `public/images/` — just stop referencing the degraded ones. The owner may reuse the paths later.
- **PRESERVE all original image `src` values as TODO comments** so the owner knows what to replace
- This is a **visual quality** overhaul. Do not change page structure, routing, content copy, or functionality
- The site should still feel fast, clean, and VC-attractive after these changes

---

*This overhaul restores visual credibility while the owner sources high-quality imagery. Every placeholder is clearly labeled for easy replacement later.*
