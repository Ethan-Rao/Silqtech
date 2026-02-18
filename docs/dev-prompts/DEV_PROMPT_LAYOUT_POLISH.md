# Dev Agent Prompt: Layout Polish & Footer Redesign

**Priority:** 🟡 HIGH  
**Created:** 2026-02-17  
**Goal:** Refine layouts across pages, redesign footer, update legal links

---

## ISSUE 1: Homepage - ClearTract Section Layout Redesign

**File:** `src/app/page.tsx`

### Current Layout (Unbalanced):
```
[Testimonial Carousel - Full Width]
[Box Image]  |  [Advanced Materials Cover]
```

### Target Layout (Balanced):
```
┌────────────────────────────────┬─────────────────────────────┐
│                                │                             │
│      [Testimonial Card]        │                             │
│      (smaller, compact)        │   [Advanced Materials       │
│                                │        Cover]               │
├────────────────────────────────┤                             │
│                                │   (Full height, matching    │
│      [ClearTract Box]          │    both elements)           │
│      (Larger, prominent)       │                             │
│                                │                             │
└────────────────────────────────┴─────────────────────────────┘
```

### 1A: Restructure the Grid

```jsx
{/* Images Row - Testimonial + Box on left, Publication on right */}
<div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
  {/* Left Column: Testimonial above Box */}
  <div className="flex flex-col gap-6">
    {/* Compact Testimonial Carousel */}
    <div className="flex-shrink-0">
      <TestimonialCarousel
        testimonials={testimonials}
        className="!max-w-none"  // Override max-width
        compact={true}  // Add compact prop to component if needed
      />
    </div>
    
    {/* Product Box - Takes remaining space */}
    <motion.div className="flex justify-center flex-1">
      <Image
        src="/images/products/boxnew.jpeg"
        alt="ClearTract Foley Catheter"
        width={450}
        height={550}
        className="rounded-2xl shadow-2xl object-contain w-full max-w-md"
      />
    </motion.div>
  </div>

  {/* Right: Publication - Full height */}
  <motion.div className="flex flex-col items-center justify-center">
    <a 
      href="https://onlinelibrary.wiley.com/doi/10.1002/adma.202200254"
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow bg-white"
    >
      <Image 
        src="/images/publications/advanced-materials-cover.jpg"
        alt="Advanced Materials Journal Cover"
        width={400}
        height={520}
        className="object-contain"
      />
    </a>
    <div className="mt-4 text-center max-w-sm">
      <p className="text-white/80 text-sm">
        <span className="font-semibold text-white">Published in Advanced Materials (2022)</span>
        <br />
        &ldquo;A Readily Scalable, Clinically Demonstrated, Antibiofouling Zwitterionic Surface Treatment&rdquo;
      </p>
      <a 
        href="https://onlinelibrary.wiley.com/doi/10.1002/adma.202200254"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-silq-teal hover:text-white text-sm font-medium transition-colors"
      >
        Read the full paper →
      </a>
    </div>
  </motion.div>
</div>
```

### 1B: Change "Learn More" Button to "Product Information"

**Find:**
```jsx
<Link
  href="/products/cleartract"
  className="px-8 py-3 bg-silq-blue hover:bg-silq-blue/90 text-white rounded-lg font-semibold transition-colors"
>
  Learn More
</Link>
```

**Change to:**
```jsx
<Link
  href="/products/cleartract"
  className="px-8 py-3 bg-silq-blue hover:bg-silq-blue/90 text-white rounded-lg font-semibold transition-colors"
>
  Product Information
</Link>
```

### 1C: Replace Trust Logo Images with Clean Text

Remove the image-based trust section and replace with styled text boxes.

**Find and replace the Trust Logos section:**

```jsx
{/* Section 6: Trust Indicators - Text Only */}
<section className="py-14 bg-white border-t border-silq-dark/5">
  <div className="container-silq">
    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
      {[
        { label: 'FDA 510(k) Cleared', sublabel: '3 Clearances' },
        { label: 'UCLA Research', sublabel: 'Technology Origin' },
        { label: 'Premier', sublabel: 'GPO Contract' },
        { label: 'Vizient', sublabel: 'Innovative Technology' },
      ].map((item, index) => (
        <div 
          key={index} 
          className="text-center px-6 py-3 border border-silq-dark/10 rounded-lg bg-silq-cream/30"
        >
          <p className="font-semibold text-silq-dark text-sm">{item.label}</p>
          <p className="text-xs text-silq-dark/50">{item.sublabel}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## ISSUE 2: Technology Page - Blood Loop Images & Data Link

**File:** `src/app/technology/page.tsx`

### 2A: Shrink Blood Loop Images

The blood loop tube images are too large compared to the lubricity and hydrophilicity videos.

**Find the blood loop images and reduce their size:**

```jsx
{/* Anti-Thrombogenicity - Stacked Images (SMALLER) */}
<div className="flex flex-col gap-2">
  <div className="rounded-lg overflow-hidden">
    <Image 
      src="/images/science/blood-loop-1.jpg"
      alt="Blood loop - treated surface"
      width={400}
      height={150}
      className="w-full h-32 object-contain bg-white"  // Fixed height h-32
    />
  </div>
  <div className="rounded-lg overflow-hidden">
    <Image 
      src="/images/science/blood-loop-2.jpg"
      alt="Blood loop - control surface"
      width={400}
      height={150}
      className="w-full h-32 object-contain bg-white"  // Fixed height h-32
    />
  </div>
