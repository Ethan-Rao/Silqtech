# Dev Agent Prompt: Homepage & Site Enhancements

**Priority:** 🔴 CRITICAL  
**Created:** 2026-02-11  
**Status:** Ready for Implementation

---

## Overview

This prompt addresses specific user-requested changes plus 10 additional improvements to create a more polished, professional site. Focus on visual balance, content organization, and adding critical missing sections.

---

## USER-REQUESTED CHANGES

### 1. Homepage Banner Text Fix

**File:** `src/app/page.tsx`

In the ClearTract section (dark section around line 147-212), change the heading text:

**Current:**
```jsx
<h2 className="text-display-sm font-bold mb-4">
  ClearTract® Foley Catheters
</h2>
```

**Confirm** this already says "ClearTract® Foley Catheters" (not just "ClearTract"). If it just says "ClearTract", update it.

---

### 2. Integrate Testimonials into ClearTract Section on Homepage

**File:** `src/app/page.tsx`

Currently testimonials appear in a separate section below the ClearTract section. Merge them:

**REMOVE** the standalone testimonials section (Section 4, lines ~214-266).

**MODIFY** the ClearTract section (Section 3) to include condensed testimonial quotes:

```jsx
{/* Section 3: ClearTract + Encrustation + Testimonials (Combined Dark Section) */}
<section className="section-padding bg-gradient-to-br from-silq-blue-900 via-silq-dark to-silq-blue-800 text-white">
  <div className="container-silq">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left: Product + Encrustation Image */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/images/products/boxnew.jpg"
          alt="ClearTract Foley Catheter"
          width={500}
          height={500}
          className="rounded-2xl shadow-2xl"
        />
        {/* Encrustation comparison */}
        <div className="mt-6 rounded-xl overflow-hidden">
          <div className="h-48 md:h-56 overflow-hidden">
            <Image 
              src="/images/science/encrustation-comparison.png"
              alt="Encrustation comparison - standard catheter vs ClearTract"
              width={500}
              height={250}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <p className="text-xs text-white/60 mt-2 text-center">
            Visible difference in mineral buildup after extended use
          </p>
        </div>
      </motion.div>
      
      {/* Right: Copy + Inline Testimonials */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-teal bg-silq-teal/20 rounded-full">
          FDA 510(k) Cleared
        </span>
        <h2 className="text-display-sm font-bold mb-4">
          ClearTract® Foley Catheters
        </h2>
        <p className="text-white/80 mb-6">
          Drug-free infection resistance. Reduced encrustation. Superior patient comfort.
        </p>
        
        {/* Condensed Testimonials */}
        <div className="space-y-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/5">
            <p className="text-white/90 text-sm italic">
              &ldquo;ClearTract catheters have made a significant difference in reducing catheter-associated infections in my practice.&rdquo;
            </p>
            <p className="text-silq-teal text-xs mt-2 font-medium">— Evgeniy Kreydin, M.D., Cedars-Sinai</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/5">
            <p className="text-white/90 text-sm italic">
              &ldquo;Her UTIs have completely subsided, no more blockages or emergency room visits.&rdquo;
            </p>
            <p className="text-silq-teal text-xs mt-2 font-medium">— Stephen Newhouse, Caregiver</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Link href="/products/cleartract">
            <Button variant="primary" size="lg">Learn More</Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary" size="lg" className="text-white border-white/30 hover:bg-white/10">
              Request Samples
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
</section>
```

---

### 3. Add Surface Treatment Services Section at Bottom

**File:** `src/app/page.tsx`

Add a NEW SECTION before the CTA banner:

```jsx
{/* Section: Surface Treatment Services Teaser */}
<section className="section-padding bg-silq-cream">
  <div className="container-silq">
    <div className="max-w-4xl mx-auto text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
        For Medical Device Manufacturers
      </p>
      <h2 className="text-display-sm font-bold text-silq-dark mb-4">
        Surface Treatment Services
      </h2>
      <p className="text-silq-dark/70 mb-8 max-w-2xl mx-auto">
        License our patented zwitterionic technology for your products. Scalable manufacturing, FDA-cleared platform, customizable surface properties.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link href="/products/surface-treatment">
          <Button variant="primary" size="lg">Learn About Partnerships</Button>
        </Link>
        <Link href="/technology">
          <Button variant="secondary" size="lg">View Platform Technology</Button>
        </Link>
      </div>
    </div>
  </div>
</section>
```

---

### 4. Fix "Innovation That Matters" Balance

**File:** `src/app/page.tsx`

The issue: Feature cards on left, video on right feels visually heavy on the right side.

**Solution:** Make the video smaller and add a "How It Works" summary below it:

```jsx
{/* Right: How It Works Video */}
<div className="lg:sticky lg:top-24">
  <motion.div 
    className="rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto"
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <video 
      src="/videos/silq-technology-demo.mp4" 
      poster="/images/textures/tech-overview.gif"
      autoPlay 
      loop 
      muted 
      playsInline
      className="w-full aspect-video object-cover"
    />
  </motion.div>
  <div className="mt-6 text-center max-w-md mx-auto">
    <p className="text-sm text-silq-dark/50 mb-3">
      Surface treatment in action
    </p>
    <Link href="/technology" className="text-sm text-silq-blue hover:underline font-medium">
      Learn how it works →
    </Link>
  </div>
</div>
```

Also ensure the left side heading has more visual weight by adding a decorative element:

```jsx
{/* Left: Feature Cards + How It Works */}
<div>
  <div className="flex items-center gap-3 mb-2">
    <div className="w-1 h-8 bg-silq-blue rounded-full" />
    <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue">
      Why Silq
    </p>
  </div>
  <h2 className="text-display-sm font-bold text-silq-dark mb-4">
    Innovation That Matters
  </h2>
  {/* ... rest of content ... */}
</div>
```

---

### 5. Add Scrolling News Cards Section

**File:** `src/app/page.tsx`

Add a horizontally scrolling news section below the Trust Logos section:

First, define the news data at the top of the file:

```jsx
const newsItems = [
  {
    source: 'PR Newswire',
    title: 'Silq Technologies Awarded Group Purchasing Agreement for ClearTract® Catheters with Premier, Inc.',
    url: 'https://www.prnewswire.com/news-releases/silq-technologies-awarded-group-purchasing-agreement-for-cleartract-catheters-with-premier-inc-301234567.html',
    logo: '/images/news/prnewswire.png',
  },
  {
    source: 'Business Wire',
    title: 'Silq Technologies and NuSil Announce Collaboration Agreement to Drive Broad-based Adoption',
    url: 'https://www.businesswire.com/',
    logo: '/images/news/businesswire.png',
  },
  {
    source: 'Business Wire',
    title: 'Silq Technologies Receives Innovative Technology Contract From Vizient for ClearTract® Foley Catheter',
    url: 'https://www.businesswire.com/',
    logo: '/images/news/businesswire.png',
  },
  {
    source: 'UCLA Newsroom',
    title: 'Scientists Devise Method to Prevent Deadly Hospital Infections without Antibiotics',
    url: 'https://newsroom.ucla.edu/',
    logo: '/images/trust/ucla.jpg',
  },
]
```

Then add the section:

```jsx
{/* Section: News Ticker */}
<section className="py-12 bg-white border-t border-silq-dark/10">
  <div className="container-silq">
    <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue text-center mb-6">
      In The News
    </p>
  </div>
  
  {/* Horizontal Scroll Container */}
  <div className="overflow-x-auto scrollbar-hide">
    <div className="flex gap-6 px-6 md:px-12 pb-4 min-w-max">
      {newsItems.map((item, index) => (
        <a
          key={index}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-80 bg-silq-cream rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-silq-dark/5"
        >
          <div className="flex items-center gap-3 mb-3">
            <Image 
              src={item.logo} 
              alt={item.source} 
              width={80} 
              height={24} 
              className="h-5 w-auto object-contain opacity-60"
            />
            <span className="text-xs text-silq-dark/40">{item.source}</span>
          </div>
          <h4 className="text-sm font-semibold text-silq-dark leading-snug line-clamp-3">
            {item.title}
          </h4>
          <p className="text-xs text-silq-blue mt-3 flex items-center gap-1">
            Read article 
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </p>
        </a>
      ))}
    </div>
  </div>
</section>
```

