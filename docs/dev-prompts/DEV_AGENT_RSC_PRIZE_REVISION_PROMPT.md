# RSC Prize Section — Revision Dev Agent Prompt

## Role
You are a frontend dev agent for the Silq Technologies website (`silq.tech`). You are revising the "In The News" section on the homepage based on design feedback. The previous implementation is already live. Your job is to make targeted surgical edits to achieve the changes described below, then build and deploy.

---

## Repository & Stack
- **Repo:** `c:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website`
- **Framework:** Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion
- **Deploy:** `git push` to `main` triggers DigitalOcean auto-deploy → `silq.tech`
- **Brand colors:** `silq-blue`, `silq-teal`, `silq-dark` (deep navy), `silq-cream`
- **Image component:** Next.js `<Image>` from `next/image`

---

## Files to Edit
1. **`src/app/page.tsx`** — banner redesign + data array update
2. **`src/components/sections/NewsCarousel.tsx`** — NEW file: scrolling news card component

---

## Change 1 — RSC Banner Redesign

### What to replace
The current banner is a single `motion.a` with two joined columns (image left, dark panel right), held together with `overflow-hidden`. Replace the entire `{/* RSC Horizon Prize Featured Banner */}` block.

### New banner layout
Two **visually separate cards** placed side by side with a gap between them. Both link to the RSC prize page. They are NOT joined — each has its own rounded corners and shadow. The container is `flex flex-col md:flex-row gap-4 max-w-5xl mx-auto mb-8`.

#### Left card — Image only
```
<a href="[RSC URL]" target="_blank" rel="noopener noreferrer" className="...image card...">
  <div className="relative w-full md:w-[58%] rounded-2xl overflow-hidden shadow-lg" 
       style={{ aspectRatio: '16/9' }}>    {/* force the native aspect ratio of the graphic */}
    <Image
      src="/images/news/rsc-horizon-prize-2026.png"
      alt="..."
      fill
      className="object-contain"         {/* CONTAIN — not cover — so nothing is cropped */}
      style={{ backgroundColor: '#0b3d2b' }}   {/* dark green matching the graphic's background */}
      unoptimized
    />
  </div>
</a>
```
Key points:
- Use `object-contain` (NOT `object-cover`) so the full celebratory graphic is visible with no cropping on the left or right edges.
- Set `backgroundColor: '#0b3d2b'` on the image element (or as a `bg-[#0b3d2b]` class on the parent div) to fill any letterbox areas with the graphic's own dark green background so it looks seamless.
- Use `aspect-ratio: 16/9` to let the card height derive naturally from the graphic's proportions. Do NOT use a fixed `min-h`.
- The card itself is `md:w-[58%]` of the container.

#### Right card — Award details
```
<a href="[RSC URL]" target="_blank" rel="noopener noreferrer"
   className="group relative md:w-[42%] bg-silq-dark rounded-2xl shadow-lg flex flex-col justify-between p-6 md:p-8 overflow-hidden">
```
Key points for the right card:
- **NO yellow or amber anywhere.** Remove the star badge and the `bg-amber-400` accent bar entirely.
- Replace accent bar with: a thin `bg-silq-teal` 3px top border spanning the full card width:
  ```
  <div className="absolute top-0 left-0 right-0 h-[3px] bg-silq-teal" />
  ```
- **Top section** (stacked, top-aligned):
  1. Prize title: `text-xl md:text-2xl font-bold text-white leading-tight mb-1`
     ```
     Materials Chemistry Horizon Prize
     ```
  2. Sub-line: `text-white/50 text-sm mb-5`
     ```
     Stephanie L Kwolek Prize · Royal Society of Chemistry · 2026
     ```
  3. Thin divider: `border-t border-white/10 mb-4`
  4. Citation (italic, `text-white/75 text-sm leading-relaxed`):
     ```
     "For the development of a zwitterion polymer surface treatment for medical devices that prevents infections in patients."
     ```

- **Bottom section** — flex row, `justify-between items-end mt-6 gap-4`:
  - **Left of bottom row** — brief explanatory text (`text-white/45 text-xs leading-relaxed max-w-[60%]`):
    ```
    The RSC Horizon Prize recognizes the most significant recent advances in the chemical sciences — the first international recognition of this caliber for zwitterionic surface technology.
    ```
    Keep to 1–2 short sentences, max ~30 words. This text provides prestige context and is visually subordinate (small, muted).
  - **Right of bottom row** — CTA link:
    ```
    <span className="text-silq-teal text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all whitespace-nowrap">
      View Award
      <svg ...arrow right.../>
    </span>
    ```
    Use `text-silq-teal` (NOT amber). Arrow SVG: `M17 8l4 4m0 0l-4 4m4-4H3`, strokeWidth 2.

---

## Change 2 — News Cards: Horizontal Scrolling Carousel

### Create `src/components/sections/NewsCarousel.tsx`
This is a `'use client'` component. It receives the `newsItems` array as a prop and renders a horizontally scrollable single-row card strip with left/right navigation arrows.

#### Props type
```ts
type NewsItem = {
  source: string
  title: string
  url: string
  logo: string | null
}
interface NewsCarouselProps {
  items: NewsItem[]
}
```

#### Layout structure
```
<div className="relative max-w-5xl mx-auto">
  {/* Left arrow button */}
  {/* Scrollable track */}
  {/* Right arrow button */}
</div>
```

