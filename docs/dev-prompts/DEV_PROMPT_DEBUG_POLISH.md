# Developer Agent Prompt: Debug & Polish

**Date:** February 2026  
**Priority:** 🔴 CRITICAL  
**Objective:** Fix visual imbalances, eliminate problematic language, and ensure consistent professional appearance

---

## Instructions

This prompt identifies **5 specific issues per page** plus instructs you to find **5 additional improvements** on each page (10 total per page). Execute all changes systematically.

**Critical Rules:**
1. **ELIMINATE** all "Technology Demonstrations" language site-wide
2. **ELIMINATE** all "Works on" cards and language site-wide
3. **MERGE** related sections to reduce page length and improve balance
4. **USE PLACEHOLDERS** with specific callouts when images need to be remade

---

## PAGE 1: HOME PAGE (`src/app/page.tsx`)

### Issues to Fix (5)

#### H1. Back-to-Back Same-Color Sections
**Problem:** Section 3.5 (Technology Demo) and Section 4 (Testimonials) both use `bg-silq-cream`, creating visual monotony.

**Fix:** Change Section 3.5 to white background:
```tsx
// Line 214: CHANGE FROM
<section className="section-padding bg-silq-cream">

// TO
<section className="section-padding bg-white">
```

#### H2. Redundant "See Our Technology in Action" Section  
**Problem:** Section 3.5 creates unnecessary page length with generic language.

**Fix:** DELETE entire Section 3.5 (lines 213-241). The technology video is already shown in Section 2. If CTAs are needed, add them to Section 2 or the CTA banner.

#### H3. Video Caption Too Technical
**Problem:** Line 140-141 says "How our zwitterionic treatment transforms surfaces" — too technical for home page.

**Fix:**
```tsx
// CHANGE TO
<p className="text-center text-sm text-silq-dark/50 mt-4">
  Silq surface treatment in action
</p>
```

#### H4. Trust Section Logo Inconsistency  
**Problem:** Based on screenshot, Vizient logo appears but code references Verizon Award. Verify correct asset and ensure consistent sizing.

**Fix:** Audit `public/images/trust/` and ensure correct logo is referenced. All logos should have similar visual weight:
```tsx
<div className="flex flex-col items-center">
  <div className="h-16 flex items-center justify-center">
    <Image src="/images/trust/fda.png" alt="FDA Cleared" width={60} height={60} className="object-contain" />
  </div>
  <p className="text-xs text-silq-dark/50 mt-2">510(k) Cleared</p>
</div>
```

#### H5. Feature Cards Layout Imbalance
**Problem:** 2x2 grid of feature cards can look cramped on certain viewports.

**Fix:** Add minimum height to ensure consistent card sizing:
```tsx
<motion.div 
  className="p-5 bg-silq-cream rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[140px] flex flex-col"
  // ...
>
```

### Find 5 More Improvements
Examine the page and implement 5 additional enhancements for visual balance, spacing, or professional appearance.

---

## PAGE 2: CLEARTRACT PAGE (`src/app/products/cleartract/page.tsx`)

### Issues to Fix (5)

#### C1. Remove Product Sizes
**Problem:** Lines 45-53 show sizes (14Fr, 16Fr, 18Fr). User wants these removed.

**Fix:** DELETE the entire sizes block:
```tsx
// DELETE lines 45-53:
{/* Available Sizes (C4) */}
<div className="mt-4 flex items-center gap-3">
  <span className="text-sm font-medium text-silq-dark/50">Available sizes:</span>
  {['14Fr', '16Fr', '18Fr'].map(size => (
    <span key={size} className="px-3 py-1 bg-silq-blue/10 text-silq-blue text-sm font-semibold rounded-full">
      {size}
    </span>
  ))}
</div>
```

#### C2. Missing Product Specifications
**Problem:** Page is missing key product details from brochure copy.

**Fix:** Add a specifications section after the hero, before Key Benefits:
```tsx
{/* Product Specifications - Compact Strip */}
<section className="py-8 bg-silq-dark text-white">
  <div className="container-silq">
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-center">
      <div>
        <p className="text-sm font-semibold text-silq-teal">100% Medical Grade Silicone</p>
        <p className="text-xs text-white/60">No latex, BPA, or DEHP</p>
      </div>
      <div className="hidden md:block w-px bg-white/20" />
      <div>
        <p className="text-sm font-semibold text-silq-teal">FDA Cleared</p>
        <p className="text-xs text-white/60">Urethral, Suprapubic, Nephrostomy</p>
      </div>
      <div className="hidden md:block w-px bg-white/20" />
      <div>
        <p className="text-sm font-semibold text-silq-teal">Antibiotic Free</p>
        <p className="text-xs text-white/60">Drug-free infection resistance</p>
      </div>
      <div className="hidden md:block w-px bg-white/20" />
      <div>
        <p className="text-sm font-semibold text-silq-teal">Endotoxin & Pyrogen Free</p>
        <p className="text-xs text-white/60">Reduced vs. market alternatives*</p>
      </div>
    </div>
    <p className="text-center text-xs text-white/40 mt-4">*Data on file available by request</p>
  </div>
</section>
```

