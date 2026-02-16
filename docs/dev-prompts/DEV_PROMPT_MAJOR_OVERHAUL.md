# Developer Agent Prompt: Major Site Overhaul

**Date:** February 2026  
**Priority:** 🔴 CRITICAL  
**Scope:** Complete visual and content overhaul across all main pages

---

## Overview

This prompt implements major user-requested changes plus 10 additional enhancements. Focus is on incorporating new assets, refining messaging to match the company's positioning, and creating a high-tech, VC-attractive appearance.

---

## PART A: Asset Preparation

Before implementing changes, copy these files from the project folder to the website:

### Files to Copy

| Source | Destination | Purpose |
|--------|-------------|---------|
| `Banner.gif` | `public/images/hero/banner.gif` | Home page hero background |
| `Silq Machine GIF.gif` | `public/images/science/silq-machine.gif` | Surface Treatment scalability |
| `Images/Bacteria Panel.png` | `public/images/science/bacteria-panel.png` | Microbial resistance data |
| `Images/BloodLoopV2.webp` | `public/images/science/blood-loop.webp` | Thrombosis protection data |
| `Images/Encrusted catheter comparison.png` | `public/images/science/encrustation-comparison.png` | Catheter comparison |
| `PosterContent/ContactAngleDiagram.png` | `public/images/science/contact-angle-diagram.png` | Technology applicability |

---

## PART B: User-Requested Changes

### B1. Home Page Hero - Add Banner Background

**File:** `src/app/page.tsx` and `src/components/sections/Hero.tsx`

Add Banner.gif as a looping background behind "Transforming Surfaces Through Advanced Material Science".

**Update Hero component to support background media:**

```tsx
// src/components/sections/Hero.tsx - Add backgroundMedia prop
interface HeroProps {
  // ... existing props
  backgroundMedia?: {
    type: 'image' | 'gif' | 'video'
    src: string
  }
}

// Inside the Hero component JSX, before the content:
{backgroundMedia && (
  <div className="absolute inset-0 z-0">
    {backgroundMedia.type === 'video' ? (
      <video 
        src={backgroundMedia.src} 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="w-full h-full object-cover"
      />
    ) : (
      <Image 
        src={backgroundMedia.src} 
        alt="" 
        fill 
        className="object-cover"
        priority
      />
    )}
    {/* Overlay for readability */}
    <div className="absolute inset-0 bg-gradient-to-b from-silq-dark/80 via-silq-dark/70 to-silq-dark/90" />
  </div>
)}
```

**Then in `src/app/page.tsx`:**

```tsx
<Hero
  title="Transforming Surfaces Through"
  highlightedText="Advanced Material Science"
  description="Drug-free surface technology for medical devices. FDA-cleared. UCLA-born."
  primaryCta={{ text: 'Our Technology', href: '/technology' }}
  secondaryCta={{ text: 'ClearTract®', href: '/products/cleartract' }}
  variant="default"
  size="large"
  backgroundMedia={{
    type: 'gif',
    src: '/images/hero/banner.gif'
  }}
/>
```

---

### B2. Home Page - Swap Video Positions & Integrate "How It Works"

**File:** `src/app/page.tsx`

**Change Section 2 (Innovation That Matters):**
- Put "How It Works" video (silq-technology-demo.mp4) next to the feature cards
- Remove current "See our technology in action" video from this section

**REPLACE the current Section 2 with:**

```tsx
{/* Section 2: Innovation + How It Works Video */}
<section className="section-padding bg-white">
  <div className="container-silq">
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/* Left: Feature Cards + How It Works */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
          Why Silq
        </p>
        <h2 className="text-display-sm font-bold text-silq-dark mb-4">
          Innovation That Matters
        </h2>
        <p className="text-silq-dark/70 mb-8">
          Zwitterionic molecules create a hydration barrier that resists protein and bacterial adhesion—mimicking natural cell membranes.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title} 
              className="p-5 bg-silq-cream rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="w-10 h-10 rounded-lg bg-silq-blue/10 flex items-center justify-center text-silq-blue mb-3">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-silq-dark text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-silq-dark/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Right: How It Works Video */}
      <div className="lg:sticky lg:top-24">
        <motion.div 
          className="rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <video 
            src="/videos/silq-technology-demo.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full"
          />
        </motion.div>
        <p className="text-center text-sm text-silq-dark/50 mt-4">
          How our zwitterionic treatment transforms surfaces
        </p>
      </div>
    </div>
  </div>
</section>
```

