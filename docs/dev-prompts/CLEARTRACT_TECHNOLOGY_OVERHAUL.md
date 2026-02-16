# Developer Agent Prompt: Website Update — Clinical Data Alignment & Visual Enhancement

## Mission Context

You are updating the Silq Technologies website to:
1. **Align messaging with an upcoming peer-reviewed publication in Nature Medicine** (manuscript provided)
2. **Remove overclaiming language** ("proven patient outcomes" is NOT allowed)
3. **Add teaser language** that clinical data is "coming soon" / "to be published"
4. **Incorporate new scientific imagery** (Bacteria Panel, Contact Angle Diagram)
5. **Restructure key pages** (ClearTract, Technology) for better visual impact
6. **Enhance bland sections** (FeatureGrid / "Innovation That Matters") with more visual polish

---

## Key Constraints (READ CAREFULLY)

### Language Guardrails — DO NOT Overclaim

The upcoming publication (Nature Medicine) contains strong clinical results, but **we cannot pre-announce unpublished data**. Use conservative, forward-looking language:

**ALLOWED:**
- "Clinical data to be published soon"
- "Demonstrated in peer-reviewed research to reduce bacterial adhesion"
- "In clinical studies, patients reported improved outcomes" (past tense, general)
- "Designed to help reduce..."
- "Engineered to mitigate..."
- "Aims to reduce..."
- "Has been validated in peer-reviewed research"

**NOT ALLOWED:**
- "Proven patient outcomes" ❌
- "Clinically proven to reduce infections" ❌
- "Eliminates" / "prevents" (absolute terms) ❌
- Any specific statistics from the unpublished Nature Med paper ❌
- "Significantly reduces" without a citation to a published source ❌

### Publication to Reference

The **Advanced Materials 2022 paper** (McVerry et al.) is the **only** published source we can cite directly. The Nature Med data is upcoming — tease it, don't quote it.

---

## Task 1: ClearTract Page Overhaul (`src/app/products/cleartract/page.tsx`)

### Current Issues:
1. Section titled **"Proven Patient Outcomes"** (line 187-188) — **MUST REMOVE** this title
2. Page structure puts clinical stats before testimonials — should be reversed
3. Missing the **Bacteria Panel** image that visually supports the UTI reduction claim

### Required Changes:

#### A. Remove "Proven Patient Outcomes" Language
**Find and replace:**
```tsx
// CHANGE THIS:
<h2 className="text-display-sm md:text-display font-bold">
  Proven Patient Outcomes
</h2>
<p className="mt-4 text-white/70 max-w-2xl mx-auto">
  In a clinical evaluation of long-term catheterized patients, ClearTract demonstrated 
  significant improvements in patient-reported outcomes.
</p>

// TO THIS:
<h2 className="text-display-sm md:text-display font-bold">
  Patient-Reported Improvements
</h2>
<p className="mt-4 text-white/70 max-w-2xl mx-auto">
  In an evaluation of long-term catheterized patients, those using ClearTract 
  reported improved experiences. Additional clinical data will be published soon.
</p>
```

**Also update the badge text from "Clinical Results" to "Patient Experience"**

#### B. Restructure Page Order — Testimonials First

New section order for ClearTract page:
1. **Hero** (keep as-is)
2. **CAUTI Statistics** (keep as-is — this is general problem framing)
3. **Testimonials** (MOVE UP — currently at line 250)
4. **Two-Column Evidence Section** (NEW — see below)
5. **Encrustation Comparison** (keep, but integrate into two-column)
6. **Patient Experience Stats** (moved down, language updated)
7. **Biocompatibility** (keep at bottom)
8. **FAQ, Antibiotic Section, Trust Logos, CTA** (keep order)

#### C. Create New Two-Column Evidence Section