#### C3. Update Hero Description
**Problem:** Description doesn't emphasize patient comfort.

**Fix:**
```tsx
// CHANGE line 41-42 FROM:
<p className="mt-4 text-lg text-silq-dark/70">
  Drug-free surface treatment designed to reduce infection and encrustation.
</p>

// TO:
<p className="mt-4 text-lg text-silq-dark/70">
  Drug-free surface treatment designed to reduce infection, encrustation, and improve patient comfort.
</p>
```

#### C4. Benefits Cards Text Inconsistency
**Problem:** "18x improvement in lubricity" is a specific claim without context.

**Fix:** Update the Enhanced Lubricity card (lines 137-145):
```tsx
<h4 className="font-semibold text-silq-dark mb-2">Designed for Comfort</h4>
<p className="text-sm text-silq-dark/60">Enhanced lubricity alleviating patient discomfort during insertion and removal</p>
```

#### C5. Image Cards Height Mismatch
**Problem:** The two main benefit cards (Bacterial Adhesion, Encrustation) may have different image heights causing visual imbalance.

**Fix:** Force consistent image container height:
```tsx
<div className="bg-white rounded-2xl overflow-hidden shadow-lg">
  <div className="h-48 md:h-56 overflow-hidden">
    <Image 
      src="/images/science/bacteria-panel.png"
      alt="Bacterial adhesion comparison"
      width={600}
      height={400}
      className="w-full h-full object-cover"
    />
  </div>
  <div className="p-6">
    // ...
  </div>
</div>
```

Apply the same pattern to both image cards.

### Find 5 More Improvements
Examine the page and implement 5 additional enhancements for visual balance, spacing, or professional appearance.

---

## PAGE 3: SURFACE TREATMENT PAGE (`src/app/products/surface-treatment/page.tsx`)

### Issues to Fix (5)

#### S1. Eliminate "Technology Demonstrations" Section
**Problem:** Lines 134-179 contain a section titled "Technology Demonstrations" which should be eliminated as standalone section.

**Fix:** DELETE the entire "Technology Demos" section (lines 134-179).

#### S2. Merge Demo Videos into Customizable Surface Properties
**Problem:** Demo videos should be integrated into the Customizable Surface Properties section, not separate.

**Fix:** Expand the Customizable Surface Properties section (lines 84-132) to include the videos as property demonstrations:
```tsx
{/* Customizable Surface Properties - WITH Videos */}
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
    
    {/* 2x2 Grid: Images + Videos */}
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Microbial Resistance - Image */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="h-48 md:h-56 overflow-hidden">
          <Image 
            src="/images/science/bacteria-panel.png"
            alt="Bacterial adhesion reduction data"
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="font-bold text-silq-dark text-lg mb-2">Microbial Resistance</h3>
          <p className="text-silq-dark/70 text-sm">
            Permanently transformed surface capable of repelling bacteria and restricting growth that promotes infection.
          </p>
        </div>
      </div>
      
      {/* Anti-Thrombogenicity - Image */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="h-48 md:h-56 overflow-hidden">
          <Image 
            src="/images/science/blood-loop.webp"
            alt="Blood loop thrombosis comparison"
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="font-bold text-silq-dark text-lg mb-2">Anti-Thrombogenicity</h3>
          <p className="text-silq-dark/70 text-sm">
            50% reduction in surface thrombus coverage, reducing catheter-related thrombosis complications.
          </p>
        </div>
      </div>
      
      {/* Enhanced Lubricity - Video */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="h-48 md:h-56 overflow-hidden">
          <video 
            src="/videos/frictionless-silicone.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="font-bold text-silq-dark text-lg mb-2">Enhanced Lubricity</h3>
          <p className="text-silq-dark/70 text-sm">
            Low coefficient of friction providing dramatically improved lubricity on medical-grade materials.
          </p>
        </div>
      </div>
      
      {/* Hydrophilicity - Video */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="h-48 md:h-56 overflow-hidden">
          <video 
            src="/videos/contact-lens-drying.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="font-bold text-silq-dark text-lg mb-2">Hydrophilicity</h3>
          <p className="text-silq-dark/70 text-sm">
            Dramatically enhanced wettability for applications requiring moisture retention.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### S3. Back-to-Back White Sections
**Problem:** After merge, there may be back-to-back white or cream sections.

**Fix:** Ensure alternating backgrounds:
- Hero: Dark gradient ✓
- Scalable Manufacturing: `bg-white`
- Customizable Surface Properties: `bg-silq-cream`
- Why Partner: `bg-silq-dark` ✓
- CTA: gradient ✓

#### S4. Partnership Cards Visual Weight
**Problem:** The three "Why Partner with Silq?" cards (lines 189-202) may look visually light.

**Fix:** Add icons to each card:
```tsx
<div className="p-6 rounded-xl bg-white/10">
  <div className="w-10 h-10 rounded-full bg-silq-teal/20 flex items-center justify-center mb-3">
    <svg className="w-5 h-5 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  </div>
  <h3 className="font-semibold text-silq-teal mb-2">FDA-Cleared</h3>
  <p className="text-white/70 text-sm">Technology validated with 510(k) clearance</p>
