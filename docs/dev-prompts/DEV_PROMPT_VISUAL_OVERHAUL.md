# Developer Agent Prompt: Visual Quality Overhaul

You are a skilled React/Next.js developer. Your task is to restore visual quality to the Silq Technologies website by replacing degraded images with branded placeholders, overhauling the testimonials design, and cleaning up dead code.

---

## Project Context

- **Stack:** Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **Purpose:** Investor-facing medical device company website
- **Problem:** Images have degraded, testimonials look cheap, dead components clutter the codebase
- **Scope:** All pages EXCEPT `/rep/[slug]` pages — those are perfect, do NOT touch them

---

## Task 1: Create ImagePlaceholder Component

**Create file:** `src/components/ui/ImagePlaceholder.tsx`

```tsx
import { cn } from '@/lib/utils'

interface ImagePlaceholderProps {
  label: string
  sublabel?: string
  className?: string
  variant?: 'light' | 'dark'
  icon?: 'image' | 'science' | 'building' | 'shield'
}

const icons = {
  image: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
  ),
  science: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A17.996 17.996 0 0112 21a17.996 17.996 0 01-6.365-1.397c-1.717-.293-2.3-2.379-1.067-3.61L12 15" />
  ),
  building: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  ),
  shield: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  ),
}

export function ImagePlaceholder({
  label,
  sublabel = 'Image will be provided',
  className,
  variant = 'light',
  icon = 'image',
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl',
        variant === 'light'
          ? 'bg-gradient-to-br from-silq-cream to-silq-blue/5 border border-silq-dark/5'
          : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10',
        className
      )}
    >
      <div className="text-center p-4">
        <svg
          className={cn(
            'w-10 h-10 mx-auto mb-2',
            variant === 'light' ? 'text-silq-blue/20' : 'text-white/20'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {icons[icon]}
        </svg>
        <p className={cn(
          'text-sm font-medium',
          variant === 'light' ? 'text-silq-dark/30' : 'text-white/30'
        )}>
          {label}
        </p>
        <p className={cn(
          'text-xs mt-1',
          variant === 'light' ? 'text-silq-dark/20' : 'text-white/20'
        )}>
          {sublabel}
        </p>
      </div>
    </div>
  )
}
```

---

## Task 2: Image Replacements by Page

### Images to KEEP (do not change these):
- `/images/logos/*` — All logo files
- `/images/products/boxnew.jpg` — Product box photo
- `/images/trust/fda.png` — FDA badge
- `/images/trust/ucla.jpg` — UCLA logo
- `/images/trust/verizon-award.png` — Verizon award

### 2.1 Home Page (`src/app/page.tsx`)

1. **Remove hero background GIF:**
   ```tsx
   // DELETE this prop from <Hero>:
   backgroundGif="/images/textures/tech-overview.gif"
   ```

2. **Replace encrustation image** with placeholder:
   ```tsx
   // Find the encrustation image and replace with:
   {/* TODO: Replace with actual encrustation comparison image */}
   <ImagePlaceholder 
     label="Encrustation Comparison" 
     icon="shield" 
     variant="dark"
     className="w-full h-48 rounded-lg" 
   />
   ```

### 2.2 Technology Page (`src/app/technology/page.tsx`)

1. **Replace contact angle comparison image:**
   ```tsx
   {/* TODO: Replace with actual contact angle comparison image */}
   <ImagePlaceholder 
     label="Contact Angle Comparison" 
     icon="science" 
     className="w-full h-64 md:h-80 rounded-2xl shadow-lg" 
   />
   ```

### 2.3 Products Page (`src/app/products/page.tsx`)

1. **Remove texture background** from hero (delete the `<Image>` with `brand-texture-1.jpg`)

2. **Replace Surface Treatment card image** — set `image: null` and handle with placeholder in render

### 2.4 ClearTract Page (`src/app/products/cleartract/page.tsx`)

1. **Replace microbial adhesion image:**
   ```tsx
   {/* TODO: Replace with actual microbial adhesion comparison image */}
   <ImagePlaceholder 
     label="Microbial Adhesion Data" 
     icon="shield" 
     className="w-full h-48 rounded-xl" 
   />
   ```

2. **Replace encrustation comparison image:**
   ```tsx
   {/* TODO: Replace with actual encrustation comparison image */}
   <ImagePlaceholder 
     label="Encrustation Comparison" 
     icon="shield" 
     className="w-full h-48 rounded-xl" 
   />
   ```

