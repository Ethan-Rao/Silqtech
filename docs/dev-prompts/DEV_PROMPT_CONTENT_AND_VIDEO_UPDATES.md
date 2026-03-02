# Dev Prompt: Content Updates & Video Behavior Changes

## Overview
This prompt contains specific content and behavior changes for the Homepage and Surface Treatment Services page. All changes should maintain the clean, high-tech, investment-attractive aesthetic of the site.

---

## HOMEPAGE CHANGES (`src/app/page.tsx`)

### 1. Video/GIF Playback Behavior
**Requirement**: Both the hero banner GIF and the "Surface Treatment in Action" video should pause on their final frame, not continuously replay.

#### Hero Banner GIF (Line ~88-91)
The hero uses a GIF background. To make it stop on the last frame, convert to video or use a static final frame fallback:

**Option A - Use video instead of GIF:**
```tsx
backgroundMedia={{
  type: 'video',
  src: '/videos/hero-banner.mp4',  // Convert GIF to MP4
  loop: false  // Don't loop - pause on final frame
}}
```

**Option B - If keeping GIF, modify Hero component to support non-looping behavior**

#### Surface Treatment in Action Video (Line ~137-145)
Change from:
```tsx
<video 
  src="/videos/silq-technology-demo.mp4" 
  poster="/images/textures/tech-overview.gif"
  autoPlay 
  loop    // REMOVE THIS
  muted 
  playsInline
  className="w-full h-full object-cover flex-1"
/>
```

To:
```tsx
<video 
  src="/videos/silq-technology-demo.mp4" 
  poster="/images/textures/tech-overview.gif"
  autoPlay 
  muted 
  playsInline
  className="w-full h-full object-cover flex-1"
/>
```
Remove the `loop` attribute so video stops on final frame.

---

### 2. Hero Description Text (Line ~83)
**Change FROM:**
```
"Surface technology for better, safer medical implants. FDA Cleared, Antibiotic-free."
```

**Change TO:**
```
"Zwitterion Surface technology for better, safer medical implants. FDA Cleared, Antibiotic-free."
```

---

### 3. ClearTract Section Description (Line ~177-179)
**Change FROM:**
```
"Drug-free surface treatment designed to reduce infection, encrustation, and improve patient comfort."
```

**Change TO:**
```
"Drug-free surface treatment designed to reduce infections and encrustation, and improve patient comfort."
```

---

### 4. Ordering Buttons (Lines ~203-213)
**Change FROM:**
```tsx
<Link href="/contact?inquiry=ordering" className="...">
  Facility Ordering Information
</Link>
<Link href="/contact?inquiry=ordering" className="...">
  Patient Ordering Information
</Link>
```

**Change TO:**
```tsx
<Link href="/contact?inquiry=ordering" className="...">
  Healthcare Facility Ordering
</Link>
<Link href="/contact?inquiry=ordering" className="...">
  Patient Ordering
</Link>
```

---

### 5. Remove Trust Indicators Section (Lines ~505-521)
**DELETE the entire section** containing:
- FDA 510(k) Cleared
- UCLA Research  
- Premier GPO Contract
- Vizient GPO Contract

Remove this entire `<section>` block:
```tsx
{/* Section 6: Trust Indicators - Text Only */}
<section className="py-14 bg-white border-t border-silq-dark/5">
  ... entire section ...
</section>
```

---

### 6. FDA Cleared Platform Label (Line ~416)
**Change FROM:**
```tsx
{ label: 'FDA Cleared Platform' },
```

**Change TO:**
```tsx
{ label: 'FDA Cleared Product' },
```

---

### 7. Surface Treatment Services Teaser Text (Lines ~390-391)
**Change FROM:**
```
"Bring our proven antibiofouling technology to your medical devices. We offer contract surface treatment services with customizable properties for various substrates."
```

**Change TO:**
```
"Bring our proven antibiofouling technology to your medical devices or industrial/commercial products. We offer contract surface treatment services with customizable solutions for various substrates and environments."
```

---

## CLEARTRACT PAGE CHANGES (`src/app/products/cleartract/page.tsx`)

### 1. Description Text (Line ~109-110)
**Change FROM:**
```
"Drug-free surface treatment designed to reduce infection, encrustation, and improve patient comfort."
```