#### Scrollable track
```tsx
const trackRef = useRef<HTMLDivElement>(null)

<div
  ref={trackRef}
  className="flex gap-4 overflow-x-auto scroll-smooth pb-2
             [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
>
  {items.map((item, index) => (
    <a key={index} href={item.url} target="_blank" rel="noopener noreferrer"
       className="flex-none w-56 bg-silq-cream rounded-xl p-5 border border-silq-dark/5
                  hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* same internal card layout as the current cards */}
    </a>
  ))}
</div>
```
Each card is `flex-none w-56` (fixed width, never wraps). The track hides the scrollbar via Tailwind arbitrary variants.

#### Arrow buttons
```tsx
function scroll(dir: 'left' | 'right') {
  trackRef.current?.scrollBy({ left: dir === 'right' ? 240 : -240, behavior: 'smooth' })
}
```

Left button — positioned `absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10`:
```tsx
<button onClick={() => scroll('left')}
  className="hidden md:flex w-9 h-9 items-center justify-center rounded-full
             bg-white border border-silq-dark/10 shadow-md
             hover:bg-silq-cream transition-colors">
  {/* left chevron SVG */}
</button>
```

Right button — same but `right-0 translate-x-4`:
```tsx
<button onClick={() => scroll('right')} className="...">
  {/* right chevron SVG */}
</button>
```

Arrow SVGs: `M15 19l-7-7 7-7` (chevron-left) and `M9 5l7 7-7 7` (chevron-right), strokeWidth 2, `w-4 h-4 text-silq-dark`.

Hide arrows on mobile (they can just swipe). On desktop use `md:flex`.

#### Card internals (same as current, copy exactly)
```tsx
<div className="flex items-center gap-3 mb-3">
  {item.logo ? (
    <Image src={item.logo} alt={item.source} width={80} height={24}
           className="h-5 w-auto object-contain opacity-60" />
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide text-silq-blue bg-silq-blue/10">
      RSC
    </span>
  )}
  <span className="text-xs text-silq-dark/40">{item.source}</span>
</div>
<h4 className="text-sm font-semibold text-silq-dark leading-snug line-clamp-3">
  {item.title}
</h4>
<p className="text-xs text-silq-blue mt-3 flex items-center gap-1">
  Read article
  {/* external link SVG */}
</p>
```

### Update `src/app/page.tsx`
1. Import the new component: `import { NewsCarousel } from '@/components/sections/NewsCarousel'`
2. Remove the old `<div className="flex flex-wrap justify-center gap-6 ...">` block that maps `newsItems`
3. Replace it with: `<NewsCarousel items={newsItems} />`
4. The `newsItems` array type annotation needs to match: `{ source: string; title: string; url: string; logo: string | null }[]`

---

## Change 3 — Section padding (minor)
The news section currently uses `py-12`. Change to `py-10` to make the whole section slightly more compact.

---

## Change 4 — Add a Second UCLA News Card

Add a new entry to the `newsItems` array immediately after the existing RSC entry (position 2, zero-indexed index 1). It links to the UCLA press release about the same award:

```ts
{
  source: 'UCLA Newsroom',
  title: 'UCLA Led Team Wins Royal Society of Chemistry\'s 2026 Materials Chemistry Horizon Prize',
  url: 'https://www.chemistry.ucla.edu/news/ucla-led-team-wins-royal-society-of-chemistrys-2026-materials-chemistry-horizon-prize/',
  logo: '/images/trust/ucla.jpg',
},
```

Use the **exact same** `logo` path and `source` label (`'UCLA Newsroom'`) as the existing UCLA card at the bottom of the array. It is intentional to have two cards related to the Horizon Prize — the RSC card and this UCLA press release card. The carousel handles extra cards gracefully so no layout changes are needed.

After this addition the `newsItems` array will have **6 entries** in this order:
1. RSC (logo: null)
2. UCLA Newsroom — Horizon Prize (logo: `/images/trust/ucla.jpg`) ← NEW
3. KGET News
4. Business Wire — NuSil collaboration
5. Business Wire — Vizient
6. UCLA Newsroom — Deadly Hospital Infections

---

## What NOT to change
- The "In The News" label `<p>` stays as-is above the banner.
- All other sections on the page are untouched.
- Do NOT change the RSC external URLs.

---

## URLs for reference
- **RSC prize page:** `https://www.rsc.org/standards-and-recognition/prizes/winners/the-kaner-group-at-ucla-and-silq-technologies`
- **UCLA press release:** `https://www.chemistry.ucla.edu/news/ucla-led-team-wins-royal-society-of-chemistrys-2026-materials-chemistry-horizon-prize/`

---

## Build, Lint & Deploy
```bash
npm run build        # must pass with zero errors/warnings
```
Fix any TypeScript or lint errors before committing.

```bash
git add src/app/page.tsx src/components/sections/NewsCarousel.tsx
git commit -m "feat: revise RSC banner (two-card layout, brand colors, no amber) + news carousel"
git push
```

`git push` to `main` triggers DigitalOcean auto-deploy. The live site will reflect changes within ~5 minutes.

---

## Visual checklist before committing
- [ ] No amber/yellow colors anywhere in the news section
- [ ] The RSC celebratory graphic shows fully with no left/right cropping
- [ ] The letterbox areas (if any) blend seamlessly with the dark green graphic background
- [ ] The image card and info card have a visible gap between them (they are NOT joined)
- [ ] The brief context text is small and visually subordinate — it should not dominate
- [ ] "View Award →" CTA is `text-silq-teal`
- [ ] News cards show in a single horizontal row that doesn't wrap
- [ ] Left/right arrows appear on desktop and scroll the track smoothly
- [ ] Scrollbar is hidden
- [ ] All cards are the same height regardless of title length (use `flex flex-col` on each card with the title area taking `flex-1`)
- [ ] `npm run build` passes cleanly
- [ ] External links open in new tab
