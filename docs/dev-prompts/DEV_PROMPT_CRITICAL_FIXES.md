# Dev Agent Prompt: Critical UI Fixes

**Priority:** 🔴 CRITICAL  
**Created:** 2026-02-17  
**Goal:** Fix broken UI elements, improve readability, fix mobile menu

**IMPORTANT:** Push and commit all changes when finished.

---

## ISSUE 1: Homepage Trust Cards

**File:** `src/app/page.tsx`

### 1A: Update Vizient Label

**Find (around line 446):**
```jsx
{ label: 'Vizient', sublabel: 'Innovative Technology' },
```

**Change to:**
```jsx
{ label: 'Vizient', sublabel: 'GPO Contract' },
```

### 1B: Remove Subtitles from Trust Cards

The trust cards don't need subtitles. Simplify them.

**Find the trust indicators section (~line 438-458) and replace with:**

```jsx
{/* Section 6: Trust Indicators - Text Only */}
<section className="py-14 bg-white border-t border-silq-dark/5">
  <div className="container-silq">
    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
      {[
        'FDA 510(k) Cleared',
        'UCLA Research',
        'Premier GPO Contract',
        'Vizient GPO Contract',
      ].map((item, index) => (
        <div 
          key={index} 
          className="text-center px-5 py-2.5 border border-silq-dark/10 rounded-lg bg-silq-cream/30"
        >
          <p className="font-semibold text-silq-dark text-sm">{item}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## ISSUE 2: Footer - Use Colorful Logo

**File:** `src/components/layout/Footer.tsx`

The footer currently uses `logo-oneline.png` with `brightness-0 invert` which looks poor. Use the colorful logo from the header instead.

### 2A: Update Logo

**Find (lines 11-19):**
```jsx
<Link href="/" className="flex items-center gap-3 mb-4">
  <Image
    src="/images/logos/logo-oneline.png"
    alt="Silq Technologies"
    width={120}
    height={40}
    className="h-10 w-auto brightness-0 invert"
  />
</Link>
```

**Change to:**
```jsx
<Link href="/" className="inline-block mb-4">
  <Image
    src="/images/logos/logo-main.png"
    alt="Silq Technologies"
    width={140}
    height={45}
    className="h-11 w-auto"
  />
</Link>
```

### 2B: Improve Footer Styling

**Replace the entire Footer component with this improved version:**

```jsx
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-silq-dark text-white">
      <div className="container-silq py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logos/logo-main.png"
                alt="Silq Technologies"
                width={140}
                height={45}
                className="h-11 w-auto"
              />
            </Link>
            <p className="text-white/60 text-sm font-light tracking-wide mb-2">
              Surface Science Perfected
            </p>
            <p className="text-white/40 text-xs">
              Los Angeles, California
            </p>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Products</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <Link href="/products/cleartract" className="hover:text-white transition-colors">
                  ClearTract® Catheters
                </Link>
              </li>
              <li>
                <Link href="/products/surface-treatment" className="hover:text-white transition-colors">
                  Surface Treatment
                </Link>
              </li>
              <li>
                <Link href="/technology" className="hover:text-white transition-colors">
                  Technology
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <Link href="/about/team" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about/investors" className="hover:text-white transition-colors">
                  Investors
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-white/50">
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
                  Terms &amp; Conditions
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
        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Silq Technologies Corp. All rights reserved.
            </p>
            <a
              href="https://linkedin.com/company/silq-technologies"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

---

## ISSUE 3: Technology Page - Video Sizing & Layout

**File:** `src/app/technology/page.tsx`

### 3A: Enlarge Videos in 3-Card Row

The videos in the Lubricity and Hydrophilicity cards are too small. Remove the height constraint and make them more prominent.

**Find the 3-card grid (around line 211-274) and update the video containers:**

For both video cards, change:
```jsx
<div className="px-2 pb-2">
  <div className="rounded-lg overflow-hidden bg-gradient-to-br from-silq-blue/5 to-silq-teal/5">
    <video 
      src="/videos/frictionless-silicone.mp4" 
      autoPlay loop muted playsInline
      className="w-full aspect-video object-contain"
    />
  </div>
</div>
```

**To (remove padding, make video larger):**
```jsx
<div className="relative">
  <video 
    src="/videos/frictionless-silicone.mp4" 
    autoPlay loop muted playsInline
    className="w-full aspect-[4/3] object-cover"
  />
</div>
```

Do the same for the contact-lens-drying.mp4 video.

### 3B: Optimize Bacteria Panel Loading

Add `priority` and `loading="eager"` to the bacteria panel image for faster loading:

**Find:**
```jsx
<Image 
  src="/images/science/Bacteria%20Panel.png"
  alt="Bacterial adhesion reduction data"
  width={1200}
  height={400}
  className="w-full object-contain"
/>
```

**Change to:**
```jsx
<Image 
  src="/images/science/Bacteria%20Panel.png"
  alt="Bacterial adhesion reduction data"
  width={1200}
  height={400}
  className="w-full object-contain"
  priority
/>
```

---

## ISSUE 4: ClearTract Page - Text Fixes

**File:** `src/app/products/cleartract/page.tsx`

### 4A: Fix Grammar - "surfaces reduce" not "surface reduces"

**Find (around line 167):**
```jsx
<p className="text-sm text-silq-dark/60">Zwitterionic surface reduces mineral buildup for longer catheter life and fewer replacements.</p>
```

**Change to:**
```jsx
<p className="text-sm text-silq-dark/60">Zwitterionic surfaces reduce mineral buildup for longer catheter life and fewer replacements.</p>
```

### 4B: Enlarge Product Specs Text

The specs text above testimonials is too small to read. Increase font sizes.