Add a new section after Testimonials that shows **Infection Reduction** and **Encrustation Reduction** side-by-side:

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
            {/* Shield icon */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
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
            {/* Cycle/refresh icon */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
            </svg>
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

#### D. Copy Required Asset

Copy this file to the public images folder:
```
FROM: Images/Bacteria Panel.png
TO:   silq-website/public/images/science/bacteria-panel.png
```

---

## Task 2: Technology Page Overhaul (`src/app/technology/page.tsx`)

### Current Issues:
1. Page looks "poor" according to owner — needs more visual impact
2. Missing the **Contact Angle Diagram** showing wide applicability
3. Not featuring video demonstrations prominently enough

### Required Changes:

#### A. Copy New Assets to Public Folder

```
FROM: PosterContent/ContactAngleDiagram.png
TO:   silq-website/public/images/science/contact-angle-diagram-full.png

FROM: PosterContent/Picture1.png  
TO:   silq-website/public/images/science/biofilm-cascade-diagram.png
```

#### B. Add Wide Applicability Section with Contact Angle Images

Create a new visually-striking section showing the treatment works across multiple materials:

```tsx
{/* Wide Applicability Section */}
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
      {['Silicone', 'Nylon', 'Polystyrene', 'PVC'].map((material) => (
        <div key={material} className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-silq-teal/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-silq-teal">✓</span>
          </div>
          <p className="font-semibold">{material}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

#### C. Enhance Video Demonstrations Section

The Technology page should prominently feature video demonstrations. Create a more impactful video showcase:

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
          src: '/videos/silq-technology-demo.mp4',
          title: 'Surface Treatment Process',
          description: 'See how our zwitterionic coating is applied to medical devices.',
        },
        {
          src: '/videos/contact-lens-demo.mp4',
          title: 'Hydrophilicity Test',
          description: 'Contact lens drying comparison shows enhanced wettability.',
        },
        {
          src: '/videos/frictionless-silicone.mp4',
          title: 'Friction Reduction',
          description: 'Dramatically reduced friction for improved comfort.',
        },
      ].map((video) => (
        <div key={video.title} className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="aspect-video bg-silq-dark">
            <video
              src={video.src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-silq-dark mb-2">{video.title}</h3>
            <p className="text-silq-dark/60">{video.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## Task 3: Home Page — Enhance "Innovation That Matters" Section

### Current Issue:
The `FeatureGrid` component with "Innovation That Matters" is described as "too bland."

### Required Changes:

#### Option A: Enhanced FeatureGrid Component (`src/components/sections/FeatureGrid.tsx`)

Update the component to be more visually dynamic:

```tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  accentColor?: string
}

interface FeatureGridProps {
  title?: string
  subtitle?: string
  description?: string
  features: Feature[]
  columns?: 2 | 3 | 4
  variant?: 'default' | 'cards' | 'minimal' | 'gradient'
  className?: string
}

export function FeatureGrid({
  title,
  subtitle,
  description,
  features,
  columns = 4,
  variant = 'default',
  className,
}: FeatureGridProps) {
  return (
    <section className={cn(
      'section-padding relative overflow-hidden',
      variant === 'gradient' && 'bg-gradient-to-br from-silq-cream via-white to-silq-cream',
      variant === 'default' && 'bg-silq-cream',
      variant === 'cards' && 'bg-white',
      className
    )}>
      {/* Subtle background pattern */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-silq-blue/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-silq-teal/10 rounded-full blur-3xl" />
        </div>
      )}
      
      <div className="container-silq relative">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            {subtitle && (
              <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-display-sm md:text-display font-bold text-silq-dark">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-silq-dark/70 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </motion.div>
        )}

        <div
          className={cn(
            'grid gap-8',
            columns === 2 && 'md:grid-cols-2',
            columns === 3 && 'md:grid-cols-2 lg:grid-cols-3',
            columns === 4 && 'md:grid-cols-2 lg:grid-cols-4'
          )}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className={cn(
                'rounded-2xl p-8 h-full transition-all duration-500',
                variant === 'cards' && 'bg-silq-cream shadow-lg shadow-silq-dark/5 hover:shadow-xl hover:-translate-y-2 border border-silq-dark/5',
                variant === 'default' && 'bg-white shadow-lg shadow-silq-dark/5 hover:shadow-xl hover:-translate-y-1 border border-silq-dark/5',
                variant === 'gradient' && 'bg-white/80 backdrop-blur-sm shadow-lg shadow-silq-dark/5 hover:shadow-xl hover:-translate-y-2 border border-white/50',
                variant === 'minimal' && 'bg-transparent hover:bg-silq-cream/50'
              )}>
                {/* Animated icon container */}
                <div className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500',
                  'bg-gradient-to-br from-silq-blue/10 to-silq-teal/10 text-silq-blue',
                  'group-hover:from-silq-blue group-hover:to-silq-blue-700 group-hover:text-white group-hover:scale-110 group-hover:rotate-3'
                )}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-silq-dark mb-3 group-hover:text-silq-blue transition-colors">
                  {feature.title}
                </h3>
                <p className="text-silq-dark/60 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Subtle bottom accent line */}
                <div className="mt-6 h-1 w-0 group-hover:w-12 bg-gradient-to-r from-silq-blue to-silq-teal rounded-full transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

#### B: Update Home Page to Use Enhanced Variant

In `src/app/page.tsx`, update the FeatureGrid usage:

```tsx
{/* Value Proposition */}
<FeatureGrid
  subtitle="Why Silq"
  title="Innovation That Matters"
  description="Our drug-free approach addresses the root causes of device-related complications through advanced material science."
  features={features}
  columns={4}
  variant="gradient"
/>
```

---

## Task 4: Add "Clinical Data Coming Soon" Teaser

