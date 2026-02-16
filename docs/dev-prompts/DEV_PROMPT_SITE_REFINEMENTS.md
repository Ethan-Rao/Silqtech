# Developer Agent Prompt: Site Refinements & Visual Polish

**Date:** February 2026  
**Priority:** 🟡 HIGH  
**Scope:** All non-rep pages, plus minor rep page adjustments

---

## Overview

This prompt addresses specific user-requested changes plus 10 additional improvements to enhance the site's visual appeal and polish, prioritizing the home page.

---

## PART A: User-Requested Changes

### A1. Rep Directory - Remove Subtitle Line

**File:** `src/app/rep/page.tsx`  
**Line:** 97-99

```tsx
// FIND AND DELETE this line:
<p className="text-xl text-white/70">
  Find your territory portal with CAUTI facility data and interactive maps.
</p>
```

The subtitle under "Rep Directory" is unnecessary — remove it entirely.

---

### A2. Rep Page - Change Export Button Text

**File:** `src/app/rep/[slug]/page.tsx`  
**Line:** 397

```tsx
// CHANGE FROM:
Export All Facilities (CSV)

// CHANGE TO:
Export Facilities Within View (CSV)
```

---

### A3. ClearTract Page - Remove Inline Stats

**File:** `src/app/products/cleartract/page.tsx`  
**Lines:** 62-76

```tsx
// DELETE this entire block:
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
```

---

### A4. Home Page - Add Technology Video with CTA

**File:** `src/app/page.tsx`

Add a new section after the ClearTract showcase (Section 3) that features the "How It Works" video with CTAs to Surface Treatment Services and Technology pages.

**Insert this new section between Section 3 (ClearTract) and Section 4 (Testimonials):**

```tsx
{/* Section 3.5: Surface Treatment Services Teaser */}
<section className="section-padding bg-white">
  <div className="container-silq">
    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
      {/* Left: Video */}
      <motion.div 
        className="rounded-2xl overflow-hidden shadow-xl"
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
      
      {/* Right: Copy + CTAs */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
          Platform Technology
        </span>
        <h2 className="text-display-sm font-bold text-silq-dark mb-4">
          How It Works
        </h2>
        <p className="text-silq-dark/70 mb-6">
          Our zwitterionic surface treatment creates a hydration barrier that resists protein and bacterial adhesion—applicable to medical devices and industrial components.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/technology">
            <Button variant="primary" size="lg">Explore Technology</Button>
          </Link>
          <Link href="/products/surface-treatment">
            <Button variant="secondary" size="lg">Surface Treatment Services</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
</section>
```

---

## PART B: 10 Additional Improvements

### B1. Home Page - Fix Back-to-Back Dark Sections

**File:** `src/app/page.tsx`

**Problem:** Section 3 (ClearTract) and Section 4 (Testimonials) both have dark gradient backgrounds, creating visual monotony.

**Solution:** Change Testimonials section to a light background:

```tsx
// CHANGE Section 4 (Testimonials) background from:
<section className="py-20 bg-gradient-to-br from-silq-blue-900 via-silq-dark to-silq-blue-800 text-white relative overflow-hidden">

// TO:
<section className="py-20 bg-silq-cream relative overflow-hidden">
```

Then update all text colors in that section from white to dark:
- `text-white` → `text-silq-dark`
- `text-white/90` → `text-silq-dark/80`
- `text-white/50` → `text-silq-dark/50`
- `bg-silq-teal/20` → `bg-silq-blue/10`
- `text-silq-teal` → `text-silq-blue`
- `bg-white/10` → `bg-white`
- `border-white/10` → `border-silq-dark/10`

---

### B2. Home Page - Enhance Trust Logos Section

**File:** `src/app/page.tsx`  
**Lines:** 258-267

**Problem:** Trust section is sparse—just two small logos and text.

**Solution:** Make it more substantial:

```tsx
{/* Section 5: Trust Logos - Enhanced */}
<section className="py-16 bg-white">
  <div className="container-silq">
    <p className="text-center text-sm font-semibold uppercase tracking-wider text-silq-dark/40 mb-8">
      Trusted & Recognized
    </p>
    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
      <div className="flex flex-col items-center">
        <Image src="/images/trust/fda.png" alt="FDA Cleared" width={70} height={70} />
        <p className="text-xs text-silq-dark/50 mt-2">510(k) Cleared</p>
      </div>
      <div className="flex flex-col items-center">
        <Image src="/images/trust/ucla.jpg" alt="UCLA" width={100} height={50} className="h-12 w-auto" />
        <p className="text-xs text-silq-dark/50 mt-2">Research Origins</p>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-silq-blue/10 flex items-center justify-center mb-2">
          <svg className="w-8 h-8 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-xs text-silq-dark/50">Made in USA</p>
      </div>
    </div>
  </div>
</section>
```

---

### B3. Home Page - Add Subtle Animation to Feature Cards

**File:** `src/app/page.tsx`  
**Lines:** 96-111

**Problem:** Feature cards animate in but have no interactive hover effect.

**Solution:** Add staggered animation delay and hover lift:

```tsx
{features.map((feature, index) => (
  <motion.div 
    key={feature.title} 
    className="p-5 bg-silq-cream rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    ...
  </motion.div>
))}
```

---

### B4. Home Page - Add Gradient Border to CTA Banner

**File:** `src/app/page.tsx` (or `src/components/sections/CTABanner.tsx`)

**Problem:** Final CTA section is plain.

**Solution:** Add a gradient top border for visual interest:

```tsx
// In CTABanner component or inline, add to the section wrapper:
<div className="relative">
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-silq-blue via-silq-teal to-silq-blue" />
  {/* rest of CTABanner content */}
</div>
```

