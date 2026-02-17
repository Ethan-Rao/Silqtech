# Dev Agent Prompt: Critical Fixes & Enhancements

**Priority:** 🔴 CRITICAL  
**Created:** 2026-02-17  
**Goal:** Fix broken images, correct content, improve visual balance

---

## 🚨 CRITICAL: Push Changes First

Before starting, ensure all previous fixes are pushed:

```bash
cd C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website
git add .
git commit -m "Fix build and visual enhancements"
git push origin staging
```

---

## ISSUE 1: Investors Page - Incorrect Claims

**File:** `src/app/about/investors/page.tsx`

### 1A: Remove Manufacturing Facility Claims

The company uses third-party manufacturing. Remove these misleading claims:

**Find and remove/change:**
- "ISO Certified" → Remove
- "FDA Registered Facility" → Remove  
- "Cleanroom Operations" → Remove or change to "Contract Manufacturing"
- "GMP Compliant Processes" → Remove

**Change the manufacturing section stats from:**
```jsx
{[
  { value: 'FDA', label: 'Registered Facility' },
  { value: 'ISO', label: 'Quality Certified' },
  { value: 'GMP', label: 'Compliant Processes' },
  { value: '100%', label: 'US Manufactured' },
]}
```

**To:**
```jsx
{[
  { value: '3', label: '510(k) Clearances' },
  { value: '1', label: 'FDA Master File' },
  { value: 'US', label: 'Based Company' },
  { value: '∞', label: 'Scalable Production' },
]}
```

### 1B: Fix Patent Language

**Find:**
```jsx
title: 'Strong IP Portfolio',
description: 'Patented technology born from UCLA research with exclusive licensing rights.',
```

**Change to:**
```jsx
title: 'Strong IP Portfolio',
description: 'Numerous patents established in the US and abroad.',
```

### 1C: Add Scalability Point to "Why Invest"

Add a new item to the investment reasons list:

```jsx
{
  title: 'Highly Scalable',
  description: 'Manufacturing process scales to commercial volumes.',
},
```

### 1D: Update Manufacturing Section

**Change the section heading from:**
```jsx
<h2 className="text-display-sm md:text-display font-bold">
  Scalable Production Capability
</h2>
```

**To:**
```jsx
<h2 className="text-display-sm md:text-display font-bold">
  Scalable Technology Platform
</h2>
```

**Change the description from:**
```jsx
<p className="mt-4 text-white/70 max-w-2xl mx-auto">
  Our FDA-registered manufacturing facility operates under strict quality controls 
  to produce medical-grade devices at scale.
</p>
```

**To:**
```jsx
<p className="mt-4 text-white/70 max-w-2xl mx-auto">
  Our patented surface treatment process is designed for commercial-scale production 
  through qualified contract manufacturing partners.
</p>
```

---

## ISSUE 2: Homepage - Visual Balance & Missing Images

**File:** `src/app/page.tsx`

### 2A: Fix ClearTract Product Image Not Appearing

The product box image may have a path issue. Verify and fix:

```jsx
<Image
  src="/images/products/boxnew.jpg"
  alt="ClearTract Foley Catheter"
  width={500}
  height={500}
  className="rounded-2xl shadow-2xl"
/>
```

Check that `/public/images/products/boxnew.jpg` exists and is valid.

### 2B: Fix Encrustation Image Path (Changed to JPEG)

**Find:**
```jsx
src="/images/science/Encrustation1.png"
```

**Change to:**
```jsx
src="/images/science/Encrustation1.jpeg"
```

(User confirmed the file was updated to jpeg format)

### 2C: Center Innovation Section - Balance Video with Cards

The "Innovation That Matters" section has 4 feature cards on the left and a video on the right. They should be visually balanced.

**Current layout issue:** Video appears smaller/unbalanced compared to the 4-card grid.

**Fix:** Make the video section match the height of the cards grid and center it vertically.

