# Dev Prompt: Aesthetic Polish & Visual Consistency

## Overview
This prompt focuses on visual refinements to create a more polished, professional appearance. No new content—only styling and layout improvements.

---

## TECHNOLOGY PAGE (`src/app/technology/page.tsx`)

### 1. Update Hero Subtitle
**Change FROM:**
```tsx
<p className="mt-4 text-lg text-white/60 max-w-xl mx-auto">
  Bio-inspired zwitterionic chemistry that resists fouling on any surface.
</p>
```

**Change TO:**
```tsx
<p className="mt-4 text-lg text-white/60 max-w-xl mx-auto">
  Bio-inspired zwitterionic chemistry for better, safer medical implants. FDA Cleared, Antibiotic-free.
</p>
```

### 2. Enlarge Publication Card
Make the publication card larger and more prominent.

**Change FROM:**
```tsx
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
```

**Change TO:**
```tsx
<a 
  href="https://onlinelibrary.wiley.com/doi/10.1002/adma.202200254"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-8 bg-white rounded-2xl p-6 hover:shadow-xl transition-shadow max-w-3xl border border-silq-dark/5 shadow-lg"
>
  <Image 
    src="/images/publications/advanced-materials-cover.jpg"
    alt="Advanced Materials Journal Cover"
    width={100}
    height={130}
    className="rounded-lg shadow-lg flex-shrink-0"
  />
```

### 3. Add Video Subtitle Under "How It Works" Video
Add the same "Treatment Effect Demonstration" subtitle as on the homepage.

**Change FROM:**
```tsx
<div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-silq-dark/5">
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
</div>
```

**Change TO:**
```tsx
<div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-silq-dark/5">
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
  <div className="p-3 bg-gradient-to-r from-silq-blue to-silq-teal text-white text-center">
    <p className="text-sm font-medium">Treatment Effect Demonstration</p>
  </div>
</div>
```

### 4. Fix Section Backgrounds - Make Bottom Section Lighter
The dark "Adopt Our Technology" section clashes with the contact angle chart. Change to a lighter background.

**Change the "Adopt Our Technology" section FROM:**
```tsx
<section className="relative py-20 bg-gradient-to-br from-silq-dark via-silq-blue-900 to-silq-dark text-white overflow-hidden">
```

**Change TO a light section with better contrast:**
```tsx
<section className="relative py-20 bg-gradient-to-b from-silq-cream to-white overflow-hidden">
```

**Then update all text colors within to work on light background:**
- `text-white` → `text-silq-dark`
- `text-white/70` → `text-silq-dark/70`
- `text-silq-teal` → `text-silq-blue`
- Remove/update decorative dark blurs

**Updated section structure:**
```tsx
<section className="relative py-20 bg-gradient-to-b from-silq-cream/50 to-white overflow-hidden">
  {/* Subtle decorative elements */}
  <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
    <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-silq-teal blur-3xl" />
    <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-silq-blue blur-3xl" />
  </div>
  <div className="container-silq relative z-10">
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-display-sm font-bold text-silq-dark mb-4">
          Adopt Our Technology
        </h2>
        <p className="text-silq-dark/70 max-w-lg mx-auto">
          Bring Silq&apos;s technology to your medical devices or industrial/commercial products.
        </p>
      </div>
      
      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Contact Angle Chart - already in white card, good */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-silq-dark/5">
          <h3 className="text-lg font-bold text-silq-dark mb-4">Multi-Substrate Compatibility</h3>
          <p className="text-sm text-silq-dark/70 mb-4">
            Our treatment demonstrates consistent performance across multiple polymer substrates.
          </p>
          <ContactAngleChart />
        </div>
        
        {/* Right: Manufacturing + Buttons */}
        <div className="flex flex-col">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-silq-dark/5 mb-6">
            <Image 
              src="/images/science/silq-machine.gif"
              alt="Silq Manufacturing System"
              width={600}
              height={400}
              className="w-full h-auto"
              unoptimized
            />
          </div>
          <div className="bg-silq-blue/5 rounded-xl p-5 mb-6 border border-silq-blue/10">
            <h3 className="text-base font-bold text-silq-blue mb-2">Scalable Manufacturing</h3>
            <p className="text-sm text-silq-dark/70">
              Rapid deposition process under ambient conditions. No exotic chemicals. Commercial-scale capacity.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 flex-wrap">
            <Link href="/products/surface-treatment">
              <Button variant="primary" size="lg">
                Surface Treatment Services →
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
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

### 5. Fix Spacing in "Adopt Our Technology" Section
The current layout (as pictured) has awkward spacing. Ensure:
- Contact angle chart card and manufacturing column are equal height
- Consistent padding and gaps
- Buttons sit naturally under the content

---

## ABOUT PAGE (`src/app/about/team/page.tsx`)

### 1. Fix Image Cropping in BiographyCard
The images are being cut off. Update `BiographyCard.tsx`:

**Change FROM:**
```tsx
<div className="h-56 relative overflow-hidden group">
```

**Change TO:**
```tsx
<div className="h-64 relative overflow-hidden group">
```

Also update the Image component to use `object-center` instead of `object-top`:
```tsx
<Image
  src={image}
  alt={name}
  fill
  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
  onError={() => setImgError(true)}