**REPLACE current Section 3.5 (Surface Treatment Teaser) with full demo video:**

```tsx
{/* Section 3.5: Technology Demo - Full Overview */}
<section className="section-padding bg-silq-cream">
  <div className="container-silq">
    <div className="max-w-4xl mx-auto text-center mb-10">
      <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
        Platform Technology
      </span>
      <h2 className="text-display-sm font-bold text-silq-dark">
        See Our Technology in Action
      </h2>
    </div>
    
    <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
      <VideoEmbed 
        vimeoId="869354523" 
        title="Silq Technologies Overview"
      />
    </div>
    
    <div className="mt-8 flex justify-center gap-4">
      <Link href="/technology">
        <Button variant="primary" size="lg">Explore Technology</Button>
      </Link>
      <Link href="/products/surface-treatment">
        <Button variant="secondary" size="lg">Surface Treatment Services</Button>
      </Link>
    </div>
  </div>
</section>
```

---

### B3. Remove "Works On" Cards Site-Wide

**Files to update:**
- `src/app/technology/page.tsx` - DELETE lines 37-44 (the grid of material cards)
- `src/app/products/surface-treatment/page.tsx` - DELETE lines 28-49 (the applications grid)

**Technology page - REPLACE the entire "Key Visual" section with:**

```tsx
{/* Contact Angle Comparison - Full Width Visual */}
<section className="section-padding bg-white">
  <div className="container-silq">
    <div className="max-w-5xl mx-auto">
      <Image 
        src="/images/science/contact-angle-diagram.png"
        alt="Contact Angle Comparison across materials"
        width={1200}
        height={600}
        className="w-full rounded-2xl shadow-lg"
      />
      <p className="text-center text-sm text-silq-dark/50 mt-4">
        Wide applicability demonstrated across silicone, nylon, polystyrene, PVC, and polyethylene substrates
      </p>
    </div>
  </div>
</section>
```

---

### B4. Add Demo Videos to Technology & Surface Treatment Pages

**File:** `src/app/technology/page.tsx`

**Add new section before "License Our Technology":**

```tsx
{/* Technology Demonstrations */}
<section className="section-padding bg-white">
  <div className="container-silq">
    <div className="text-center mb-10">
      <h2 className="text-display-sm font-bold text-silq-dark">
        Technology Demonstrations
      </h2>
      <p className="text-silq-dark/60 mt-2">
        Watch the dramatic difference our surface treatment makes
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Frictionless Silicone */}
      <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-xl">
        <video 
          src="/videos/frictionless-silicone.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full aspect-video object-cover"
        />
        <div className="p-6">
          <h3 className="font-bold text-silq-dark mb-2">Frictionless Silicone</h3>
          <p className="text-sm text-silq-dark/60">
            18x improvement in lubricity on medical-grade silicone, reducing patient discomfort during implant and explant.
          </p>
        </div>
      </div>
      
      {/* Contact Lens Hydrophilicity */}
      <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-xl">
        <video 
          src="/videos/contact-lens-drying.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full aspect-video object-cover"
        />
        <div className="p-6">
          <h3 className="font-bold text-silq-dark mb-2">Enhanced Wettability</h3>
          <p className="text-sm text-silq-dark/60">
            Contact lens drying comparison showing dramatically enhanced hydrophilicity on treated surfaces.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

**File:** `src/app/products/surface-treatment/page.tsx`

**Complete rewrite to focus on scalability:**

```tsx
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CTABanner } from '@/components/sections/CTABanner'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Surface Treatment Services',
  description: 'Turn-key coating solutions with customizable surfaces providing microbial resistance, anti-thrombogenicity, and enhanced lubricity.',
}