```jsx
{/* Right: How It Works Video - Centered Vertically */}
<div className="flex flex-col items-center justify-center h-full">
  <motion.div 
    className="rounded-2xl overflow-hidden shadow-2xl w-full max-w-md"
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="bg-gradient-to-br from-silq-blue/5 to-silq-teal/5 relative">
      <video 
        src="/videos/silq-technology-demo.mp4" 
        poster="/images/textures/tech-overview.gif"
        autoPlay 
        loop 
        muted 
        playsInline
        className="w-full aspect-video object-cover relative z-10"
      />
    </div>
    {/* Add blue gradient bar like manufacturing section */}
    <div className="p-3 bg-gradient-to-r from-silq-blue to-silq-teal text-white text-center">
      <p className="text-sm font-medium">Surface Treatment in Action</p>
    </div>
  </motion.div>
</div>
```

### 2D: Add Blue Gradient Bar to Surface Treatment GIF

In Section 4 (Surface Treatment Services), the machine GIF should have the same blue gradient treatment bar.

**Find the Surface Treatment GIF section and ensure it has:**
```jsx
<div className="rounded-2xl overflow-hidden shadow-xl bg-white">
  <Image 
    src="/images/science/silq-machine.gif"
    alt="Silq surface treatment process"
    width={500}
    height={400}
    className="w-full object-cover"
    unoptimized
  />
  <div className="p-4 bg-gradient-to-r from-silq-blue to-silq-teal text-white">
    <p className="text-sm font-medium">Scalable Treatment Process</p>
    <p className="text-xs text-white/70">In-house manufacturing capability</p>
  </div>
</div>
```

### 2E: Add Placeholder Testimonials Below ClearTract Section

Move or add testimonials to appear directly after the ClearTract section title/description, before the product image.

The testimonials carousel should be positioned within the ClearTract dark section, after the heading but integrated with the product display.

**Structure should be:**
1. ClearTract heading + description
2. Testimonials carousel (3 visible, scrollable)
3. Product image + encrustation comparison

---

## ISSUE 3: Technology Page - Add Science Images

**File:** `src/app/technology/page.tsx`

### 3A: Add Bacterial Panel Image

In the "Customizable Surface Properties" section, replace the icon-only cards with actual images like on the Surface Treatment page.

**For Microbial Resistance card, change from icon to image:**
```jsx
<div className="h-48 md:h-52 overflow-hidden">
  <Image 
    src="/images/science/Bacteria%20Panel.png"
    alt="Bacterial adhesion reduction data"
    width={600}
    height={400}
    className="w-full h-full object-cover"
  />
</div>
```

### 3B: Add Blood Loop Image

**For Anti-Thrombogenicity card, add image:**
```jsx
<div className="h-48 md:h-52 overflow-hidden">
  <Image 
    src="/images/science/blood-loop.webp"
    alt="Blood loop thrombosis comparison"
    width={600}
    height={400}
    className="w-full h-full object-contain bg-white"  // object-contain to prevent zoom
  />
</div>
```

---

## ISSUE 4: Surface Treatment Page - Blood Loop Image Zoom

**File:** `src/app/products/surface-treatment/page.tsx`

### 4A: Fix Blood Loop Image Being Too Zoomed In

**Find:**
```jsx
<Image 
  src="/images/science/blood-loop.webp"
  alt="Blood loop thrombosis comparison"
  width={600}
  height={400}
  className="w-full h-full object-cover"
/>
```

**Change to:**
```jsx
<Image 
  src="/images/science/blood-loop.webp"
  alt="Blood loop thrombosis comparison"
  width={600}
  height={400}
  className="w-full h-full object-contain bg-white p-4"
/>
```

The `object-contain` will show the full image without cropping, and `p-4` adds padding.

---

## ISSUE 5: ClearTract Page - Testimonials & Specs

**File:** `src/app/products/cleartract/page.tsx`

### 5A: Fix Low Endotoxin Subtitle

**Find:**
```jsx
<div>
  <p className="text-sm font-semibold text-silq-teal">Low Endotoxin</p>
  <p className="text-xs text-white/50">Reduced vs. alternatives*</p>
</div>
```