**NOTE:** You'll need to create placeholder news logos:
- `/public/images/news/prnewswire.png`
- `/public/images/news/businesswire.png`

These can be simple text-based placeholders for now. The UCLA logo already exists.

---

### 6. Change "Innovation Award" to "GPO Approved"

**File:** `src/app/page.tsx`

In the Trust Logos section, find the Verizon award item and change it:

**Current:**
```jsx
<div className="flex flex-col items-center">
  <div className="h-16 flex items-center justify-center">
    <Image src="/images/trust/verizon-award.png" alt="Verizon Innovation Award" width={80} height={80} className="object-contain" />
  </div>
  <p className="text-xs text-silq-dark/50 mt-2">Innovation Award</p>
</div>
```

**Replace with GPO logos:**
```jsx
<div className="flex flex-col items-center">
  <div className="h-16 flex items-center justify-center gap-4">
    <Image src="/images/trust/premier-logo.png" alt="Premier GPO" width={60} height={40} className="h-8 w-auto object-contain" />
    <Image src="/images/trust/vizient-logo.png" alt="Vizient GPO" width={60} height={40} className="h-8 w-auto object-contain" />
  </div>
  <p className="text-xs text-silq-dark/50 mt-2">GPO Approved</p>
</div>
```

**NOTE:** Create placeholder images for:
- `/public/images/trust/premier-logo.png`
- `/public/images/trust/vizient-logo.png`

---

### 7. Technology Page - Enlarge Customizable Surface Properties to 2x2 Grid

**File:** `src/app/technology/page.tsx`

Change the grid from `lg:grid-cols-4` to `md:grid-cols-2` and make cards larger:

```jsx
{/* Customizable Properties - 2x2 Grid */}
<section className="section-padding bg-white">
  <div className="container-silq">
    <div className="text-center mb-10">
      <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
        Platform Capabilities
      </p>
      <h2 className="text-display-sm font-bold text-silq-dark">
        Customizable Surface Properties
      </h2>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Microbial Resistance */}
      <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="h-48 md:h-56 bg-gradient-to-br from-silq-blue/10 to-silq-teal/10 flex items-center justify-center">
          <svg className="w-20 h-20 text-silq-blue/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="p-6 text-center">
          <h4 className="font-bold text-silq-dark text-lg mb-2">Microbial Resistance</h4>
          <p className="text-sm text-silq-dark/60">Permanently transformed surface repels bacteria without drugs</p>
        </div>
      </div>
      
      {/* Anti-Thrombogenicity */}
      <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="h-48 md:h-56 bg-gradient-to-br from-silq-blue/10 to-silq-teal/10 flex items-center justify-center">
          <svg className="w-20 h-20 text-silq-blue/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div className="p-6 text-center">
          <h4 className="font-bold text-silq-dark text-lg mb-2">Anti-Thrombogenicity</h4>
          <p className="text-sm text-silq-dark/60">Reduces clot formation on vascular access devices</p>
        </div>
      </div>
      
      {/* Enhanced Lubricity - Video */}
      <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="h-48 md:h-56 overflow-hidden">
          <video 
            src="/videos/frictionless-silicone.mp4" 
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 text-center">
          <h4 className="font-bold text-silq-dark text-lg mb-2">Enhanced Lubricity</h4>
          <p className="text-sm text-silq-dark/60">Low friction coefficient for improved patient comfort</p>
        </div>
      </div>
      
      {/* Hydrophilicity - Video */}
      <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="h-48 md:h-56 overflow-hidden">
          <video 
            src="/videos/contact-lens-drying.mp4" 
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 text-center">
          <h4 className="font-bold text-silq-dark text-lg mb-2">Hydrophilicity</h4>
          <p className="text-sm text-silq-dark/60">Enhanced wettability for moisture-critical applications</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

### 8. Technology Page - Shrink Contact Angle Image & Add Manufacturing

**File:** `src/app/technology/page.tsx`

Replace the large Contact Angle section with a smaller, two-column layout that includes both the contact angle data AND the manufacturing capability:

```jsx
{/* Contact Angle + Manufacturing - Two Column */}
<section className="section-padding bg-white">
  <div className="container-silq">
    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
      {/* Left: Contact Angle (Smaller) */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
          Wide Applicability
        </p>
        <h2 className="text-display-sm font-bold text-silq-dark mb-4">
          Works Across Materials
        </h2>
        <p className="text-silq-dark/70 mb-6">
          Our treatment demonstrates consistent performance across multiple polymer substrates.
        </p>
        
        {/* Material & Contact Angle Table */}
        <div className="bg-silq-cream rounded-xl p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-silq-dark/60 border-b border-silq-dark/10">
                <th className="pb-2 font-medium">Material</th>
                <th className="pb-2 font-medium text-right">Untreated</th>
                <th className="pb-2 font-medium text-right">Treated</th>
              </tr>
            </thead>
            <tbody className="text-silq-dark">
              <tr className="border-b border-silq-dark/5">
                <td className="py-2">Silicone</td>
                <td className="py-2 text-right">108°</td>
                <td className="py-2 text-right text-silq-teal font-semibold">32°</td>
              </tr>
              <tr className="border-b border-silq-dark/5">
                <td className="py-2">Polyurethane</td>
                <td className="py-2 text-right">85°</td>
                <td className="py-2 text-right text-silq-teal font-semibold">28°</td>
              </tr>
              <tr className="border-b border-silq-dark/5">
                <td className="py-2">PTFE</td>
                <td className="py-2 text-right">120°</td>
                <td className="py-2 text-right text-silq-teal font-semibold">35°</td>
              </tr>
              <tr>
                <td className="py-2">Polycarbonate</td>
                <td className="py-2 text-right">82°</td>
                <td className="py-2 text-right text-silq-teal font-semibold">24°</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-silq-dark/40 mt-4">Lower contact angle = more hydrophilic surface</p>
        </div>
      </div>
      
      {/* Right: Manufacturing GIF */}
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
        <p className="text-sm font-semibold text-silq-dark mb-2">Scalable Manufacturing</p>
        <p className="text-sm text-silq-dark/70">
          Rapid deposition process under ambient conditions. No exotic chemicals. Commercial-scale capacity.
        </p>
        <Link href="/products/surface-treatment" className="text-sm text-silq-blue hover:underline font-medium mt-3 inline-block">
          Learn about partnership opportunities →
        </Link>
      </div>
    </div>
  </div>
</section>
```

---

### 9. ClearTract Page - Move Testimonials Below Banner

**File:** `src/app/products/cleartract/page.tsx`

Reorder sections so testimonials appear immediately after the hero, WITH the product specs strip:

**New order:**
1. Hero (white background)
2. Product Specs Strip (dark background) ← Combine with mini testimonials
3. Testimonials (keep dark/gradient)
4. Key Benefits (cream background)
5. CTA

**Modify the Product Specs section to be more prominent:**

```jsx
{/* Product Specs + Mini Testimonials */}
<section className="py-12 bg-gradient-to-br from-silq-blue-900 via-silq-dark to-silq-blue-800 text-white">
  <div className="container-silq">
    {/* Specs Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 max-w-4xl mx-auto text-center">
      <div>
        <p className="text-lg font-semibold text-silq-teal">100% Medical Grade</p>
        <p className="text-xs text-white/60">Silicone</p>
      </div>
      <div>
        <p className="text-lg font-semibold text-silq-teal">No Latex, BPA, DEHP</p>
        <p className="text-xs text-white/60">Safe materials</p>
      </div>
      <div>
        <p className="text-lg font-semibold text-silq-teal">FDA Cleared</p>
        <p className="text-xs text-white/60">Urethral, Suprapubic, Nephrostomy</p>
      </div>
      <div>
        <p className="text-lg font-semibold text-silq-teal">Antibiotic Free</p>
        <p className="text-xs text-white/60">Drug-free infection resistance</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-center mb-10">
      <div>
        <p className="text-lg font-semibold text-silq-teal">Endotoxin & Pyrogen Free</p>
        <p className="text-xs text-white/60">Reduced vs. market alternatives*</p>
      </div>
      <div>
        <p className="text-lg font-semibold text-silq-teal">Designed for Comfort</p>
        <p className="text-xs text-white/60">Enhanced lubricity</p>
      </div>
    </div>
    <p className="text-center text-xs text-white/40">*Data on file available by request</p>
    
    {/* Divider */}
    <div className="w-24 h-px bg-white/20 mx-auto my-10" />
    
    {/* Testimonials Header */}
    <h2 className="text-display-sm font-bold text-center mb-8">
      What People Are Saying
    </h2>
    
    {/* Testimonials Grid */}
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {testimonials.map((t, i) => (
        <motion.div
          key={i}
          className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <blockquote className="text-white/90 text-sm leading-relaxed mb-4">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-silq-teal/30 flex items-center justify-center text-xs font-bold text-white">
              {t.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold text-white text-xs">{t.author}</p>
              <p className="text-white/50 text-xs">{t.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

Then **REMOVE** the separate Testimonials section that was previously at the bottom.

---

## 10 ADDITIONAL ENHANCEMENTS

### Enhancement 1: Homepage Hero CTA Clarity

**File:** `src/app/page.tsx`

The secondary CTA "ClearTract®" is unclear. Make it action-oriented:

```jsx
secondaryCta={{ text: 'View Product', href: '/products/cleartract' }}
```

---

### Enhancement 2: Add Subtle Section Dividers

**File:** `src/app/page.tsx`

Between major sections, add subtle gradient dividers:

```jsx
{/* Section Divider */}
<div className="h-px bg-gradient-to-r from-transparent via-silq-dark/10 to-transparent" />
```

Add this between the Innovation section and the ClearTract section.

---

### Enhancement 3: Add Hover Micro-interactions to Feature Cards

**File:** `src/app/page.tsx`

Add a subtle scale effect on hover for the Innovation feature cards:

```jsx
<motion.div 
  key={feature.title} 
  className="p-5 bg-silq-cream rounded-xl hover:shadow-xl transition-all duration-300 min-h-[140px] flex flex-col group"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.4, delay: index * 0.1 }}
  whileHover={{ y: -4, scale: 1.02 }}
>
  <div className="w-10 h-10 rounded-lg bg-silq-blue/10 flex items-center justify-center text-silq-blue mb-3 group-hover:bg-silq-blue group-hover:text-white transition-colors duration-300">
    {feature.icon}
  </div>
  {/* ... rest ... */}
</motion.div>
```

---

### Enhancement 4: Technology Page - Add "Book a Demo" CTA in Hero

**File:** `src/app/technology/page.tsx`

Add a CTA button in the hero:

```jsx
<div className="mt-8 flex justify-center">
  <Link href="/contact">
    <Button variant="primary" size="lg">
      Schedule a Consultation
    </Button>
  </Link>
</div>
```

---

### Enhancement 5: ClearTract Hero - Make Product Image Larger

**File:** `src/app/products/cleartract/page.tsx`

Increase the product image size:

```jsx
<Image
  src="/images/products/boxnew.jpg"
  alt="ClearTract"
  width={600}
  height={600}
  className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
/>
```

---

### Enhancement 6: Add Animated Entrance to Trust Logos

**File:** `src/app/page.tsx`

Wrap trust logos in motion divs:

```jsx
{[
  { src: '/images/trust/fda.png', alt: 'FDA Cleared', label: '510(k) Cleared', width: 60 },
  // ... other logos
].map((item, index) => (
  <motion.div 
    key={item.alt}
    className="flex flex-col items-center"
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    {/* logo content */}
  </motion.div>
))}
```

---

### Enhancement 7: Add "Data on File" Footnote Styling

**File:** Global or component-level

Create a consistent style for data footnotes across pages:

```jsx
<p className="text-center text-xs text-white/40 mt-4 flex items-center justify-center gap-1">
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  *Data on file available by request
</p>
```

---

### Enhancement 8: Add Loading States to Videos

**File:** All pages with videos

Add a loading background while videos load:

```jsx
<div className="h-48 md:h-56 overflow-hidden bg-gradient-to-br from-silq-blue/5 to-silq-teal/5 relative">
  <video 
    src="/videos/frictionless-silicone.mp4" 
    autoPlay loop muted playsInline
    className="w-full h-full object-cover relative z-10"
  />
</div>
```

---

### Enhancement 9: Improve Mobile Navigation Touch Targets

**File:** `src/components/layout/Header.tsx`

Ensure all mobile nav links have adequate padding:

```jsx
<Link 
  href={item.href}
  className="block py-4 px-2 text-lg font-medium text-silq-dark hover:text-silq-blue transition-colors"
>
  {item.label}
</Link>
```

---

### Enhancement 10: Add Keyboard Focus Styles

**File:** `src/app/globals.css` or component-level

Add visible focus indicators for accessibility:

```css
/* In globals.css */
a:focus-visible,
button:focus-visible {
  outline: 2px solid theme('colors.silq.blue');
  outline-offset: 2px;
}
```

---

## FILES TO CREATE

Create placeholder images for news logos:

1. `/public/images/news/prnewswire.png` - Simple "PR Newswire" text on transparent background
2. `/public/images/news/businesswire.png` - Simple "Business Wire" text on transparent background
3. `/public/images/trust/premier-logo.png` - "Premier" GPO placeholder
4. `/public/images/trust/vizient-logo.png` - "Vizient" GPO placeholder

---

## Adding News Links (How To)

To easily add news links in the future, the `newsItems` array at the top of `page.tsx` follows this structure:

```typescript
interface NewsItem {
  source: string;      // Display name (e.g., "PR Newswire")
  title: string;       // Headline text
  url: string;         // Full URL to article
  logo: string;        // Path to source logo
}
```

Simply add new objects to the `newsItems` array:

```jsx
const newsItems = [
  // Existing items...
  {
    source: 'New Source',
    title: 'Article Headline Here',
    url: 'https://example.com/article',
    logo: '/images/news/source-logo.png',
  },
]
```

---

## FINAL SECTION ORDER (Homepage)

1. Hero (with banner.gif)
2. Innovation That Matters + How It Works Video
3. Section Divider
4. ClearTract + Encrustation + Inline Testimonials (dark section)
5. Trust Logos (with GPO Approved)
6. News Ticker (scrolling cards)
7. Surface Treatment Services Teaser (cream section)
8. CTA Banner

---

## TESTING CHECKLIST

- [ ] Homepage banner says "ClearTract® Foley Catheters"
- [ ] Testimonials are integrated into ClearTract section
- [ ] Surface Treatment teaser section appears at bottom
- [ ] Innovation section is visually balanced
- [ ] News cards scroll horizontally
- [ ] "Innovation Award" is changed to "GPO Approved"
- [ ] Technology page has 2x2 properties grid
- [ ] Technology page has smaller contact angle + manufacturing section
- [ ] ClearTract page shows specs + testimonials immediately after banner
- [ ] All hover states work smoothly
- [ ] Mobile responsive
- [ ] No console errors