**Change TO:**
```
"Drug-free surface treatment designed to reduce infections and encrustation, and improve patient comfort."
```

---

### 2. Ordering Buttons (Lines ~121-128)
**Change FROM:**
```tsx
<Button variant="teal" size="lg">
  Facility Ordering Information
</Button>
...
<Button variant="teal" size="lg">
  Patient Ordering Information
</Button>
```

**Change TO:**
```tsx
<Button variant="teal" size="lg">
  Healthcare Facility Ordering
</Button>
...
<Button variant="teal" size="lg">
  Patient Ordering
</Button>
```

---

## SURFACE TREATMENT SERVICES PAGE CHANGES (`src/app/products/surface-treatment/page.tsx`)

### 1. Hero Title (Lines ~19-21)
**Change FROM:**
```tsx
<h1 className="text-hero-sm md:text-hero font-bold">
  External Coating <span className="text-silq-teal">Solutions</span>
</h1>
```

**Change TO:**
```tsx
<h1 className="text-hero-sm md:text-hero font-bold">
  Surface Treatment <span className="text-silq-teal">Services</span>
</h1>
```

---

### 2. Turn-key Coating Text (Line ~59)
**Change FROM:**
```
"...offering a turn-key coating solution to customers worldwide."
```

**Change TO:**
```
"...offering turn-key coating solutions to customers worldwide."
```

---

### 3. Scalability Bullet Point (Line ~69)
**Change FROM:**
```tsx
<span className="text-silq-dark/70">Scalability up to commercial quantities</span>
```

**Change TO:**
```tsx
<span className="text-silq-dark/70">Scalability from prototypes to large scale commercial quantities</span>
```

---

### 4. Add New Bullet Point (After Line ~71)
**ADD new bullet point** after "Scalability from prototypes to large scale commercial quantities":

```tsx
<li className="flex items-start gap-3">
  <span className="w-6 h-6 rounded-full bg-silq-teal/15 flex items-center justify-center flex-shrink-0 mt-0.5">
    <svg className="w-3.5 h-3.5 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
  </span>
  <span className="text-silq-dark/70">Adaptable to various substrates, geometries, and configurations</span>
</li>
```

---

### 5. Enhanced Hydrophilicity Title (Line ~170)
**Change FROM:**
```tsx
<h3 className="text-lg font-bold text-silq-blue">Enhanced Hydrophilicity</h3>
```

**Change TO:**
```tsx
<h3 className="text-lg font-bold text-silq-blue">Improved Wettability</h3>
```

---

## SUMMARY CHECKLIST

### Homepage (`src/app/page.tsx`)
- [ ] Remove `loop` from Surface Treatment in Action video
- [ ] Handle hero GIF to stop on final frame (may need Hero component update)
- [ ] Add "Zwitterion" to hero description
- [ ] Fix "infections and encrustation" text (add 's' to infections, add 'and')
- [ ] Change ordering buttons to "Healthcare Facility Ordering" and "Patient Ordering"
- [ ] Delete Trust Indicators section (FDA, UCLA, Premier, Vizient boxes)
- [ ] Change "FDA Cleared Platform" to "FDA Cleared Product"
- [ ] Update Surface Treatment Services teaser text

### ClearTract Page (`src/app/products/cleartract/page.tsx`)
- [ ] Fix "infections and encrustation" text
- [ ] Change ordering buttons to "Healthcare Facility Ordering" and "Patient Ordering"

### Surface Treatment Services Page (`src/app/products/surface-treatment/page.tsx`)
- [ ] Change title from "External Coating Solutions" to "Surface Treatment Services"
- [ ] Change "a turn-key coating solution" to "turn-key coating solutions"
- [ ] Update scalability text to include "from prototypes to large scale"
- [ ] Add new bullet point about substrates, geometries, configurations
- [ ] Change "Enhanced Hydrophilicity" to "Improved Wettability"

---

## Commit and Deploy

After all changes:
```bash
git add -A
git commit -m "Update content: video behavior, text changes, remove trust section"
git push origin main
git push origin main:staging --force
```

Verify on staging that:
1. Videos stop on final frame (don't loop)
2. All text changes are correct
3. Trust indicators section is removed
4. Site maintains clean, professional appearance
