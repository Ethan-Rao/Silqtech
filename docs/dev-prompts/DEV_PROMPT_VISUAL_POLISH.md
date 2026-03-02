# Dev Prompt: Visual Polish & Final Adjustments

## Overview
This prompt contains visual improvements and specific wording adjustments. Focus on appearance improvements without adding additional text content.

---

## BUG FIX: Bacteria Panel Not Displaying

The bacteria panel image (`BacPanelV2.png`) is not displaying reliably. This needs investigation and fix.

### Investigation Steps
1. Check file exists: `public/images/science/BacPanelV2.png`
2. Verify file size isn't too large for Next.js image optimization
3. Add `unoptimized` prop if needed for large images
4. Add `priority` prop for above-the-fold images

### Fix in All Locations
Update all bacteria panel Image components:

```tsx
<Image 
  src="/images/science/BacPanelV2.png"
  alt="Bacterial adhesion comparison"
  width={1200}
  height={400}
  className="w-full object-contain"
  unoptimized
  priority
/>
```

**Files to update:**
- `src/app/technology/page.tsx`
- `src/app/products/cleartract/page.tsx`
- `src/app/products/surface-treatment/page.tsx`

---

## HOMEPAGE CHANGES (`src/app/page.tsx`)

### 1. Hero GIF Should Pause at End
The landing screen graphic behind "Transforming Surfaces Through Advanced Material Science" should pause on final frame, not loop continuously.

Update the Hero component to support non-looping video. If using GIF, convert to video format with `loop={false}`.

In Hero component or homepage, change:
```tsx
backgroundMedia={{
  type: 'video',
  src: '/videos/hero-banner.mp4',  // Convert GIF to video
  loop: false  // Don't loop
}}
```

### 2. FDA Cleared Products (Plural)
**Change FROM:**
```
'FDA Cleared Product'
```

**Change TO:**
```
'FDA Cleared Products'
```

### 3. Video Title Change
**Change FROM:**
```
"Surface Treatment in Action"
```

**Change TO:**
```
"Treatment Effect Demonstration"
```

### 4. Video Subtitle Change (in Surface Treatment Services section)
**Change FROM:**
```
"In-house manufacturing capability"
```

**Change TO:**
```
"Adaptable to various substrates, geometries, and configurations"
```

---

## TECHNOLOGY PAGE (`src/app/technology/page.tsx`)

### 1. Move Publication Card to Bottom of "How It Works" Section

Move the Advanced Materials publication graphic from the Surface Properties section to the **bottom** of the "How It Works" section, after the bullet points and video.

### 2. Remove "(2022)" from Publication Card
**Change FROM:**
```
"Published in Advanced Materials (2022)"
```

**Change TO:**
```
"Published in Advanced Materials"
```

### 3. Update "Mimics Natural Cell Membranes" Text
**Change FROM:**
```
"Mimics natural cell membranes to resist fouling"
```

**Change TO:**
```
"Mimics natural cell membranes to resist the host immune system's foreign body response"
```

### 4. Remove Labels from Anti-Thrombogenicity Images
Remove the recently added "Silq Treated" and "Control" labels from the blood loop images. The images are already labeled.

Remove these spans:
```tsx
<span className="absolute bottom-1 left-2 text-xs bg-silq-teal/90 text-white px-2 py-0.5 rounded">Silq Treated</span>
```
and
```tsx
<span className="absolute bottom-1 left-2 text-xs bg-gray-500/90 text-white px-2 py-0.5 rounded">Control</span>
```

Also remove the `relative` class from the parent divs if no longer needed.

### 5. Change "Enhanced Hydrophilicity" to "Improved Wettability"
**Change FROM:**
```tsx
<h3 className="text-lg font-bold text-silq-blue">Enhanced Hydrophilicity</h3>
```

**Change TO:**
```tsx
<h3 className="text-lg font-bold text-silq-blue">Improved Wettability</h3>
```

### 6. Improve "Adopt Our Technology" Section

The Contact Angle Chart doesn't look good in the dark section. Improvements needed:

**A. Improve chart styling for dark background:**
```tsx
<div className="bg-white rounded-xl p-6 shadow-lg">
  <ContactAngleChart />
</div>
```

**B. Move CTA buttons to be directly under the Scalable Manufacturing card:**

**C. Update description text:**
**Change FROM:**
```
"Bring antibiofouling technology to your devices."
```

**Change TO:**
```
"Bring Silq's technology to your medical devices or industrial/commercial products."
```