---

### B5. Technology Page - Add Partner CTA

**File:** `src/app/technology/page.tsx`

**Problem:** Technology page is very minimal—ends abruptly.

**Solution:** Add a partnership teaser before the final CTA:

```tsx
{/* Insert before final CTABanner */}
<section className="section-padding bg-silq-dark text-white">
  <div className="container-silq">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-display-sm font-bold mb-4">
        License Our Technology
      </h2>
      <p className="text-white/70 mb-8">
        We partner with medical device and industrial manufacturers to bring antibiofouling solutions to your products.
      </p>
      <Link href="/products/surface-treatment">
        <Button variant="primary" size="lg">
          Surface Treatment Services →
        </Button>
      </Link>
    </div>
  </div>
</section>
```

---

### B6. ClearTract Page - Make FAQ More Prominent

**File:** `src/app/products/cleartract/page.tsx`

**Problem:** FAQ section blends in too much.

**Solution:** Add a header intro above the Accordion:

```tsx
{/* Before <Accordion> */}
<section className="section-padding bg-silq-cream">
  <div className="container-silq">
    <div className="text-center mb-8">
      <h2 className="text-display-sm font-bold text-silq-dark">
        Common Questions
      </h2>
      <p className="text-silq-dark/60 mt-2">
        Everything you need to know about ClearTract® catheters.
      </p>
    </div>
    
    <div className="max-w-3xl mx-auto">
      <Accordion items={benefitsFAQ} />
    </div>
  </div>
</section>
```

Update the Accordion call to remove the duplicate subtitle/title it may have.

---

### B7. Home Page - Improve Hero Visual Weight

**File:** `src/app/page.tsx`

**Problem:** Hero relies on text only—no strong visual element.

**Solution:** Add decorative gradient orbs behind the hero:

```tsx
{/* Add inside Hero section or via Hero props */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-silq-teal/10 rounded-full blur-3xl" />
  <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-silq-blue/10 rounded-full blur-3xl" />
</div>
```

If Hero component doesn't support this, add to `src/components/sections/Hero.tsx` for the `default` variant.

---

### B8. All Pages - Consistent Section Padding

**File:** Multiple

**Problem:** Some sections use `section-padding`, others use inline `py-*` values, creating inconsistent spacing.

**Solution:** Audit and standardize:
- Use `section-padding` class for all main content sections
- Use `py-10` or `py-16` only for minimal divider sections (like Trust Logos)

Check and update:
- `src/app/page.tsx`
- `src/app/technology/page.tsx`
- `src/app/products/cleartract/page.tsx`

---

### B9. ClearTract Page - Add Visual Break Between Benefits and Testimonials

**File:** `src/app/products/cleartract/page.tsx`

**Problem:** Benefits section flows directly into Testimonials with no visual separation.

**Solution:** Add a thin gradient divider:

```tsx
{/* Insert between Benefits section and Testimonials section */}
<div className="h-px bg-gradient-to-r from-transparent via-silq-dark/10 to-transparent" />
```

---

### B10. Home Page - Encrustation Placeholder Styling

**File:** `src/app/page.tsx`  
**Lines:** 156-168

**Problem:** Encrustation placeholder in the dark section looks too prominent for placeholder content.

**Solution:** Make it more subtle until real image is available:

```tsx
// CHANGE the placeholder wrapper from:
<div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl">

// TO:
<div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/10">
```

And reduce the placeholder height:
```tsx
className="w-full h-36 rounded-lg"  // Changed from h-48
```

---

## Files to Modify Summary

| File | Changes | Priority |
|------|---------|----------|
| `src/app/rep/page.tsx` | Remove subtitle line | High |
| `src/app/rep/[slug]/page.tsx` | Change export button text | High |
| `src/app/products/cleartract/page.tsx` | Remove inline stats, enhance FAQ | High |
| `src/app/page.tsx` | Add tech video section, fix dark sections, enhance trust, improve features, fix placeholder | Critical |
| `src/app/technology/page.tsx` | Add partner CTA section | Medium |
| `src/components/sections/Hero.tsx` | Add gradient orbs (optional) | Low |
| `src/components/sections/CTABanner.tsx` | Add gradient top border (optional) | Low |

---

## Acceptance Criteria

### User Requests
- [ ] Rep directory subtitle "Find your territory portal..." removed
- [ ] Rep page export button says "Export Facilities Within View"
- [ ] ClearTract page inline stats (72%, 0, FDA) removed
- [ ] Home page has "How It Works" video section with CTAs to Technology and Surface Treatment Services

### Improvements
- [ ] No two back-to-back dark sections on home page
- [ ] Trust logos section enhanced with labels
- [ ] Feature cards have stagger animation delay
- [ ] CTA banner has gradient accent
- [ ] Technology page has partner section
- [ ] ClearTract FAQ is more prominent
- [ ] Hero has subtle gradient orbs
- [ ] Section padding is consistent
- [ ] Visual divider before ClearTract testimonials
- [ ] Encrustation placeholder is more subtle

### General
- [ ] `npm run build` passes
- [ ] All pages render correctly
- [ ] Mobile responsive
- [ ] No console errors

---

## Testing Checklist

1. Visit home page — verify new video section appears
2. Visit home page — verify testimonials have light background (not dark)
3. Visit home page — verify trust section has labels under logos
4. Visit `/rep` — verify subtitle is gone
5. Visit `/rep/proactive` — verify export button says "Within View"
6. Visit `/products/cleartract` — verify inline stats are removed
7. Check mobile viewport on all modified pages
8. Run build to verify no errors

---

*These refinements improve visual consistency and add polish throughout the site.*
