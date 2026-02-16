# Dev Agent Prompt: Final Site Polish & Code Cleanup

**Priority:** 🔴 CRITICAL  
**Created:** 2026-02-11  
**Status:** Ready for Implementation

---

## Objective

Perform a comprehensive review of the entire site to:
1. Fix any formatting or placement issues
2. Enhance copy for a high-tech, professional, investor-attractive appearance
3. Remove unnecessary labels, badges, and extraneous text
4. Delete unused code and components from the codebase

**Guiding Principle:** Every element should provide clear value. If a label restates what's obvious, remove it. If a badge duplicates the heading, remove it. Aim for elegance and confidence, not verbosity.

---

## PART 1: CODE CLEANUP - Delete Unused Files

### Unused Components to DELETE

The following components are not imported anywhere in the codebase:

```
DELETE: src/components/ui/VideoPlayer.tsx
DELETE: src/components/ui/Badge.tsx
```

### Update UI Index File

**File:** `src/components/ui/index.ts`

**Current:**
```typescript
export { Button } from './Button'
export { Card, CardHeader, CardContent, CardFooter } from './Card'
export { Badge } from './Badge'
export { VideoEmbed } from './VideoEmbed'
export { VideoPlayer } from './VideoPlayer'
```

**Replace with:**
```typescript
export { Button } from './Button'
export { Card, CardHeader, CardContent, CardFooter } from './Card'
export { VideoEmbed } from './VideoEmbed'
```

---

## PART 2: HOMEPAGE POLISH

**File:** `src/app/page.tsx`

### Issue 1: Hero Copy Could Be Stronger

**Current:**
```jsx
description="Drug-free surface technology for medical devices. FDA-cleared. UCLA-born."
```

**Change to:**
```jsx
description="FDA-cleared surface technology. Antibiotic-free. Proven in clinical use."
```

*Rationale: "UCLA-born" is less compelling to investors than clinical validation.*

### Issue 2: Feature Card Copy Is Generic

Update the feature descriptions to be more specific:

```jsx
const features = [
  {
    icon: (/* shield icon */),
    title: 'Infection Resistance',
    description: 'Biofilm reduction without antibiotics or antimicrobials.',
  },
  {
    icon: (/* refresh icon */),
    title: 'Reduced Encrustation',
    description: 'Fewer blockages, fewer replacements, reduced trauma.',
  },
  {
    icon: (/* lightning icon */),
    title: 'Cost Efficiency',
    description: 'Decrease complication-related expenses.',
  },
  {
    icon: (/* sparkle icon */),
    title: 'Enhanced Comfort',
    description: 'Superior lubricity for patient wellbeing.',
  },
]
```

*Rationale: "Smooth as Silq" is marketing-speak. "Enhanced Comfort" is more professional.*

### Issue 3: "Why Silq" Eyebrow is Unnecessary

The "Innovation That Matters" heading is strong enough on its own.

**Remove this:**
```jsx
<div className="flex items-center gap-3 mb-2">
  <div className="w-1 h-8 bg-silq-blue rounded-full" />
  <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue">
    Why Silq
  </p>
</div>
```

**Keep only:**
```jsx
<h2 className="text-display-sm font-bold text-silq-dark mb-4">
  Innovation That Matters
</h2>
```

### Issue 4: Trust Logo Labels

Some labels are redundant. Simplify:

**Change:**
- "510(k) Cleared" → Remove label (FDA logo is recognizable)
- "Research Origins" → Remove label (UCLA logo is recognizable)
- "GPO Approved" → Keep (explains the Premier/Vizient logos)
- "Made in USA" → Keep (important differentiator)

**New Trust Section:**
```jsx
<section className="py-16 bg-white">
  <div className="container-silq">
    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
      <div className="h-14 flex items-center">
        <Image src="/images/trust/fda.png" alt="FDA Cleared" width={50} height={50} className="object-contain" />
      </div>
      <div className="h-14 flex items-center">
        <Image src="/images/trust/ucla.jpg" alt="UCLA" width={90} height={45} className="h-10 w-auto object-contain" />
      </div>
      <div className="flex flex-col items-center">
        <div className="h-14 flex items-center justify-center gap-3">
          <Image src="/images/trust/premier-logo.png" alt="Premier" width={50} height={35} className="h-7 w-auto object-contain" />
          <Image src="/images/trust/vizient-logo.png" alt="Vizient" width={50} height={35} className="h-7 w-auto object-contain" />
        </div>
        <p className="text-xs text-silq-dark/40 mt-1">GPO Approved</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="h-14 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-silq-blue/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-silq-dark/40 mt-1">Made in USA</p>
      </div>
    </div>
  </div>
</section>
```