### 2.5 Surface Treatment Page (`src/app/products/surface-treatment/page.tsx`)

1. **Remove texture background** from hero (delete the `<Image>` with `brand-texture-2.jpg`)

2. **Replace contact angle comparison image** with same placeholder as Technology page

### 2.6 Investors Page (`src/app/about/investors/page.tsx`)

1. **Remove decorative divider image** — Replace with CSS divider:
   ```tsx
   <div className="mt-8 flex justify-center">
     <div className="w-24 h-1 bg-gradient-to-r from-silq-blue to-silq-teal rounded-full" />
   </div>
   ```

2. **Replace both manufacturing images:**
   ```tsx
   {/* TODO: Replace with actual manufacturing facility photo */}
   <ImagePlaceholder 
     label="Manufacturing Facility" 
     icon="building" 
     variant="dark"
     className="w-full h-64 rounded-t-2xl" 
   />
   ```

### 2.7 Team Page (`src/app/about/team/page.tsx`)

Audit team photos. If any look AI-generated or degraded, replace with initials placeholder:
```tsx
<div className="w-full h-full bg-gradient-to-br from-silq-blue/20 to-silq-teal/10 flex items-center justify-center">
  <span className="text-5xl font-bold text-silq-blue/30">
    {member.name.split(' ').map(n => n[0]).join('')}
  </span>
</div>
```

---

## Task 3: Testimonials Overhaul

Replace the testimonials sections on **both** Home page and ClearTract page with this redesigned version:

```tsx
{/* Testimonials Section - Redesigned */}
<section className="py-20 bg-gradient-to-br from-silq-blue-900 via-silq-dark to-silq-blue-800 text-white relative overflow-hidden">
  {/* Decorative quote mark */}
  <div className="absolute top-8 left-8 opacity-5">
    <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  </div>
  
  <div className="container-silq relative">
    <div className="text-center mb-12">
      <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-teal bg-silq-teal/20 rounded-full">
        Real Experiences
      </span>
      <h2 className="text-display-sm font-bold">
        What People Are Saying
      </h2>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {testimonials.map((t, i) => (
        <motion.div
          key={i}
          className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-colors"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
        >
          {/* Quote icon */}
          <div className="w-10 h-10 rounded-full bg-silq-teal/20 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-silq-teal" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          
          <blockquote className="text-white/90 text-base leading-relaxed mb-6">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            {/* Avatar initials */}
            <div className="w-10 h-10 rounded-full bg-silq-teal/30 flex items-center justify-center text-sm font-bold text-white">
              {t.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{t.author}</p>
              <p className="text-white/50 text-xs">{t.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

---

## Task 4: Delete Unused Components

**Delete these 8 files** from `src/components/sections/`:
1. `TestimonialsCarousel.tsx`
2. `ScienceShowcase.tsx`
3. `ResearchEvidence.tsx`
4. `ImageTextSplit.tsx`
5. `FeatureGrid.tsx`
6. `VideoShowcase.tsx`
7. `TrustLogos.tsx`
8. `MetricsStrip.tsx`

**Update** `src/components/sections/index.ts` to only export:
```ts
export { Hero } from './Hero'
export { TeamGrid } from './TeamGrid'
export { ContactForm } from './ContactForm'
export { InvestorForm } from './InvestorForm'
export { CTABanner } from './CTABanner'
export { Accordion } from './Accordion'
```

---

## Acceptance Criteria

- [ ] `ImagePlaceholder` component created and working
- [ ] Hero background GIF removed from home page
- [ ] All texture background images removed from hero sections
- [ ] All degraded science images replaced with `ImagePlaceholder`
- [ ] Manufacturing images replaced with placeholders
- [ ] Decorative divider replaced with CSS gradient
- [ ] Testimonials on Home page use new dark glassmorphism design
- [ ] Testimonials on ClearTract page use same design
- [ ] All 8 unused components deleted
- [ ] `index.ts` updated with correct exports
- [ ] `npm run build` passes with no errors
- [ ] All pages render correctly
- [ ] Rep pages (`/rep/*`) are completely untouched
- [ ] Every placeholder has a `{/* TODO: Replace with actual ... */}` comment

---

## DO NOT:
- Modify any files in `src/app/rep/`
- Delete any image files from `public/images/`
- Change page structure, routing, or content copy
- Remove any logos or the product box photo

---

Begin by creating the `ImagePlaceholder` component, then work through each page systematically.
