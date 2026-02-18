# Dev Agent Prompt: Final Debug & Polish

**Priority:** 🟢 FINAL REVIEW  
**Created:** 2026-02-17  
**Goal:** Review recent changes, fix remaining issues, clean up legacy code, commit all changes

---

## CONTEXT

Recent changes completed by dev agent:
- ✅ Homepage ClearTract section restructured (testimonial + box left, publication right)
- ✅ "Learn More" → "Product Information"
- ✅ Trust logos → clean text boxes
- ✅ Blood loop images shrunk (h-32)
- ✅ Data availability note added
- ✅ Footer redesigned with 4 columns and legal links
- ✅ Build passing with 0 errors

---

## ISSUE 1: Remaining "Hydrophilic" Terminology

The user requested changing "Hydrophilic" to "Zwitterionic" but some instances remain.

**Files:** `src/app/technology/page.tsx`, `src/app/products/surface-treatment/page.tsx`

### 1A: Technology Page (Line ~258, 261)

**Find:**
```jsx
{/* Hydrophilicity - Video */}
<h3 className="text-lg font-bold text-silq-blue">Surface Hydrophilicity</h3>
```

**Change to:**
```jsx
{/* Hydrophilicity - Video */}
<h3 className="text-lg font-bold text-silq-blue">Enhanced Hydrophilicity</h3>
```

**Note:** "Hydrophilicity" is technically correct here as it describes the surface property (water-attracting). The card describes the *result* of zwitterionic treatment. Keep as is OR change to "Surface Wettability" for consistency.

### 1B: Surface Treatment Page (Line ~166, 169)

Same change as above if needed.

---

## ISSUE 2: Console.log Statements in API Routes

Console.log statements are intentional for staging (to debug form submissions) but should be clearly marked.

**Files:** 
- `src/app/api/contact/route.ts` (lines 26-33)
- `src/app/api/investor-inquiry/route.ts` (lines 28-33)

**Action:** These are fine for staging. When deploying to production, these can be removed or wrapped in a development check:

```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('=== CONTACT FORM SUBMISSION ===')
  // ... rest of logging
}
```

**For now:** Leave as-is for staging debugging purposes.

---

## ISSUE 3: Verify Button Variant "teal" Exists

**File:** `src/app/products/cleartract/page.tsx` (line 79)

The ClearTract page uses `variant="teal"` for the Ordering Information button.

**Check:** Ensure the Button component supports this variant in `src/components/ui/Button.tsx`.

If not defined, add the teal variant:

```typescript
const variants = {
  primary: 'bg-silq-blue hover:bg-silq-blue/90 text-white',
  secondary: 'bg-white hover:bg-gray-50 text-silq-dark border border-gray-200',
  teal: 'bg-silq-teal hover:bg-silq-teal/90 text-white',  // ADD THIS
  outline: 'bg-transparent border border-silq-blue text-silq-blue hover:bg-silq-blue/10',
}
```

---

## ISSUE 4: Legacy Code Cleanup

### 4A: Search for Unused Imports

Run through each modified file and remove any unused imports:

```bash
# Check for unused imports
npx eslint src/app/page.tsx --fix
npx eslint src/components/layout/Footer.tsx --fix
```

### 4B: Remove Old Trust Logo Code

Verify no references to old image-based trust logos remain:

**Search for:**
- `/images/trust/fda.png`
- `/images/trust/ucla.jpg`
- `/images/trust/premier-logo.svg`
- `/images/trust/vizient-logo.svg`

These should only appear in the News section (for UCLA logo on news items) but NOT in the main Trust section.

### 4C: Check for Commented-Out Code

Search for and remove any large commented-out code blocks that are no longer needed:

```jsx
// {/* OLD CODE - REMOVE */}
// <section>...</section>
```

---

## ISSUE 5: Mobile Responsiveness Check

### 5A: Footer Grid on Mobile

The 4-column footer should collapse gracefully on mobile:

**Current:** `grid md:grid-cols-4 gap-12`

**Verify:** On mobile (< md), columns should stack vertically with proper spacing.

### 5B: ClearTract Section Images

The testimonial + box + publication layout should stack properly on mobile:

**Current:** `grid md:grid-cols-2`

**Verify:** On mobile, left column (testimonial + box) should appear above right column (publication).

### 5C: Trust Indicators

**Current:** `flex flex-wrap justify-center items-center gap-8 md:gap-12`

**Verify:** Text boxes wrap properly and remain readable on small screens.

---

## ISSUE 6: Image Optimization Check

### 6A: Verify All Images Load

Check that these images exist and load correctly:
- `/images/products/boxnew.jpeg`
- `/images/publications/advanced-materials-cover.jpg`
- `/images/logos/logo-oneline.png`
- `/images/science/silq-machine.gif`
- `/images/science/blood-loop-1.jpg`
- `/images/science/blood-loop-2.jpg`

### 6B: GIF Optimization

Ensure GIFs use `unoptimized` prop:

```jsx
<Image 
  src="/images/science/silq-machine.gif"
  unoptimized  // Required for GIFs
  ...
/>
```

---

## ISSUE 7: Accessibility Final Check

### 7A: All Links Have Descriptive Text

Footer links should be clear:
- ✅ "Privacy Policy"
- ✅ "Terms & Conditions"
- ✅ "Cookie Policy"

### 7B: External Links Open in New Tab

All external links should have:
```jsx
target="_blank"
rel="noopener noreferrer"
```

### 7C: Image Alt Text

Verify all images have descriptive alt text:
- Product images
- Science/research images
- Logo images

---

## ISSUE 8: Final Visual Polish

### 8A: Consistent Spacing

Verify consistent `py-20` on major sections and `gap-12` on grids.

### 8B: Color Consistency

All blues should use `text-silq-blue` or `bg-silq-blue`.
All teals should use `text-silq-teal` or `bg-silq-teal`.

### 8C: Hover States

All interactive elements should have hover states:
- Buttons: `hover:bg-{color}/90`
- Links: `hover:text-white` or `hover:underline`
- Cards: `hover:shadow-xl` or `hover:-translate-y-1`

---

## CHECKLIST

### Code Quality
- [ ] No unused imports
- [ ] No console.log in client-side code (API routes OK for staging)
- [ ] No commented-out legacy code
- [ ] All TypeScript types correct
- [ ] ESLint passes with no warnings

### Visual
- [ ] Homepage ClearTract layout looks balanced
- [ ] Footer 4-column layout clean
- [ ] Trust indicators are text-based
- [ ] Blood loop images properly sized

### Functionality
- [ ] All links work
- [ ] All buttons have correct variants
- [ ] Forms submit correctly (staging mode)
- [ ] Mobile responsive

### Files Changed
- [ ] `src/app/page.tsx`
- [ ] `src/app/products/cleartract/page.tsx`
- [ ] `src/app/products/surface-treatment/page.tsx`
- [ ] `src/app/technology/page.tsx`
- [ ] `src/components/layout/Footer.tsx`

---

## FINAL STEP

After all checks pass:

```bash
cd C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website
git add .
git commit -m "Final polish: layout fixes, footer redesign, trust text boxes, legal links"
git push origin main staging
```

---

## POST-DEPLOY VERIFICATION

After pushing, verify on staging site:
1. Homepage loads correctly
2. All navigation links work
3. Footer displays properly
4. ClearTract section shows testimonial + box + publication
5. Trust indicators are text-based
6. Legal links open correct TermsFeed pages