</div>
```

#### S5. Scalability Section Image Placeholder
**Problem:** If silq-machine.gif doesn't exist or looks poor, need placeholder.

**Fix:** Check if image exists. If missing or poor quality, use placeholder:
```tsx
{/* PLACEHOLDER CALLOUT: Need high-quality GIF or video of Silq manufacturing system */}
<div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-silq-blue/5 to-silq-dark/5 flex items-center justify-center h-[300px]">
  <div className="text-center p-8">
    <svg className="w-16 h-16 mx-auto text-silq-blue/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
    <p className="text-silq-dark/40 font-medium">Manufacturing System Visual</p>
    <p className="text-silq-dark/30 text-sm">Asset: silq-machine.gif</p>
  </div>
</div>
```

### Find 5 More Improvements
Examine the page and implement 5 additional enhancements for visual balance, spacing, or professional appearance.

---

## PAGE 4: TECHNOLOGY PAGE (`src/app/technology/page.tsx`)

### Issues to Fix (5)

#### T1. Eliminate "Technology Demonstrations" Section
**Problem:** Lines 114-164 contain a section titled "Technology Demonstrations" which must be eliminated.

**Fix:** DELETE entire section (lines 114-164).

#### T2. Remove "Works On" Language
**Problem:** Line 41-42 still contains "Works on" language in caption.

**Fix:**
```tsx
// CHANGE FROM:
<p className="text-center text-sm text-silq-dark/50 mt-4">
  Wide applicability demonstrated across silicone, nylon, polystyrene, PVC, and polyethylene substrates
</p>

// TO:
<p className="text-center text-sm text-silq-dark/50 mt-4">
  Demonstrated efficacy across multiple polymer substrates
</p>
```

#### T3. Merge Demo Videos into Customizable Properties
**Problem:** "Customizable Properties" (lines 89-112) is too thin. Demo videos should be integrated.

**Fix:** Replace the entire Customizable Properties section with an expanded version:
```tsx
{/* Customizable Properties - WITH Videos */}
<section className="section-padding bg-white">
  <div className="container-silq">
    <div className="text-center mb-10">
      <h2 className="text-display-sm font-bold text-silq-dark">
        Customizable Surface Properties
      </h2>
      <p className="text-silq-dark/60 mt-2 max-w-2xl mx-auto">
        Our platform delivers a unique combination of beneficial surface characteristics.
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {/* Microbial Resistance */}
      <div className="bg-silq-cream rounded-xl overflow-hidden shadow-md">
        <div className="h-32 bg-gradient-to-br from-silq-blue/10 to-silq-teal/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-silq-blue/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="p-4 text-center">
          <h4 className="font-semibold text-silq-dark mb-1">Microbial Resistance</h4>
          <p className="text-xs text-silq-dark/60">Repels bacteria without drugs</p>
        </div>
      </div>
      
      {/* Anti-Thrombogenicity */}
      <div className="bg-silq-cream rounded-xl overflow-hidden shadow-md">
        <div className="h-32 bg-gradient-to-br from-silq-blue/10 to-silq-teal/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-silq-blue/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div className="p-4 text-center">
          <h4 className="font-semibold text-silq-dark mb-1">Anti-Thrombogenicity</h4>
          <p className="text-xs text-silq-dark/60">Reduces clot formation</p>
        </div>
      </div>
      
      {/* Enhanced Lubricity - Video */}
      <div className="bg-silq-cream rounded-xl overflow-hidden shadow-md">
        <div className="h-32 overflow-hidden">
          <video 
            src="/videos/frictionless-silicone.mp4" 
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 text-center">
          <h4 className="font-semibold text-silq-dark mb-1">Enhanced Lubricity</h4>
          <p className="text-xs text-silq-dark/60">Low friction coefficient</p>
        </div>
      </div>
      
      {/* Hydrophilicity - Video */}
      <div className="bg-silq-cream rounded-xl overflow-hidden shadow-md">
        <div className="h-32 overflow-hidden">
          <video 
            src="/videos/contact-lens-drying.mp4" 
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 text-center">
          <h4 className="font-semibold text-silq-dark mb-1">Hydrophilicity</h4>
          <p className="text-xs text-silq-dark/60">Enhanced wettability</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### T4. Back-to-Back Cream Sections
