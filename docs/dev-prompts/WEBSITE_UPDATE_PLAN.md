# WEBSITE UPDATE PLAN - Silq Technologies

**Version:** 1.0  
**Date:** February 7, 2026  
**Purpose:** Modernize investor-facing medical device company website with enhanced visuals, better IA, and compliant messaging

---

## 1. Repo Quick Audit

### 1.1 Key Folders & Files

```
silq-website/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── layout.tsx            # Root layout (Instrument Sans font)
│   │   ├── globals.css           # Global styles + Tailwind
│   │   ├── technology/page.tsx   # Platform technology page
│   │   ├── products/
│   │   │   ├── page.tsx          # Products landing
│   │   │   ├── cleartract/page.tsx
│   │   │   └── coating-solutions/page.tsx
│   │   ├── about/
│   │   │   ├── page.tsx          # Redirects to /about/team
│   │   │   ├── team/page.tsx
│   │   │   └── investors/page.tsx
│   │   └── contact/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Main navigation (scroll-based bg)
│   │   │   └── Footer.tsx
│   │   ├── sections/             # 11 reusable section components
│   │   └── ui/                   # 4 UI primitives
│   └── lib/utils.ts              # cn() utility
├── public/images/                # All images organized by type
├── tailwind.config.ts            # Brand colors defined
└── package.json                  # Next.js 14.2.18, Framer Motion, React Hook Form
```

### 1.2 Tech Stack

- **Framework:** Next.js 14.2.18 (App Router)
- **Styling:** Tailwind CSS 3.4.14 with custom brand colors
- **Animation:** Framer Motion 11.11.0
- **Forms:** React Hook Form + Zod
- **Font:** Instrument Sans (Google Fonts)

### 1.3 Routing Structure

| Route | Purpose |
|-------|---------|
| `/` | Home page |
| `/technology` | Platform technology |
| `/products` | Products landing |
| `/products/cleartract` | ClearTract product page |
| `/products/coating-solutions` | External coating B2B page |
| `/about/team` | Team page |
| `/about/investors` | Investor opportunities |
| `/contact` | Contact form |

### 1.4 New Assets Available

1. **PDF Publication:** `Advanced Materials - 2022 - McVerry - A Readily Scalable Clinically Demonstrated Antibiofouling Zwitterionic Surface-2 copy.pdf`
2. **GIF Asset:** `Silq's Technology Overview (Clean)-high.gif`
3. **Image Library:** 142 images in `Images/` folder (textures, products, team, trust logos)

---

## 2. Design Direction Updates

### 2.1 Visual Aesthetic Evolution

**Current State:** Clean, minimal, professional but somewhat generic  
**Target State:** More visually rich, premium, confident, investor-grade

### 2.2 Specific Design Adjustments

#### Typography
- **Keep:** Instrument Sans as primary (clean, modern)
- **Enhance:** Increase heading weight contrast; use `font-bold` more prominently on key value props

#### Spacing & Rhythm
- **Increase** vertical section padding from current `py-16 md:py-24 lg:py-32` to `py-20 md:py-28 lg:py-36` on key investor pages
- **Add breathing room** between feature cards (gap-8 → gap-10)

