# Dev Agent Prompt: Visual Layout Improvements

**Priority:** 🟡 HIGH  
**Created:** 2026-02-17  
**Goal:** Reorganize ClearTract section layout and update Surface Treatment copy

---

## ISSUE 1: Homepage ClearTract Section - Layout Reorganization

**File:** `src/app/page.tsx`

The ClearTract Foley Catheters section needs a layout overhaul. Currently the buttons are too far from the title and images are not aligned properly.

### Current Layout (Wrong):
```
Title + Description
Testimonials (3 cards)
Box Image
Buttons (Learn More / Request Samples)
Encrustation Images
```

### Target Layout (Correct):
```
Title + Description
Buttons (Learn More / Request Samples)  ← Move directly under title
Testimonials (3 cards)
[Box Image]  |  [Encrustation Images]   ← Same horizontal row
```

### 1A: Move Buttons Directly Below Title

The "Learn More" and "Request Samples" buttons should appear immediately after the title and description, before the testimonials.

**Restructure the section:**

```jsx
{/* ClearTract Section */}
<section className="py-20 bg-gradient-to-b from-silq-dark to-[#1a3a52]">
  <div className="container-silq">
    {/* Title */}
    <motion.div className="text-center mb-6">
      <h2 className="text-3xl md:text-4xl font-bold text-white">
        ClearTract® Foley Catheters
      </h2>
      <p className="mt-4 text-white/70 max-w-2xl mx-auto">
        Drug-free infection resistance. Reduced encrustation. Superior patient comfort.
      </p>
    </motion.div>
    
    {/* Buttons - IMMEDIATELY after title */}
    <motion.div className="flex flex-wrap justify-center gap-4 mb-12">
      <Link 
        href="/products/cleartract"
        className="px-8 py-3 bg-silq-blue hover:bg-silq-blue/90 text-white rounded-lg font-semibold transition-colors"
      >
        Learn More
      </Link>
      <Link 
        href="/contact?inquiry=samples"
        className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
      >
        Request Samples
      </Link>
    </motion.div>
    
    {/* Testimonials */}
    <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-12">
      {/* testimonial cards */}
    </div>
    
    {/* Images Row - Box and Encrustation side by side */}
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
      {/* Left: Product Box */}
      <motion.div className="flex justify-center">
        <Image 
          src="/images/products/boxnew.jpg"
          alt="ClearTract Foley Catheter"
          width={400}
          height={400}
          className="rounded-2xl shadow-2xl"
        />
      </motion.div>
      
      {/* Right: Encrustation Comparison */}
      <motion.div className="flex justify-center">
        <div className="rounded-xl overflow-hidden shadow-xl">
          <Image 
            src="/images/science/Encrustation1.jpeg"
            alt="Encrustation comparison"
            width={500}
            height={300}
            className="w-full"
          />
          <p className="text-center text-white/60 text-sm py-3 bg-silq-dark/50">
            Visible difference in mineral buildup after extended use
          </p>
        </div>
      </motion.div>
    </div>
  </div>
</section>
```

### 1B: Enlarge FDA Cleared Icon

Find the FDA Cleared icon/badge and increase its size. Look for it in the trust indicators or stats section.

**If it's an SVG icon, increase dimensions:**

```jsx
{/* Before */}
<div className="w-12 h-12">
  {/* FDA icon */}
</div>

{/* After - Larger */}
<div className="w-16 h-16 md:w-20 md:h-20">
  {/* FDA icon */}
</div>
```

**If it's in a trust badges section:**

```jsx
{/* FDA Cleared Badge - Make it prominent */}
<div className="flex flex-col items-center p-6 bg-white/5 rounded-xl">
  <div className="w-20 h-20 mb-3 flex items-center justify-center">
    <svg className="w-full h-full text-silq-teal" viewBox="0 0 24 24" fill="currentColor">
      {/* FDA shield icon */}
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
    </svg>
  </div>
  <p className="text-lg font-bold text-white">FDA Cleared</p>
  <p className="text-sm text-white/60">510(k) Approved</p>
</div>
```

---

## ISSUE 2: Surface Treatment Services - Update FDA Subtitle

**File:** `src/app/products/surface-treatment/page.tsx`

### 2A: Change FDA Cleared Subtitle

Find the FDA Cleared section/card at the bottom of the page.

**Find:**
```jsx
<p className="text-sm text-silq-dark/60">FDA Cleared</p>
{/* or */}
<p className="text-xs text-white/50">510(k) Cleared</p>
```

**Change subtitle to:**
```jsx
<p className="text-sm text-silq-dark/70">
  Technology validated with 510(k) clearance. Master File Available
</p>
```

**If it's a stats card, update the full card:**

```jsx
<div className="text-center p-6 bg-white rounded-xl shadow-sm">
  <div className="w-16 h-16 mx-auto mb-4 bg-silq-blue/10 rounded-full flex items-center justify-center">
    <svg className="w-8 h-8 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  </div>
  <h3 className="font-bold text-silq-dark text-lg">FDA Cleared</h3>
  <p className="text-sm text-silq-dark/70 mt-2">
    Technology validated with 510(k) clearance.<br/>
    Master File Available
  </p>
</div>
```

---

## VISUAL REFERENCE

### Target ClearTract Layout:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│          ClearTract® Foley Catheters                        │
│   Drug-free infection resistance. Reduced encrustation...   │
│                                                             │
│           [Learn More]  [Request Samples]                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ Testimonial │  │ Testimonial │  │ Testimonial │          │
│  │     #1      │  │     #2      │  │     #3      │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────────────┐     ┌──────────────────────────┐     │
│   │                  │     │                          │     │
│   │   Product Box    │     │  Encrustation Comparison │     │
│   │     Image        │     │        Images            │     │
│   │                  │     │                          │     │
│   └──────────────────┘     └──────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## CHECKLIST

- [ ] Buttons moved directly below ClearTract title
- [ ] Box image and encrustation images on same horizontal row
- [ ] FDA Cleared icon enlarged (at least 20x20 or larger)
- [ ] Surface Treatment FDA subtitle updated to include "510(k) clearance. Master File Available"
- [ ] Layout looks balanced and professional
- [ ] Changes pushed to staging

---

## FINAL STEP

```bash
git add .
git commit -m "Visual improvements: ClearTract layout, FDA icon size"
git push origin staging
```
