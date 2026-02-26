# Dev Agent Prompt: Testimonial Fixes

**Priority:** High  
**Branch:** Push to both `main` AND `staging`

---

## Overview

Quick fixes needed for testimonials:
1. Slow down carousel rotation speed
2. Fix modal display styling issues
3. Ensure all 8 testimonials are included
4. Update specific testimonial excerpts

---

## Task 1: Slow Down Carousel Rotation

**File:** `src/components/ui/TestimonialCarousel.tsx`

### Current:
`autoAdvanceMs = 6000` (6 seconds)

### Change to:
`autoAdvanceMs = 10000` (10 seconds)

Also update any places where `TestimonialCarousel` is used if they override the default.

---

## Task 2: Fix Modal Display

**File:** `src/components/ui/TestimonialModal.tsx`

Looking at the current modal, there are styling issues:
- The opening quote mark appears but may be cut off or poorly positioned
- Need to ensure proper padding and spacing
- The close quote should appear at the end of content, not floating

### Fixes:

```tsx
{/* Content - Fixed styling */}
<div className="p-6 overflow-y-auto flex-1">
  {/* Opening Quote - Inline with first line */}
  <div className="prose prose-lg max-w-none text-silq-dark/80">
    <p className="text-lg leading-relaxed">
      <span className="text-silq-teal/50 text-4xl font-serif leading-none align-top mr-1">&ldquo;</span>
      {testimonial.fullContent}
      <span className="text-silq-teal/50 text-4xl font-serif leading-none align-bottom ml-1">&rdquo;</span>
    </p>
  </div>
</div>
```

Alternative cleaner approach:

```tsx
{/* Content */}
<div className="p-6 overflow-y-auto flex-1">
  <blockquote className="text-lg leading-relaxed text-silq-dark/80 italic border-l-4 border-silq-teal/30 pl-4">
    {testimonial.fullContent}
  </blockquote>
</div>
```

Choose whichever looks better - the key is:
- No floating disconnected quote marks
- Clean, readable text
- Proper spacing around content

---

## Task 3: Ensure All 8 Testimonials Are Included

**Files to check:**
- `src/app/products/cleartract/page.tsx`
- `src/app/page.tsx`

All 8 testimonials from the `Testimonials Full` folder must be included:

1. **Ana Garcia** - Long-term ClearTract Patient
2. **Dulce Garcia** - Long-term ClearTract Patient (or Caregiver - check PDF)
3. **Evgeniy Kreydin, M.D.** - Urologist, Cedars-Sinai
4. **Linnehan** - (check PDF for proper title)
5. **Lora A. Plaskon, M.D.** - Urologist (check PDF for affiliation)
6. **Maria Luisa Trevino** - (check PDF for proper title)
7. **Matthew Bui, M.D.** - (check PDF for specialty/affiliation)
8. **Stephen Newhouse** - Caregiver to ClearTract Patient

---

## Task 4: Update Specific Testimonial Excerpts

Update these **card preview quotes** (the short text shown on the carousel card, NOT the full modal content):

### Evgeniy Kreydin, M.D.
```
"Silq Technologies is bringing a game changing innovation to the care of patients who require catheters for bladder drainage."
```

### Matthew Bui, M.D.
```
"It has been a gamechanger. Not only did the Silq coating promote biofilm resistance, but it also improved patient comfort significantly."
```

### Lora A. Plaskon, M.D.
```
"Silq catheter-coating technology has the potential to revolutionize how we manage the constant threat of microbial colonization."
```

### Ana Garcia
```
"I was immediately impressed with the difference with this catheter. There was no pain or bladder spasms on a daily basis."
```

---

## Updated Testimonials Array

Here's the complete array structure with the updated quotes:

```tsx
const testimonials = [
  {
    quote: "Silq Technologies is bringing a game changing innovation to the care of patients who require catheters for bladder drainage.",
    fullContent: `[FULL TEXT FROM PDF]`,
    author: "Evgeniy Kreydin, M.D.",
    role: "Urologist, Cedars-Sinai",
    initials: "EK",
  },
  {
    quote: "It has been a gamechanger. Not only did the Silq coating promote biofilm resistance, but it also improved patient comfort significantly.",
    fullContent: `[FULL TEXT FROM PDF]`,
    author: "Matthew Bui, M.D.",
    role: "[Specialty, Affiliation from PDF]",
    initials: "MB",
  },
  {
    quote: "Silq catheter-coating technology has the potential to revolutionize how we manage the constant threat of microbial colonization.",
    fullContent: `[FULL TEXT FROM PDF]`,
    author: "Lora A. Plaskon, M.D.",
    role: "[Specialty, Affiliation from PDF]",
    initials: "LP",
  },
  {
    quote: "I was immediately impressed with the difference with this catheter. There was no pain or bladder spasms on a daily basis.",
    fullContent: `[FULL TEXT FROM PDF]`,
    author: "Ana Garcia",
    role: "Long-term ClearTract Patient",
    initials: "AG",
  },
  {
    quote: "[SELECT IMPACTFUL LINE FROM PDF]",
    fullContent: `[FULL TEXT FROM PDF]`,
    author: "Dulce Garcia",
    role: "[Determine from PDF - Patient or Caregiver]",
    initials: "DG",
  },
  {
    quote: "[SELECT IMPACTFUL LINE FROM PDF]",
    fullContent: `[FULL TEXT FROM PDF]`,
    author: "Stephen Newhouse",
    role: "Caregiver to ClearTract Patient",
    initials: "SN",
  },
  {
    quote: "[SELECT IMPACTFUL LINE FROM PDF]",
    fullContent: `[FULL TEXT FROM PDF]`,
    author: "Linnehan",
    role: "[Determine from PDF]",
    initials: "L",
  },
  {
    quote: "[SELECT IMPACTFUL LINE FROM PDF]",
    fullContent: `[FULL TEXT FROM PDF]`,
    author: "Maria Luisa Trevino",
    role: "[Determine from PDF - Patient or Caregiver]",
    initials: "MT",
  },
]
```

---

## Commit & Push

```bash
git add -A
git commit -m "Fix testimonial rotation speed, modal styling, and add all 8 testimonials"
git push origin main
git push origin main:staging --force
```

---

## Verification Checklist

- [ ] Carousel rotates every 10 seconds (noticeably slower)
- [ ] Modal displays clean text without floating quote marks
- [ ] Modal content is properly scrollable
- [ ] All 8 testimonials are present and rotate through
- [ ] Kreydin quote updated: "...game changing innovation..."
- [ ] Bui quote updated: "...gamechanger...biofilm resistance..."
- [ ] Plaskon quote updated: "...revolutionize...microbial colonization..."
- [ ] Ana Garcia quote updated: "...no pain or bladder spasms..."
- [ ] Each testimonial has appropriate role/title
- [ ] "Read Full Testimonial" button works for all 8