**Suggested structure:**
```tsx
<section className="relative py-20 bg-gradient-to-br from-silq-dark via-silq-blue-900 to-silq-dark text-white overflow-hidden">
  <div className="container-silq relative z-10">
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-display-sm font-bold mb-4">Adopt Our Technology</h2>
        <p className="text-white/70 max-w-lg mx-auto">
          Bring Silq's technology to your medical devices or industrial/commercial products.
        </p>
      </div>
      
      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Contact Angle Chart in white card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-silq-dark mb-4">Multi-Substrate Compatibility</h3>
          <p className="text-sm text-silq-dark/70 mb-4">
            Our treatment demonstrates consistent performance across multiple polymer substrates.
          </p>
          <ContactAngleChart />
        </div>
        
        {/* Right: Manufacturing + Buttons */}
        <div className="flex flex-col">
          <div className="rounded-2xl overflow-hidden shadow-xl mb-6">
            <Image 
              src="/images/science/silq-machine.gif"
              alt="Silq Manufacturing System"
              width={600}
              height={400}
              className="w-full h-auto"
              unoptimized
            />
          </div>
          <div className="bg-white/10 rounded-xl p-5 mb-6">
            <h3 className="text-base font-bold text-silq-teal mb-2">Scalable Manufacturing</h3>
            <p className="text-sm text-white/70">
              Rapid deposition process under ambient conditions. No exotic chemicals. Commercial-scale capacity.
            </p>
          </div>
          
          {/* CTA Buttons - Directly under manufacturing */}
          <div className="flex gap-4 flex-wrap">
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
    </div>
  </div>
</section>
```

---

## ABOUT PAGE (`src/app/about/team/page.tsx`)

### Reduce Headshot Sizes

The team member headshots are too large. Reduce the aspect ratio of the image container.

**Change FROM:**
```tsx
<div className="aspect-[4/5] relative overflow-hidden group">
```

**Change TO:**
```tsx
<div className="aspect-[3/4] relative overflow-hidden group max-h-64">
```

Or in `BiographyCard.tsx`, change the image container:
```tsx
<div className="h-56 relative overflow-hidden group">
```

This will make the images more compact while maintaining their professional appearance.

---

## CONTACT PAGE (`src/app/contact/page.tsx`)

### 1. Reduce White Space / Improve Visual Appeal

The page is too white. Add subtle background styling.

**Update the contact form section:**
```tsx
{/* Contact Form Section */}
<section className="py-16 bg-gradient-to-b from-white via-silq-cream/30 to-silq-cream/50 relative">
```

**Add subtle pattern or accents:**
```tsx
<section className="py-16 bg-gradient-to-b from-white to-silq-cream/40 relative">
  {/* Subtle background pattern */}
  <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1E4A6D 1px, transparent 0)', backgroundSize: '40px 40px' }} />
  </div>
  
  <div className="container-silq relative">
    {/* ... existing content ... */}
  </div>
</section>
```

### 2. Update Form Success Message

In `src/components/sections/ContactForm.tsx`, update the success message (Lines ~86-89):

**Change FROM:**
```tsx
<h3 className="text-xl font-bold text-green-800">Thank you!</h3>
<p className="mt-2 text-green-700">
  We&apos;ve received your message and will be in touch soon.
</p>
```

**Change TO:**
```tsx
<h3 className="text-xl font-bold text-green-800">Thank you!</h3>
<p className="mt-2 text-green-700">
  We&apos;ve received your message. A Silq team member will reach out within 48 hours.
</p>
```

---

## SUMMARY CHECKLIST

### Bug Fix
- [ ] Fix bacteria panel image display (add `unoptimized` and `priority` props)

### Homepage
- [ ] Hero GIF pauses on final frame (not loop)
- [ ] "FDA Cleared Product" → "FDA Cleared Products"
- [ ] Video title → "Treatment Effect Demonstration"
- [ ] Video subtitle → "Adaptable to various substrates, geometries, and configurations"

### Technology Page
- [ ] Move publication card to bottom of "How It Works" section
- [ ] Remove "(2022)" from publication
- [ ] Update "Mimics natural cell membranes..." text
- [ ] Remove Silq Treated/Control labels from blood loop images
- [ ] "Enhanced Hydrophilicity" → "Improved Wettability"
- [ ] Improve "Adopt Our Technology" section visually
- [ ] Contact Angle Chart in white card for contrast
- [ ] Move CTA buttons under Scalable Manufacturing
- [ ] Update description text

### About Page
- [ ] Reduce headshot sizes significantly

### Contact Page
- [ ] Add subtle background gradient/pattern to reduce white space
- [ ] Update success message: "A Silq team member will reach out within 48 hours"

---

## Commit and Deploy

```bash
git add -A
git commit -m "Visual polish: fix bacteria panel, reduce headshots, improve contact page, text updates"
git push origin main
git push origin main:staging --force
```
