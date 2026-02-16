# Comprehensive Site Enhancement Plan
## Silq Technologies Website — Developer Agent Handoff

**Prepared:** February 2026  
**Purpose:** Complete site overhaul for modern, premium, investor-grade presentation  
**Audience:** Developer Agent (implementation-ready specifications)

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Global Enhancements](#2-global-enhancements)
3. [Home Page Enhancements](#3-home-page-enhancements)
4. [Technology Page Overhaul](#4-technology-page-overhaul)
5. [ClearTract Page Restructure](#5-cleartract-page-restructure)
6. [External Coating Solutions Page](#6-external-coating-solutions-page)
7. [About Pages Enhancement](#7-about-pages-enhancement)
8. [Contact Page Enhancement](#8-contact-page-enhancement)
9. [NEW: Rep Pages System](#9-new-rep-pages-system)
10. [Asset Management Summary](#10-asset-management-summary)
11. [Language & Compliance Guidelines](#11-language--compliance-guidelines)
12. [Implementation Sequence](#12-implementation-sequence)
13. [Developer Agent Prompt](#13-developer-agent-prompt)

---

## 1. Executive Summary

### Goals
1. **Modern, premium aesthetic** — Move away from "bland" sections toward visually striking, high-tech design
2. **Clinical data alignment** — Prepare messaging for upcoming Nature Medicine publication
3. **Stronger ClearTract emphasis** — Make flagship product more prominent
4. **More imagery and visual storytelling** — Incorporate new videos, GIF, and scientific images
5. **Sales rep portal** — Add scalable rep page system for territory management
6. **Conservative language** — Remove "proven" claims until publication; use measured language

### Completed Preparation Work
- ✅ Copied `Bacteria Panel.png` → `public/images/science/bacteria-panel.png`
- ✅ Copied `ContactAngleDiagram.png` → `public/images/science/contact-angle-diagram-full.png`
- ✅ Copied `Biocomp.png` → `public/images/science/biocomp-evaluation.png`
- ✅ Copied `Picture1.png` → `public/images/science/biofilm-cascade.png`
- ✅ Copied `manufacturing.png` → `public/images/science/manufacturing.png`
- ✅ Copied new videos to `public/videos/`
- ✅ Created Rep Page template at `src/app/rep/[slug]/page.tsx`

---

## 2. Global Enhancements

### 2.1 Header/Navigation
**File:** `src/components/layout/Header.tsx`

| Enhancement | Specification |
|-------------|---------------|
| White background on load | Remove `bg-transparent` initial state; always use `bg-white` |
| Subtle border on scroll | Add `border-b border-silq-dark/5` after scroll |
| Smooth transitions | Keep `transition-all duration-300` |

**Code Change:**
```tsx
// Line 52-57 — BEFORE:
isScrolled
  ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-silq-dark/5'
  : 'bg-transparent'

// AFTER:
isScrolled
  ? 'bg-white/98 backdrop-blur-md shadow-md shadow-silq-dark/5 border-b border-silq-dark/5'
  : 'bg-white border-b border-silq-dark/5'
```

### 2.2 Typography Enhancement
**File:** `tailwind.config.ts`

Add a new display font weight for hero sections:
```ts
fontWeight: {
  // Add to existing
  'display': '800',
}
```

### 2.3 Section Rhythm
All major sections should follow this spacing pattern:
- Section padding: `py-20 md:py-28 lg:py-32`
- Content max-width: `max-w-7xl mx-auto`
- Heading to content gap: `mb-12 md:mb-16`

### 2.4 Global Animation Upgrades
**File:** `src/components/sections/*.tsx`

Add staggered entrance animations to all grid-based sections:
```tsx
// Add to all feature/grid items
transition={{ duration: 0.5, delay: index * 0.08 }}
```

---

## 3. Home Page Enhancements

**File:** `src/app/page.tsx`

### 3.1 Hero Section
**Current:** GIF background with static content  
**Enhanced:** More dynamic layout with animated elements

**Changes:**
1. Add animated gradient overlay that shifts subtly
2. Keep GIF at 15-20% opacity as texture
3. Add floating particle effect (CSS-only)
4. Make CTAs more prominent with hover animations

```tsx
// Enhanced Hero usage
<Hero
  title="Transforming Surfaces Through"
  highlightedText="Advanced Material Science"
  description="Born out of cutting-edge research at UCLA, our groundbreaking, drug-free technology offers customizable surface modifications for medical devices and industrial components."
  primaryCta={{ text: 'Explore Technology', href: '/technology' }}
  secondaryCta={{ text: 'View ClearTract®', href: '/products/cleartract' }}
  backgroundGif="/images/textures/tech-overview.gif"
  variant="default"
  size="large"
  showParticles={true}  // NEW PROP
  gradientAnimation={true}  // NEW PROP
/>
```

### 3.2 "Innovation That Matters" Section — MAJOR OVERHAUL
**Current:** Bland 4-column grid  
**Enhanced:** Visually striking with icons, animations, and accent colors

**File:** `src/components/sections/FeatureGrid.tsx`

**New Component Specification:**
```tsx
interface EnhancedFeatureGridProps {
  title: string
  subtitle?: string
  description?: string
  features: Feature[]
  columns?: 2 | 3 | 4
  variant?: 'default' | 'gradient' | 'cards' | 'minimal'
  showConnectors?: boolean  // Lines connecting features
  accentPattern?: 'dots' | 'grid' | 'none'
}
```

**Visual Enhancements:**
1. Add subtle background pattern (dots or grid)
2. Each card gets a gradient accent line at bottom
3. Icons animate on hover (scale + color shift)
4. Add small connector lines between cards (optional)
5. Staggered entrance animation

**CSS Classes to Add:**
```css
.feature-card-enhanced {
  @apply relative overflow-hidden;
  @apply before:absolute before:bottom-0 before:left-0 before:right-0;
  @apply before:h-1 before:bg-gradient-to-r before:from-silq-blue before:to-silq-teal;
  @apply before:scale-x-0 before:origin-left before:transition-transform before:duration-500;
}

.feature-card-enhanced:hover::before {
  @apply before:scale-x-100;
}
```

### 3.3 ClearTract Product Section — Increased Prominence
**Current:** Standard ImageTextSplit  
**Enhanced:** Hero-style product showcase

**Changes:**
1. Make it a full-width section with gradient background
2. Add product image with subtle floating animation
3. Include "FDA 510(k) Cleared" badge more prominently
4. Add quick stats strip below

```tsx
{/* Product Showcase — Enhanced */}
<section className="section-padding bg-gradient-to-br from-silq-cream via-white to-silq-cream relative overflow-hidden">
  {/* Subtle background pattern */}
  <div className="absolute inset-0 opacity-30">
    <div className="absolute top-0 right-0 w-96 h-96 bg-silq-blue/10 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-silq-teal/10 rounded-full blur-3xl" />
  </div>
  
  <div className="container-silq relative">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Product Image with Animation */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-silq-blue/20 to-silq-teal/20 rounded-3xl blur-2xl" />
        <Image
          src="/images/products/boxnew.jpg"
          alt="ClearTract Foley Catheter packaging"
          width={600}
          height={600}
          className="relative rounded-2xl shadow-2xl"
        />
        {/* FDA Badge */}
        <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg">
          <Image src="/images/trust/fda.png" alt="FDA Cleared" width={60} height={60} />
        </div>
      </motion.div>
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
          FDA 510(k) Cleared
        </span>
        <h2 className="text-display-sm md:text-display font-bold text-silq-dark mb-6">
          ClearTract® Foley Catheters
        </h2>
        <p className="text-lg text-silq-dark/70 mb-6">
          Our FDA-cleared ClearTract® Foley Catheters utilize patented zwitterionic 
          surface treatment technology to dramatically reduce bacterial adhesion and 
          biofilm formation—without antibiotics.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="/products/cleartract" className="btn-primary">
            Explore ClearTract®
          </a>
          <a href="/contact" className="btn-secondary">
            Request Samples
          </a>
        </div>
      </motion.div>
    </div>
  </div>
</section>
```

### 3.4 Video Section Enhancement
**Current:** Single embedded video  
**Enhanced:** Multi-video showcase with descriptions

```tsx
<VideoShowcase
  subtitle="See the Science"
  title="Technology in Action"
  videos={[
    {
      src: '/videos/silq-demo-v1.mp4',  // NEW video
      title: 'Silq Surface Treatment',
      description: 'Watch how our zwitterionic coating transforms surface properties.',
    },
    {
      src: '/videos/contact-lens-drying.mp4',  // NEW video
      title: 'Hydrophilicity Demonstration',
      description: 'Contact lens drying test shows enhanced wettability.',
    },
    {
      src: '/videos/frictionless-silicone-v1.mp4',  // NEW video
      title: 'Frictionless Silicone',
      description: 'Dramatically reduced friction for improved comfort.',
    },
  ]}
/>
```

### 3.5 Add "Clinical Data Coming Soon" Teaser
**New Section:** After ScienceShowcase

```tsx
{/* Research Preview Banner */}
<section className="py-8 bg-gradient-to-r from-silq-blue/5 via-silq-teal/5 to-silq-blue/5 border-y border-silq-blue/10">
  <div className="container-silq">
    <div className="flex items-center justify-center gap-4 text-center">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-silq-teal rounded-full animate-pulse" />
        <span className="text-sm font-semibold text-silq-teal uppercase tracking-wider">Coming Soon</span>
      </div>
      <p className="text-silq-dark/70">
        <span className="font-semibold text-silq-dark">New clinical data</span> from 
        our peer-reviewed research will be published soon.
        <a href="/technology" className="text-silq-blue hover:underline ml-2">
          Learn about our technology →
        </a>
      </p>
    </div>
  </div>
</section>
```

---

## 4. Technology Page Overhaul

**File:** `src/app/technology/page.tsx`

**Current Issues:**
- Looks "very poor" per owner
- Not showcasing wide applicability
- Missing contact angle demonstrations
- Videos not prominent enough

### 4.1 New Section Order
1. Hero (keep, but enhance)
2. **NEW:** Wide Applicability Showcase (contact angle images)
3. **NEW:** Video Demonstrations Grid
4. UCLA Origins (keep)
5. The Problem: Biofilm Formation (keep, add biofilm-cascade.png)
6. The Solution: Microbial Resistance (keep)
7. Zwitterionic Chemistry (keep)
8. **ENHANCED:** Surface Properties Grid
9. Clinical Impact (keep)
10. **NEW:** Manufacturing Scale Section
11. CTA (update language)

### 4.2 Wide Applicability Section — NEW

```tsx
{/* Wide Applicability Showcase */}
<section className="section-padding bg-gradient-to-br from-silq-dark via-silq-blue-900 to-silq-dark text-white overflow-hidden">
  <div className="container-silq">
    <div className="text-center mb-12">
      <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-teal bg-silq-teal/20 rounded-full">
        Platform Technology
      </span>
      <h2 className="text-display-sm md:text-display font-bold">
        Works Across Multiple Materials
      </h2>
      <p className="mt-4 text-white/70 max-w-2xl mx-auto">
        Our zwitterionic surface treatment dramatically improves wettability on diverse 
        substrate materials, opening possibilities beyond medical devices.
      </p>
    </div>
    
    <div className="max-w-5xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
        <Image
          src="/images/science/contact-angle-diagram-full.png"
          alt="Contact angle comparison showing Silq treatment effectiveness on Silicone, Nylon, Polystyrene, PVC, and other substrates"
          width={1200}
          height={800}
          className="w-full h-auto rounded-xl"
        />
        <p className="text-center text-white/60 text-sm mt-6">
          Water contact angle measurements demonstrate significant improvement in surface 
          wettability after Silq treatment. Lower contact angles indicate more hydrophilic 
          surfaces that resist biofouling.
        </p>
      </div>
    </div>
    
    {/* Material Applications Grid */}
    <div className="grid md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
      {['Silicone', 'Nylon', 'Polystyrene', 'PVC', 'Polyethylene'].map((material, i) => (
        <motion.div 
          key={material} 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-silq-teal/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-silq-teal">✓</span>
          </div>
          <p className="font-semibold">{material}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

### 4.3 Video Demonstrations Section — Enhanced

```tsx
{/* Video Demonstrations */}
<section className="section-padding bg-silq-cream">
  <div className="container-silq">
    <div className="text-center mb-12">
      <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
        See It In Action
      </span>
      <h2 className="text-display-sm md:text-display font-bold text-silq-dark">
        Technology Demonstrations
      </h2>
      <p className="mt-4 text-silq-dark/70 max-w-2xl mx-auto">
        Watch our zwitterionic surface treatment transform material properties in real-time.
      </p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          src: '/videos/silq-demo-v1.mp4',
          title: 'Surface Treatment Process',
          description: 'See how our zwitterionic coating is applied to medical devices.',
        },
        {
          src: '/videos/contact-lens-drying.mp4',
          title: 'Hydrophilicity Test',
          description: 'Contact lens drying comparison shows enhanced wettability.',
        },
        {
          src: '/videos/frictionless-silicone-v1.mp4',
          title: 'Friction Reduction',
          description: 'Dramatically reduced friction for improved comfort.',
        },
      ].map((video, index) => (
        <motion.div 
          key={video.title} 
          className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="aspect-video bg-silq-dark relative overflow-hidden">
            <video
              src={video.src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Play indicator overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                <svg className="w-8 h-8 text-silq-blue ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-silq-dark mb-2">{video.title}</h3>
            <p className="text-silq-dark/60">{video.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

### 4.4 Manufacturing Scale Section — NEW

```tsx
{/* Manufacturing Scale */}
<section className="section-padding bg-white">
  <div className="container-silq">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
          Scalable Manufacturing
        </span>
        <h2 className="text-display-sm md:text-display font-bold text-silq-dark mb-6">
          From Lab to Production
        </h2>
        <p className="text-lg text-silq-dark/70 mb-6">
          We developed a novel high-throughput manufacturing system to apply our 
          zwitterionic treatment to catheters at scale, enabling production volumes 
          that meet worldwide demand.
        </p>
        <ul className="space-y-4">
          {[
            'Ambient temperature UV-light deposition',
            'Compatible with existing manufacturing processes',
            'FDA-cleared production facility',
            'Scalable to meet global demand',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-silq-teal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-silq-dark/70">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative">
        <Image
          src="/images/science/manufacturing.png"
          alt="Silq manufacturing process"
          width={600}
          height={500}
          className="rounded-2xl shadow-xl"
        />
      </div>
    </div>
  </div>
</section>
```

---

## 5. ClearTract Page Restructure

**File:** `src/app/products/cleartract/page.tsx`

### 5.1 Critical Language Updates

| Find | Replace With |
|------|--------------|
| `"Proven Patient Outcomes"` | `"Patient-Reported Improvements"` |
| `"Proven Biocompatibility"` | `"Demonstrated Biocompatibility"` |
| `"significant improvements"` | `"improved experiences"` |

### 5.2 New Section Order

1. **Hero** (keep)
2. **CAUTI Statistics** (keep — problem framing)
3. **Testimonials** (MOVE UP — currently last)
4. **Two-Column Evidence** (NEW — Infection + Encrustation side-by-side)
5. **Patient Experience Stats** (renamed from "Proven Patient Outcomes")
6. **Biocompatibility** (keep at bottom, rename)
7. **Benefits/FAQ** (keep)
8. **Antibiotic Concern** (keep)
9. **Trust Logos + CTA** (keep)

### 5.3 Two-Column Evidence Section — NEW

Use the `bacteria-panel.png` image for infection reduction:

```tsx
{/* Two-Column Value Props */}
<section className="section-padding bg-white">
  <div className="container-silq">
    <div className="text-center mb-12">
      <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
        Designed for Better Outcomes
      </span>
      <h2 className="text-display-sm md:text-display font-bold text-silq-dark">
        Addressing Key Catheter Challenges
      </h2>
      <p className="mt-4 text-silq-dark/70 max-w-2xl mx-auto">
        Our zwitterionic surface treatment targets the two primary causes of catheter complications.
      </p>
    </div>
    
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Infection Reduction Column */}
      <div className="bg-silq-cream rounded-2xl p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-silq-blue/10 flex items-center justify-center text-silq-blue">
            <ShieldIcon className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-silq-dark">Resisting Bacterial Adhesion</h3>
        </div>
        <p className="text-silq-dark/70 mb-6">
          Our patented zwitterionic surface treatment creates a hydration barrier that 
          dramatically reduces the adhesion of pathogenic microbes—helping to prevent 
          biofilm formation at the source, without antibiotics.
        </p>
        <div className="rounded-xl overflow-hidden bg-silq-dark">
          <Image
            src="/images/science/bacteria-panel.png"
            alt="Fluorescent microscopy showing reduced bacterial adhesion on Silq-treated surfaces"
            width={800}
            height={300}
            className="w-full h-auto"
          />
        </div>
        <p className="text-sm text-silq-dark/50 mt-3 italic">
          Fluorescent imaging: Standard silicone (top) vs. Silq-treated silicone (bottom). 
          <a href="https://doi.org/10.1002/adma.202200254" className="text-silq-blue hover:underline ml-1">
            McVerry et al., Advanced Materials, 2022
          </a>
        </p>
      </div>
      
      {/* Encrustation Reduction Column */}
      <div className="bg-silq-cream rounded-2xl p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-silq-blue/10 flex items-center justify-center text-silq-blue">
            <RefreshIcon className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-silq-dark">Designed to Reduce Encrustation</h3>
        </div>
        <p className="text-silq-dark/70 mb-6">
          Mineral buildup (encrustation) leads to catheter blockages, discomfort, and 
          increased infection risk. Our zwitterionic treatment is engineered to help 
          mitigate mineral deposit buildup, aiming to extend catheter life.
        </p>
        <div className="rounded-xl overflow-hidden">
          <Image
            src="/images/science/encrusted-catheter-comparison.png"
            alt="Comparison of encrusted conventional catheter vs ClearTract catheter"
            width={800}
            height={400}
            className="w-full h-auto"
          />
        </div>
        <p className="text-sm text-silq-dark/50 mt-3 italic">
          Visual comparison of catheter encrustation after extended use.
          <span className="block mt-1 text-silq-blue">Additional clinical data coming soon.</span>
        </p>
      </div>
    </div>
  </div>
</section>
```

---

## 6. External Coating Solutions Page

**File:** `src/app/products/coating-solutions/page.tsx`

### 6.1 Enhancements

1. **Add application examples** with images
2. **Include contact angle comparison** showing effectiveness
3. **Add B2B inquiry form** or prominent CTA
4. **Showcase industrial applications** (not just medical)

### 6.2 New Applications Section

```tsx
{/* Application Examples */}
<section className="section-padding bg-silq-cream">
  <div className="container-silq">
    <div className="text-center mb-12">
      <h2 className="text-display-sm md:text-display font-bold text-silq-dark">
        Potential Applications
      </h2>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { title: 'Medical Devices', examples: ['Catheters', 'Stents', 'Implants'] },
        { title: 'Industrial', examples: ['Membranes', 'Filters', 'Sensors'] },
        { title: 'Consumer', examples: ['Contact Lenses', 'Dental', 'Wearables'] },
      ].map((category) => (
        <div key={category.title} className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-silq-dark mb-4">{category.title}</h3>
          <ul className="space-y-2">
            {category.examples.map((example) => (
              <li key={example} className="flex items-center gap-2 text-silq-dark/70">
                <span className="w-1.5 h-1.5 bg-silq-blue rounded-full" />
                {example}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## 7. About Pages Enhancement

### 7.1 Team Page (`src/app/about/team/page.tsx`)

**Enhancements:**
1. Larger team photos with hover effects
2. Add LinkedIn links where available
3. Add "Our Story" timeline section
4. Include company milestones

### 7.2 Investors Page (`src/app/about/investors/page.tsx`)

**Enhancements:**
1. Add market opportunity stats
2. Include regulatory pathway progress
3. Add "Why Invest" expanded section
4. Include publication references

---

## 8. Contact Page Enhancement

**File:** `src/app/contact/page.tsx`

**Enhancements:**
1. Add department-specific contact options
2. Include FAQ accordion
3. Add office location with map
4. Include response time expectations

---

## 9. NEW: Rep Pages System

**Location:** `src/app/rep/[slug]/page.tsx` (CREATED)

### 9.1 Purpose
Sales rep pages provide territory-specific information including:
- Territory overview video
- Interactive facility map (from html6.py generator)
- Facility and physician tables
- Quick resource links

### 9.2 Implementation Notes

The rep page system is designed to:
1. Use dynamic routing (`/rep/[slug]`)
2. Accept map HTML injection from the Squarespace code generator
3. Display territory-specific data
4. Link back to main product/technology pages

### 9.3 Data Integration

To integrate with the existing map generation system (`new maps/html6.py`):

1. Generate HTML using the Python script
2. Inject into the `#map-container` div
3. Style will adapt to site theme

### 9.4 Example URLs
- `/rep/example` — Example template page
- `/rep/dwb` — DWB Medical
- `/rep/[sales-rep-name]` — Any future rep pages

---

## 10. Asset Management Summary

### 10.1 Newly Copied Assets

| Source | Destination | Purpose |
|--------|-------------|---------|
| `Images/Bacteria Panel.png` | `public/images/science/bacteria-panel.png` | ClearTract infection evidence |
| `PosterContent/ContactAngleDiagram.png` | `public/images/science/contact-angle-diagram-full.png` | Technology wide applicability |
| `PosterContent/Biocomp.png` | `public/images/science/biocomp-evaluation.png` | Biocompatibility evidence |
| `PosterContent/Picture1.png` | `public/images/science/biofilm-cascade.png` | Biofilm formation diagram |
| `PosterContent/manufacturing.png` | `public/images/science/manufacturing.png` | Manufacturing scale section |
| `contact_lens_drying_v3.mp4` | `public/videos/contact-lens-drying.mp4` | Technology demo |
| `frictionless_silicone_v1.mp4` | `public/videos/frictionless-silicone-v1.mp4` | Technology demo |
| `silq_demo_v1.mp4` | `public/videos/silq-demo-v1.mp4` | Technology demo |

### 10.2 Existing Assets to Keep

| Asset | Location | Usage |
|-------|----------|-------|
| `tech-overview.gif` | `public/images/textures/` | Hero background |
| `boxnew.jpg` | `public/images/products/` | ClearTract product |
| `encrusted-catheter-comparison.png` | `public/images/science/` | Encrustation evidence |
| `biocompatibility.png` | `public/images/science/` | Safety profile |
| `contact-angle-comparison.jpg` | `public/images/science/` | Technology proof |

---

## 11. Language & Compliance Guidelines

### 11.1 Prohibited Phrases

| ❌ DO NOT USE | ✅ USE INSTEAD |
|---------------|----------------|
| "Proven patient outcomes" | "Patient-reported improvements" |
| "Clinically proven" | "Demonstrated in clinical studies" |
| "Proven to reduce" | "Designed to help reduce" |
| "Eliminates" | "Dramatically reduces" |
| "Prevents infection" | "Resists bacterial adhesion" |
| "Cures" | Never use |

### 11.2 Approved Claim Language

**For Infection Reduction:**
- "Our zwitterionic surface treatment creates a hydration barrier that dramatically reduces the adhesion of pathogenic microbes"
- "Designed to help prevent biofilm formation at the source"
- "Demonstrated reduced bacterial adhesion in peer-reviewed research"

**For Encrustation:**
- "Engineered to help mitigate mineral deposit buildup"
- "Designed to reduce encrustation"
- "Aims to extend catheter life by reducing mineral buildup"

**For Clinical Data:**
- "Clinical data to be published soon"
- "Additional peer-reviewed research coming soon"
- "Validated in peer-reviewed research" (for Advanced Materials 2022)

### 11.3 Citation Requirements

Always cite the Advanced Materials 2022 paper when making claims:
```
McVerry et al., Advanced Materials, 2022
https://doi.org/10.1002/adma.202200254
```

---

## 12. Implementation Sequence

### Phase 1: Foundation (Day 1)
1. ✅ Copy all new assets to public folder
2. ✅ Create Rep Page template
3. Update Header component (white from load)
4. Update FeatureGrid component (enhanced version)
5. Site-wide "proven" language audit and replacement

### Phase 2: Home Page (Day 2)
1. Enhance Hero section
2. Update FeatureGrid to use gradient variant
3. Enhance ClearTract product showcase
4. Add video showcase section
5. Add "Clinical data coming soon" banner

### Phase 3: Technology Page (Day 3)
1. Add Wide Applicability section
2. Add Video Demonstrations grid
3. Add Manufacturing Scale section
4. Update CTA language

### Phase 4: ClearTract Page (Day 4)
1. Update all "proven" language
2. Move Testimonials section up
3. Add Two-Column Evidence section
4. Restructure section order

### Phase 5: Polish (Day 5)
1. Enhance External Coating Solutions page
2. Update About pages
3. Enhance Contact page
4. Test all pages responsive
5. Final language audit

---

## 13. Developer Agent Prompt

```markdown
# Developer Agent: Silq Website Enhancement Implementation

## Your Mission
Implement the comprehensive site enhancement plan for the Silq Technologies website. 
This is an investor-facing medical device company website that must look modern, 
premium, and credible.

## Critical Constraints

### Language Rules (MUST FOLLOW)
- NEVER use "proven patient outcomes" — replace with "patient-reported improvements"
- NEVER use "clinically proven" — replace with "demonstrated in clinical studies"
- NEVER use absolute claims like "eliminates" or "prevents"
- ALWAYS use cautious language: "designed to help reduce", "aims to reduce", "engineered to mitigate"
- Clinical data from Nature Med is UPCOMING — only tease it, don't quote specifics

### Files to Modify
1. `src/components/layout/Header.tsx` — White background from load
2. `src/components/sections/FeatureGrid.tsx` — Enhanced visual version
3. `src/app/page.tsx` — Home page enhancements
4. `src/app/technology/page.tsx` — Major overhaul
5. `src/app/products/cleartract/page.tsx` — Restructure + language fixes

### New Assets Available
- `/images/science/bacteria-panel.png` — For ClearTract infection evidence
- `/images/science/contact-angle-diagram-full.png` — For Technology wide applicability
- `/images/science/biocomp-evaluation.png` — Biocompatibility evidence
- `/images/science/biofilm-cascade.png` — Biofilm formation diagram
- `/images/science/manufacturing.png` — Manufacturing section
- `/videos/contact-lens-drying.mp4` — Demo video
- `/videos/frictionless-silicone-v1.mp4` — Demo video
- `/videos/silq-demo-v1.mp4` — Demo video

### Rep Page Already Created
- `src/app/rep/[slug]/page.tsx` is ready — test at `/rep/example`

## Implementation Checklist

### Header
- [ ] Change initial background from transparent to white
- [ ] Keep smooth scroll behavior
- [ ] Add subtle border on scroll

### Home Page
- [ ] Enhance Hero with particle/gradient effects
- [ ] Use enhanced FeatureGrid variant
- [ ] Make ClearTract section more prominent with floating product image
- [ ] Add VideoShowcase with new videos
- [ ] Add "Clinical data coming soon" banner

### Technology Page
- [ ] Add Wide Applicability section with contact-angle-diagram-full.png
- [ ] Add Video Demonstrations grid
- [ ] Add Manufacturing Scale section with manufacturing.png
- [ ] Update CTA language

### ClearTract Page
- [ ] Find/replace all "proven" language
- [ ] Move TestimonialsCarousel up after CAUTI stats
- [ ] Add Two-Column Evidence section with bacteria-panel.png
- [ ] Rename "Proven Biocompatibility" to "Demonstrated Biocompatibility"

### Final Checks
- [ ] Run `npm run build` — no errors
- [ ] Test all pages responsive (mobile, tablet, desktop)
- [ ] Verify all images load correctly
- [ ] Confirm no "proven patient outcomes" text remains
- [ ] Check all links work

## Do NOT Break
- Existing navigation structure
- FDA clearance references
- Citations to Advanced Materials 2022
- Testimonial content (keep exact quotes)
- Contact form functionality
```

---

## Acceptance Criteria

When complete, the site should:

1. ✅ Header is white from initial page load
2. ✅ No instance of "Proven Patient Outcomes" anywhere
3. ✅ "Proven Biocompatibility" changed to "Demonstrated Biocompatibility"
4. ✅ Bacteria Panel image visible on ClearTract page
5. ✅ Testimonials appear near top of ClearTract page
6. ✅ Two-column infection/encrustation section exists
7. ✅ Technology page features contact angle diagram
8. ✅ Technology page has video demonstration grid
9. ✅ "Innovation That Matters" section is visually enhanced
10. ✅ "Clinical data coming soon" teaser is visible
11. ✅ Rep page template works at `/rep/example`
12. ✅ All new videos play correctly
13. ✅ Site is fully responsive
14. ✅ Build completes without errors

---

*End of Site Enhancement Plan*