**Problem:** Lines 48-87 (How It Works) and lines 115-164 (Technology Demonstrations) both use `bg-silq-cream`.

**Fix:** After deleting Technology Demonstrations section and expanding Customizable Properties:
- Contact Angle: `bg-white` ✓
- How It Works: `bg-silq-cream` ✓
- Customizable Properties: `bg-white` (changed from cream)
- License Our Technology: `bg-silq-dark` ✓

#### T5. Contact Angle Image Placeholder
**Problem:** If `/images/science/contact-angle-diagram.png` is missing or poor quality.

**Fix:** Check if image exists. If missing, use placeholder:
```tsx
{/* PLACEHOLDER CALLOUT: Need contact angle comparison image showing treatment across multiple substrates */}
```

### Find 5 More Improvements
Examine the page and implement 5 additional enhancements for visual balance, spacing, or professional appearance.

---

## GLOBAL FIXES

### G1. Eliminate "Technology Demonstrations" Language
Search entire codebase for "Technology Demonstration" and remove/rename:
```bash
# Search command
grep -r "Technology Demonstration" src/
```

### G2. Eliminate "Works on" Cards/Language
Search for any remaining "Works on" references and remove them.

### G3. Consistent Section Spacing
Ensure all main content sections use `section-padding` class, not arbitrary `py-*` values.

### G4. Image Aspect Ratio Consistency
All image containers in cards should use:
```tsx
<div className="h-48 md:h-56 overflow-hidden">
  <Image className="w-full h-full object-cover" />
</div>
```

### G5. Video Loading Performance
All videos should have `poster` attribute for better loading:
```tsx
<video 
  poster="/images/video-poster.jpg"  // Add appropriate poster
  // ...
/>
```

---

## Acceptance Criteria

### Per-Page Checklist

**Home Page:**
- [ ] No back-to-back same-color sections
- [ ] "See Our Technology in Action" section removed or integrated
- [ ] Video caption simplified
- [ ] Trust logos consistently sized
- [ ] Feature cards balanced
- [ ] 5 additional improvements implemented

**ClearTract Page:**
- [ ] Sizes removed
- [ ] Product specs strip added (silicone, FDA, antibiotic-free, endotoxin-free)
- [ ] "*Data on file" footnote present
- [ ] Hero description mentions patient comfort
- [ ] Image cards same height
- [ ] 5 additional improvements implemented

**Surface Treatment Page:**
- [ ] "Technology Demonstrations" section eliminated
- [ ] Videos integrated into Customizable Surface Properties
- [ ] No back-to-back same-color sections
- [ ] Partnership cards have icons
- [ ] Scalability image verified or placeholder used
- [ ] 5 additional improvements implemented

**Technology Page:**
- [ ] "Technology Demonstrations" section eliminated
- [ ] No "Works on" language
- [ ] Videos integrated into Customizable Properties
- [ ] Alternating section backgrounds
- [ ] Contact angle image verified or placeholder used
- [ ] 5 additional improvements implemented

### Global Checklist
- [ ] No "Technology Demonstrations" text anywhere
- [ ] No "Works on" cards or language anywhere
- [ ] All sections have consistent padding
- [ ] All image cards have consistent aspect ratios
- [ ] `npm run build` passes
- [ ] No console errors

---

## Testing

1. View each page at 1440px, 1024px, 768px, and 375px viewports
2. Verify no visual imbalances or cramped sections
3. Verify no redundant/repetitive sections
4. Verify all images load correctly
5. Verify all videos autoplay

---

*This debug pass ensures a polished, professional appearance consistent with a high-tech company seeking VC investment.*
