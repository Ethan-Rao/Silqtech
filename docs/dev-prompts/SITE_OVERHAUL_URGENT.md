# URGENT: Site-Wide Overhaul - Developer Agent Prompt

**Date:** February 2026  
**Priority:** 🔴 CRITICAL  
**Status:** Site has regressed significantly - requires complete overhaul

---

## Executive Summary

The content agent has failed. The non-rep pages are:
- **Too long** - excessive scrolling, user fatigue
- **Too much text** - walls of copy, not scannable
- **Bland** - lacks visual punch, not VC-attractive
- **Repetitive** - same sections duplicated across pages
- **Poorly structured** - video separated from related content

This document specifies a complete overhaul to create a **tight, visually striking, high-tech appearance** suitable for investor presentations.

---

## CRITICAL: Items to REMOVE Immediately

### 1. Remove "Peer-Reviewed Research / Clinically Demonstrated Technology" Section
**Files affected:** `src/app/page.tsx`

DELETE this entire section (lines ~201-220):
```tsx
{/* Scientific Proof Point */}
<ScienceShowcase
  subtitle="Peer-Reviewed Research"
  title="Clinically Demonstrated Technology"
  ...
/>
```

### 2. Remove ALL Duplicate Zwitterionic Sections
The same "Zwitterionic Chemistry" section appears on:
- Technology page
- ClearTract page  
- Surface Treatment page

**KEEP only on Technology page.** Remove from ClearTract and Surface Treatment.

### 3. Remove Excessive CTABanner Sections
Every page has a `<CTABanner>` at the bottom. Keep only ONE per page and make it concise.

---

## Navigation Fix

### Change "Surface Treatment" to "Surface Treatment Services"

**File:** `src/components/layout/Header.tsx`

```tsx
// Line 14 - CHANGE:
{ name: 'Surface Treatment', href: '/products/surface-treatment' },

// TO:
{ name: 'Surface Treatment Services', href: '/products/surface-treatment' },
```

---

## HOME PAGE Complete Restructure

**File:** `src/app/page.tsx`

### Current Problems:
1. Hero → FeatureGrid → ClearTract showcase → Video (SEPARATE!) → ScienceShowcase → Testimonials → Trust → CTA
2. Video is isolated, far from "Innovation that Matters"
3. Encrustation not shown with ClearTract
4. Too many sections, too much scrolling

### New Structure (STRICT):

```
1. HERO (Keep, reduce description text)
2. INNOVATION THAT MATTERS + VIDEO (Side by side!)
3. CLEARTRACT SHOWCASE + ENCRUSTATION IMAGE (Combined)
4. TESTIMONIALS (Immediately after product)
5. TRUST LOGOS (Compact)
6. SINGLE CTA
```

**That's it. 6 sections maximum.**

### Implementation:

#### Section 1: Hero (Tighten)
```tsx
<Hero
  title="Transforming Surfaces Through"
  highlightedText="Advanced Material Science"
  description="Drug-free surface technology for medical devices. FDA-cleared. UCLA-born."
  primaryCta={{ text: 'Our Technology', href: '/technology' }}
  secondaryCta={{ text: 'ClearTract®', href: '/products/cleartract' }}
  backgroundGif="/images/textures/tech-overview.gif"
  variant="default"
  size="large"
/>
```

**Note:** Description cut from 2 sentences to 1 punchy line.

#### Section 2: Innovation + Video (NEW - Side by Side)
```tsx
<section className="section-padding bg-white">
  <div className="container-silq">
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/* Left: Feature Cards */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
          Why Silq
        </p>
        <h2 className="text-display-sm font-bold text-silq-dark mb-8">
          Innovation That Matters
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature) => (
            <div key={feature.title} className="p-5 bg-silq-cream rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-silq-blue/10 flex items-center justify-center text-silq-blue mb-3">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-silq-dark text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-silq-dark/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right: Video */}
      <div className="lg:sticky lg:top-24">
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <VideoEmbed 
            vimeoId="869354523" 
            title="Silq Technologies Overview"
          />
        </div>
        <p className="text-center text-sm text-silq-dark/50 mt-4">
          See our technology in action
        </p>
      </div>
    </div>
  </div>
</section>
```