---

## PART 3: TECHNOLOGY PAGE POLISH

**File:** `src/app/technology/page.tsx`

### Issue 1: "UCLA-Born Innovation" Badge

This is fine for research credibility. **Keep it.**

### Issue 2: "The Science" Eyebrow is Unnecessary

The heading "How It Works" is clear on its own.

**Remove:**
```jsx
<p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
  The Science
</p>
```

### Issue 3: "Platform Capabilities" Eyebrow

Also unnecessary. "Customizable Surface Properties" is descriptive enough.

**Remove:**
```jsx
<p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
  Platform Capabilities
</p>
```

### Issue 4: Partner CTA Section Copy

**Current:**
```jsx
<p className="text-white/70 mb-8">
  We partner with medical device and industrial manufacturers to bring antibiofouling solutions to your products.
</p>
```

**Change to:**
```jsx
<p className="text-white/70 mb-8">
  Partner with us to bring proven antibiofouling technology to your devices.
</p>
```

---

## PART 4: CLEARTRACT PAGE POLISH

**File:** `src/app/products/cleartract/page.tsx`

### Issue 1: "FDA 510(k) Cleared" Badge

This provides value. **Keep it.**

### Issue 2: Product Specs Section - Reduce Redundancy

The specs are repeated in multiple ways. Consolidate.

**Current issue:** "100% Medical Grade Silicone" label, then "No latex, BPA, or DEHP" as subtitle. 

**Change to more elegant presentation:**
```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto text-center">
  <div>
    <p className="text-sm font-semibold text-silq-teal">Medical Grade Silicone</p>
    <p className="text-xs text-white/50">Latex, BPA, DEHP-free</p>
  </div>
  <div>
    <p className="text-sm font-semibold text-silq-teal">FDA Cleared</p>
    <p className="text-xs text-white/50">510(k) regulatory approval</p>
  </div>
  <div>
    <p className="text-sm font-semibold text-silq-teal">Drug-Free</p>
    <p className="text-xs text-white/50">No antibiotics or antimicrobials</p>
  </div>
  <div>
    <p className="text-sm font-semibold text-silq-teal">Low Endotoxin</p>
    <p className="text-xs text-white/50">Reduced vs. alternatives*</p>
  </div>
</div>
```

### Issue 3: "Product Benefits" Eyebrow

Unnecessary with "Designed for Better Outcomes" heading.

**Remove:**
```jsx
<p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
  Product Benefits
</p>
```

### Issue 4: Benefit Card Headers Have Icons Inline

This looks cluttered. Move icons above the text:

**Current:**
```jsx
<h3 className="text-xl font-bold text-silq-dark mb-3 flex items-center gap-2">
  <svg ... />
  Resisting Bacterial Adhesion
</h3>
```

**Change to:**
```jsx
<div className="flex items-center gap-3 mb-3">
  <div className="w-10 h-10 rounded-lg bg-silq-blue/10 flex items-center justify-center">
    <svg className="w-5 h-5 text-silq-blue" ... />
  </div>
  <h3 className="text-xl font-bold text-silq-dark">Resisting Bacterial Adhesion</h3>
</div>
```

---

## PART 5: SURFACE TREATMENT PAGE POLISH

**File:** `src/app/products/surface-treatment/page.tsx`

### Issue 1: "B2B Partnership" Badge

Could be clearer. 

**Change to:** "For Device Manufacturers"

### Issue 2: "Manufacturing" Eyebrow

Unnecessary with "Scalable Manufacturing" heading.

**Remove:**
```jsx
<p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
  Manufacturing
</p>
```

### Issue 3: "Surface Properties" Eyebrow

Unnecessary.

**Remove:**
```jsx
<p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
  Surface Properties
</p>
```

### Issue 4: Property Card Descriptions

Tighten the copy:

- "Permanently transformed surface capable of repelling bacteria and restricting growth that promotes infection."
  → "Resists bacterial adhesion and biofilm formation."

- "50% reduction in surface thrombus coverage, reducing catheter-related thrombosis complications."
  → "50% reduction in surface thrombus coverage.*"

- "Low coefficient of friction providing dramatically improved lubricity on medical-grade materials."
  → "Dramatically improved surface lubricity."

- "Dramatically enhanced wettability for applications requiring moisture retention."
  → "Enhanced wettability and moisture retention."

---

## PART 6: PRODUCTS INDEX PAGE POLISH

**File:** `src/app/products/page.tsx`

### Issue 1: "Our Products" Badge

Unnecessary - the page title makes this obvious.

