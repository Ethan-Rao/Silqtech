# Image & Content Replacement Guide

This document lists all images and placeholder content in the Silq website that need review or replacement.

---

## 🔴 DEPLOYMENT FIX APPLIED

The following changes have been made to allow deployment WITHOUT requiring the Resend API key:

1. **API Routes Updated** - Contact and Investor forms now work without Resend configured
2. **Node.js Version Added** - `package.json` now specifies `"engines": { "node": ">=18.0.0" }`

**To deploy to staging, just push these changes to your `staging` branch.**

---

## 📁 Current Image Inventory

### `/public/images/hero/`
| File | Used On | Notes |
|------|---------|-------|
| `banner.gif` | Homepage Hero | Main hero background animation |

### `/public/images/logos/`
| File | Used On | Notes |
|------|---------|-------|
| `logo-main.png` | Header | Main logo |
| `logo-oneline.png` | Various | Single-line logo variant |
| `silq-monogram.png` | Decorative | Watermark on various pages |

### `/public/images/products/`
| File | Used On | Notes |
|------|---------|-------|
| `boxnew.jpg` | Homepage, ClearTract page | Product box image |
| `catheter-clinical.png` | - | May not be in use |
| `cleartract-hero.png` | - | May not be in use |
| `manufacturing-cleanroom.png` | - | Available but not currently displayed |
| `manufacturing-scale.png` | - | Available but not currently displayed |

### `/public/images/science/`
| File | Used On | Notes |
|------|---------|-------|
| `bacteria-panel.png` | ClearTract, Surface Treatment | Bacterial adhesion comparison |
| `blood-loop.webp` | Surface Treatment | Blood loop thrombosis data |
| `encrustation-comparison.png` | Homepage, ClearTract | Before/after encrustation |
| `silq-machine.gif` | Homepage, Technology, Surface Treatment | Manufacturing equipment animation |
| `contact-angle-comparison.jpg` | - | Available but replaced with data table |
| `zwitterion.jpg` | - | Available |
| `biofilm-cascade.png` | - | Available |
| `microbial-adhesion.png` | - | Available |
| Various others | - | In folder but may not be displayed |

### `/public/images/team/`
| File | Person | Notes |
|------|--------|-------|
| `verne-sharma.jpg` | Verne Sharma, CEO | ✅ In use |
| `jack-kavanaugh.jpg` | Jack Kavanaugh, Chairman | ✅ In use |
| `richard-kaner.jpg` | Richard Kaner, CSA | ✅ In use |
| `brian-mcverry.jpg` | Brian McVerry, CTO | ✅ In use |
| `mahi-desilva.jpg` | Mahi De Silva, Board | ✅ In use |
| `robert-snukal.jpg` | Robert Snukal, Board | ✅ In use |

### `/public/images/trust/`
| File | Used On | Notes |
|------|---------|-------|
| `fda.png` | Homepage, various | FDA logo |
| `ucla.jpg` | Homepage, various | UCLA logo |
| `premier-logo.svg` | Homepage | Premier GPO logo |
| `vizient-logo.svg` | Homepage | Vizient GPO logo |
| `verizon-award.png` | Products page | Award badge |

### `/public/images/news/`
| File | Used On | Notes |
|------|---------|-------|
| `prnewswire.svg` | Homepage News section | News source logo |
| `businesswire.svg` | Homepage News section | News source logo |

### `/public/images/textures/`
| File | Used On | Notes |
|------|---------|-------|
| `tech-overview.gif` | Video poster | Technology demo poster |
| Various textures | Background decorations | Available |

---

## 🎥 Current Video Inventory

### `/public/videos/`
| File | Used On | Notes |
|------|---------|-------|
| `silq-technology-demo.mp4` | Homepage, Technology | Main technology demonstration |
| `frictionless-silicone.mp4` | Technology, Surface Treatment | Lubricity demo |
| `contact-lens-drying.mp4` | Technology, Surface Treatment | Hydrophilicity demo |
| `contact-lens-demo.mp4` | - | Available but not displayed |
| `silq-demo-v1.mp4` | - | Alternative version available |
| `frictionless-silicone-v1.mp4` | - | Alternative version available |

---

## 📝 PLACEHOLDER CONTENT TO REPLACE