#### Section 3: ClearTract + Encrustation (Combined)
```tsx
<section className="section-padding bg-gradient-to-br from-silq-blue-900 via-silq-dark to-silq-blue-800 text-white">
  <div className="container-silq">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left: Product + Encrustation Image */}
      <div className="relative">
        <Image
          src="/images/products/boxnew.jpg"
          alt="ClearTract Foley Catheter"
          width={500}
          height={500}
          className="rounded-2xl shadow-2xl"
        />
        {/* Encrustation comparison overlay or adjacent */}
        <div className="mt-6 p-4 bg-white/10 rounded-xl">
          <Image
            src="/images/science/encrusted-catheter-comparison.png"
            alt="Encrustation comparison"
            width={400}
            height={200}
            className="rounded-lg"
          />
          <p className="text-xs text-white/60 mt-2 text-center">
            Standard catheter (left) vs. ClearTract (right)
          </p>
        </div>
      </div>
      
      {/* Right: Copy */}
      <div>
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-teal bg-silq-teal/20 rounded-full">
          FDA 510(k) Cleared
        </span>
        <h2 className="text-display-sm font-bold mb-4">
          ClearTract® Foley Catheters
        </h2>
        <p className="text-white/80 mb-6">
          Drug-free infection resistance. Reduced encrustation. Superior patient comfort.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/products/cleartract">
            <Button variant="primary" size="lg">Learn More</Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary" size="lg" className="text-white border-white/30">
              Request Samples
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### Section 4: Testimonials (Compact)
```tsx
<section className="py-16 bg-silq-cream">
  <div className="container-silq">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-display-sm font-bold text-silq-dark text-center mb-10">
        What People Are Saying
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-silq-dark/70 text-sm italic mb-4">"{t.quote}"</p>
            <p className="font-semibold text-silq-dark text-sm">{t.author}</p>
            <p className="text-xs text-silq-dark/50">{t.role}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

#### Section 5: Trust Logos (Inline, Minimal)
```tsx
<section className="py-10 bg-white border-y border-silq-dark/5">
  <div className="container-silq">
    <div className="flex flex-wrap justify-center items-center gap-12">
      <Image src="/images/trust/fda.png" alt="FDA Cleared" width={60} height={60} />
      <Image src="/images/trust/ucla.jpg" alt="UCLA" width={80} height={40} />
      <span className="text-sm text-silq-dark/40">FDA Cleared • Made in USA • UCLA Research</span>
    </div>
  </div>
</section>
```

#### Section 6: Single CTA
```tsx
<CTABanner
  title="Ready to Learn More?"
  description="Connect with our team."
  cta={{ text: 'Contact Us', href: '/contact' }}
  variant="gradient"
/>
```

**DELETE:** The separate video section, ScienceShowcase, separate TrustLogos component call.

---

## TECHNOLOGY PAGE Overhaul

**File:** `src/app/technology/page.tsx`

### Current: ~150 lines with repetitive content
### Target: ~80 lines, punchy and visual

### New Structure:
```
1. HERO (Short)
2. KEY VISUAL - Contact angle diagram with minimal text
3. VIDEO DEMO (inline, not full section)
4. APPLICATIONS GRID (4 items max)
5. SINGLE CTA
```

### Key Changes:

1. **Remove** the UCLA Origins ImageTextSplit section (too much text)
2. **Keep** Zwitterionic Chemistry section but SHORTEN text
3. **Remove** ResearchEvidence "Microbial Resistance" section
4. **Keep** contact angle comparison as the hero visual

### Condensed Implementation:

```tsx
export default function TechnologyPage() {
  return (
    <>
      {/* Hero - Minimal */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-gradient-to-br from-silq-dark to-silq-blue-900 text-white">
        <div className="container-silq text-center">
          <h1 className="text-hero-sm md:text-hero font-bold">
            Platform <span className="text-silq-teal">Technology</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
            Bio-inspired zwitterionic chemistry that resists fouling on any surface.
          </p>
        </div>
      </section>

      {/* Key Visual - Contact Angle */}
      <section className="section-padding bg-white">
        <div className="container-silq">
          <div className="max-w-4xl mx-auto">
            <Image
              src="/images/science/contact-angle-comparison.jpg"
              alt="Contact angle comparison across materials"
              width={1000}
              height={400}
              className="rounded-2xl shadow-lg"
            />
            <div className="mt-6 grid grid-cols-5 gap-4 text-center">
              {['Silicone', 'Nylon', 'Polystyrene', 'PVC', 'Polyethylene'].map(m => (
                <div key={m} className="p-3 bg-silq-cream rounded-lg">
                  <p className="font-semibold text-silq-dark text-sm">{m}</p>
                  <p className="text-xs text-silq-dark/50">Works on</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Compact with Video */}
      <section className="section-padding bg-silq-cream">
        <div className="container-silq">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-display-sm font-bold text-silq-dark mb-4">
                How It Works
              </h2>
              <p className="text-silq-dark/70 mb-4">
                Zwitterionic molecules create a hydration barrier that resists 
                protein and bacterial adhesion—mimicking natural cell membranes.
              </p>
              <ul className="space-y-2 text-sm text-silq-dark/70">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-silq-blue" />
                  Covalent bond to substrate
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-silq-blue" />
                  Electrically neutral surface
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-silq-blue" />
                  Durable through device lifetime
                </li>
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <video 
                src="/videos/silq-demo-v1.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        title="Explore Our Product"
        cta={{ text: 'ClearTract® Catheters', href: '/products/cleartract' }}
        secondaryCta={{ text: 'Contact Us', href: '/contact' }}
        variant="gradient"
      />
    </>
  )
}
```

**DELETE:** UCLA Origins section, ResearchEvidence section, duplicate ScienceShowcase.

---

## CLEARTRACT PAGE Overhaul

**File:** `src/app/products/cleartract/page.tsx`

### Current: 343 lines - WAY too long
### Target: ~150 lines

### New Structure:
```
1. HERO (Product + Key Stats inline)
2. TWO BENEFITS CARDS (Infection + Encrustation) - Keep but shorten
3. TESTIMONIALS (3 quotes, compact)
4. FAQ (Keep but reduce to 3 questions)
5. CTA
```

