# Dev Agent Prompt: Site Polish, Testimonials & Biography Cards

**Priority:** 🟡 HIGH  
**Created:** 2026-02-17  
**Goal:** Review recent changes, polish aesthetics, implement scrollable testimonials, add biography cards

---

## CONTEXT

The dev agent recently made significant layout changes:
- ✅ Innovation section video now fills height
- ✅ Encrustation images replaced with Advanced Materials publication
- ✅ Blood loop images stacked vertically
- ✅ Bacteria panel on own row across Technology, ClearTract, Surface Treatment
- ✅ Card titles now blue
- ✅ Contact angle chart added
- ✅ "Ordering Information" button added

This prompt focuses on polishing those changes and adding new features.

---

## ISSUE 1: Testimonial Carousel - Scroll One at a Time

**Files:** 
- `src/app/products/cleartract/page.tsx`
- `src/app/page.tsx`

### Current Behavior (Wrong)
Testimonials scroll as a set of 3 cards at once.

### Target Behavior (Correct)
Single testimonial visible at a time, with smooth horizontal scroll/fade animation between them.

### 1A: ClearTract Page - Single Testimonial Scroll

Replace the current 3-card grid with a single-card carousel:

```jsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Inside component:
const testimonials = [
  {
    quote: "ClearTract catheters have made a significant difference in reducing catheter-associated infections in my practice.",
    author: "Evgeniy Kreydin, M.D.",
    role: "Urologist, Cedars-Sinai",
    initials: "EK",
  },
  {
    quote: "I would not go back to other catheters ever again. The comfort has been life-changing for my daily routine.",
    author: "Ana Garcia",
    role: "Long-term Catheter Patient",
    initials: "AG",
  },
  {
    quote: "Her UTIs have completely subsided, no more blockages or emergency room visits. My mom is completely satisfied.",
    author: "Stephen Newhouse",
    role: "Caregiver",
    initials: "SN",
  },
  // Placeholders for additional testimonials
  {
    quote: "Placeholder testimonial - content pending team review.",
    author: "Placeholder Name",
    role: "Title, Organization",
    initials: "PN",
  },
  {
    quote: "Placeholder testimonial - content pending team review.",
    author: "Placeholder Name",
    role: "Title, Organization",
    initials: "PN",
  },
  {
    quote: "Placeholder testimonial - content pending team review.",
    author: "Placeholder Name",
    role: "Title, Organization",
    initials: "PN",
  },
]

const [currentTestimonial, setCurrentTestimonial] = useState(0)

// Auto-advance every 6 seconds
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }, 6000)
  return () => clearInterval(timer)
}, [])

// Testimonial Carousel Component
<div className="max-w-2xl mx-auto mb-12">
  <div className="relative min-h-[200px]">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentTestimonial}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        {/* Quote Icon */}
        <div className="text-silq-teal/30 text-4xl font-serif mb-2">"</div>
        
        {/* Quote Text */}
        <blockquote className="text-white/90 text-lg leading-relaxed mb-6">
          {testimonials[currentTestimonial].quote}
        </blockquote>
        
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-silq-teal/20 flex items-center justify-center">
            <span className="text-silq-teal text-sm font-semibold">
              {testimonials[currentTestimonial].initials}
            </span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">
              {testimonials[currentTestimonial].author}
            </p>
            <p className="text-white/50 text-xs">
              {testimonials[currentTestimonial].role}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
  
  {/* Navigation Dots */}
  <div className="flex justify-center gap-2 mt-6">
    {testimonials.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentTestimonial(index)}
        className={`w-2 h-2 rounded-full transition-all ${
          index === currentTestimonial 
            ? 'bg-silq-teal w-6' 
            : 'bg-white/30 hover:bg-white/50'
        }`}
        aria-label={`Go to testimonial ${index + 1}`}
      />
    ))}
  </div>
  
  {/* Arrow Navigation */}
  <div className="flex justify-center gap-4 mt-4">
    <button
      onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      aria-label="Previous testimonial"
    >
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      aria-label="Next testimonial"
    >
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</div>
```

### 1B: Homepage ClearTract Section - Add Same Carousel

Copy the same testimonial carousel component to the homepage ClearTract section.