**Find the specs grid (around line 101-118):**
```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 max-w-4xl mx-auto text-center">
  <div>
    <p className="text-sm font-semibold text-silq-teal">Medical Grade Silicone</p>
    <p className="text-xs text-white/50">Latex, BPA, DEHP-free</p>
  </div>
  ...
</div>
```

**Change to (increase font sizes):**
```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 max-w-4xl mx-auto text-center">
  <div>
    <p className="text-base font-semibold text-silq-teal">Medical Grade Silicone</p>
    <p className="text-sm text-white/60">Latex, BPA, DEHP-free</p>
  </div>
  <div>
    <p className="text-base font-semibold text-silq-teal">FDA Cleared</p>
    <p className="text-sm text-white/60">510(k) regulatory approval</p>
  </div>
  <div>
    <p className="text-base font-semibold text-silq-teal">Drug-Free</p>
    <p className="text-sm text-white/60">No antibiotics or antimicrobials</p>
  </div>
  <div>
    <p className="text-base font-semibold text-silq-teal">Low Endotoxin</p>
    <p className="text-sm text-white/60">Safe for suprapubic insertions</p>
  </div>
</div>
```

---

## ISSUE 5: Surface Treatment Page - Contact Angle Chart

**File:** `src/app/products/surface-treatment/page.tsx`

The contact angle chart exists (lines 184-214) but may not be loading due to incorrect image path.

### 5A: Verify Image Path

Check if the file exists at: `/public/images/science/contact-angle-comparison.jpg`

If the file doesn't exist or has a different name, update the path accordingly.

**Current code (line 205-210):**
```jsx
<Image 
  src="/images/science/contact-angle-comparison.jpg"
  alt="Contact angle comparison chart"
  width={500}
  height={350}
  className="w-full rounded-lg"
/>
```

### 5B: Add Fallback/Placeholder if Image Missing

If the image is missing, add a placeholder or check the actual filename in the project folder.

**List files in:** `public/images/science/` to find the correct contact angle chart filename.

---

## ISSUE 6: Mobile Menu Overlay Fix

**File:** `src/components/layout/Header.tsx`

The mobile menu overlays content and is hard to read.

### 6A: Fix Mobile Navigation Background

**Find the mobile navigation div (around line 178-226):**
```jsx
<div
  className={cn(
    'lg:hidden fixed inset-0 top-20 bg-white z-40 transition-all duration-300',
    mobileMenuOpen
      ? 'opacity-100 visible'
      : 'opacity-0 invisible pointer-events-none'
  )}
>
```

**Change to (ensure solid background, proper z-index, add overflow scroll):**
```jsx
<div
  className={cn(
    'lg:hidden fixed inset-x-0 top-20 bottom-0 bg-white z-50 transition-all duration-300 overflow-y-auto',
    mobileMenuOpen
      ? 'opacity-100 visible'
      : 'opacity-0 invisible pointer-events-none'
  )}
>
```

### 6B: Improve Text Readability

The navigation links should have better contrast and larger touch targets.

**Find the mobile nav links (around line 190-198):**
```jsx
<Link
  href={item.href}
  className={cn(
    'block py-4 px-2 text-lg font-medium border-b border-silq-dark/10 transition-colors',
    pathname === item.href ? 'text-silq-blue' : 'text-silq-dark hover:text-silq-blue'
  )}
>
  {item.name}
</Link>
```

**Change to (larger padding, better text styling):**
```jsx
<Link
  href={item.href}
  className={cn(
    'block py-5 px-4 text-lg font-semibold border-b border-silq-dark/10 transition-colors',
    pathname === item.href ? 'text-silq-blue bg-silq-blue/5' : 'text-silq-dark hover:text-silq-blue hover:bg-silq-cream/50'
  )}
>
  {item.name}
</Link>
```

### 6C: Fix Child Links Readability

**Find the child links (around line 200-212):**
```jsx
{item.children && (
  <div className="pl-4 py-2 space-y-2">
    {item.children.map((child) => (
      <Link
        key={child.name}
        href={child.href}
        className={cn(
          'block py-2 text-base',
          pathname === child.href ? 'text-silq-blue' : 'text-silq-dark/70'
        )}
      >
        {child.name}
      </Link>
    ))}
  </div>
)}
```

**Change to (better padding and contrast):**
```jsx
{item.children && (
  <div className="pl-6 py-2 space-y-1 bg-silq-cream/30">
    {item.children.map((child) => (
      <Link
        key={child.name}
        href={child.href}
        className={cn(
          'block py-3 px-4 text-base font-medium rounded-lg transition-colors',
          pathname === child.href 
            ? 'text-silq-blue bg-silq-blue/10' 
            : 'text-silq-dark/80 hover:text-silq-blue hover:bg-silq-blue/5'
        )}
      >
        {child.name}
      </Link>
    ))}
  </div>
)}
```

---

## CHECKLIST

- [ ] Homepage trust cards: "Vizient GPO Contract", no subtitles
- [ ] Footer: Colorful logo (logo-main.png), no invert filter
- [ ] Technology page: Videos enlarged (aspect-[4/3])
- [ ] Technology page: Bacteria panel has `priority` prop
- [ ] ClearTract: "surfaces reduce" (plural)
- [ ] ClearTract: Specs text enlarged (text-base, text-sm)
- [ ] STS page: Contact angle chart loads correctly
- [ ] Mobile menu: Solid background, z-50, overflow-y-auto
- [ ] Mobile menu: Larger touch targets, better contrast
- [ ] All changes committed and pushed

---

## FINAL STEP

```bash
cd C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website
git add .
git commit -m "Critical UI fixes: footer logo, mobile menu, trust cards, text sizing"
git push origin main staging
```