### Key Deletions:
- Remove "The CAUTI Problem" section (users know this)
- Remove "Zwitterionic Surface Treatment" section (it's on Technology page)
- Remove "Clinical Results / Proven Patient Outcomes" section (**per previous guidance - too strong claims**)
- Remove "Biocompatibility" ResearchEvidence section

### Condensed Implementation Highlights:

```tsx
{/* Hero with inline stats */}
<section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-white">
  <div className="container-silq">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
          FDA 510(k) Cleared
        </span>
        <h1 className="text-hero-sm md:text-hero font-bold text-silq-dark">
          ClearTract® Foley Catheters
        </h1>
        <p className="mt-4 text-lg text-silq-dark/70">
          Drug-free surface treatment designed to reduce infection and encrustation.
        </p>
        
        {/* Inline Stats */}
        <div className="mt-8 flex flex-wrap gap-6">
          <div>
            <p className="text-3xl font-bold text-silq-blue">72%</p>
            <p className="text-xs text-silq-dark/50">Patient Preference</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-silq-blue">0</p>
            <p className="text-xs text-silq-dark/50">Antibiotics</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-silq-blue">FDA</p>
            <p className="text-xs text-silq-dark/50">Cleared</p>
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/contact">
            <Button variant="primary" size="lg">Request Samples</Button>
          </Link>
        </div>
      </div>
      
      <Image
        src="/images/products/boxnew.jpg"
        alt="ClearTract"
        width={500}
        height={500}
        className="rounded-2xl shadow-2xl"
      />
    </div>
  </div>
</section>
```

---

## SURFACE TREATMENT SERVICES PAGE Overhaul

**File:** `src/app/products/surface-treatment/page.tsx`

### Target: ~100 lines (currently ~197)

### Structure:
```
1. HERO (B2B focus)
2. MATERIALS GRID (visual, minimal text)
3. PARTNERSHIP BENEFITS (3 items)
4. CTA
```

### Delete:
- Zwitterionic Technology section (duplicate)
- Encrustation Evidence section (duplicate from ClearTract)

---

## TEXT CONSOLIDATION Rules

### Before/After Examples:

**BAD (Current):**
> "Our technology enables the broad-based use of zwitterionic chemistry on implanted medical devices and beyond, opening new possibilities for patient care and industrial applications."

**GOOD:**
> "Zwitterionic chemistry for medical devices and industrial applications."

---

**BAD (Current):**
> "Silq Technologies brings together world-class experts in material science, medical devices, and business development to transform surface technology."

**GOOD:**
> "World-class team. Transformative surface technology."

---

### Text Length Rules:
- **Hero descriptions:** MAX 15 words
- **Section intros:** MAX 20 words
- **Feature descriptions:** MAX 12 words
- **No paragraphs over 2 sentences** anywhere

---

## Legacy Code to DELETE

### Files to Review for Dead Code:

1. **Check if these components are still used:**
   - `ScienceShowcase` - only keep if used ONCE
   - `ResearchEvidence` - consider removing entirely
   - `ImageTextSplit` - review usage

2. **Remove any unused imports** in all page files

3. **Remove duplicate CSS classes** if any exist

---

## Files to Modify Summary

| File | Action | Priority |
|------|--------|----------|
| `src/components/layout/Header.tsx` | Change nav item name | High |
| `src/app/page.tsx` | Complete restructure | Critical |
| `src/app/technology/page.tsx` | Heavy reduction | High |
| `src/app/products/cleartract/page.tsx` | Heavy reduction | High |
| `src/app/products/surface-treatment/page.tsx` | Moderate reduction | Medium |
| `src/app/about/team/page.tsx` | Light cleanup | Low |
| `src/app/about/investors/page.tsx` | Light cleanup | Low |
| `src/app/contact/page.tsx` | Keep as-is | None |

---

## Acceptance Criteria

- [ ] Navigation shows "Surface Treatment Services" (not "Surface Treatment")
- [ ] Home page has ONLY 6 sections (Hero, Innovation+Video, ClearTract+Encrustation, Testimonials, Trust, CTA)
- [ ] "Peer-Reviewed Research / Clinically Demonstrated Technology" section REMOVED
- [ ] Video appears NEXT TO "Innovation that Matters" cards
- [ ] Encrustation image appears with ClearTract showcase
- [ ] No single paragraph exceeds 2 sentences
- [ ] Technology page under 100 lines
- [ ] ClearTract page under 180 lines
- [ ] No duplicate Zwitterionic sections across pages
- [ ] Site feels high-tech and VC-attractive
- [ ] No lint errors
- [ ] All pages load fast (check for unnecessary imports)

---

## Visual Direction

The site should feel:
- **Clean** - generous whitespace, not cluttered
- **Confident** - bold headlines, minimal explanations
- **Technical** - the visuals (contact angles, diagrams) speak for themselves
- **Premium** - subtle gradients, professional imagery
- **Fast** - quick to scan, easy to find info

**NOT:**
- Wordy
- Academic/research paper tone
- Repetitive
- Overwhelming

---

## Testing Checklist

1. Navigate through all pages - should feel fast and punchy
2. Count sections on home page - should be exactly 6
3. Search for "Peer-Reviewed Research" - should not exist
4. Check nav - should say "Surface Treatment Services"
5. Verify video is next to feature cards on home page
6. Verify encrustation image appears with ClearTract
7. Run build to check for errors
8. Mobile responsive check

---

*This overhaul is URGENT. The current site does not meet the standard for VC presentation.*