export default function SurfaceTreatmentPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-silq-dark via-silq-blue-900 to-silq-dark text-white relative overflow-hidden">
        <div className="container-silq text-center relative">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-teal bg-silq-teal/20 rounded-full">
            B2B Partnership
          </span>
          <h1 className="text-hero-sm md:text-hero font-bold">
            External Coating <span className="text-silq-teal">Solutions</span>
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            A scalable manufacturing system delivering turn-key coating solutions to customers worldwide.
          </p>
        </div>
      </section>

      {/* Scalability Section with Silq Machine GIF */}
      <section className="section-padding bg-white">
        <div className="container-silq">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Left: Machine GIF */}
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/images/science/silq-machine.gif"
                alt="Silq Manufacturing System"
                width={600}
                height={400}
                className="w-full"
                unoptimized
              />
            </div>
            
            {/* Right: Copy */}
            <div>
              <h2 className="text-display-sm font-bold text-silq-dark mb-6">
                Scalable Manufacturing
              </h2>
              <p className="text-silq-dark/70 mb-4">
                Silq's proprietary surface treatment can be utilized in numerous applications across medicine and industry. Our business model includes offering a turn-key coating solution to customers worldwide.
              </p>
              <p className="text-silq-dark/70 mb-4">
                Our deposition process is rapid, performed under ambient conditions, and does not require exotic reaction conditions or toxic chemicals. This results in:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-silq-blue/10 flex items-center justify-center text-silq-blue flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-silq-dark/70">Scalability up to commercial quantities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-silq-blue/10 flex items-center justify-center text-silq-blue flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-silq-dark/70">Environmentally friendly operations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-silq-blue/10 flex items-center justify-center text-silq-blue flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-silq-dark/70">Competitive economics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Surface Properties with Bacteria Panel & Blood Loop */}
      <section className="section-padding bg-silq-cream">
        <div className="container-silq">
          <div className="text-center mb-12">
            <h2 className="text-display-sm font-bold text-silq-dark">
              Customizable Surface Properties
            </h2>
            <p className="text-silq-dark/60 mt-2 max-w-2xl mx-auto">
              The resulting surface can be customized to deliver a unique combination of properties.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Microbial Resistance */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <Image 
                src="/images/science/bacteria-panel.png"
                alt="Bacterial adhesion reduction data"
                width={600}
                height={400}
                className="w-full"
              />
              <div className="p-6">
                <h3 className="font-bold text-silq-dark text-lg mb-2">Microbial Resistance</h3>
                <p className="text-silq-dark/70 text-sm">
                  Our patented treatment creates a covalent bond with its substrate, resulting in a permanently transformed surface capable of repelling bacteria and restricting growth that promotes infection.
                </p>
              </div>
            </div>
            
            {/* Anti-Thrombogenicity */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <Image 
                src="/images/science/blood-loop.webp"
                alt="Blood loop thrombosis comparison"
                width={600}
                height={400}
                className="w-full"
              />
              <div className="p-6">
                <h3 className="font-bold text-silq-dark text-lg mb-2">Anti-Thrombogenicity</h3>
                <p className="text-silq-dark/70 text-sm">
                  Silq-treated silicone demonstrates a 50% reduction in surface thrombus coverage, offering potential for devices that reduce catheter-related thrombosis complications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Demos */}
      <section className="section-padding bg-white">
        <div className="container-silq">
          <div className="text-center mb-10">
            <h2 className="text-display-sm font-bold text-silq-dark">
              Technology Demonstrations
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-xl">
              <video 
                src="/videos/frictionless-silicone.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full aspect-video object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-silq-dark mb-2">Enhanced Lubricity</h3>
                <p className="text-sm text-silq-dark/60">
                  Low coefficient of friction providing enhanced lubricity—18x improvement on medical-grade silicone.
                </p>
              </div>
            </div>
            
            <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-xl">
              <video 
                src="/videos/contact-lens-drying.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full aspect-video object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-silq-dark mb-2">Hydrophilicity</h3>
                <p className="text-sm text-silq-dark/60">
                  Dramatically enhanced wettability demonstrated on contact lens substrates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Benefits - Dark Section */}
      <section className="section-padding bg-silq-dark text-white">
        <div className="container-silq">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-display-sm font-bold mb-8">
              Why Partner with Silq?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-white/10">
                <h3 className="font-semibold text-silq-teal mb-2">FDA-Cleared</h3>
                <p className="text-white/70 text-sm">Technology validated with 510(k) clearance</p>
              </div>
              <div className="p-6 rounded-xl bg-white/10">
                <h3 className="font-semibold text-silq-teal mb-2">UCLA Research</h3>
                <p className="text-white/70 text-sm">World-class material science foundation</p>
              </div>
              <div className="p-6 rounded-xl bg-white/10">
                <h3 className="font-semibold text-silq-teal mb-2">Scalable Process</h3>
                <p className="text-white/70 text-sm">Integrates with existing manufacturing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        title="Explore Partnership?"
        description="Let's discuss how Silq can enhance your products."
        cta={{ text: 'Contact Us', href: '/contact' }}
        secondaryCta={{ text: 'Learn About Technology', href: '/technology' }}
        variant="gradient"
      />
    </>
  )
}
```

---

### B5. ClearTract Page - Remove FAQ, Add Brochure Content

**File:** `src/app/products/cleartract/page.tsx`

**DELETE the entire FAQ section (lines 191-207).**

**REPLACE the "Key Benefits" section with expanded content from brochure:**

```tsx
{/* Key Benefits - Expanded from Brochure */}
<section className="section-padding bg-silq-cream">
  <div className="container-silq">
    <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
      {/* Bacterial Adhesion with Real Image */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <Image 
          src="/images/science/bacteria-panel.png"
          alt="Bacterial adhesion comparison"
          width={600}
          height={400}
          className="w-full"
        />
        <div className="p-6">
          <h3 className="text-xl font-bold text-silq-dark mb-3 flex items-center gap-2">
            <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Resisting Bacterial Adhesion
          </h3>
          <p className="text-silq-dark/70">
            Our patented zwitterionic treatment creates a covalent bond with the catheter surface, resulting in a permanently transformed device capable of repelling bacteria and restricting biofilm growth—without antibiotics or antimicrobial agents.
          </p>
        </div>
      </div>
      
      {/* Encrustation with Real Image */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <Image 
          src="/images/science/encrustation-comparison.png"
          alt="Encrustation comparison - standard vs ClearTract"
          width={600}
          height={400}
          className="w-full"
        />
        <div className="p-6">
          <h3 className="text-xl font-bold text-silq-dark mb-3 flex items-center gap-2">
            <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
            </svg>
            Reduced Encrustation
          </h3>
          <p className="text-silq-dark/70">
            ClearTract's surface treatment is engineered to mitigate mineral deposit buildup. Reduced encrustation means fewer blockages, reduced trauma during removal, and improved patient comfort throughout catheterization.
          </p>
        </div>
      </div>
    </div>
    
    {/* Additional Benefits Row */}
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10">
      <div className="bg-white rounded-xl p-6 text-center shadow-md">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-silq-blue/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 className="font-semibold text-silq-dark mb-2">Drug-Free</h4>
        <p className="text-sm text-silq-dark/60">No antibiotics or antimicrobial agents that contribute to resistance</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 text-center shadow-md">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-silq-blue/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h4 className="font-semibold text-silq-dark mb-2">Enhanced Lubricity</h4>
        <p className="text-sm text-silq-dark/60">18x improvement in lubricity alleviating patient discomfort</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 text-center shadow-md">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-silq-blue/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h4 className="font-semibold text-silq-dark mb-2">FDA Cleared</h4>
        <p className="text-sm text-silq-dark/60">510(k) cleared for urethral, suprapubic, and nephrostomy use</p>
      </div>
    </div>
  </div>
</section>
```

**ALSO update the Home Page ClearTract section to use real encrustation image:**

```tsx
{/* In src/app/page.tsx, replace the ImagePlaceholder in Section 3 with: */}
<Image 
  src="/images/science/encrustation-comparison.png"
  alt="Encrustation comparison - standard catheter vs ClearTract"
  width={500}
  height={250}
  className="w-full rounded-lg"
/>
```

---

## PART C: 10 Additional Enhancements

### C1. Home Page - Remove Duplicate Encrustation Caption

**File:** `src/app/page.tsx`

The text "Standard catheter (left) vs. ClearTract (right)" is redundant if using the actual comparison image. Remove lines 165-167 or update to be more impactful:

```tsx
<p className="text-xs text-white/60 mt-2 text-center">
  Visible difference in mineral buildup after extended use
</p>
```

---

### C2. Technology Page - Add Surface Properties Section

**File:** `src/app/technology/page.tsx`

Add after the Contact Angle section:

```tsx
{/* Surface Properties */}
<section className="section-padding bg-silq-cream">
  <div className="container-silq">
    <div className="text-center mb-10">
      <h2 className="text-display-sm font-bold text-silq-dark">
        Customizable Properties
      </h2>
    </div>
    
    <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
      {[
        { title: 'Microbial Resistance', desc: 'Repels bacteria without drugs' },
        { title: 'Anti-Thrombogenicity', desc: 'Reduces clot formation' },
        { title: 'Foreign Body Suppression', desc: 'Minimizes immune response' },
        { title: 'Enhanced Lubricity', desc: 'Low friction coefficient' },
      ].map((prop) => (
        <div key={prop.title} className="bg-white rounded-xl p-5 text-center shadow-md">
          <h4 className="font-semibold text-silq-dark mb-2">{prop.title}</h4>
          <p className="text-xs text-silq-dark/60">{prop.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

### C3. Add Verizon Award to Trust Section

**File:** `src/app/page.tsx`

The trust section has only FDA and UCLA. Add Verizon award:

```tsx
<div className="flex flex-col items-center">
  <Image src="/images/trust/verizon-award.png" alt="Verizon Innovation Award" width={80} height={80} />
  <p className="text-xs text-silq-dark/50 mt-2">Innovation Award</p>
</div>
```

---

### C4. ClearTract Hero - Add Product Sizes

**File:** `src/app/products/cleartract/page.tsx`

Add available sizes below the description:

```tsx
<p className="mt-4 text-lg text-silq-dark/70">
  Drug-free surface treatment designed to reduce infection and encrustation.
</p>

{/* Sizes */}
<div className="mt-4 flex items-center gap-3">
  <span className="text-sm font-medium text-silq-dark/50">Available sizes:</span>
  {['14Fr', '16Fr', '18Fr'].map(size => (
    <span key={size} className="px-3 py-1 bg-silq-blue/10 text-silq-blue text-sm font-semibold rounded-full">
      {size}
    </span>
  ))}
</div>
```

---

### C5. Home Page Testimonials - Add Video Testimonial CTA

**File:** `src/app/page.tsx`

Add a link to video testimonials below the testimonials grid:

```tsx
{/* After testimonials grid, before closing </div> */}
<div className="mt-10 text-center">
  <Link href="/contact" className="inline-flex items-center gap-2 text-silq-blue hover:text-silq-blue-700 font-medium">
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    Watch video testimonials
  </Link>
</div>
```

---

### C6. Technology Page - Improve Hero with Badge

**File:** `src/app/technology/page.tsx`

Add a badge to the hero:

```tsx
<section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-gradient-to-br from-silq-dark to-silq-blue-900 text-white">
  <div className="container-silq text-center">
    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-teal bg-silq-teal/20 rounded-full">
      UCLA-Born Innovation
    </span>
    <h1 className="text-hero-sm md:text-hero font-bold">
      Platform <span className="text-silq-teal">Technology</span>
    </h1>
    <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
      Bio-inspired zwitterionic chemistry that resists fouling on any surface.
    </p>
  </div>
</section>
```

---

### C7. Surface Treatment - Add Contact CTA Earlier

**File:** `src/app/products/surface-treatment/page.tsx`

Add a "Request Information" button in the hero:

```tsx
<div className="mt-8 flex justify-center">
  <Link href="/contact">
    <Button variant="primary" size="lg">
      Request Partnership Information
    </Button>
  </Link>
</div>
```

---

### C8. Standardize Video Aspect Ratios

**All pages with videos**

Ensure all video elements have consistent aspect ratio:

```tsx
<video 
  src="/videos/..."
  autoPlay 
  loop 
  muted 
  playsInline
  className="w-full aspect-video object-cover"  // Add aspect-video
/>
```

---

### C9. Add Loading State to Home Page Videos

**File:** `src/app/page.tsx`

Add poster image for better loading experience:

```tsx
<video 
  src="/videos/silq-technology-demo.mp4" 
  poster="/images/textures/tech-overview.gif"  // Add poster
  autoPlay 
  loop 
  muted 
  playsInline
  className="w-full"
/>
```

---

### C10. ClearTract Testimonials - Add More Context

**File:** `src/app/products/cleartract/page.tsx`

Update testimonial data with more detail:

```tsx
const testimonials = [
  {
    quote: "ClearTract catheters have made a significant difference in reducing catheter-associated infections in my practice.",
    author: "Evgeniy Kreydin, M.D.",
    role: "Urologist, Cedars-Sinai",
  },
  {
    quote: "I would not go back to other catheters ever again. The comfort has been life-changing for my daily routine.",
    author: "Ana Garcia",
    role: "Long-term Catheter Patient",
  },
  {
    quote: "Her UTIs have completely subsided, no more blockages or emergency room visits. My mom is completely satisfied.",
    author: "Stephen Newhouse",
    role: "Caregiver",
  },
]
```

---

## PART D: Files Summary

### Files to Create/Copy

| File | Action |
|------|--------|
| `public/images/hero/banner.gif` | Copy from project root |
| `public/images/science/silq-machine.gif` | Copy from project root |
| `public/images/science/bacteria-panel.png` | Copy from Images folder |
| `public/images/science/blood-loop.webp` | Copy from Images folder |
| `public/images/science/encrustation-comparison.png` | Copy from Images folder |
| `public/images/science/contact-angle-diagram.png` | Copy from PosterContent folder |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/sections/Hero.tsx` | Add backgroundMedia support |
| `src/app/page.tsx` | Add hero background, swap videos, update encrustation image |
| `src/app/technology/page.tsx` | Remove "works on" cards, add demos, add properties section |
| `src/app/products/surface-treatment/page.tsx` | Complete rewrite focusing on scalability |
| `src/app/products/cleartract/page.tsx` | Remove FAQ, expand benefits with real images |

---

## Acceptance Criteria

### User Requests
- [ ] Banner.gif displays behind home page hero text
- [ ] "How It Works" video is next to Innovation cards (not separate section)
- [ ] "See our technology in action" video moved to dedicated section below
- [ ] All "Works on" material cards removed site-wide
- [ ] Demo videos added to Technology and Surface Treatment pages
- [ ] FAQ removed from ClearTract page
- [ ] ClearTract page has expanded content with real images
- [ ] Bacteria Panel and Blood Loop images used with appropriate captions
- [ ] Surface Treatment page focuses on scalability with Silq Machine GIF

### Additional Enhancements
- [ ] Verizon Award added to trust section
- [ ] Product sizes shown on ClearTract page
- [ ] Technology page has UCLA badge in hero
- [ ] All videos have consistent aspect ratios
- [ ] Testimonials have more detailed context

### Quality
- [ ] `npm run build` passes
- [ ] All new images display correctly
- [ ] Videos autoplay and loop properly
- [ ] Mobile responsive
- [ ] No console errors

---

## Testing Checklist

1. Home page hero has animated banner background
2. Innovation section has "How It Works" video on the right
3. Full overview video is in separate section with CTAs
4. No "Works on" cards on Technology or Surface Treatment pages
5. Technology page has frictionless and contact lens demo videos
6. Surface Treatment page shows Silq Machine GIF and scalability messaging
7. Surface Treatment page shows Bacteria Panel and Blood Loop images
8. ClearTract page has no FAQ section
9. ClearTract page shows real encrustation and bacteria images
10. All pages mobile responsive

---

*This overhaul aligns the website with Silq's positioning as a high-tech, scalable surface treatment company attractive to VC investment.*