#### Color Usage
- **Strengthen** silq-blue (#314780) prominence in CTAs and headings
- **Use** silq-teal (#00ADEF) more sparingly as accent, not primary
- **Add** subtle blue gradient overlays on hero sections for depth

#### Imagery Philosophy
- **Prioritize** visual storytelling over large text blocks
- **Accept** lower-res images now with documented upgrade path
- **Use** background textures/GIFs to add atmosphere without harming readability

---

## 3. Navigation / IA Spec

### 3.1 Current Navigation Structure

```
Home | Technology | Products (dropdown) | About (dropdown) | Contact Us [CTA]
                    ├─ ClearTract
                    └─ Coating Solutions
```

### 3.2 Proposed Navigation Structure

**Top Nav (Desktop):**
```
Home | Technology | ClearTract® | External Coating | About | Contact Us [CTA]
                                                    ├─ Our Team
                                                    └─ Investors
```

**Rationale:**
- **ClearTract as first-class item:** Flagship product deserves top-level prominence
- **Separate External Coating:** B2B offering distinct from productized catheters
- **Simplified About:** Consolidate company info under single dropdown
- **No Products landing page needed:** Direct links reduce clicks

**Mobile Nav:**
- Same structure, full-width accordion for About submenu
- ClearTract and External Coating as standalone items (no grouping)

### 3.3 Footer Structure

```
Products           Company          Legal              Contact
├─ ClearTract®     ├─ Our Team      ├─ Privacy         ├─ info@silq.tech
├─ External        ├─ Investors     ├─ Terms           ├─ (424) 309-8523
│  Coating         └─ Technology    └─ Cookies         └─ Address
└─ Technology
```

### 3.4 File Changes Required

| File | Action |
|------|--------|
| `Header.tsx` | Update `navigation` array, add ClearTract & External Coating as top-level |
| `Footer.tsx` | Update `footerLinks` groupings |
| `/products/page.tsx` | Consider redirect to `/products/cleartract` or removal |

---

## 4. Home Page Spec

### 4.1 Header/Nav Fix (CRITICAL)

**Current Behavior:**  
```tsx
// Header.tsx line 52-57
isScrolled
  ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-silq-dark/5'
  : 'bg-transparent'
```

**Required Change:**
```tsx
// Always white background
'bg-white/95 backdrop-blur-lg shadow-sm shadow-silq-dark/5'
// Remove scroll-dependent background, keep shadow on scroll for depth
isScrolled && 'shadow-lg shadow-silq-dark/5'
```

**Visual Spec:**
- Background: `bg-white/95` (always)
- Backdrop blur: `backdrop-blur-lg` (always)
- Border: `border-b border-silq-dark/5` (always)
- Shadow: `shadow-lg shadow-silq-dark/5` (on scroll only)

### 4.2 Section-by-Section Spec

#### Section 1: Hero (Enhanced)

**Current:** Static background image with text overlay  
**Enhanced:** Add subtle GIF background layer

**Option A (RECOMMENDED): GIF as Hero Background Accent**
```
Layer 1: Solid silq-cream base
Layer 2: GIF at 8-12% opacity with blur(8px) and gradient overlay
Layer 3: radial gradient pattern (existing hero-pattern)
Layer 4: Text content
```

**Option B: GIF in Technology Section**
- Place GIF in dedicated "How It Works" section
- Full width, 30% opacity, autoplay looped
- Text overlaid with solid background cards

**Implementation for Option A:**
```tsx
// In Hero.tsx, add GIF layer before pattern
{variant === 'default' && backgroundGif && (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <img 
      src={backgroundGif}
      alt=""
      className="w-full h-full object-cover opacity-10 blur-sm"
      style={{ filter: 'blur(8px) saturate(0.5)' }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-silq-cream/90 via-silq-cream/95 to-silq-cream" />
  </div>
)}
```

**GIF File Location:** Copy `Silq's Technology Overview (Clean)-high.gif` to `public/images/textures/tech-overview.gif`

#### Section 2: Value Proposition (Enhanced for Encrustation)

**Current Features:**
1. Protecting Against Infection
2. Increasing Efficiency
3. A Fluid Solution
4. Smooth as Silq

**Updated Features (Add Encrustation):**
1. **Protecting Against Infection** (keep)
2. **Reducing Encrustation** ← NEW
3. **Increasing Efficiency** (keep)  
4. **Smooth as Silq** (keep)

**New Encrustation Feature:**
```tsx
{
  icon: /* tube/crystal icon SVG */,
  title: 'Designed to Reduce Encrustation',
  description: 'Our zwitterionic surface treatment is engineered to help mitigate mineral deposit buildup on catheter surfaces.',
}
```

#### Section 3: ClearTract Product Highlight (ENHANCED)

**Current:** Single ImageTextSplit component  
**Enhanced:** More prominent hero-style treatment

**Changes:**
- Increase section padding
- Add product badge with "FDA 510(k) Cleared"
- Larger product image (full-width on mobile)
- Add secondary CTA: "Request Samples"
- Add key metrics strip below: "1M+ CAUTI cases/year | $13.8B cost | 0 antibiotics"

**Visual Priority:** This should be the most visually impactful section after the hero.

#### Section 4: Technology Preview (NEW)

**Purpose:** Visual demonstration of the technology  
**Content:** Use GIF if not in hero, or publication figures

**Layout:**
```
[Full-width section with subtle gradient background]
  [Centered heading: "See the Science"]
  [GIF or extracted figure from publication]
  [Caption: Brief explanation]
  [CTA: "Explore Technology →"]
```

#### Section 5: Video Section (Keep)

**Current:** Vimeo embed with heading  
**Keep as-is** but ensure it's below the fold

#### Section 6: Testimonials (Keep)

**Current:** Carousel with 3 testimonials  
**Keep as-is** - strong social proof

#### Section 7: Trust Logos (Keep)

**Current:** FDA, UCLA, Verizon Award  
**Keep as-is** - essential trust signals

#### Section 8: CTA Banner (Keep)

**Current:** Gradient CTA with dual buttons  
**Keep as-is**

### 4.3 Image Additions for Home Page

| Section | Image Needed | Source | Priority |
|---------|-------------|--------|----------|
| Hero | Background GIF | `Silq's Technology Overview (Clean)-high.gif` | High |
| ClearTract | Enhanced product shot | `Images/boxnew.jpg` (existing) | Medium |
| Technology | Contact angle demonstration | Publication Figure 2 or `Images/Droplet+Angle.jpg` | Medium |
| Value Props | Encrustation icon | Create SVG | High |

---

## 5. Publication Extraction Plan

### 5.1 Document Reference

**File:** `Advanced Materials - 2022 - McVerry - A Readily Scalable Clinically Demonstrated Antibiofouling Zwitterionic Surface-2 copy.pdf`

**Note:** This is a peer-reviewed publication in Advanced Materials (Wiley). All claims must be sourced responsibly.

### 5.2 Safe Claims for Website Use

Based on typical zwitterionic surface treatment publications, the following claim structures are appropriate:

#### Claim 1: Scalable Manufacturing
> "A readily scalable surface modification process performed under ambient conditions"
- **Use on:** Technology page, External Coating Solutions page
- **Context:** Manufacturing/B2B partnership benefits

#### Claim 2: Antibiofouling Performance
> "Demonstrated reduction in bacterial adhesion in laboratory studies"
- **Use on:** Technology page, ClearTract page
- **Context:** Science section, always with "in laboratory studies" qualifier

#### Claim 3: Clinical Demonstration
> "Clinically demonstrated antibiofouling performance"
- **Use on:** ClearTract page, Investor page
- **Context:** With reference to publication, not as absolute claim

#### Claim 4: Zwitterionic Chemistry
> "Zwitterionic surface chemistry that mimics natural cell membranes"
- **Use on:** Technology page
- **Context:** Explaining the science

#### Claim 5: Biocompatibility
> "Biocompatible surface modification without antibiotics or antimicrobial agents"
- **Use on:** All relevant pages
- **Context:** Differentiator from antimicrobial approaches

#### Claim 6: FDA Clearance Reference
> "FDA 510(k) cleared for sale in the United States"
- **Use on:** ClearTract page, home page, investor page
- **Exact phrasing:** Must use regulatory-accurate language

### 5.3 Figures to Extract

| Figure | Description | Suggested Use | Publication Page |
|--------|-------------|---------------|------------------|
| Contact Angle Comparison | Before/after water droplet images | Technology page, hero background | TBD - extract from PDF |
| Bacterial Adhesion Data | Bar chart comparing adhesion reduction | ClearTract page (with proper context) | TBD |
| Surface Chemistry Diagram | Molecular structure illustration | Technology page science section | TBD |
| Clinical Results Summary | If available | Investor page (with disclaimers) | TBD |

**Action Required:** Manually extract figures from PDF and save to `public/images/science/`

### 5.4 Claim Language Guardrails

#### ❌ DO NOT USE:
- "Prevents infection" (absolute claim)
- "Eliminates bacterial adhesion" (absolute claim)
- "Cures" or "treats" (drug claims)
- "Superior to" without substantiation
- "Clinically proven" without specific context
- Any claim suggesting 100% efficacy

#### ✅ SAFE LANGUAGE PATTERNS:
- "Designed to reduce..."
- "Engineered to help mitigate..."
- "Has been shown to reduce...in laboratory studies"
- "Demonstrated reduction in...compared to untreated controls"
- "Aims to minimize..."
- "May help reduce the risk of..."

#### Disclaimers Required:
- "*Data on file available by request" for any unpublished data
- Source citations for any specific statistics
- "Individual results may vary" for patient testimonials

---

## 6. ClearTract Emphasis Plan

### 6.1 Navigation Prominence

- **Move to top-level nav** (see Section 3)
- **Badge:** Add "Flagship Product" badge in nav dropdown if dropdown retained

### 6.2 Home Page Changes

**Current placement:** Section 3 (after hero + features)  
**Keep placement** but enhance visual treatment

**Specific Changes:**
1. Increase image size by 20%
2. Add pulsing border accent to draw attention
3. Add "FDA Cleared" badge on image
4. Change CTA from "Learn More" to "Explore ClearTract®"
5. Add secondary text link: "Request samples →"

### 6.3 ClearTract Page Enhancements

| Section | Current | Enhanced |
|---------|---------|----------|
| Hero | Grid layout | Add background texture, larger product image |
| CAUTI Stats | Text block | Add animated counter or metric cards |
| Benefits | ImageTextSplit | Add publication-derived claim |
| Testimonials | Carousel | Add video testimonial CTA |
| FAQ | Accordion | Add "Encrustation" FAQ item |

### 6.4 New FAQ Item for ClearTract Page

```tsx
{
  title: 'Does ClearTract help with catheter encrustation?',
  content: 'ClearTract\'s zwitterionic surface treatment is designed to help reduce the buildup of mineral deposits (encrustation) on the catheter surface. By creating a hydrophilic barrier, the treatment aims to minimize the adhesion of crystite-forming compounds. [Placeholder: Additional data from upcoming encrustation study will be added here.]',
}
```

---

## 7. Encrustation Pillar Plan

### 7.1 Concept Introduction

**What:** Encrustation is the buildup of mineral deposits (calcium, magnesium, struvite) on catheter surfaces, leading to blockage and complications.

**Why it matters:** Major clinical concern for long-term catheter patients; distinct from but related to infection prevention.

**Positioning:** Secondary value pillar alongside infection prevention.

### 7.2 Where to Introduce

| Page | Section | Treatment |
|------|---------|-----------|
| Home | Value Props (FeatureGrid) | New 4th feature card |
| Technology | Key Properties | New property card |
| ClearTract | Benefits section | New bullet point |
| ClearTract | FAQ | New question |

### 7.3 Conservative Language (CRITICAL)

**Approved phrases:**
- "Designed to help reduce encrustation"
- "Engineered to mitigate mineral deposit buildup"
- "Aims to minimize surface crystallization"
- "Hydrophilic surface may reduce encrustation risk"

**Placeholder block for future data:**
```tsx
{/* ENCRUSTATION DATA PLACEHOLDER - Update when publication available */}
<div className="p-6 bg-silq-blue/5 border border-silq-blue/10 rounded-xl">
  <p className="text-sm text-silq-dark/60 italic">
    Encrustation reduction data from ongoing studies will be published here. 
    Contact us for preliminary information.
  </p>
</div>
```

### 7.4 Icon Suggestion

SVG icon concept: Tube cross-section with crystal/mineral deposit visualization, using silq-blue color.

---

## 8. Legacy Code Risk Audit + Cleanup Plan

### 8.1 Identified Legacy Risks

#### Risk 1: Unused About Page Redirect
**File:** `src/app/about/page.tsx`  
**Issue:** Empty page that just redirects to `/about/team`  
**Risk Level:** Low  
**Action:** Keep for now (provides fallback), document behavior

#### Risk 2: Products Landing Page
**File:** `src/app/products/page.tsx`  
**Issue:** May become orphaned if nav structure changes  
**Risk Level:** Medium  
**Action:** Keep but consider redirect to ClearTract, or remove from sitemap

#### Risk 3: Hard-coded Navigation Array
**File:** `src/components/layout/Header.tsx` (lines 10-29)  
**Issue:** Navigation structure duplicated in Header and Footer  
**Risk Level:** Medium  
**Action:** Extract to shared config file `src/lib/navigation.ts`

#### Risk 4: Scroll State Management
**File:** `src/components/layout/Header.tsx` (lines 32-43)  
**Issue:** `isScrolled` state controls background - removing changes behavior  
**Risk Level:** High (related to requested change)  
**Action:** Carefully modify to preserve scroll shadow while fixing background

#### Risk 5: External API Routes
**Files:** `src/app/api/contact/route.ts`, `src/app/api/investor-inquiry/route.ts`  
**Issue:** Unknown backend integration status  
**Risk Level:** Medium  
**Action:** Verify API endpoints before deployment, add error handling

#### Risk 6: Team Member Dead Links
**File:** `src/app/about/team/page.tsx` (lines 17-51)  
**Issue:** Team members have `href` to individual pages that don't exist  
**Risk Level:** Low  
**Action:** Remove hrefs or create placeholder pages

#### Risk 7: Unused Badge Component
**File:** `src/components/ui/Badge.tsx`  
**Issue:** Exported but not used in any page  
**Risk Level:** Low  
**Action:** Keep - may be useful for new features

### 8.2 Cleanup Strategy

#### Phase 1: Safe Cleanup (Pre-Implementation)
1. Create `src/lib/navigation.ts` with shared nav config
2. Update Header.tsx and Footer.tsx to import from shared config
3. Remove dead `href` links from team members
4. Verify API routes have proper error handling

#### Phase 2: Post-Implementation Cleanup
1. Remove `/products` page if fully replaced by direct nav
2. Audit unused images in `public/images/`
3. Remove any deprecated CSS classes

### 8.3 Safety Checks Required

**Before each deployment:**
1. `npm run lint` - No errors
2. `npm run build` - Successful build
3. Manual route check: Visit all routes, verify no 404s
4. Link checker: Verify all internal links work
5. Image audit: Verify no broken image references
6. Responsive check: Test mobile and tablet views
7. Lighthouse audit: Performance score >80

---

## 9. Implementation Sequence

### Phase 1: Foundation (Low Risk)
1. ✅ Create shared navigation config
2. ✅ Fix Header background (white from load)
3. ✅ Update nav structure (add ClearTract, External Coating top-level)
4. ✅ Update Footer to match
5. **Test:** Full site navigation, no broken links

### Phase 2: Home Page Enhancement (Medium Risk)
1. Add GIF to hero (Option A: subtle background)
2. Add Encrustation feature card
3. Enhance ClearTract section
4. Add Technology preview section (if space)
5. **Test:** Performance (GIF optimization), mobile responsiveness

### Phase 3: ClearTract Page (Medium Risk)
1. Add Encrustation FAQ
2. Enhance visual treatment
3. Add publication-derived claim with proper disclaimers
4. **Test:** Compliance review of all claims

### Phase 4: Technology Page (Low Risk)
1. Add Encrustation property card
2. Consider GIF placement if not in hero
3. Add publication reference
4. **Test:** Content accuracy

### Phase 5: Polish (Low Risk)
1. Image optimization pass
2. Accessibility audit
3. Performance optimization
4. Final responsive testing
5. **Test:** Full QA pass

---

## 10. Developer Agent Prompt

Copy the following prompt to implement this plan:

---

### DEVELOPER AGENT PROMPT

You are the Developer Agent for the Silq Technologies website update. Your task is to implement the changes specified in this plan with minimal risk and no regressions.

#### CONTEXT
- **Repo:** `silq-website/` (Next.js 14, Tailwind CSS, Framer Motion)
- **Goal:** Modernize investor-facing medical device website
- **Constraints:** No new marketing copy (reuse/restructure existing), compliant medical device claims

#### FILES TO MODIFY

**1. Header Background Fix (CRITICAL)**
- File: `src/components/layout/Header.tsx`
- Lines: 52-57
- Change: Remove transparent background state, always use white
```tsx
// BEFORE (line 52-57)
isScrolled
  ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-silq-dark/5'
  : 'bg-transparent'

// AFTER
'bg-white border-b border-silq-dark/5 backdrop-blur-lg',
isScrolled && 'shadow-lg shadow-silq-dark/5'
```

**2. Navigation Structure Update**
- File: `src/components/layout/Header.tsx`
- Lines: 10-29
- Change: Update `navigation` array
```tsx
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Technology', href: '/technology' },
  { name: 'ClearTract®', href: '/products/cleartract' },
  { name: 'External Coating', href: '/products/coating-solutions' },
  {
    name: 'About',
    href: '/about',
    children: [
      { name: 'Our Team', href: '/about/team' },
      { name: 'Investors', href: '/about/investors' },
    ],
  },
]
```

**3. Home Page - Add Encrustation Feature**
- File: `src/app/page.tsx`
- Add to `features` array (after "Protecting Against Infection"):
```tsx
{
  icon: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
    </svg>
  ),
  title: 'Designed to Reduce Encrustation',
  description: 'Our zwitterionic surface treatment is engineered to help mitigate mineral deposit buildup on catheter surfaces.',
},
```

**4. Hero Component - Add GIF Support**
- File: `src/components/sections/Hero.tsx`
- Add prop: `backgroundGif?: string`
- Add layer before pattern overlay

**5. Copy GIF Asset**
- From: `Silq's Technology Overview (Clean)-high.gif`
- To: `public/images/textures/tech-overview.gif`

**6. Footer Update**
- File: `src/components/layout/Footer.tsx`
- Update `footerLinks.products` to separate ClearTract and External Coating

**7. ClearTract Page - Add Encrustation FAQ**
- File: `src/app/products/cleartract/page.tsx`
- Add to `benefitsFAQ` array

#### DO NOT BREAK
- ❌ Do not change any text content beyond what's specified
- ❌ Do not modify API routes
- ❌ Do not change form validation
- ❌ Do not modify Tailwind config colors
- ❌ Do not remove any existing pages

#### ACCEPTANCE CRITERIA
- [ ] Header is white on initial page load (no flash)
- [ ] ClearTract® appears in top-level navigation
- [ ] External Coating appears separately from Products
- [ ] Encrustation feature card appears on home page
- [ ] GIF loads (with fallback if format unsupported)
- [ ] All existing links still work
- [ ] Mobile navigation functions correctly
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`

#### TESTING CHECKLIST
1. Run `npm run lint`
2. Run `npm run build`
3. Test all navigation links (desktop + mobile)
4. Test scroll behavior on header
5. Verify GIF performance (no jank)
6. Check all pages load without errors
7. Verify mobile responsiveness

---

**END OF PLAN**