</div>
```

**Or use a max-height constraint:**
```jsx
className="w-full max-h-36 object-contain bg-white"
```

### 2B: Add Data Availability Note

At the bottom of the "Customizable Surface Properties" section, add:

```jsx
{/* Data Availability Note */}
<div className="mt-12 text-center">
  <p className="text-sm text-silq-dark/60">
    Data available{' '}
    <a 
      href="https://onlinelibrary.wiley.com/doi/10.1002/adma.202200254"
      target="_blank"
      rel="noopener noreferrer"
      className="text-silq-blue hover:underline"
    >
      here
    </a>
    {' '}and by request.
  </p>
</div>
```

---

## ISSUE 3: ClearTract Page Updates

**File:** `src/app/products/cleartract/page.tsx`

### 3A: Change "Hydrophilic Surfaces" to "Zwitterionic Surfaces"

**Find:**
```jsx
<h3 className="text-xl font-bold text-silq-blue mb-2">Hydrophilic Surfaces</h3>
```

**Change to:**
```jsx
<h3 className="text-xl font-bold text-silq-blue mb-2">Zwitterionic Surfaces</h3>
```

(Search for all instances of "Hydrophilic" related to surface technology and change to "Zwitterionic")

### 3B: Add "Ordering Information" Button

In the hero section or CTA area, add a third button:

```jsx
<div className="mt-8 flex flex-wrap gap-4">
  <Link href="/contact">
    <Button variant="primary" size="lg">Request Samples</Button>
  </Link>
  <Link href="/technology">
    <Button variant="secondary" size="lg">Learn the Science</Button>
  </Link>
  <Link href="/contact?inquiry=ordering">
    <Button variant="outline" size="lg" className="border-silq-teal text-silq-teal hover:bg-silq-teal hover:text-white">
      Ordering Information
    </Button>
  </Link>
</div>
```

---

## ISSUE 4: Surface Treatment Services Page

**File:** `src/app/products/surface-treatment/page.tsx`

### 4A: Add Contact Angle Chart to Surface Wettability Section

In the Surface Wettability section, add the contact angle chart next to the droplet picture:

```jsx
{/* Surface Wettability Section */}
<div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
  <div className="grid md:grid-cols-2 gap-8 items-start">
    {/* Left: Text + Contact Angle Chart */}
    <div>
      <h3 className="text-xl font-bold text-silq-dark mb-4">Surface Wettability</h3>
      <p className="text-silq-dark/70 mb-6">
        Our treatment dramatically reduces contact angle across multiple substrate materials, 
        creating highly hydrophilic surfaces that resist protein and bacterial adhesion.
      </p>
      
      {/* Contact Angle Chart - Below text */}
      <div className="rounded-lg overflow-hidden border border-silq-dark/10">
        <Image 
          src="/images/science/contact-angle-comparison.jpg"
          alt="Contact angle comparison chart"
          width={500}
          height={300}
          className="w-full object-contain"
        />
      </div>
    </div>
    
    {/* Right: Droplet Image */}
    <div className="flex items-center justify-center">
      <Image 
        src="/images/science/droplet-comparison.jpg"
        alt="Water droplet contact angle demonstration"
        width={400}
        height={400}
        className="rounded-lg"
      />
    </div>
  </div>
</div>
```

### 4B: Clean Up Blood Loop Images (Same as Technology Page)

Apply the same sizing fix as Issue 2A - constrain the height of blood loop images:

```jsx
className="w-full h-32 object-contain bg-white"
```

---

## ISSUE 5: Footer Redesign (Site-Wide)

**File:** `src/components/layout/Footer.tsx`

### 5A: Replace Logo with Header Logo + "Surface Science Perfected"

Reference the `footerexample` image in the project folder for styling.

```jsx
{/* Footer Logo Section */}
<div className="flex flex-col items-start">
  <Link href="/" className="flex items-center gap-3 mb-4">
    <Image
      src="/images/logos/silq-logo-white.png"  // Or use the header logo in white
      alt="Silq Technologies"
      width={120}
      height={40}
      className="h-10 w-auto"
    />
  </Link>
  <p className="text-white/80 text-lg font-light tracking-wide">
    Surface Science Perfected
  </p>
