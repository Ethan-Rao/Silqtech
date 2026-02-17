# Dev Agent Prompt: Layout Refinements & Content Updates

**Priority:** 🔴 CRITICAL  
**Created:** 2026-02-17  
**Goal:** Fix visual balance issues, update image layouts, improve overall polish

---

## OVERVIEW

The site content is good, but formatting and positioning needs refinement. This prompt addresses specific layout issues and visual balance problems across all main pages.

---

## ISSUE 1: Homepage - Innovation Section Balance

**File:** `src/app/page.tsx`

### 1A: Surface Treatment Video Height

The video on the right should match the vertical height of the text and cards on the left.

**Fix:** Make the video container fill available height using flexbox:

```jsx
{/* Innovation That Matters Section */}
<section className="py-20 bg-white">
  <div className="container-silq">
    <div className="grid lg:grid-cols-2 gap-12 items-stretch">  {/* items-stretch for equal height */}
      
      {/* Left: Text + Cards */}
      <div className="flex flex-col">
        <h2 className="text-3xl md:text-4xl font-bold text-silq-dark">
          Innovation That Matters
        </h2>
        <p className="mt-4 text-silq-dark/70 mb-8">
          Zwitterionic molecules create a hydration barrier that repels proteins and bacteria.
        </p>
        
        {/* 2x2 Feature Cards - Fill remaining space */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {/* Feature cards */}
        </div>
      </div>
      
      {/* Right: Video - Match height of left column */}
      <div className="flex flex-col h-full">
        <div className="rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col">
          <video 
            src="/videos/silq-technology-demo.mp4"
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover flex-1"
          />
          <div className="p-3 bg-gradient-to-r from-silq-blue to-silq-teal text-white text-center">
            <p className="text-sm font-medium">Surface Treatment in Action</p>
          </div>
        </div>
        <Link href="/technology" className="mt-4 text-silq-blue hover:text-silq-teal font-medium text-center">
          Learn how it works →
        </Link>
      </div>
    </div>
  </div>
</section>
```

### 1B: Remove Encrustation Images Site-Wide

Remove the encrustation comparison images from:
- Homepage ClearTract section
- ClearTract product page
- Technology page
- Any other location

**Keep the text about encrustation, just remove the image.**

### 1C: Add Advanced Materials Publication Image

Replace the encrustation image in the ClearTract section with the Advanced Materials paper cover.

**Add a new image file:** `/public/images/publications/advanced-materials-cover.jpg`
(Extract the cover from the PDF or use a placeholder)

**Add publication card next to product box:**

```jsx
{/* Images Row - Box and Publication side by side */}
<div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
  {/* Left: Product Box */}
  <motion.div className="flex justify-center">
    <Image 
      src="/images/products/boxnew.jpg"
      alt="ClearTract Foley Catheter"
      width={400}
      height={500}
      className="rounded-2xl shadow-2xl object-contain"
    />
  </motion.div>
  
  {/* Right: Publication - Match height of box */}
  <motion.div className="flex flex-col items-center h-full justify-center">
    <a 
      href="https://onlinelibrary.wiley.com/doi/10.1002/adma.202200254"
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow bg-white"
    >
      <Image 
        src="/images/publications/advanced-materials-cover.jpg"
        alt="Advanced Materials Journal Cover"
        width={350}
        height={450}
        className="object-contain"
      />
    </a>
    <div className="mt-4 text-center max-w-sm">
      <p className="text-white/80 text-sm">
        <span className="font-semibold text-white">Published in Advanced Materials (2022)</span>
        <br />
        "A Readily Scalable, Clinically Demonstrated, Antibiofouling Zwitterionic Surface Treatment"
      </p>
      <a 
        href="https://onlinelibrary.wiley.com/doi/10.1002/adma.202200254"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-silq-teal hover:text-white text-sm font-medium"
      >
        Read the full paper →
      </a>
    </div>
  </motion.div>
</div>
```

---

## ISSUE 2: Technology Page - Image Layout Updates

**File:** `src/app/technology/page.tsx`

### 2A: Blood Loop Images - Stack Vertically

Replace the single blood loop image with two new images stacked vertically.

**Check for new blood loop images in project folder and use them:**

```jsx
{/* Anti-Thrombogenicity - Stacked Images */}
<div className="flex flex-col gap-4">
  <div className="rounded-lg overflow-hidden">
    <Image 
      src="/images/science/blood-loop-1.jpg"  {/* New image 1 */}
      alt="Blood loop comparison - treated"
      width={600}
      height={300}
      className="w-full object-contain bg-white"
    />
  </div>
  <div className="rounded-lg overflow-hidden">
    <Image 
      src="/images/science/blood-loop-2.jpg"  {/* New image 2 */}
      alt="Blood loop comparison - control"
      width={600}
      height={300}
      className="w-full object-contain bg-white"
    />
  </div>
</div>
```