### On Home Page

Add a subtle teaser banner or badge near relevant sections. In the ScienceShowcase or after it:

```tsx
{/* Research Preview */}
<section className="py-8 bg-silq-blue/5 border-y border-silq-blue/10">
  <div className="container-silq">
    <div className="flex items-center justify-center gap-4 text-center">
      <div className="w-2 h-2 bg-silq-blue rounded-full animate-pulse" />
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

### On Technology Page

In the CTA section, update:

```tsx
<CTABanner
  title="Peer-Reviewed Research"
  description="Our zwitterionic technology has been validated in multiple peer-reviewed publications, with additional clinical data coming soon."
  cta={{
    text: 'View Published Research',
    href: 'https://doi.org/10.1002/adma.202200254',
    external: true,
  }}
  secondaryCta={{ text: 'Contact Our Team', href: '/contact' }}
  variant="dark"
/>
```

---

## Task 5: Remove/Update All "Proven" Language Site-Wide

### Files to Audit:

Run a search for "proven" and "Proven" across the codebase:

```bash
grep -r -i "proven" src/
```

**Expected locations and fixes:**

| File | Current | Change To |
|------|---------|-----------|
| `products/cleartract/page.tsx` | "Proven Patient Outcomes" | "Patient-Reported Improvements" |
| `products/cleartract/page.tsx` | "Proven Biocompatibility" | "Demonstrated Biocompatibility" |
| Any other instances | "Proven" | "Demonstrated" or "Validated" |

---

## Task 6: Asset Copy Script

Create or update `scripts/copy-assets.ps1`:

```powershell
# Copy new assets for website update

# Bacteria Panel for ClearTract page
Copy-Item -Path "..\Images\Bacteria Panel.png" -Destination "public\images\science\bacteria-panel.png" -Force

# Contact Angle Diagram for Technology page
Copy-Item -Path "..\PosterContent\ContactAngleDiagram.png" -Destination "public\images\science\contact-angle-diagram-full.png" -Force

# Biofilm Cascade Diagram
Copy-Item -Path "..\PosterContent\Picture1.png" -Destination "public\images\science\biofilm-cascade-diagram.png" -Force

Write-Host "Assets copied successfully!"
```

---

## Implementation Sequence

1. **Copy assets** (run script above)
2. **Update FeatureGrid component** for enhanced styling
3. **Update Home Page** — use gradient variant, add teaser
4. **Overhaul ClearTract Page** — reorder, add two-column, remove "proven"
5. **Overhaul Technology Page** — add videos, contact angle section
6. **Site-wide audit** — remove all "proven" language
7. **Test all pages** — verify no broken images/links
8. **Responsive check** — verify mobile looks good

---

## Acceptance Criteria

- [ ] No instance of "Proven Patient Outcomes" on site
- [ ] "Proven Biocompatibility" changed to "Demonstrated Biocompatibility"
- [ ] Bacteria Panel image visible on ClearTract page
- [ ] Testimonials appear before clinical stats on ClearTract page
- [ ] Two-column layout shows infection + encrustation side-by-side
- [ ] Technology page features Contact Angle Diagram prominently
- [ ] Technology page has visually impactful video showcase
- [ ] "Clinical data coming soon" teaser visible
- [ ] FeatureGrid is visually enhanced (not bland)
- [ ] All images load correctly
- [ ] Mobile responsive

---

## Do NOT Break

- Existing navigation structure
- FDA clearance references (keep these)
- Citations to Advanced Materials 2022 paper (keep these)
- Testimonial content (keep exact quotes)
- Contact page functionality
- Any existing working images

---

## Key Messaging From Upcoming Publication (For Context Only)

From the Nature Medicine manuscript introduction, these are the key findings that we're *teasing* but not directly quoting:

1. **Drug-free approach** using zwitterion chemistry (bio-inspired)
2. **FDA-cleared** for urethral, suprapubic, and nephrostomy implantation
3. **Clinical studies** showed reduction in biofilm, CAUTI, and encrustation
4. **No contribution to antibiotic resistance** (physical/chemical, not antimicrobial)
5. **High-throughput manufacturing** developed

**Remember:** We can hint at these findings but cannot quote statistics or claim specific results until publication.

---

## File Targets Summary

| File | Action |
|------|--------|
| `src/app/products/cleartract/page.tsx` | Major restructure |
| `src/app/technology/page.tsx` | Major enhancement |
| `src/app/page.tsx` | Add teaser, update FeatureGrid variant |
| `src/components/sections/FeatureGrid.tsx` | Visual enhancement |
| `public/images/science/bacteria-panel.png` | ADD (copy from Images/) |
| `public/images/science/contact-angle-diagram-full.png` | ADD (copy from PosterContent/) |