</div>
```

### 5B: Remove FDA and UCLA Images

Delete the trust indicator images from the footer. Keep only text-based content.

### 5C: Create Separate Legal Column

Restructure footer into clear columns with Legal as its own column:

```jsx
<footer className="bg-silq-dark text-white py-16">
  <div className="container-silq">
    <div className="grid md:grid-cols-4 gap-12">
      {/* Column 1: Brand */}
      <div>
        <Link href="/" className="flex items-center gap-3 mb-4">
          <Image
            src="/images/logos/silq-logo-white.png"
            alt="Silq Technologies"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
        <p className="text-white/70 text-lg font-light tracking-wide mb-4">
          Surface Science Perfected
        </p>
        <p className="text-white/50 text-sm">
          Los Angeles, California
        </p>
      </div>

      {/* Column 2: Products */}
      <div>
        <h4 className="font-semibold text-white mb-4">Products</h4>
        <ul className="space-y-2 text-sm text-white/60">
          <li><Link href="/products/cleartract" className="hover:text-white transition-colors">ClearTract® Catheters</Link></li>
          <li><Link href="/products/surface-treatment" className="hover:text-white transition-colors">Surface Treatment Services</Link></li>
          <li><Link href="/technology" className="hover:text-white transition-colors">Technology</Link></li>
        </ul>
      </div>

      {/* Column 3: Company */}
      <div>
        <h4 className="font-semibold text-white mb-4">Company</h4>
        <ul className="space-y-2 text-sm text-white/60">
          <li><Link href="/about/team" className="hover:text-white transition-colors">About Us</Link></li>
          <li><Link href="/about/investors" className="hover:text-white transition-colors">Investors</Link></li>
          <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
        </ul>
      </div>

      {/* Column 4: Legal (NEW SEPARATE COLUMN) */}
      <div>
        <h4 className="font-semibold text-white mb-4">Legal</h4>
        <ul className="space-y-2 text-sm text-white/60">
          <li>
            <a 
              href="https://www.termsfeed.com/live/64033d10-28a1-4790-8c14-dcc8b36bc800"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a 
              href="https://www.termsfeed.com/live/d6ba54e4-a9be-410a-80b2-5037841021b5"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </a>
          </li>
          <li>
            <a 
              href="https://www.termsfeed.com/live/1252cec2-0fa4-4014-bf4a-2494a8d7eb29"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Cookie Policy
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="mt-12 pt-8 border-t border-white/10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} Silq Technologies Corp. All rights reserved.
        </p>
        <p className="text-xs text-white/30">
          Los Angeles, CA
        </p>
      </div>
    </div>
  </div>
</footer>
```

---

## LEGAL LINKS REFERENCE

| Link | URL |
|------|-----|
| **Privacy Policy** | https://www.termsfeed.com/live/64033d10-28a1-4790-8c14-dcc8b36bc800 |
| **Terms & Conditions** | https://www.termsfeed.com/live/d6ba54e4-a9be-410a-80b2-5037841021b5 |
| **Cookie Policy** | https://www.termsfeed.com/live/1252cec2-0fa4-4014-bf4a-2494a8d7eb29 |

---

## VISUAL REFERENCE: Footer Layout

Reference `footerexample` in project folder for the logo + tagline styling.

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  [SILQ LOGO]              Products        Company        Legal      │
│  Surface Science          ClearTract®     About Us       Privacy    │
│  Perfected                Surface Treat.  Investors      Terms      │
│                           Technology      Contact        Cookies    │
│  Los Angeles, CA                                                    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  © 2026 Silq Technologies Corp.                    Los Angeles, CA  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## CHECKLIST

### Homepage
- [ ] Testimonial card smaller, above product box
- [ ] Advanced Materials cover beside both (full height)
- [ ] "Learn More" → "Product Information"
- [ ] Trust logos replaced with clean text boxes

### Technology Page
- [ ] Blood loop images shrunk (h-32 or max-h-36)
- [ ] "Data available here and by request" added

### ClearTract Page
- [ ] "Hydrophilic Surfaces" → "Zwitterionic Surfaces"
- [ ] "Ordering Information" button added

### Surface Treatment Services
- [ ] Contact angle chart added to Surface Wettability section
- [ ] Blood loop images cleaned up (same sizing as Technology)

### Footer (Site-Wide)
- [ ] Header logo + "Surface Science Perfected" tagline
- [ ] FDA/UCLA images removed
- [ ] Legal section as separate column
- [ ] Privacy Policy link updated
- [ ] Terms & Conditions link updated
- [ ] Cookie Policy link updated

---

## FINAL STEP

```bash
git add .
git commit -m "Layout polish: ClearTract section, footer redesign, trust text, legal links"
git push origin main staging
```