### 2B: Bacteria Panel - Own Row, Enlarged

Put the bacteria panel on its own full-width row, with the other 3 cards in a row below.

```jsx
{/* Customizable Surface Properties Section */}
<section className="py-20 bg-gray-50">
  <div className="container-silq">
    <div className="text-center mb-12">
      <p className="text-sm font-semibold text-silq-blue uppercase tracking-wider mb-2">
        Platform Capabilities
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-silq-dark">
        Customizable Surface Properties
      </h2>
    </div>
    
    {/* Row 1: Bacteria Panel - Full Width */}
    <div className="mb-8">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg max-w-4xl mx-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold text-silq-blue mb-2">Microbial Resistance</h3>
          <p className="text-silq-dark/70 text-sm">
            Significant reduction in bacterial adhesion across multiple pathogenic species.
          </p>
        </div>
        <Image 
          src="/images/science/Bacteria%20Panel.png"
          alt="Bacterial adhesion reduction data"
          width={1200}
          height={400}
          className="w-full object-contain"
        />
      </div>
    </div>
    
    {/* Row 2: Other 3 Cards */}
    <div className="grid md:grid-cols-3 gap-6">
      {/* Anti-Thrombogenicity Card */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="p-5">
          <h3 className="text-lg font-bold text-silq-blue">Anti-Thrombogenicity</h3>
          <p className="text-silq-dark/70 text-sm mt-1">Reduced blood clot formation.</p>
        </div>
        {/* Stacked blood loop images */}
        <div className="flex flex-col">
          <Image src="/images/science/blood-loop-1.jpg" ... />
          <Image src="/images/science/blood-loop-2.jpg" ... />
        </div>
      </div>
      
      {/* Lubricity Card */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="p-5">
          <h3 className="text-lg font-bold text-silq-blue">Enhanced Lubricity</h3>
          <p className="text-silq-dark/70 text-sm mt-1">Improved patient comfort.</p>
        </div>
        {/* Content */}
      </div>
      
      {/* Hydrophilicity Card */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="p-5">
          <h3 className="text-lg font-bold text-silq-blue">Surface Hydrophilicity</h3>
          <p className="text-silq-dark/70 text-sm mt-1">Water-attracting surface prevents fouling.</p>
        </div>
        {/* Content */}
      </div>
    </div>
  </div>
</section>
```

### 2C: Card Titles in Blue

Ensure all card titles use `text-silq-blue` class:

```jsx
<h3 className="text-lg font-bold text-silq-blue">Card Title</h3>
```

---

## ISSUE 3: ClearTract Page - Layout Updates

**File:** `src/app/products/cleartract/page.tsx`

### 3A: Replace Encrustation Image with Text Card

Remove the encrustation image and replace with an image-free info card like the Drug Free/Comfort/FDA cards.

```jsx
{/* Reduced Encrustation - Text-only card */}
<div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
  <div className="w-12 h-12 bg-silq-teal/20 rounded-lg flex items-center justify-center mb-4">
    <svg className="w-6 h-6 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
  <h3 className="text-lg font-bold text-white mb-2">Reduced Encrustation</h3>
  <p className="text-white/70 text-sm">
    Hydrophilic surface reduces mineral buildup for longer catheter life and fewer replacements.
  </p>
</div>
```

### 3B: Bacteria Panel - Own Row

Same as Technology page - put bacteria panel on its own row with other cards below.

### 3C: Add "Ordering Information" Button

Add a third CTA button next to the existing ones:

```jsx
{/* CTA Buttons */}
<div className="flex flex-wrap justify-center gap-4 mb-12">
  <Link 
    href="/products/cleartract"
    className="px-8 py-3 bg-silq-blue hover:bg-silq-blue/90 text-white rounded-lg font-semibold transition-colors"
  >
    Learn More
  </Link>
  <Link 
    href="/technology"
    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
  >
    Learn the Science
  </Link>
  <Link 
    href="/contact?inquiry=ordering"
    className="px-8 py-3 bg-silq-teal hover:bg-silq-teal/90 text-white rounded-lg font-semibold transition-colors"
  >
    Ordering Information
  </Link>
</div>
```

---

## ISSUE 4: Surface Treatment Services - Updates

**File:** `src/app/products/surface-treatment/page.tsx`

### 4A: Thrombogenicity Images - Stack Vertically

Same as Technology page - stack the two blood/thrombus images vertically:

```jsx
<div className="flex flex-col gap-2">
  <Image 
    src="/images/science/blood-loop-1.jpg"
    alt="Blood loop - treated surface"
    width={600}
    height={250}
    className="w-full object-contain bg-white rounded-lg"
  />
  <Image 
    src="/images/science/blood-loop-2.jpg"
    alt="Blood loop - control surface"
    width={600}
    height={250}
    className="w-full object-contain bg-white rounded-lg"
  />
</div>
```

### 4B: Remove Thrombus Coverage Statement

**Find and delete:**
```jsx
<p>50% reduction in surface thrombus coverage.*</p>
```

The images speak for themselves - remove this text.

### 4C: Add Contact Angle Chart

Add the contact angle chart to demonstrate hydrophilicity/wettability:

```jsx
{/* Contact Angle Section */}
<div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
  <div className="grid md:grid-cols-2 gap-8 items-center">
    <div>
      <h3 className="text-xl font-bold text-silq-dark mb-4">Surface Wettability</h3>
      <p className="text-silq-dark/70">
        Our treatment dramatically reduces contact angle across multiple substrate materials, 
        creating highly hydrophilic surfaces that resist protein and bacterial adhesion.
      </p>
      <ul className="mt-4 space-y-2">
        <li className="flex items-center gap-2 text-sm text-silq-dark/70">
          <span className="w-2 h-2 bg-silq-blue rounded-full"></span>
          Lower contact angle = more hydrophilic
        </li>
        <li className="flex items-center gap-2 text-sm text-silq-dark/70">
          <span className="w-2 h-2 bg-silq-teal rounded-full"></span>
          Works on silicone, polyurethane, PDMS, and more
        </li>
      </ul>
    </div>
    <div>
      <Image 
        src="/images/science/contact-angle-chart.png"
        alt="Contact angle comparison chart"
        width={500}
        height={350}
        className="w-full rounded-lg"
      />
    </div>
  </div>
</div>
```

---

## ISSUE 5: Global Visual Balance Improvements

### 5A: Consistent Section Padding

Ensure all sections use consistent vertical padding:
- Large sections: `py-20`
- Medium sections: `py-16`
- Small sections: `py-12`

### 5B: Card Shadow Consistency

Use consistent shadow classes:
- Feature cards: `shadow-lg hover:shadow-xl`
- Image containers: `shadow-xl`
- Interactive elements: Add `transition-shadow`

### 5C: Grid Gap Consistency

Standardize gaps across the site:
- Card grids: `gap-6` or `gap-8`
- Feature sections: `gap-12`

### 5D: Typography Hierarchy

Ensure consistent heading sizes:
- Section titles: `text-3xl md:text-4xl font-bold`
- Card titles: `text-lg font-bold text-silq-blue`
- Subtitles: `text-silq-dark/70` or `text-white/70`

### 5E: Mobile Responsiveness Check

Verify all grid layouts collapse properly:
- `grid md:grid-cols-2` → Single column on mobile
- `grid md:grid-cols-3` → Single column on mobile
- Images should not overflow containers

---

## ISSUE 6: Remove Duplicate/Redundant Elements

Search for and remove:
- Duplicate "Learn More" links
- Redundant section headers
- Repeated descriptions
- Unused imports

---

## FILE CHECKLIST

**New files needed:**
- [ ] `/public/images/publications/advanced-materials-cover.jpg` (extract from PDF or create placeholder)
- [ ] Confirm blood loop images exist: `/public/images/science/blood-loop-1.jpg`, `/public/images/science/blood-loop-2.jpg`
- [ ] Confirm contact angle chart exists: `/public/images/science/contact-angle-chart.png`

**Files to modify:**
- [ ] `src/app/page.tsx` - Homepage layout fixes
- [ ] `src/app/technology/page.tsx` - Bacteria panel + blood loop layout
- [ ] `src/app/products/cleartract/page.tsx` - Remove encrustation, add button
- [ ] `src/app/products/surface-treatment/page.tsx` - Blood loop + contact angle

---

## VISUAL TARGETS

### Technology/Surface Treatment - Bacteria Panel Layout:
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              BACTERIA PANEL (Full Width)                    │
│                                                             │
├───────────────────┬───────────────────┬─────────────────────┤
│                   │                   │                     │
│  Thrombogenicity  │    Lubricity      │   Hydrophilicity    │
│  [Stacked imgs]   │                   │                     │
│                   │                   │                     │
└───────────────────┴───────────────────┴─────────────────────┘
```

### Blood Loop Images - Stacked:
```
┌─────────────────────┐
│ [Blood Loop Img 1]  │
│   (Treated)         │
├─────────────────────┤
│ [Blood Loop Img 2]  │
│   (Control)         │
└─────────────────────┘
```

---

## FINAL STEP

```bash
git add .
git commit -m "Layout refinements: balanced sections, stacked images, publication card"
git push origin staging
```
