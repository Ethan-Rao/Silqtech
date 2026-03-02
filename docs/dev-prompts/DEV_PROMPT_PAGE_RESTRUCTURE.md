# Dev Prompt: ClearTract & Technology Page Restructure

## Overview
This prompt contains structural changes to the ClearTract and Technology pages to improve layout and content organization.

---

## CLEARTRACT PAGE (`src/app/products/cleartract/page.tsx`)

### 1. Reduce Size of Registered Trademark Symbol (®)

The ® symbol after "ClearTract" in the hero title is too large. Wrap it in a smaller span.

**Change FROM (Line ~106-107):**
```tsx
<h1 className="text-hero-sm md:text-hero font-bold text-silq-dark">
  ClearTract® Foley Catheters
</h1>
```

**Change TO:**
```tsx
<h1 className="text-hero-sm md:text-hero font-bold text-silq-dark">
  ClearTract<span className="text-[0.5em] align-super">®</span> Foley Catheters
</h1>
```

This makes the ® symbol 50% of the heading size and positions it as superscript.

---

### 2. Remove "Reduced Encrustation" Card

In the Clinical Benefits section (Lines ~206-216), **DELETE the entire "Reduced Encrustation" card**:

```tsx
{/* Reduced Encrustation - Text-only card */}
<div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-silq-teal/10 flex items-center justify-center">
    <svg className="w-6 h-6 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
    </svg>
  </div>
  <h4 className="font-semibold text-silq-blue mb-2">Reduced Encrustation</h4>
  <p className="text-sm text-silq-dark/60">Zwitterionic surfaces reduce mineral buildup for longer catheter life and fewer replacements.</p>
</div>
```

After removing, change the grid from 4 columns to 3 columns:
```tsx
<div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
```

---

## TECHNOLOGY PAGE (`src/app/technology/page.tsx`)

### Major Restructure Required

The page sections need to be reordered and content reorganized:

**NEW ORDER:**
1. Hero (keep as-is)
2. **How It Works** (move up - currently Section 3)
3. **Surface Properties** (move up - currently Section 4, add publication graphic)
4. **Adopt our Technology** (rename from "License Our Technology", add Multi-Substrate content)
5. **REMOVE** "Explore Our Product" CTABanner

---

### 1. Reorder: Move "How It Works" Section to Top

Move the entire "How It Works" section (currently Lines ~95-140) to be immediately after the Hero section.

The section starts with:
```tsx
{/* How It Works - Compact with Video */}
<section className="py-20 bg-gradient-to-b from-silq-cream to-white">
```

Move this entire section to come right after the Hero (after Line ~38).

---

### 2. Move "Surface Properties" Section After "How It Works"

The "Surface Properties" section (currently Lines ~145-242) should come after "How It Works".

---

### 3. Add Publication Graphic to Surface Properties Section

Add the Advanced Materials publication graphic (smaller version) to the Surface Properties section. Add it after the bacteria panel but before the 3-card row:

```tsx
{/* Row 1: Bacteria Panel - Full Width */}
<div className="mb-8">
  {/* ... existing bacteria panel ... */}
</div>

{/* Publication Reference - Compact */}
<div className="mb-8 flex justify-center">
  <a 
    href="https://onlinelibrary.wiley.com/doi/10.1002/adma.202200254"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-6 bg-silq-cream rounded-xl p-4 hover:shadow-lg transition-shadow max-w-2xl"
  >
    <Image 
      src="/images/publications/advanced-materials-cover.jpg"
      alt="Advanced Materials Journal Cover"
      width={80}
      height={104}
      className="rounded-lg shadow-md flex-shrink-0"
    />
    <div>
      <p className="text-xs text-silq-dark/50 uppercase tracking-wider mb-1">Published in Advanced Materials (2022)</p>
      <p className="text-sm font-medium text-silq-dark leading-snug">
        "A Readily Scalable, Clinically Demonstrated, Antibiofouling Zwitterionic Surface Treatment"
      </p>
      <p className="text-xs text-silq-blue mt-2 font-medium">
        Read the full paper →
      </p>
    </div>
  </a>
</div>

{/* Row 2: Other 3 Cards */}
```

---

### 4. Flip Anti-Thrombogenicity Images

In the Surface Properties section, swap the order of the blood loop images so **Silq Treated is on TOP**:

**Change FROM (Lines ~185-204):**
```tsx
<div className="flex flex-col gap-1 px-2 pb-2">
  <div className="rounded-lg overflow-hidden">
    <Image 
      src="/images/science/blood-loop-treated.jpg"
      alt="Blood loop - treated surface"
      ...
    />
  </div>
  <div className="rounded-lg overflow-hidden">
    <Image 
      src="/images/science/blood-loop-untreated.jpg"
      alt="Blood loop - control surface"
      ...
    />
  </div>
</div>
```

**Actually this is already correct** - treated is on top. But verify and add labels to make it clearer:

```tsx
<div className="flex flex-col gap-1 px-2 pb-2">
  <div className="rounded-lg overflow-hidden relative">
    <Image 
      src="/images/science/blood-loop-treated.jpg"
      alt="Blood loop - Silq treated surface"
      width={400}
      height={150}
      className="w-full h-32 object-contain bg-white"
    />
    <span className="absolute bottom-1 left-2 text-xs bg-silq-teal/90 text-white px-2 py-0.5 rounded">Silq Treated</span>
  </div>
  <div className="rounded-lg overflow-hidden relative">
    <Image 
      src="/images/science/blood-loop-untreated.jpg"
      alt="Blood loop - untreated control"
      width={400}
      height={150}
      className="w-full h-32 object-contain bg-white"
    />
    <span className="absolute bottom-1 left-2 text-xs bg-gray-500/90 text-white px-2 py-0.5 rounded">Control</span>
  </div>
</div>
```

---

### 5. Rename "License Our Technology" to "Adopt Our Technology" and Add Multi-Substrate Content

The section currently at Lines ~264-292 needs to be renamed AND the Multi-Substrate Compatibility content needs to be moved here.

**Change the section to:**
```tsx
{/* Adopt Our Technology - Combined with Multi-Substrate */}
<section className="relative py-20 bg-gradient-to-br from-silq-dark via-silq-blue-900 to-silq-dark text-white overflow-hidden">
  <div className="absolute inset-0 opacity-[0.05]">
    <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-silq-teal blur-3xl" />
    <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-silq-blue blur-3xl" />
  </div>
  <div className="container-silq relative z-10">
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-display-sm font-bold mb-4">
          Adopt Our Technology
        </h2>
        <p className="text-white/60 max-w-lg mx-auto">
          Bring antibiofouling technology to your devices.
        </p>
      </div>
      
      {/* Two Column: Multi-Substrate Chart + Manufacturing */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
        {/* Left: Multi-Substrate Compatibility */}
        <div>
          <h3 className="text-xl font-bold text-silq-teal mb-4">
            Multi-Substrate Compatibility
          </h3>
          <p className="text-white/70 mb-6">
            Our treatment demonstrates consistent performance across multiple polymer substrates.
          </p>
          <div className="bg-white/10 rounded-xl p-4">
            <ContactAngleChart />
          </div>
        </div>
        
        {/* Right: Manufacturing */}
        <div>
          <div className="rounded-2xl overflow-hidden shadow-2xl mb-4">
            <Image 
              src="/images/science/silq-machine.gif"
              alt="Silq Manufacturing System"
              width={600}
              height={400}
              className="w-full h-auto"
              unoptimized
            />
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="text-base font-bold text-silq-teal mb-2">Scalable Manufacturing</h3>
            <p className="text-sm text-white/70">
              Rapid deposition process under ambient conditions. No exotic chemicals. Commercial-scale capacity.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Buttons */}
      <div className="flex justify-center gap-4 flex-wrap">
        <Link href="/products/surface-treatment">
          <Button variant="primary" size="lg">
            Surface Treatment Services →
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="secondary" size="lg" className="text-white border-white/20 hover:bg-white/10">
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  </div>
</section>
```

---

### 6. Remove Original Multi-Substrate Section

After moving the content to "Adopt Our Technology", **DELETE** the original "Contact Angle + Manufacturing" section (Lines ~40-90):

```tsx
{/* Contact Angle + Manufacturing - Two Column */}
<section className="py-20 bg-white">
  ... entire section ...
</section>
```

---

### 7. REMOVE "Explore Our Product" CTABanner

**DELETE** the final CTABanner at the bottom of the page (Lines ~294-300):

```tsx
{/* CTA */}
<CTABanner
  title="Explore Our Product"
  cta={{ text: 'ClearTract® Catheters', href: '/products/cleartract' }}
  secondaryCta={{ text: 'Contact Us', href: '/contact' }}
  variant="gradient"
/>
```

---

### 8. Remove "Data Availability Note" Section

Since the publication link is now in the Surface Properties section, **DELETE** the separate data availability section (Lines ~244-262):

```tsx
{/* Data Availability Note */}
<section className="py-6 bg-white">
  ... entire section ...
</section>
```

---

## FINAL TECHNOLOGY PAGE STRUCTURE

After all changes, the Technology page should have this order:

1. **Hero** - Dark gradient with "Platform Technology" title
2. **How It Works** - Two column with bullet points and video
3. **Surface Properties** - Bacteria panel, publication link, 3 property cards
4. **Adopt Our Technology** - Dark section with Multi-Substrate chart, manufacturing GIF, CTAs

---

## Commit and Deploy

After all changes:
```bash
git add -A
git commit -m "Restructure Technology page, update ClearTract page"
git push origin main
git push origin main:staging --force
```

## Verification Checklist

### ClearTract Page
- [ ] ® symbol is smaller (superscript style)
- [ ] "Reduced Encrustation" card is removed
- [ ] Remaining 3 cards are properly centered

### Technology Page
- [ ] "How It Works" is the first content section after hero
- [ ] "Surface Properties" includes the publication link graphic
- [ ] Anti-Thrombogenicity images have labels (Silq Treated on top)
- [ ] "Adopt Our Technology" section contains Multi-Substrate chart and manufacturing GIF
- [ ] No "Explore Our Product" CTABanner at bottom
- [ ] Page flows cleanly with no duplicate content
