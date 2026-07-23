# RSC Horizon Prize — Featured News Section Dev Agent Prompt

## Role
You are a frontend dev agent for the Silq Technologies website (`silq.tech`). Your task is to add a prominent featured award banner and a new standard news card to the homepage's "In The News" section to announce Silq Technologies winning the 2026 Royal Society of Chemistry Materials Chemistry Horizon Prize (Stephanie L Kwolek Prize). This is the most significant accolade in the company's history and must be visually distinct from the existing news items.

---

## Repository Context
- **Repo:** `c:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website` (GitHub: `Ethan-Rao/Silqtech`, branch `main`)
- **Framework:** Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion
- **Deploys:** DigitalOcean App Platform → `silq.tech`
- **Brand colors (Tailwind custom):** `silq-blue`, `silq-teal`, `silq-dark`, `silq-cream`
- **Image component:** Always use Next.js `<Image>` from `next/image` with `unoptimized` if the image is a local PNG that doesn't need resizing

---

## The Only File You Need to Edit
**`src/app/page.tsx`** — the homepage. All changes are made here.

### Current "In The News" section structure (lines ~467–505)
```tsx
{/* Section 5: News */}
<section className="py-12 bg-white">
  <div className="container-silq">
    <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue text-center mb-8">
      In The News
    </p>
    <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
      {newsItems.map((item, index) => ( ... ))}
    </div>
  </div>
</section>
```

The `newsItems` array (around line 49) has 4 entries — KGET News, Business Wire (×2), UCLA Newsroom.

---

## What to Build

### Part 1 — Featured Award Banner
Insert a full-width banner **between the "In The News" label and the existing news card grid**. The banner is a single `<a>` element linking to:
```
https://www.rsc.org/standards-and-recognition/prizes/winners/the-kaner-group-at-ucla-and-silq-technologies
```
(opens in new tab, `rel="noopener noreferrer"`).

#### Layout
Two-column layout on md+ screens, stacked on mobile:
- **Left column (~60% width):** The celebratory graphic image
- **Right column (~40% width):** Award details card

#### Left column — Image
```
src: /images/news/rsc-horizon-prize-2026.png
alt: "The Kaner Group at UCLA and SILQ Technologies — 2026 RSC Materials Chemistry Horizon Prize"
```
The image should fill the left column completely, with `object-cover`, rounded on mobile, flat edge on the inside on desktop (so the two columns feel joined). Give it a subtle `rounded-l-2xl` on desktop.

#### Right column — Award details card
Dark background (`bg-silq-dark`), matching height to the image. Contents (top to bottom):
1. **Award badge row** — small gold/amber pill: `"2026 Horizon Prize"` in `text-amber-400 font-semibold text-xs tracking-widest uppercase` with a trophy emoji or star SVG icon to the left
2. **Prize title** (large, white, bold):
   ```
   Materials Chemistry Horizon Prize
   ```
   Sub-line in `text-white/60 text-sm`:
   ```
   Stephanie L Kwolek Prize · Royal Society of Chemistry
   ```
3. **Thin divider** (`border-t border-white/10 my-4`)
4. **Citation** (text-white/80, text-sm, italic, max ~2 lines):
   ```
   "For the development of a zwitterion polymer surface treatment for medical devices that prevents infections in patients."
   ```
5. **Pull quote** (optional — only include if space feels right, keep it SHORT):
   ```
   "There's no drug, no killing, and no resistance pathway."
   — Prof. Richard Kaner, UCLA
   ```
   Style: `text-silq-teal text-xs italic`
6. **CTA row** at the bottom — right-aligned:
   ```
   View Award →
   ```
   Style: `text-amber-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all`

#### Overall banner styling
- Rounded corners: `rounded-2xl overflow-hidden`
- Shadow: `shadow-xl`
- Margin below: `mb-8`
- Add a subtle left-side accent: a 4px vertical bar in `bg-amber-400` on the far left of the right column
- Wrap with a Framer Motion `motion.a` with `whileHover={{ scale: 1.005 }}` and `transition={{ duration: 0.2 }}`