### Homepage Testimonials (PLACEHOLDER)

**Location:** `src/app/page.tsx` lines 77-108

The homepage has 6 placeholder testimonials that say "Placeholder testimonial text. This will be replaced with actual content."

**To replace:** Edit the `placeholderTestimonials` array with real quotes:

```javascript
const placeholderTestimonials = [
  {
    quote: "Your actual quote here",
    author: "Dr. Name Here",
    role: "Title, Hospital/Organization",
  },
  // ... more testimonials
]
```

### ClearTract Testimonials (REAL - Review for accuracy)

**Location:** `src/app/products/cleartract/page.tsx` lines 9-25

These appear to be real testimonials:
- Evgeniy Kreydin, M.D., Urologist, Cedars-Sinai
- Ana Garcia, Long-term Catheter Patient
- Stephen Newhouse, Caregiver

**Action:** Verify these are accurate and approved for use.

---

## 📄 PDF PLACEHOLDERS

The following PDFs in `/public/pdfs/` are placeholder files and need to be replaced with actual documents:

| File | Purpose |
|------|---------|
| `pricing/premier-pricing.pdf` | Premier facility pricing |
| `pricing/vizient-pricing.pdf` | Vizient facility pricing |
| `pricing/va-pricing.pdf` | VA facility pricing |
| `cleartract-ifu.pdf` | Instructions for use |
| `cleartract-bifold.pdf` | Marketing bi-fold |
| `sales-marketing-slides.pdf` | Sales presentation |
| `technology-overview.pdf` | Technology overview |
| `testimonials.pdf` | Testimonials document |

---

## 🖼️ HOW TO ADD/REPLACE IMAGES

### Step 1: Prepare Your Images

**Recommended formats:**
- Photos: `.jpg` or `.webp` (optimized, 80% quality)
- Graphics/logos: `.svg` or `.png`
- Animations: `.gif` or `.mp4`

**Recommended sizes:**
- Hero images: 1920x1080 or larger
- Product images: 800x800 (square)
- Science/data images: 1200x800
- Team photos: 600x600 (square)
- Logos: 200-400px wide

### Step 2: Place Files in the Correct Folder

Put your images in the appropriate folder under `public/images/`:

```
silq-website/
└── public/
    └── images/
        ├── hero/           ← Hero backgrounds
        ├── products/       ← Product photos
        ├── science/        ← Data visualizations, lab photos
        ├── team/           ← Team headshots
        ├── trust/          ← Logos, badges, certifications
        └── textures/       ← Background textures
```

### Step 3: Update the Code to Use New Images

Find the page file that needs the image and update the `src` path:

```jsx
<Image 
  src="/images/products/your-new-image.jpg"  // ← Update this path
  alt="Description of image"
  width={600}
  height={400}
/>
```

### Step 4: Commit and Push

```bash
cd C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website
git add .
git commit -m "Update images: [description]"
git push origin staging
```

---

## 🔄 IMAGES THAT MAY NEED REVIEW

Based on the site review, these images should be checked for quality/accuracy:

1. **`/images/science/encrustation-comparison.png`** - Is this the best encrustation comparison image?
2. **`/images/science/bacteria-panel.png`** - Is this data current and accurate?
3. **`/images/products/boxnew.jpg`** - Is this the current product packaging?
4. **Team photos** - Are all team members current? Any new additions?

---

## 📋 CONTENT TO VERIFY

### News Items (Homepage)

The news section has 4 items with URLs. Verify these are the correct/current news articles:

1. Premier GPO Agreement - PR Newswire
2. NuSil Collaboration - Business Wire
3. Vizient Contract - Business Wire
4. UCLA Research - UCLA Newsroom

**Location:** `src/app/page.tsx` lines 50-75

### Company Information

- **Address:** 323 Sunny Isles Blvd., 7th Floor, Sunny Isles Beach, FL 33160
- **Phone:** (424) 309-8523
- **Email:** info@silq.tech

Verify this information is current on the Contact page.

---

## NEXT STEPS

1. ✅ Push the deployment fix (already done)
2. Review this document and identify which images/content to update
3. Prepare replacement files
4. Share the files with me or place them in the correct folders
5. I'll update the code references as needed
6. Push to staging for review