**Change to:**
```jsx
<div>
  <p className="text-sm font-semibold text-silq-teal">Low Endotoxin</p>
  <p className="text-xs text-white/50">Safe for suprapubic insertions</p>
</div>
```

### 5B: Make Testimonial Text Larger

**Find the testimonial blockquote styling:**
```jsx
<blockquote className="text-white/85 text-sm leading-relaxed mb-3">
```

**Change to:**
```jsx
<blockquote className="text-white/90 text-base leading-relaxed mb-4">
```

### 5C: Expand Testimonials to 6-9 with Scroll

Add more placeholder testimonials and implement a carousel that shows 3 at a time:

```jsx
const testimonials = [
  {
    quote: "ClearTract catheters have made a significant difference in reducing catheter-associated infections in my practice.",
    author: "Evgeniy Kreydin, M.D.",
    role: "Urologist, Cedars-Sinai",
  },
  {
    quote: "I would not go back to other catheters ever again. The comfort has been life-changing for my daily routine.",
    author: "Ana Garcia",
    role: "Long-term Catheter Patient",
  },
  {
    quote: "Her UTIs have completely subsided, no more blockages or emergency room visits. My mom is completely satisfied.",
    author: "Stephen Newhouse",
    role: "Caregiver",
  },
  // Add placeholder testimonials for scrolling
  {
    quote: "Placeholder testimonial - to be replaced with actual content.",
    author: "Placeholder Name",
    role: "Title, Organization",
  },
  {
    quote: "Placeholder testimonial - to be replaced with actual content.",
    author: "Placeholder Name",
    role: "Title, Organization",
  },
  {
    quote: "Placeholder testimonial - to be replaced with actual content.",
    author: "Placeholder Name",
    role: "Title, Organization",
  },
]
```

**Add navigation arrows to scroll through testimonials (3 visible at a time):**

```jsx
'use client'  // Add at top of file if not already present

import { useState } from 'react'

// Inside component:
const [testimonialIndex, setTestimonialIndex] = useState(0)
const maxIndex = Math.max(0, testimonials.length - 3)

// Testimonials section with carousel:
<div className="relative">
  <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto overflow-hidden">
    {testimonials.slice(testimonialIndex, testimonialIndex + 3).map((t, i) => (
      // ... testimonial card
    ))}
  </div>
  
  {/* Navigation */}
  {testimonials.length > 3 && (
    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => setTestimonialIndex(Math.max(0, testimonialIndex - 1))}
        disabled={testimonialIndex === 0}
        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center"
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setTestimonialIndex(Math.min(maxIndex, testimonialIndex + 1))}
        disabled={testimonialIndex === maxIndex}
        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center"
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )}
</div>
```

---

## ISSUE 6: Homepage Testimonials - Remove or Fix Placeholders

**File:** `src/app/page.tsx`

The homepage has 6 placeholder testimonials that say "Placeholder testimonial text." Either:

**Option A:** Remove the testimonials section entirely until real content is available

**Option B:** Keep placeholders but make them clearly look like placeholders (use italics, different styling)

**Recommended:** Keep the section structure but update placeholder text to be more realistic-looking:

```jsx
const placeholderTestimonials = [
  {
    quote: "Testimonial content pending - check back soon.",
    author: "Coming Soon",
    role: "Healthcare Professional",
  },
  // ... repeat for all 6
]
```

---

## ISSUE 7: Contact Page - Redundant Information

**File:** `src/app/contact/page.tsx`

The contact info (email, phone) appears both in the hero section badges AND in the sidebar. Remove the hero badges to reduce redundancy.

**Delete lines ~44-57 (the quick contact badges in hero):**
```jsx
{/* DELETE THIS BLOCK */}
<div className="mt-8 flex flex-wrap justify-center gap-4">
  <a href="mailto:info@silq.tech" className="...">
    ...
  </a>
  <a href="tel:4243098523" className="...">
    ...
  </a>
</div>
```