#### DO NOT add a lot of text. The right card should be skimmable in 3 seconds. Omit the pull quote if the section starts to feel cluttered.

---

### Part 2 — New Standard News Card
Add a new entry to the **front** of the `newsItems` array (so it appears first / leftmost in the grid):

```tsx
{
  source: 'Royal Society of Chemistry',
  title: 'Silq Technologies Wins 2026 Materials Chemistry Horizon Prize',
  url: 'https://www.chemistry.ucla.edu/news/ucla-led-team-wins-royal-society-of-chemistrys-2026-materials-chemistry-horizon-prize/',
  logo: '/images/news/rsc-logo.svg',   // see note below
}
```

**RSC Logo note:** There is no pre-existing RSC logo SVG in the project. Instead of using a placeholder image that will 404, render a small text badge in place of the `<Image>` logo component for this card only. The cleanest approach: refactor the news card render slightly so that if `logo` is missing/null, it shows a styled text source name instead. Alternatively, render a simple inline SVG "RSC" monogram badge in the same spot. Either approach is fine — just ensure no broken image appears.

The URL should point to the **UCLA press release** (link above) as it provides fuller context. Both the RSC page and UCLA page are acceptable; use UCLA as it's a richer read.

---

## Content Reference

### Award facts (for the right panel of the banner)
- **Prize:** Materials Chemistry Horizon Prize (Stephanie L Kwolek Prize)
- **Awarding body:** Royal Society of Chemistry
- **Year:** 2026
- **Winners:** The Kaner Group at UCLA and SILQ Technologies
- **Citation:** *"For the development of a zwitterion polymer surface treatment for medical devices that prevents infections in patients."*
- **RSC page:** https://www.rsc.org/standards-and-recognition/prizes/winners/the-kaner-group-at-ucla-and-silq-technologies

### Tone and copy guidance
- This is a prestigious scientific prize, not a product announcement. Keep the tone professional and understated — let the award name carry weight.
- Do NOT use generic marketing language ("exciting", "proud to announce", "thrilled").
- Limit the banner right panel to ≤60 words of visible copy (not counting the badge and CTA).
- The UCLA press release is the canonical source for any additional copy needs: https://www.chemistry.ucla.edu/news/ucla-led-team-wins-royal-society-of-chemistrys-2026-materials-chemistry-horizon-prize/

---

## Implementation Steps

1. **Read `src/app/page.tsx`** in full before making any changes.
2. **Add the new `newsItems` entry** at the front of the array.
3. **Build the featured banner JSX** as described above. Place it inside the existing news `<section>`, between the "In The News" label `<p>` and the `<div className="flex flex-wrap ...">` grid.
4. **Run `npm run build`** to confirm zero TypeScript/build errors.
5. **Fix any lint errors** before committing.
6. **Commit and push:**
   ```bash
   git add public/images/news/rsc-horizon-prize-2026.png src/app/page.tsx
   git commit -m "feat: add RSC 2026 Horizon Prize featured banner and news card to homepage"
   git push
   ```

---

## Visual Design Checklist
Before committing, verify:
- [ ] Banner image fills the left column without distortion on desktop and mobile
- [ ] Right panel text is NOT the longest paragraph on the page — keep it tight
- [ ] Banner has a hover effect (subtle scale or glow)
- [ ] Standard news card appears first in the grid (leftmost)
- [ ] No broken image references (especially for the RSC logo)
- [ ] Section heading "In The News" is still centered above everything
- [ ] Everything looks correct at mobile (`sm`), tablet (`md`), and desktop (`lg`+) breakpoints
- [ ] External links open in new tab with `rel="noopener noreferrer"`
- [ ] `npm run build` passes cleanly
