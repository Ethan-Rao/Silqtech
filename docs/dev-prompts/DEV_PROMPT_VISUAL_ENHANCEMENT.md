# Dev Agent Prompt: Visual Enhancement & Content Polish

**Priority:** 🔴 HIGH  
**Created:** 2026-02-16  
**Goal:** Create a clean, professional, investor-attractive website

---

## 🚨 CRITICAL: Fix Build First

The staging deployment is failing because changes haven't been pushed. Run these commands first:

```bash
cd C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website
git add .
git commit -m "Fix build: remove Resend dependency, update images, visual polish"
git push origin staging
```

**What was fixed (already in local files):**
1. Removed `resend` from `package.json` dependencies
2. Removed all Resend imports from API routes (`src/app/api/contact/route.ts` and `src/app/api/investor-inquiry/route.ts`)
3. Added Node.js version to `package.json`: `"engines": { "node": ">=18.0.0" }`
4. Updated image paths for `Bacteria Panel.png` and `Encrustation1.png`

After pushing, Digital Ocean will auto-deploy and the build should succeed.

---

## Core Principles

1. **Less is more** - Remove unnecessary text, labels, and explanations
2. **Show, don't tell** - Let visuals speak; minimize copy
3. **Whitespace is good** - Don't crowd elements
4. **Consistency** - Same patterns across all pages
5. **Professional tone** - No marketing fluff, no exclamation points

---

## GLOBAL CHANGES

### Remove Redundant Labels/Badges

Throughout the site, remove eyebrow labels that restate the obvious:

**Pattern to eliminate:**
```jsx
<span className="...">Label Text</span>  {/* Remove if heading says the same thing */}
<h2>Heading That Says The Same Thing</h2>
```

**Example fixes:**
- "Our Products" badge above "Products" heading → Remove badge
- "Investment Opportunities" badge above "Investor Opportunities" heading → Remove badge
- "Get in Touch" badge above "Let's Talk" heading → Remove badge
- "About Silq" badge above team content → Remove badge

### Tighten All Copy

Every paragraph should be 1-2 sentences max. If it's longer, cut it.

**Before:**
```
Our patented zwitterionic treatment creates a covalent bond with the catheter 
surface, resulting in a permanently transformed device capable of repelling 
bacteria and restricting biofilm growth—without antibiotics or antimicrobial agents.
```

**After:**
```
Zwitterionic treatment creates a permanent bond that repels bacteria—no antibiotics needed.
```

### Consistent Section Padding

Use `section-padding` class consistently (py-16 md:py-24).

### Button Text

Keep button text to 2-3 words max:
- "Learn More About Our Technology" → "Learn More"
- "Request Partnership Information" → "Partner With Us"
- "Schedule a Consultation" → "Get Started"

---

## PAGE-BY-PAGE REVIEW

### Homepage (`src/app/page.tsx`)

#### Hero Section
- ✅ Keep as-is (clean, minimal)

#### Innovation That Matters Section
Current description is good but could be shorter:
```jsx
// CURRENT
<p className="text-silq-dark/70 mb-8">
  Zwitterionic molecules create a hydration barrier that resists protein and bacterial adhesion—mimicking natural cell membranes.
</p>

// CHANGE TO
<p className="text-silq-dark/70 mb-8">
  Zwitterionic molecules create a hydration barrier that repels proteins and bacteria.
</p>
```