**Remove:**
```jsx
<span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
  Our Products
</span>
```

### Issue 2: Product Card Badges

"Flagship Product" and "B2B Partnership" are helpful differentiators. **Keep them.**

### Issue 3: Trust Section Labels

The labels "510(k) Cleared", "Born from UCLA", "Award Winner" add context. Keep but simplify:

- "Born from UCLA" → "UCLA Research"
- "Award Winner" → Remove entirely (Verizon award doesn't need explanation)

---

## PART 7: CONTACT PAGE POLISH

**File:** `src/app/contact/page.tsx`

### Issue 1: "Get in Touch" Badge

Redundant with "Let's Talk" heading.

**Remove:**
```jsx
<span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
  Get in Touch
</span>
```

### Issue 2: Redundant Contact Info

Contact info appears both as hero badges AND in the sidebar. Remove from hero.

**Remove the quick contact badges entirely:**
```jsx
{/* Remove this entire block */}
<div className="mt-8 flex flex-wrap justify-center gap-4">
  <a href="mailto:info@silq.tech" className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
    ...
  </a>
  <a href="tel:4243098523" ...>
    ...
  </a>
</div>
```

### Issue 3: "Other Ways to Reach Us" Heading

Could be simpler.

**Change to:** "Contact Information"

---

## PART 8: TEAM PAGE POLISH

**File:** `src/app/about/team/page.tsx`

### Issue 1: "About Silq" Badge

Unnecessary.

**Remove:**
```jsx
<span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
  About Silq
</span>
```

### Issue 2: "Leadership" Subtitle in TeamGrid

Redundant with "Meet Our Team" heading. Check TeamGrid component.

If TeamGrid has a subtitle prop, either:
- Remove the subtitle prop, OR
- Change subtitle to empty string: `subtitle=""`

### Issue 3: Scientific Advisory Section

This section is vague and adds little value.

**Option A - Remove entirely**
**Option B - Make specific (if there are named advisors)**

For now, **remove the section:**
```jsx
{/* DELETE THIS SECTION */}
<section className="py-16 bg-white">
  <div className="container-silq">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-silq-dark mb-4">
        Scientific Advisory
      </h2>
      ...
    </div>
  </div>
</section>
```

---

## PART 9: INVESTORS PAGE POLISH

**File:** `src/app/about/investors/page.tsx`

### Issue 1: "Investment Opportunities" Badge + "Investor Opportunities" Heading

Nearly identical - redundant.

**Remove the badge:**
```jsx
<span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
  Investment Opportunities
</span>
```

**Simplify the heading:**
```jsx
<h1 className="text-hero-sm md:text-hero font-bold text-silq-blue">
  Invest in Silq
</h1>
```

### Issue 2: "Why Invest in Silq?" List

The bullet points are good but some copy is verbose.

**Tighten:**
- "ClearTract® Foley Catheters are already FDA 510(k) cleared and commercially available."
  → "FDA-cleared product in commercial distribution."

- "Our zwitterionic surface treatment extends beyond catheters to multiple medical devices and industrial applications."
  → "Platform technology applicable across device categories."

- "Patented technology born from UCLA research with exclusive licensing rights."
  → "Strong IP portfolio with exclusive UCLA license."

- "$1B+ catheter market with significant unmet need for infection prevention."
  → "$1B+ addressable market with clear unmet need."

- "Leadership with deep expertise in medical devices, material science, and commercialization."
  → "Experienced leadership team."

- "Strong clinical evidence supporting our technology's efficacy in reducing infections."
  → "Clinical evidence demonstrating efficacy."

### Issue 3: Manufacturing Section Badge

"Manufacturing" is obvious from the heading.

**Remove:**
```jsx
<span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-teal bg-silq-teal/20 rounded-full">
  Manufacturing
</span>
```

### Issue 4: "Backed By World-Class Research" Heading

This is vague marketing-speak.

**Change to:** "Credentials" or simply remove the heading and let the logos speak.

---

## PART 10: REP DIRECTORY PAGE POLISH

**File:** `src/app/rep/page.tsx`

### Issue 1: "Sales Network" Badge

Internal jargon.

**Remove:**
```jsx
<span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-teal bg-silq-teal/20 rounded-full">
  Sales Network
</span>
```

### Issue 2: "Data Version" Stat

This is internal/technical information that doesn't help reps.

**Remove from stats grid:**
```jsx
{/* Remove this stat */}
<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
  <p className="text-3xl font-bold">{manifest?.dataVersion}</p>
  <p className="text-sm text-white/60">Data Version</p>
</div>
```

**Change grid to 2 columns:**
```jsx
<motion.div 
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  className="mt-12 max-w-2xl mx-auto grid grid-cols-2 gap-4"
>
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
    <p className="text-3xl font-bold">{uniqueReps.length}</p>
    <p className="text-sm text-white/60">Territories</p>
  </div>
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
    <p className="text-3xl font-bold">{allStates.length}</p>
    <p className="text-sm text-white/60">States</p>
  </div>
</motion.div>
```

### Issue 3: Footer Note

Too verbose. Simplify:

```jsx
<section className="py-6 bg-silq-dark text-white/50 text-center text-xs">
  <div className="container-silq">
    <p>
      Internal use only. Last updated: {manifest?.generated ? new Date(manifest.generated).toLocaleDateString() : 'Unknown'}
    </p>
  </div>
</section>
```

---

## PART 11: 404 PAGE POLISH

**File:** `src/app/not-found.tsx`

### Issue 1: "Looking for something specific?" Text

Slightly condescending. 

**Change to:** "Try these pages:"

---

## PART 12: GLOBAL CONSISTENCY CHECKS

### Verify All Pages Have Consistent:

1. **Section padding:** Use `section-padding` class consistently
2. **Container:** Use `container-silq` class consistently
3. **Heading sizes:** 
   - Page titles: `text-hero-sm md:text-hero`
   - Section headings: `text-display-sm`
   - Subsection headings: `text-2xl`
4. **Button styles:** Primary actions use `variant="primary"`, secondary use `variant="secondary"`

### Font Weight Consistency

Ensure all section headings use `font-bold`, not a mix of `font-bold` and `font-semibold`.

---

## PART 13: FIND & FIX ANY ADDITIONAL ISSUES

As you review each page, look for and fix:

1. **Orphan text** - Single words on their own line at the end of paragraphs
2. **Inconsistent spacing** - Sections with different top/bottom padding
3. **Dead hover states** - Hover effects that don't do anything meaningful
4. **Redundant link text** - "Click here", "Learn more" appearing multiple times in one view
5. **Empty or placeholder text** - Any remaining "Lorem ipsum" or "TODO" comments visible to users
6. **Console errors** - Check browser console for any warnings
7. **Accessibility issues** - Missing alt text, poor color contrast, missing focus states
8. **Mobile issues** - Text too small, buttons too close together, horizontal scroll

---

## TESTING CHECKLIST

After completing all changes:

- [ ] Homepage loads without console errors
- [ ] All pages render correctly on mobile (375px width)
- [ ] All pages render correctly on desktop (1440px width)
- [ ] All links work correctly
- [ ] All images load (no broken images)
- [ ] All videos play
- [ ] Form submissions work (Contact, Investor)
- [ ] Navigation works on all pages
- [ ] Footer appears on all pages
- [ ] No unused imports in any file
- [ ] `npm run build` succeeds with no errors
- [ ] Lighthouse score > 90 for Performance

---

## SUMMARY OF FILES TO MODIFY

| File | Changes |
|------|---------|
| `src/components/ui/VideoPlayer.tsx` | **DELETE** |
| `src/components/ui/Badge.tsx` | **DELETE** |
| `src/components/ui/index.ts` | Remove VideoPlayer and Badge exports |
| `src/app/page.tsx` | Copy improvements, remove redundant labels |
| `src/app/technology/page.tsx` | Remove eyebrow labels, tighten copy |
| `src/app/products/cleartract/page.tsx` | Consolidate specs, remove eyebrows |
| `src/app/products/surface-treatment/page.tsx` | Remove eyebrows, tighten descriptions |
| `src/app/products/page.tsx` | Remove "Our Products" badge |
| `src/app/contact/page.tsx` | Remove badge and redundant contact badges |
| `src/app/about/team/page.tsx` | Remove badge, remove Scientific Advisory section |
| `src/app/about/investors/page.tsx` | Remove badge, tighten copy |
| `src/app/rep/page.tsx` | Remove badge, remove Data Version stat |
| `src/app/not-found.tsx` | Minor copy tweak |

---

## COPY PRINCIPLES

When reviewing any text, apply these principles:

1. **Eliminate redundancy** - Don't say the same thing twice
2. **Remove qualifiers** - Delete "very", "really", "dramatically" unless quantified
3. **Active voice** - "We developed" not "Was developed by us"
4. **Specific over generic** - "50% reduction" not "significant reduction"
5. **Confident tone** - "Our technology reduces..." not "Our technology may help to reduce..."
6. **Investor mindset** - Every claim should be believable and ideally verifiable

---

*This document should result in a cleaner, more professional site that communicates confidence and competence to potential investors and partners.*