/>
```

### 2. Remove Email Icons from Verne and Brian
In `src/app/about/team/page.tsx`, remove the `email` property from Verne Sharma and Brian McVerry's entries:

**For Verne Sharma, REMOVE:**
```tsx
email: 'info@silq.tech',
```

**For Brian McVerry, REMOVE:**
```tsx
email: 'brianm@silq.tech',
```

---

## CONTACT PAGE (`src/app/contact/page.tsx`)

### Add Light Blue Background to "Let's Talk" Hero Section
**Change FROM:**
```tsx
<section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-silq-cream via-white to-silq-blue/5 relative overflow-hidden">
```

**Change TO:**
```tsx
<section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-silq-blue/10 via-silq-blue/5 to-white relative overflow-hidden">
```

This creates a subtle light blue tint behind the "Let's Talk" title.

---

## SURFACE TREATMENT SERVICES PAGE (`src/app/products/surface-treatment/page.tsx`)

### Improve Contact Angle Section Layout (Two-Column Table)
The current layout has excessive white space. Create a more compact two-column layout.

**Current:** Single-column table with left-side explanatory text  
**Goal:** Two-column material table with centered header

Update the ContactAngleChart component or the section layout:

```tsx
{/* Contact Angle Chart - Compact Layout */}
<div className="mt-12 bg-white rounded-2xl p-6 shadow-lg max-w-4xl mx-auto">
  <div className="text-center mb-6">
    <h3 className="text-xl font-bold text-silq-blue">Multi-Substrate Compatibility</h3>
    <p className="text-silq-dark/70 text-sm mt-2">
      Our treatment dramatically reduces contact angle across multiple substrate materials.
    </p>
  </div>
  <ContactAngleChart compact />
</div>
```

**Option: Update ContactAngleChart.tsx to support compact/two-column mode:**

Add a `compact` prop that splits materials into two columns:
```tsx
interface ContactAngleChartProps {
  className?: string
  compact?: boolean  // Two-column mode
}

export function ContactAngleChart({ className = '', compact = false }: ContactAngleChartProps) {
  // ... existing state ...
  
  if (compact) {
    const midpoint = Math.ceil(materials.length / 2)
    const leftColumn = materials.slice(0, midpoint)
    const rightColumn = materials.slice(midpoint)
    
    return (
      <div className={className}>
        <div className="bg-gradient-to-br from-silq-cream to-white rounded-xl p-4 border border-silq-dark/5">
          <div className="grid grid-cols-2 gap-x-8">
            {/* Left Column */}
            <table className="text-sm">
              <thead>
                <tr className="text-silq-dark/50 border-b border-silq-dark/10">
                  <th className="pb-2 text-left font-medium text-xs">Material</th>
                  <th className="pb-2 text-center font-medium text-xs">Untreated</th>
                  <th className="pb-2 text-center font-medium text-xs">Treated</th>
                </tr>
              </thead>
              <tbody>
                {leftColumn.map((m) => (
                  <tr key={m.name} className="border-b border-silq-dark/5">
                    <td className="py-2 font-medium">{m.displayName}</td>
                    <td className="py-2 text-center text-silq-dark/60">{m.untreatedAngle}</td>
                    <td className="py-2 text-center">
                      <span className="inline-flex items-center gap-1 text-silq-teal font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-silq-teal" />
                        {m.treatedAngle}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Right Column */}
            <table className="text-sm">
              <thead>
                <tr className="text-silq-dark/50 border-b border-silq-dark/10">
                  <th className="pb-2 text-left font-medium text-xs">Material</th>
                  <th className="pb-2 text-center font-medium text-xs">Untreated</th>
                  <th className="pb-2 text-center font-medium text-xs">Treated</th>
                </tr>
              </thead>
              <tbody>
                {rightColumn.map((m) => (
                  <tr key={m.name} className="border-b border-silq-dark/5">
                    <td className="py-2 font-medium">{m.displayName}</td>
                    <td className="py-2 text-center text-silq-dark/60">{m.untreatedAngle}</td>
                    <td className="py-2 text-center">
                      <span className="inline-flex items-center gap-1 text-silq-teal font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-silq-teal" />
                        {m.treatedAngle}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-silq-dark/40 mt-3 text-center">
            Click any angle to view measurement. Lower = more hydrophilic.
          </p>
        </div>
      </div>
    )
  }
  
  // ... existing single-column return ...
}
```

---

## GLOBAL AESTHETIC IMPROVEMENTS

### 1. Consistent Section Backgrounds
Ensure consistent use of background colors across pages:
- **Light sections:** `bg-white` or `bg-gradient-to-b from-silq-cream to-white`
- **Cream sections:** `bg-silq-cream` or `bg-silq-cream/50`
- **Dark sections (use sparingly):** `bg-gradient-to-br from-silq-dark via-silq-blue-900 to-silq-dark`

### 2. Card Shadows
Use consistent shadow treatment:
- Standard cards: `shadow-lg hover:shadow-xl transition-shadow`
- Featured cards: `shadow-xl` or `shadow-2xl`
- Add `border border-silq-dark/5` for subtle definition

### 3. Button Consistency
Ensure all CTA buttons use the Button component with consistent sizing:
- Primary actions: `variant="primary" size="lg"`
- Secondary actions: `variant="secondary" size="lg"`

---

## SUMMARY CHECKLIST

### Technology Page
- [ ] Update hero subtitle to match homepage messaging
- [ ] Enlarge publication card (100px wide image, larger padding)
- [ ] Add "Treatment Effect Demonstration" subtitle under video
- [ ] Change "Adopt Our Technology" to light background
- [ ] Fix spacing/layout in bottom section

### About Page
- [ ] Fix image cropping (increase height to `h-64`, use `object-center`)
- [ ] Remove email icons from Verne Sharma and Brian McVerry

### Contact Page
- [ ] Add light blue gradient background to "Let's Talk" hero section

### Surface Treatment Services Page
- [ ] Implement two-column contact angle table for better space usage

---

## Commit and Deploy

```bash
git add -A
git commit -m "Aesthetic polish: technology page colors, about page fixes, contact page background, STS layout"
git push origin main
git push origin main:staging --force
```