#### ClearTract Section
- Remove "FDA 510(k) Cleared" badge (it's obvious from the product page)
- Keep description short

**Current:**
```jsx
<p className="text-white/80 mb-6">
  Drug-free infection resistance. Reduced encrustation. Superior patient comfort.
</p>
```
**Good - keep it.**

#### Testimonials Section
- ⚠️ Still has placeholder content - needs real testimonials
- If no real testimonials available, REMOVE the entire testimonials carousel
- A site without testimonials is better than one with "Placeholder testimonial text"

**If removing testimonials, delete lines 267-338 entirely.**

#### Surface Treatment Section
- Current copy is good
- Remove emoji icons, replace with SVG icons for professionalism:

```jsx
// CURRENT
{ icon: '🔬', label: 'Custom Formulations' },

// CHANGE TO
{ 
  icon: (
    <svg className="w-5 h-5 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ), 
  label: 'Custom Formulations' 
},
```

Do this for all 4 capability items.

#### News Section
- Good as-is

#### Trust Logos Section
- Remove "GPO Approved" and "Made in USA" labels
- Let the logos speak for themselves
- Keep clean row of logos without text

```jsx
// Remove the labels, just show logos in a row
<div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
  <Image src="/images/trust/fda.png" alt="FDA Cleared" width={50} height={50} />
  <Image src="/images/trust/ucla.jpg" alt="UCLA" width={90} height={45} />
  <Image src="/images/trust/premier-logo.svg" alt="Premier" width={60} height={30} />
  <Image src="/images/trust/vizient-logo.svg" alt="Vizient" width={60} height={30} />
</div>
```

#### CTA Banner
- Current is good: "Ready to Learn More?" + "Connect with our team."

---

### Technology Page (`src/app/technology/page.tsx`)

#### Hero
- Remove "UCLA-Born Innovation" badge - it's in the trust logos
- Keep hero clean with just title and one-line description

#### Contact Angle Section
- Remove "Wide Applicability" eyebrow label
- Change heading from "Works Across Materials" to just "Multi-Substrate Compatibility"
- Table is good, keep it

#### How It Works Section
- Good as-is

#### Customizable Properties Section
- Remove "Customizable Surface Properties" - redundant
- Just use: "Surface Properties" as heading
- Descriptions under each card are good

#### Partner CTA
**Current:**
```jsx
<p className="text-white/60 mb-8 max-w-lg mx-auto">
  Partner with us to bring proven antibiofouling technology to your devices.
</p>
```
**Change to:**
```jsx
<p className="text-white/60 mb-8 max-w-lg mx-auto">
  Bring antibiofouling technology to your devices.
</p>
```

---

### ClearTract Page (`src/app/products/cleartract/page.tsx`)

#### Hero
- Keep "FDA 510(k) Cleared" badge here (it's the product page)
- Current description is good

#### Specs + Testimonials Section
- Specs grid is clean, keep it
- Testimonials look real - keep them

#### Benefits Section
**Current heading:**
```jsx
<h2 className="text-display-sm font-bold text-silq-dark">
  Designed for Better Outcomes
</h2>
```
**Change to:**
```jsx
<h2 className="text-display-sm font-bold text-silq-dark">
  Clinical Benefits
</h2>
```

Benefit card descriptions - tighten:

**"Resisting Bacterial Adhesion" card:**
```jsx
// CURRENT
Our patented zwitterionic treatment creates a covalent bond with the catheter surface, 
resulting in a permanently transformed device capable of repelling bacteria and 
restricting biofilm growth—without antibiotics or antimicrobial agents.

// CHANGE TO
Permanent zwitterionic bond repels bacteria without antibiotics.
```

**"Reduced Encrustation" card:**
```jsx
// CURRENT
ClearTract's surface treatment is engineered to mitigate mineral deposit buildup. 
Reduced encrustation means fewer blockages, reduced trauma during removal, and 
improved patient comfort throughout catheterization.

// CHANGE TO
Engineered to reduce mineral buildup. Fewer blockages, less trauma.
```

---

### Surface Treatment Page (`src/app/products/surface-treatment/page.tsx`)

#### Hero
- Change "For Device Manufacturers" badge to just remove it
- The page title makes it clear

#### Scalability Section
- Good as-is

#### Customizable Outcomes Section
**Current heading:** "Customizable Outcomes"
**Change to:** "Surface Properties"

Card descriptions are already concise - good.

#### Partnership Section
- Remove heading "Why Partner with Silq?"
- Just show the 3 benefit cards without the question

---

### Products Index Page (`src/app/products/page.tsx`)

- Remove "Our Products" badge entirely
- Keep product cards as-is

---

### Contact Page (`src/app/contact/page.tsx`)

- Remove "Get in Touch" badge
- Keep "Let's Talk." heading
- Remove the hero contact badges (email/phone pills) - they're in the sidebar already

**Delete this block (lines ~44-57):**
```jsx
{/* Quick contact badges */}
<div className="mt-8 flex flex-wrap justify-center gap-4">
  <a href="mailto:info@silq.tech" ...>
  <a href="tel:4243098523" ...>
</div>
```

- Change "Other Ways to Reach Us" to just "Contact"

---

### Team Page (`src/app/about/team/page.tsx`)

- Remove "About Silq" badge
- Change hero heading from "The Story. The Team." to just "Leadership"
- Remove the vague "Scientific Advisory" section entirely (lines 129-142)

---

### Investors Page (`src/app/about/investors/page.tsx`)

- Remove "Investment Opportunities" badge
- Change heading from "Investor Opportunities" to "Invest in Silq"
- Remove decorative divider under heading

**Tighten "Why Invest" bullet points:**

| Current | Change To |
|---------|-----------|
| ClearTract® Foley Catheters are already FDA 510(k) cleared and commercially available. | FDA-cleared product in market. |
| Our zwitterionic surface treatment extends beyond catheters to multiple medical devices and industrial applications. | Platform technology for multiple device categories. |
| Patented technology born from UCLA research with exclusive licensing rights. | Exclusive UCLA patent license. |
| $1B+ catheter market with significant unmet need for infection prevention. | $1B+ addressable market. |
| Leadership with deep expertise in medical devices, material science, and commercialization. | Experienced leadership team. |
| Strong clinical evidence supporting our technology's efficacy in reducing infections. | Clinical evidence of efficacy. |

- Remove "Manufacturing" badge in manufacturing section
- Remove "Backed By World-Class Research" heading - just show logos

---

### Rep Directory Page (`src/app/rep/page.tsx`)

- Remove "Sales Network" badge
- Remove "Data Version" stat from hero stats (internal info)
- Simplify footer text

---

### 404 Page (`src/app/not-found.tsx`)

- Change "Looking for something specific?" to "Try these:"

---

## COLOR & SPACING CONSISTENCY

### Check these patterns are consistent:

1. **Section backgrounds alternate:** white → cream → white → dark → cream
2. **All headings use:** `text-display-sm font-bold text-silq-dark`
3. **All body text uses:** `text-silq-dark/70` (70% opacity)
4. **All badges use:** `px-4 py-1.5 text-sm font-semibold rounded-full`
5. **Card shadows:** `shadow-lg hover:shadow-xl transition-shadow`

---

## THINGS TO NOT CHANGE

- ✅ Hero sections (already clean)
- ✅ Navigation (already clean)  
- ✅ Footer (already clean)
- ✅ Rep pages (working well)
- ✅ Interactive map (functional)
- ✅ Form designs (functional)

---

## FINAL CHECKLIST

After making changes:

- [ ] No placeholder text visible anywhere
- [ ] No emoji icons (use SVG icons)
- [ ] No paragraphs longer than 2 sentences
- [ ] No redundant badges/labels
- [ ] Consistent spacing between sections
- [ ] All images load correctly
- [ ] Site looks good on mobile (375px)
- [ ] Site looks good on desktop (1440px)
- [ ] `npm run build` succeeds

---

## PHILOSOPHY

**Investors skim.** They don't read paragraphs. They look at:
1. What does it do? (one line)
2. Is it FDA cleared? (badge)
3. Who's on the team? (photos)
4. What's the market? (one number)

Every word that doesn't serve these questions should be removed.

**Professional = Restraint.** The most impressive company websites say the least. Apple doesn't explain why their products are good in paragraphs. They show them and state facts.

Apply this mindset to every page.