---

## ISSUE 8: Products Page - Missing Surface Treatment Image

**File:** `src/app/products/page.tsx`

The Surface Treatment product card uses `ImagePlaceholder`. Replace with an actual image:

**Find:**
```jsx
<ImagePlaceholder
  label="Surface Treatment"
  icon="science"
  className="w-full h-full"
/>
```

**Change to:**
```jsx
<Image
  src="/images/science/silq-machine.gif"
  alt="Surface Treatment Process"
  fill
  className="object-cover"
  unoptimized
/>
```

---

## ISSUE 9: Team Page - Remove Vague Advisory Section

**File:** `src/app/about/team/page.tsx`

The "Scientific Advisory" section is vague and doesn't add value. Remove it.

**Delete lines ~129-142:**
```jsx
{/* DELETE THIS SECTION */}
<section className="py-16 bg-white">
  <div className="container-silq">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-silq-dark mb-4">
        Scientific Advisory
      </h2>
      <p className="text-silq-dark/70">
        Our team is backed by leading researchers from UCLA...
      </p>
    </div>
  </div>
</section>
```

---

## ISSUE 10: Rep Directory - Remove Internal Data Version

**File:** `src/app/rep/page.tsx`

The "Data Version" stat in the hero is internal information that doesn't help sales reps.

**Find the stats grid and remove the Data Version stat:**

```jsx
// Change from 3 columns to 2:
<motion.div 
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
  {/* REMOVE the Data Version stat */}
</motion.div>
```

---

## ISSUE 11: Homepage - Add Promotional Video to "Ready to Learn More"

**File:** `src/app/page.tsx`

### 11A: Add Video to CTA Section

In the "Ready to Learn More" section at the bottom of the homepage, add the promotional video embed.

**Find the Ready to Learn More section and add a video:**

```jsx
{/* Ready to Learn More Section */}
<section className="py-20 bg-gradient-to-br from-silq-dark to-silq-blue relative overflow-hidden">
  <div className="container-silq relative z-10">
    <div className="max-w-4xl mx-auto text-center">
      <motion.h2 
        className="text-3xl md:text-4xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Ready to Learn More?
      </motion.h2>
      
      {/* Add promotional video */}
      <motion.div 
        className="mb-8 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative aspect-video">
          <iframe
            src="https://player.vimeo.com/video/710986413?h=&title=0&byline=0&portrait=0"
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Silq Technology Overview"
          />
        </div>
        <div className="p-3 bg-gradient-to-r from-silq-blue to-silq-teal text-white text-center">
          <p className="text-sm font-medium">Silq Technology Overview</p>
        </div>
      </motion.div>
      
      {/* Existing CTA buttons continue below... */}
    </div>
  </div>
</section>
```

**Alternative: Use local video file if Vimeo embed has issues:**

```jsx
<video 
  src="/videos/silq-technology-overview.mp4"
  poster="/images/video-poster.jpg"
  controls
  className="w-full aspect-video"
>
  Your browser does not support the video tag.
</video>
```

**Note:** The local file is `silq's_technology_overview_(clean) (720p).mp4` - rename it to `silq-technology-overview.mp4` and place in `/public/videos/`.

---

## CHECKLIST

After implementing all fixes:

- [ ] Encrustation image path updated to `.jpeg`
- [ ] ClearTract product box image loads correctly
- [ ] Innovation section video is visually balanced with cards
- [ ] Surface treatment GIF has blue gradient bar
- [ ] Investors page has correct claims (no ISO/FDA facility)
- [ ] Patents language updated
- [ ] Technology page has science images
- [ ] Blood loop image not too zoomed
- [ ] ClearTract testimonials are scrollable (6-9 items)
- [ ] Low Endotoxin subtitle changed
- [ ] All changes pushed to staging
- [ ] Build succeeds on Digital Ocean

---

## FINAL STEP

Push all changes:

```bash
git add .
git commit -m "Critical fixes: images, investor claims, testimonials"
git push origin staging
```