**Position:** Between the title/buttons and the product images.

**Adapt for dark section background:**
- Use same `bg-white/5` card styling
- Same navigation dots and arrows
- Same auto-advance behavior

Consider extracting to a reusable component:

```jsx
// src/components/ui/TestimonialCarousel.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Testimonial {
  quote: string
  author: string
  role: string
  initials: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  autoAdvanceMs?: number
  className?: string
}

export function TestimonialCarousel({ 
  testimonials, 
  autoAdvanceMs = 6000,
  className = ''
}: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, autoAdvanceMs)
    return () => clearInterval(timer)
  }, [testimonials.length, autoAdvanceMs])

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* ... carousel implementation ... */}
    </div>
  )
}
```

Then use in both pages:
```jsx
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel'

<TestimonialCarousel testimonials={testimonials} />
```

---

## ISSUE 2: Biography Cards for Team Page

**File:** `src/app/about/team/page.tsx`

### 2A: Create Biography Card Component

Add expandable biography cards for team members:

```jsx
// src/components/ui/BiographyCard.tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface BiographyCardProps {
  name: string
  title: string
  image: string
  bio: string  // Full biography text
  shortBio?: string  // Optional short version
  linkedIn?: string
  email?: string
}

export function BiographyCard({ 
  name, 
  title, 
  image, 
  bio, 
  shortBio,
  linkedIn,
  email 
}: BiographyCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      layout
    >
      {/* Image */}
      <div className="aspect-[4/5] relative overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-silq-dark">{name}</h3>
        <p className="text-silq-blue font-medium text-sm mt-1">{title}</p>
        
        {/* Biography */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {expanded ? (
              <motion.div
                key="full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-silq-dark/70 text-sm leading-relaxed"
              >
                {bio}
              </motion.div>
            ) : (
              <motion.p
                key="short"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-silq-dark/70 text-sm line-clamp-3"
              >
                {shortBio || bio}
              </motion.p>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-silq-blue hover:text-silq-teal text-sm font-medium transition-colors"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        </div>
        
        {/* Social Links */}
        <div className="mt-4 flex gap-3">
          {linkedIn && (
            <a 
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-silq-dark/40 hover:text-silq-blue transition-colors"
              aria-label={`${name}'s LinkedIn`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          )}
          {email && (
            <a 
              href={`mailto:${email}`}
              className="text-silq-dark/40 hover:text-silq-blue transition-colors"
              aria-label={`Email ${name}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
```

### 2B: Update Team Page with Biography Cards

```jsx
// In team/page.tsx

const teamMembers = [
  {
    name: "Brian McVerry, Ph.D.",
    title: "Co-Founder & CEO",
    image: "/images/team/brian-mcverry.jpg",
    bio: "Placeholder biography - content pending team review. Full biography will include education, experience, and achievements.",
    shortBio: "Placeholder short bio - pending team review.",
    linkedIn: "https://linkedin.com/in/...",
    email: "brianm@silq.tech",
  },
  {
    name: "Ethan Rao",
    title: "Co-Founder & COO",
    image: "/images/team/ethan-rao.jpg",
    bio: "Placeholder biography - content pending team review. Full biography will include education, experience, and achievements.",
    shortBio: "Placeholder short bio - pending team review.",
    linkedIn: "https://linkedin.com/in/...",
    email: "ethanr@silq.tech",
  },
  {
    name: "Richard Kaner, Ph.D.",
    title: "Co-Founder & Scientific Advisor",
    image: "/images/team/richard-kaner.jpg",
    bio: "Placeholder biography - content pending team review. Full biography will include education, experience, and achievements.",
    shortBio: "Placeholder short bio - pending team review.",
  },
  // Add other team members...
]

// Render
<section className="py-20 bg-gray-50">
  <div className="container-silq">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-silq-dark">Leadership Team</h2>
      <p className="mt-4 text-silq-dark/70">The people behind Silq Technologies</p>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {teamMembers.map((member, index) => (
        <BiographyCard key={index} {...member} />
      ))}
    </div>
  </div>
</section>
```

---

## ISSUE 3: Legacy Code Cleanup

### 3A: Search for Unused Components

Run a search for components that may no longer be used:

```bash
# Check for unused imports in each page
grep -r "ImagePlaceholder" src/app/
grep -r "VideoEmbed" src/app/
```

**Components to verify are still needed:**
- `ImagePlaceholder` - May be obsolete now that real images are in place
- Any old testimonial components replaced by carousel
- Unused utility functions

### 3B: Remove Deprecated Code Blocks

Search for and remove:
- Commented-out code blocks
- TODO comments that have been addressed
- Console.log statements
- Unused imports at top of files

```jsx
// REMOVE patterns like:
// import { SomeUnusedComponent } from '@/components/...'
// console.log('debug:', someVar)
// TODO: This has been done
/* 
  Old code that was replaced
*/
```

### 3C: Clean Up CSS/Tailwind

Remove any duplicate or conflicting Tailwind classes:

```jsx
// BAD - redundant
<div className="flex flex-row items-center flex items-center">

// GOOD
<div className="flex items-center">
```

### 3D: Check for Dead Routes

Verify all pages in `src/app/` are linked from somewhere:
- No orphaned pages that can't be navigated to
- All nav links point to existing routes

---

## ISSUE 4: Aesthetic Polish Checklist

Review each page and fix any visual inconsistencies:

### 4A: Homepage
- [ ] Video fills full height of Innovation section
- [ ] Publication card matches box image height
- [ ] Testimonial carousel works smoothly
- [ ] All buttons have consistent hover states
- [ ] Proper spacing between sections

### 4B: Technology Page
- [ ] Bacteria panel looks balanced on its own row
- [ ] Blood loop images stack cleanly
- [ ] Card titles all blue
- [ ] No orphaned or misaligned elements

### 4C: ClearTract Page
- [ ] Testimonial carousel scrolls one at a time
- [ ] Three CTA buttons aligned properly
- [ ] Benefit cards evenly spaced
- [ ] FDA icon properly sized

### 4D: Surface Treatment Page
- [ ] Contact angle chart section integrated well
- [ ] Blood loop images properly stacked
- [ ] No redundant text (thrombus coverage removed)

### 4E: Team Page
- [ ] Biography cards render correctly
- [ ] Read more/less animation smooth
- [ ] Placeholder text clearly marked

### 4F: Investors Page
- [ ] Correct claims (no ISO/FDA facility)
- [ ] Patent language updated
- [ ] Stats accurate (3 510(k)s, Master File)

### 4G: Contact Page
- [ ] Form works and submits
- [ ] No duplicate contact info
- [ ] Proper validation feedback

---

## ISSUE 5: Performance & Accessibility

### 5A: Image Optimization
- Ensure all images use `next/image` with proper `width`/`height`
- Add `loading="lazy"` to below-fold images
- Use `unoptimized` prop only for GIFs

### 5B: Accessibility
- All buttons have `aria-label` when icon-only
- All images have descriptive `alt` text
- Color contrast meets WCAG standards
- Carousel is keyboard navigable

### 5C: Mobile Testing
- Test all pages at 375px width
- Ensure carousel arrows don't overlap content
- Verify touch gestures work on carousel

---

## FILES TO CREATE/MODIFY

**New Components:**
- [ ] `src/components/ui/TestimonialCarousel.tsx`
- [ ] `src/components/ui/BiographyCard.tsx`

**Pages to Update:**
- [ ] `src/app/page.tsx` - Add testimonial carousel
- [ ] `src/app/products/cleartract/page.tsx` - Update carousel behavior
- [ ] `src/app/about/team/page.tsx` - Add biography cards

**Cleanup:**
- [ ] Remove unused components from `src/components/`
- [ ] Remove commented code throughout
- [ ] Clean up unused imports

---

## FINAL CHECKLIST

- [ ] Testimonials scroll one at a time on ClearTract
- [ ] Same carousel added to homepage ClearTract section
- [ ] Biography card component created
- [ ] Team page shows biography cards with "Read more"
- [ ] All legacy/commented code removed
- [ ] No unused imports
- [ ] All pages visually balanced
- [ ] Mobile responsive
- [ ] Pushed to staging

---

## FINAL STEP

```bash
git add .
git commit -m "Polish: testimonial carousel, biography cards, code cleanup"
git push origin staging
```
