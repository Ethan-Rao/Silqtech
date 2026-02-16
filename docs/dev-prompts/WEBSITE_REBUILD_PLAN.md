# WEBSITE REBUILD PLAN: Silq Technologies

**Document Version:** 2.0  
**Generated:** February 6, 2026  
**Updated:** February 6, 2026  
**Purpose:** Developer-ready specification for rebuilding silq.tech as a modern, investor-grade medical device company website

> **Note for Developer Agent:** This document contains all specifications needed to build the site. Domain is managed via Squarespace but development will NOT use Squarespace. See Section 7.1 for hosting recommendations.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current Site Map & Page Inventory](#2-current-site-map--page-inventory)
3. [Per-Page Content Outline](#3-per-page-content-outline)
4. [Navigation & Information Architecture](#4-navigation--information-architecture)
5. [Image Asset Review](#5-image-asset-review)
6. [Design Direction](#6-design-direction)
7. [Developer Deliverables](#7-developer-deliverables)
8. [Content Risk & Open Questions](#8-content-risk--open-questions)

---

## 1. Executive Summary

### Company Overview
Silq Technologies is a medical device company developing advanced biomaterials technology born from UCLA research. Their flagship product is the **ClearTract® Foley Catheter**, which uses patented zwitterionic surface treatment technology to resist biofouling and improve patient outcomes. The company is seeking investor funding.

### Rebuild Goals
- Present Silq as a **credible, premium, cutting-edge** medical device company
- Optimize for **investor-facing presentation** (clear technology story, strong team, FDA status, clinical validation)
- Modernize visual design while preserving existing content and messaging
- Consolidate and clarify site structure

### Current Platform
The existing site was built on **Squarespace** using their Fluid Engine layout system. The rebuild will transition to a custom-built solution for greater flexibility and performance.

---

## 2. Current Site Map & Page Inventory

### 2.1 Saved Pages (From `Pages/` folder)

| Page | File | Status | Investor Priority |
|------|------|--------|-------------------|
| **Homepage** | `Silq Technologies.html` | ✅ Complete | PRIMARY |
| **Platform Technology** | `PLATFORM TECHNOLOGY — Silq Technologies.html` | ✅ Complete | PRIMARY |
| **Our Team** | `OUR TEAM — Silq Technologies.html` | ✅ Complete | PRIMARY |
| **Contact** | `Contact — Silq Technologies.html` | ✅ Complete | SECONDARY |
| **ClearTract Catheters** | `CLEARTRACT CATHETERS — Silq Technologies2.html` | ✅ Complete | PRIMARY |
| **Investors** | `INVESTORS — Silq Technologies.html` | ✅ Complete | PRIMARY |
| **External Coating Solutions** | `EXTERNAL COATING SOLUTIONS — Silq Technologies_files/` | ⚠️ MISSING HTML (only assets folder exists) | SECONDARY |
| **Example Rep Page** | `Example Rep Page — Silq Technologies.html` | ✅ Template (unlinked) | INTERNAL/SALES |

### 2.2 Brochures & Documents (From `Pages/Brochures/` folder)

| Document | File | Purpose |
|----------|------|---------|
| Patient & MD Testimonials | `ClearTract+Patient+++MD+Testimonials.pdf` | Marketing collateral |
| Product Brochure | `L.SLQ011+B+Silq+ClearTract+Brochure+Bi-Fold.pdf` | Sales brochure |
| Sales & Marketing Guide | `Sales+and+Marketing+for+1099+5_30_25.pdf` | Rep training/guidelines |
| ClearTract Training | `SILQ_ClearTract_Training+No+BE.pdf` | Product training materials |

> **Note:** Consider making select brochures downloadable from the website for healthcare professionals.

### 2.3 Navigation Structure (Extracted from Current Site)

**Top Navigation:**
- HOME → `/`
- ABOUT SILQ (Dropdown)
  - OUR TEAM → `/our-team`
  - INVESTOR OPPORTUNITIES → `/investors`
- CLEARTRACT CATHETERS → `/cleartract-foley-catheters`
- PLATFORM TECHNOLOGY → `/platform-technology`
- EXTERNAL COATING SOLUTIONS → `/external-coating-solutions`
- Contact Us ⇲ (CTA Button) → `/contact`

### 2.4 Footer Links (Extracted)
- About
- Privacy Policy (external: termsfeed.com)
- Terms and Conditions (external: termsfeed.com)
- Cookies Policy (external: termsfeed.com)
- Contact: info@silq.tech, (424) 309-8523
- Address: 323 Sunny Isles Blvd., 7th Floor, Sunny Isles Beach, FL 33160

---

## 3. Per-Page Content Outline

### 3.1 Homepage (`Silq Technologies.html`)

**Purpose:** Introduce Silq Technologies' value proposition, technology differentiation, and flagship product to investors and healthcare stakeholders.

**Sections Present:**
1. **Hero Section**
   - Main heading: "Transforming Surfaces Through Advanced Material Science"
   - Introductory paragraph about UCLA origins, drug-free technology, customizable surface modifications
   
2. **Value Proposition Grid**
   - "Protecting against infection."
   - "Increasing Efficiency."
   - "A fluid solution."
   - "Smooth as Silq."

3. **Product Highlight: ClearTract® Foley Catheters**
   - Product description and benefits
   - Embedded Vimeo video (ID: 869354523 - "Silq Technologies Overview ClearTract")

4. **Testimonials Section**
   - Evgeniy Kreydin, M.D. (medical professional)
   - Ana Garcia (patient testimonial)
   - Stephen and Dolores Newhouse (patient family)

5. **Trust Signals**
   - FDA logo/clearance reference
   - UCLA affiliation logo
   - Verizon award logo (`vzt_awardsupp_r_rgb_orn_pos.png`)
   - PressWire logo

**Content Trimming Recommendations:**
- ⚠️ Value proposition statements are short taglines without supporting content—consider adding brief explanatory text OR removing redundant ones
- The "Smooth as Silq" tagline is clever but may feel too casual for investor audiences; keep but de-emphasize

**Essential Images:**
- `boxnew.jpg` - ClearTract product packaging
- `fda.png` - FDA clearance trust signal
- `ucla.jpg` - UCLA affiliation
- `vzt_awardsupp_r_rgb_orn_pos.png` - Verizon award badge
- `Textures_SIL_*.jpg` - Hero/background textures
- `water5.jpg` - Water/fluid texture (brand theming)

---

### 3.2 Platform Technology (`PLATFORM TECHNOLOGY — Silq Technologies.html`)

**Purpose:** Explain the scientific foundation of Silq's patented zwitterionic surface treatment technology for technical investors, partners, and healthcare professionals.

**Sections Present:**
1. **Hero/Title Section**
   - Heading: "A Bioinspired Platform Technology"
   - Background texture image (`Textures_SIL_15.jpg`)

2. **UCLA Research Origin**
   - Paragraph about material scientists, chemists, microbiologists at UCLA
   - Key claim: "enabling the broad-based use of zwitterionic chemistry on implanted medical devices and beyond"

3. **Zwitterion Chemistry Explanation**
   - Scientific explanation of zwitterionic chemistry as antibiofouling technology
   - Phospholipid bilayer emulation
   - Covalent bond explanation with substrate

4. **Clinical Relevance**
   - Catheter-related thrombosis concern
   - New generation medical devices potential

5. **Visual Elements**
   - `zwitterion.jpg` - Molecular diagram
   - `Textures_SIL_4.jpg` - Background/texture
   - Lab/engineering stock photo (`thisisengineering-TeJZ3CGZXRw-unsplash.jpg`)

6. **Call to Action**
   - Link to Advanced Materials publication (Wiley Online Library)

**Content Trimming Recommendations:**
- ✅ Keep all technical content—critical for investor due diligence
- Consider adding a "Key Benefits Summary" or bullet points at top for quick scanning
- Disclaimer "*Data on file available by request" should be styled consistently

**Essential Images:**
- `Textures_SIL_15.jpg` - Hero background
- `zwitterion.jpg` - Molecular diagram (critical for technology explanation)
- `Textures_SIL_4.jpg` - Section background
- Lab/engineering photography

---

### 3.3 Our Team (`OUR TEAM — Silq Technologies.html`)

**Purpose:** Establish credibility through leadership team backgrounds—critical for investor confidence.

**Sections Present:**
1. **Hero/Title Section**
   - Heading: "The story. The team."

2. **Company Description**
   - Full paragraph about Silq as "leader in advanced biomaterials"
   - Applications: medical devices, implants, microfluidics, lithium-ion batteries, water treatment

3. **Team Grid**
   - **Verne Sharma** - MBA, CEO, Board of Directors
   - **Jack Kavanaugh** - MD, MBA, Chairman of Board
   - **Richard Kaner** - PhD, Chief Scientific Advisor, Board
   - **Mahi De Silva** - Board of Directors
   - **Robert Snukal** - Board of Directors
   - **Brian McVerry** - PhD, CTO, Board of Directors

4. **Team Detail Pages** (linked from grid)
   - Individual bio pages at `/verne`, `/jack`, `/richard`, `/mahi`, `/robert`, `/brian`

**Content Trimming Recommendations:**
- ⚠️ Company description is long—move to About page or condense to 2-3 sentences
- Team grid is well-structured; keep as-is
- Consider adding "Advisory Board" section if advisors exist

**Essential Images:**
- Team headshot photos (from `OUR TEAM — Silq Technologies_files/`):
  - `60ce61b3102e0b3b954a3c43_D-Verne-Sharma-505x645+(1).jpg`
  - `60ce61b3707f44bad1f84f96_Jack-Kavanaugh-2.jpg`
  - `60ce61b338e06c4d391ec83f_KanerRichard2.jpg`
  - `60f9b962d44e6744967f463d_Untitled+design+(31).png` (Mahi De Silva)
  - `60ce61b38fffca7602972d0e_Robert-Snukal-300x300.jpg`
  - `60ce61b33ce5aeaa6bca57d7_Brian-Headshot2-1.jpg`

---

### 3.4 Contact (`Contact — Silq Technologies.html`)

**Purpose:** Provide clear contact method for investors, partners, and healthcare professionals.

**Sections Present:**
1. **Header Section**
   - Heading: "Let's Talk."
   - Subheading: "We have samples available"

2. **Contact Form**
   - Fields: Name, Email (required), "How can we help you?" (required)
   - Submit button

3. **Footer** (Global)
   - Contact info: info@silq.tech, (424) 309-8523
   - Address: 323 Sunny Isles Blvd., 7th Floor, Sunny Isles Beach, FL 33160

**Content Trimming Recommendations:**
- ✅ Keep minimal—contact pages should be focused
- "We have samples available" is good for product inquiries; keep

**Essential Images:**
- `divider.png` - Decorative divider element

---

### 3.5 ClearTract Catheters (`CLEARTRACT CATHETERS — Silq Technologies2.html`)

**Purpose:** Product page for flagship ClearTract® Foley Catheter—critical investor page demonstrating the commercial application of Silq's technology.

**Sections Present:**
1. **Hero Section**
   - Product image with heading: "ClearTract® Foley Catheters"
   - Image: `Screenshot+2024-09-24+at+1.26.02+PM.png` (product display)

2. **CAUTI Statistics Section**
   - "There are now an estimated 1 million catheter-associated urinary tract infection (CAUTI) cases per year in the United States"
   - Cost statistic: "costing an estimated $13,793 per case"
   - External links to Nature (nrurol.2010.190) and AHRQ (hai/pfp/haccost2017-results)

3. **Patient Testimonials Carousel**
   - "Her UTIs have subsided, no more blockages…My mom is completely relieved and satisfied" - Son of a Silq ClearTract Patient
   - "I have said it more than once, but I won't use any other catheter out there." - Dulce Garcia | Patient
   - "This has been like a miracle for us" - Stephen and Dolores Newhouse | Parents of Patient
   - "I do not think I would go back to the other catheters ever again." - Ana Garcia | Patient

4. **Benefits Section**
   - Heading: "The Benefits of ClearTract®"
   - Key benefit: "Silq's groundbreaking surface technology has been shown to be able to reduce the adhesion of pathogenic microbes without the use of antibiotics."
   - Material specs: "100% medical grade silicone with no latex, BPA, or DEHP and demonstrate dramatically reduced endotoxin levels"
   - Accordion/FAQ items for detailed benefits

5. **Antibiotic Concern Section**
   - Heading: "Overuse of Antibiotic Drugs: A growing concern"
   - Supporting the drug-free value proposition

6. **Contact CTA**
   - "Contact us to learn more"

**Content Trimming Recommendations:**
- ✅ Keep all testimonials—strong social proof
- ✅ Keep CAUTI statistics—compelling problem statement
- ⚠️ Verify external links (Nature, AHRQ) are still valid
- Consider adding product specifications (sizes, catalog numbers) if available

**Essential Images:**
- `Screenshot+2024-09-24+at+1.26.02+PM.png` - Product display
- `CDC+Graphic.png` - Statistics visual
- `boxnew.jpg` - Product packaging

---

### 3.6 External Coating Solutions (⚠️ INCOMPLETE - HTML MISSING)

**Purpose:** B2B/licensing page for applying Silq technology to third-party products.

**Available Assets (from `_files/` folder):**
- `Contact+Angle+Images_2.png` - Contact angle demonstration image
- `lightblue.jpg` - Background
- `Textures_SIL_15.jpg` - Texture

**Action Required:**
- ⚠️ **OWNER MUST PROVIDE:** Full page content OR re-save this page from live site

---

### 3.7 Investors (`INVESTORS — Silq Technologies.html`)

**Purpose:** Dedicated investor relations page with contact form for investment inquiries—critical for funding round.

**Sections Present:**
1. **Header Section**
   - Heading: "Investor opportunities" (blue `#314780`)
   - Subheading: "Fill out the form below to speak to a member of our team"
   - Decorative divider image (`divider.png`)

2. **Investor Contact Form**
   - Form name: "InvestorForm"
   - Fields:
     - Name (First Name, Last Name - required)
     - Organization (required)
     - Email (required)
     - Message (required)
   - Submit button
   - reCAPTCHA enabled for spam protection
   - Success message: "Thank you for your inquiry! A Silq team member will be in contact with you shortly."

3. **Footer** (Standard site footer)

**Content Trimming Recommendations:**
- ✅ Keep form simple and focused
- Consider adding brief intro paragraph about investment opportunity
- Consider adding link to download investor deck (if available)
- Consider adding "What to expect" timeline for follow-up

**Essential Images:**
- `divider.png` - Decorative separator

**Form Integration Notes:**
- Current form uses Squarespace's built-in form handling
- New site will need: Email service (Resend, SendGrid) or form backend (Formspree, Netlify Forms)
- Consider CRM integration (HubSpot, Salesforce) for investor lead tracking

---

### 3.8 Example Rep Page (`Example Rep Page — Silq Technologies.html`) — TEMPLATE

**Purpose:** Template page for sales representatives to share with healthcare facilities. Each rep can have their own customized landing page with territory-specific information. Currently unlinked from main navigation.

**Sections Present:**
1. **Rep/Distributor Header**
   - Customizable company name: "DWB Medical" (example placeholder)
   - Rep contact email: "ChuckG@Silq.tech" (customizable)

2. **Silq Treatment Demo Section**
   - Heading: "Silq's Treatment Demo"
   - Embedded Vimeo video (ID: 1105287849 - "Silq Coating Dye Test")

3. **Patient Experience Video Section**
   - Native video: `cleartract_catheter_patient_experience (1080p).mp4`
   - 61-second testimonial video

4. **Sample Request Form**
   - Heading: "Sample Request Form"
   - Form for healthcare professionals to request product samples

5. **Interactive Facility Map Section**
   - Heading: "Highlighted Facilities"
   - Interactive Plotly.js map for territory visualization
   - Facility data table with columns:
     - Facility Name, State, City, Facility Type, GPO Membership, Address, Phone, Physicians
   - Instruction: "Click and drag on the map to select facilities"

**Data Sources (from `new maps/` folder):**
- `Doctors_08_2025/` - Physician targeting data
- `hospitals_08_2025/` - Hospital facility data (~50+ CSV files)
- `html6.py`, `TargetList2.py` - Data processing scripts

**Implementation Notes:**
- This is a **template system** - not a single static page
- Requires dynamic route generation (e.g., `/rep/[repId]` or `/rep/dwb-medical`)
- Rep data (name, company, email, territory) should be configurable
- Map requires Plotly.js integration
- Consider:
  - Admin interface for creating new rep pages
  - Or JSON/CMS-based configuration for each rep
  - Password protection or login for rep-specific content
  - Analytics per rep page for tracking engagement

**Essential Components:**
- Video player (Vimeo + native MP4)
- Interactive map (Plotly.js or similar: Mapbox, Leaflet)
- Data table with filtering
- Sample request form
- Rep contact information display

**Essential Videos:**
- Vimeo 1105287849 - Coating dye test demo
- `cleartract_catheter_patient_experience.mp4` - Patient testimonial

---

## 4. Navigation & Information Architecture

### 4.1 Proposed Navigation Structure

**Primary Navigation (Top):**

```
SILQ TECHNOLOGIES (Logo/Home)

HOME | TECHNOLOGY | PRODUCTS ▼ | ABOUT ▼ | [Contact Us - CTA Button]
                       |              |
                       |              ├─ Our Team
                       |              └─ Investors
                       |
                       ├─ ClearTract® Catheters
                       └─ External Coating Solutions
```

**Rationale:**
- "Platform Technology" → "Technology" (simpler)
- Group products under dropdown for scalability
- Keep "Investors" accessible but not dominant in nav
- CTA button for Contact drives action

### 4.2 Footer Navigation

```
┌─────────────────────────────────────────────────────────────────────┐
│  [SILQ LOGO]                                                        │
│                                                                     │
│  PRODUCTS          COMPANY           CONTACT          LEGAL        │
│  ClearTract®       Our Team          info@silq.tech   Privacy      │
│  Coating Solutions Investors         (424) 309-8523   Terms        │
│  Technology        Careers*          323 Sunny Isles  Cookies      │
│                                      Blvd., FL 33160               │
│                                                                     │
│  © 2026 Silq Technologies. All rights reserved.                    │
│  [LinkedIn] [Twitter/X]                                            │
└─────────────────────────────────────────────────────────────────────┘
```

*Careers only if applicable

### 4.3 Recommended Page Consolidation

| Current | Proposed | Rationale |
|---------|----------|-----------|
| Homepage | Homepage | Keep |
| Platform Technology | Technology | Rename for simplicity |
| ClearTract Catheters | Products > ClearTract® Catheters | Group under Products |
| External Coating Solutions | Products > Coating Solutions | Group under Products |
| Our Team | About > Our Team | Group under About |
| Investor Opportunities | About > Investors | Keep accessible |
| Contact | Contact | Keep as top-level CTA |

### 4.4 Must-Have Investor Pages Checklist

| Page | Exists | Status |
|------|--------|--------|
| Technology/Platform Overview | ✅ | Complete |
| Flagship Product (ClearTract) | ✅ | Complete |
| Team & Leadership | ✅ | Complete |
| Investor Relations | ✅ | Complete |
| Contact/Get in Touch | ✅ | Complete |
| External Coating Solutions (B2B) | ⚠️ | HTML missing |

### 4.5 Sales/Rep Tools Checklist

| Feature | Exists | Status |
|---------|--------|--------|
| Rep Landing Page Template | ✅ | Example Rep Page available |
| Product Demo Videos | ✅ | Vimeo + native video |
| Facility Targeting Map | ✅ | Plotly.js map with data |
| Sample Request Form | ✅ | In rep page template |
| PDF Brochures | ✅ | 4 PDFs in Brochures folder |

---

## 5. Image Asset Review

### 5.1 Image Categories (from `Images/` folder)

#### Logos & Brand Assets
| File | Type | Quality | Recommendation |
|------|------|---------|----------------|
| `Logo_Main_SIL+(3).png` | Main logo | ✅ Good | Use for header |
| `Logo_OneLine_SIL+(2).png` | Horizontal logo | ✅ Good | Use for footer |
| `Monogram_SIL_03_A.png` | Icon/monogram | ✅ Good | Use for favicon, mobile |
| `favicon.ico.png` | Favicon | ✅ Good | Keep |

#### Product Photography
| File | Type | Quality | Recommendation |
|------|------|---------|----------------|
| `boxnew.jpg` | ClearTract packaging | ✅ Good | Hero product image |
| `CDC+Graphic.png` | CDC statistics | ⚠️ Review | May be dated—verify stats |
| `Contact+Angle+Images_2.png` | Science demo | ✅ Good | Technology page |
| `Screenshot+2024-09-24+...` | App/product screenshot | ⚠️ Review | Filename suggests dated |

#### Scientific/Diagrams
| File | Type | Quality | Recommendation |
|------|------|---------|----------------|
| `Droplet+Angle.jpg` | Surface droplet | ✅ Good | Technology page |
| `Droplet1.jpg` | Surface droplet | ✅ Good | Alternative/secondary |
| `Surface+Droplet.jpg` | Macro surface | ✅ Good | Technology page |
| `Surface+Droplet2.jpg` | Macro surface | ✅ Good | Alternative |
| `zwitterion.jpg` (in _files) | Molecular diagram | ✅ Critical | Technology page |

#### Textures & Backgrounds
| File | Type | Quality | Recommendation |
|------|------|---------|----------------|
| `Textures_SIL_4.jpg` | Abstract texture | ✅ Good | Section backgrounds |
| `Textures_SIL_6.jpg` | Abstract texture | ✅ Good | Section backgrounds |
| `Textures_SIL_15.jpg` | Abstract texture | ✅ Good | Hero backgrounds |
| `water5.jpg` | Water/fluid | ✅ Good | Brand theming |
| `lightblue.jpg` | Solid color | ⚠️ Redundant | Use CSS instead |
| `bw.jpg` | Black/white texture | ✅ Good | Optional use |

#### Trust/Partner Logos
| File | Type | Quality | Recommendation |
|------|------|---------|----------------|
| `fda.png` | FDA logo | ✅ Critical | Trust signal |
| `ucla.jpg` | UCLA logo | ✅ Critical | Origin story |
| `vzt_awardsupp_r_rgb_orn_pos.png` | Verizon award | ✅ Good | Trust signal |
| `PRESSWIRE-LOGO-BLACK-1190x595.png` | PressWire | ⚠️ Optional | Lower priority |

#### UI Elements
| File | Type | Quality | Recommendation |
|------|------|---------|----------------|
| `divider.png` | Decorative divider | ⚠️ Consider CSS | Replace with CSS border |
| `1.png`, various `.svg` | Icons | ✅ Good | Keep for UI |

### 5.2 Image Optimization Notes

- Multiple `.webp` and `.jpeg` versions exist (good—responsive images already generated)
- Several duplicate numbered files (e.g., `boxnew.jpg_1.webp`, `_2.webp`)—clean up in rebuild
- **Recommendation:** Use `srcset` with WebP primary, JPEG fallback

### 5.3 Essential Images by Page

**Homepage:**
- Hero: `Textures_SIL_6.jpg` or `water5.jpg`
- Product: `boxnew.jpg`
- Trust signals: `fda.png`, `ucla.jpg`, `vzt_awardsupp_r_rgb_orn_pos.png`

**Technology:**
- Hero: `Textures_SIL_15.jpg`
- Diagrams: `zwitterion.jpg`, `Droplet+Angle.jpg`, `Surface+Droplet.jpg`

**Team:**
- All team headshots (from `_files` folders)

**Products:**
- `boxnew.jpg`, `CDC+Graphic.png`, `Contact+Angle+Images_2.png`

### 5.4 Missing/Needed Images

- ⚠️ Higher quality team headshots (current images are 200-640px, need 800px+)
- ⚠️ In-use clinical photography (actual catheter in healthcare setting)
- ⚠️ Manufacturing/facility photos (builds credibility)

---

## 6. Design Direction

### 6.1 Mood Keywords

```
CLINICAL • CONFIDENT • PREMIUM • TRUSTWORTHY • INNOVATIVE • PRECISE
```

**Visual Personality:**
- Medical-grade precision meets modern tech startup
- UCLA research credibility + commercial readiness
- Not sterile/cold—warm confidence with scientific foundation

### 6.2 Color Direction

**Primary Palette (Extracted from Current Site):**
- **Primary Blue:** `#314780` (current CTA/link color—confident, professional)
- **White/Off-White:** `#FFFFFF` / `#EBEAE3` (backgrounds)
- **Black:** `#0E1216` (text)

**Recommended Enhancements:**
- **Accent:** Subtle teal/aqua (`#00ADEF` appears in video player—water/fluid association)
- **Success/Trust:** Medical green accent for clinical claims
- Keep palette restrained—3 colors max for premium feel

### 6.3 Typography Recommendations

**Current (Squarespace defaults):** Generic system fonts

**Recommended:**
- **Headlines:** Modern geometric sans-serif (e.g., **Söhne**, **Neue Montreal**, or **Instrument Sans**)
- **Body:** Highly legible sans-serif (e.g., **Inter**, **Source Sans Pro**, or **IBM Plex Sans**)
- **Monospace/Data:** For statistics/metrics (e.g., **JetBrains Mono** or **IBM Plex Mono**)

**Scale:**
- Hero H1: 56-72px (desktop), 36-44px (mobile)
- Section H2: 36-48px
- Body: 18px with 1.6 line-height
- Captions/small: 14px

### 6.4 Layout Principles

**Grid:**
- 12-column grid with generous gutters (24-48px)
- Max content width: 1200-1400px
- Full-bleed hero sections with overlaid text

**Spacing:**
- Section padding: 80-120px vertical (desktop), 48-64px (mobile)
- Consistent rhythm using 8px base unit
- Generous white space between sections (premium feel)

**Section Rhythm Pattern:**
```
[Full-width Hero] → [Content Section] → [Full-width Feature] → [Content Section] → [CTA]
```

### 6.5 Component Style Recommendations

#### Hero Section
- Full-viewport height option for homepage
- Subtle animated background (CSS gradients or particle effects—current site uses Squarespace's "liquid" effect)
- Clear hierarchy: H1 → Subhead → CTA button

#### Feature/Technology Blocks
- Image + Text split layouts (alternate sides)
- Numbered lists for processes/steps
- Icon + label grids for benefits

#### Team Grid
- Consistent card sizing with hover states
- Circular or soft-rounded image masks
- Name, title, credentials in clear hierarchy

#### Metrics/Stats Strip
- Large numbers with labels
- Use for: FDA clearance stats, clinical outcomes, patent numbers
- Subtle animation on scroll-into-view

#### Testimonials
- Quote marks or subtle styling
- Photo + name + title/affiliation
- Carousel or stacked layout

#### Contact Form
- Minimal fields (Name, Email, Message)
- Clear labels, generous touch targets
- Success state feedback

#### Call-to-Action Buttons
- Primary: Solid fill with brand blue, white text
- Secondary: Outlined with brand blue
- Consistent padding (16px 32px)
- Subtle hover transitions

### 6.6 Accessibility & Trust Signals

**Accessibility:**
- Minimum 4.5:1 contrast ratio for text
- Focus states on all interactive elements
- Semantic HTML structure
- Alt text for all images
- Skip navigation link

**Trust Signals:**
- FDA clearance badge prominently displayed
- UCLA affiliation/origin story
- Team credentials visible
- Contact information always accessible
- Professional photography (no obvious stock)

---

## 7. Developer Deliverables

### 7.1 Recommended Tech Stack

#### Option A: Next.js + Tailwind CSS (RECOMMENDED)

**Stack:**
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS 3.x
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Resend (email)
- **CMS:** Optional—Sanity.io or Contentlayer for content management
- **Deployment:** Vercel

**Rationale:**
- ✅ Excellent SEO with static generation + server components
- ✅ Fast builds and deployments
- ✅ Modern React patterns
- ✅ Tailwind enables rapid, consistent styling
- ✅ Vercel provides easy deployment with analytics
- ⚠️ Requires React knowledge

#### Option B: Astro + Tailwind CSS

**Stack:**
- **Framework:** Astro 4.x
- **Styling:** Tailwind CSS 3.x
- **Animations:** CSS + Intersection Observer
- **Forms:** Formspree or Netlify Forms
- **Deployment:** Netlify or Vercel

**Rationale:**
- ✅ Zero JavaScript by default (fastest possible pages)
- ✅ Great for content-heavy sites
- ✅ Simpler mental model than React
- ✅ Built-in image optimization
- ⚠️ Less flexible for interactive features
- ⚠️ Smaller ecosystem than Next.js

**Recommendation:** **Option A (Next.js)** for future flexibility (investor portal, product configurators, rep page system, etc.)

### 7.1.1 Hosting & Deployment Recommendations

> **Domain Note:** Domain (silq.tech) is currently managed via Squarespace. DNS can be pointed to any hosting provider. Squarespace will NOT be used for development—only domain management.

#### Option A: Vercel (RECOMMENDED for Next.js)

**Pros:**
- ✅ Zero-config deployment for Next.js (same company)
- ✅ Automatic CI/CD from GitHub
- ✅ Built-in analytics and speed insights
- ✅ Global CDN with edge functions
- ✅ Generous free tier for small sites
- ✅ Easy preview deployments for review

**Cons:**
- ⚠️ Can get expensive at scale (bandwidth pricing)
- ⚠️ Vendor lock-in for some features

**Pricing:** Free tier likely sufficient; Pro starts at $20/month

---

#### Option B: DigitalOcean App Platform

**Pros:**
- ✅ Owner already familiar with DigitalOcean
- ✅ Predictable pricing ($5-12/month for static sites)
- ✅ Full infrastructure control if needed
- ✅ Good for adding backend services later (databases, etc.)
- ✅ Managed SSL certificates

**Cons:**
- ⚠️ More manual setup than Vercel
- ⚠️ Less optimized for Next.js specifically
- ⚠️ No built-in preview deployments

**Pricing:** App Platform starts at $5/month for static sites

---

#### Option C: Cloudflare Pages

**Pros:**
- ✅ Unlimited bandwidth (free tier)
- ✅ Fastest global CDN
- ✅ Built-in DDoS protection
- ✅ Workers for edge functions
- ✅ Great for static/SSG sites

**Cons:**
- ⚠️ Less native Next.js support than Vercel
- ⚠️ Some Next.js features require workarounds

**Pricing:** Free tier is very generous

---

#### Option D: Netlify

**Pros:**
- ✅ Easy deployment from Git
- ✅ Built-in forms (good for contact forms)
- ✅ Serverless functions included
- ✅ Good Next.js support

**Cons:**
- ⚠️ Bandwidth limits on free tier
- ⚠️ Build minutes can run out on free tier

**Pricing:** Free tier; Pro at $19/month

---

**Hosting Recommendation:**

| Scenario | Best Choice |
|----------|-------------|
| Fastest setup, best DX | **Vercel** |
| Owner comfort + full control | **DigitalOcean** |
| Budget priority | **Cloudflare Pages** |
| Built-in form handling | **Netlify** |

For a professional investor-facing site, **Vercel** is recommended for optimal Next.js performance and simplest deployment workflow. If budget or existing DigitalOcean familiarity is prioritized, **DigitalOcean App Platform** is a solid choice.

### 7.2 Proposed Site Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── technology/
│   │   └── page.tsx                # Platform Technology
│   ├── products/
│   │   ├── page.tsx                # Products overview (optional)
│   │   ├── cleartract/
│   │   │   └── page.tsx            # ClearTract Catheters
│   │   └── coating-solutions/
│   │       └── page.tsx            # External Coating Solutions
│   ├── about/
│   │   ├── team/
│   │   │   ├── page.tsx            # Our Team
│   │   │   └── [member]/
│   │   │       └── page.tsx        # Individual team member bios
│   │   └── investors/
│   │       └── page.tsx            # Investor Opportunities
│   ├── contact/
│   │   └── page.tsx                # Contact form
│   ├── rep/
│   │   └── [repId]/
│   │       └── page.tsx            # Dynamic rep landing pages
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts            # Contact form handler
│   │   ├── investor-inquiry/
│   │   │   └── route.ts            # Investor form handler
│   │   └── sample-request/
│   │       └── route.ts            # Sample request handler
│   └── layout.tsx                  # Global layout (nav, footer)
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── ImageTextSplit.tsx
│   │   ├── TeamGrid.tsx
│   │   ├── TestimonialsCarousel.tsx
│   │   ├── MetricsStrip.tsx
│   │   ├── TrustLogos.tsx
│   │   ├── ContactForm.tsx
│   │   ├── InvestorForm.tsx
│   │   ├── Accordion.tsx           # For FAQ/benefits sections
│   │   └── VideoEmbed.tsx
│   ├── rep/                        # Rep page specific components
│   │   ├── RepHeader.tsx
│   │   ├── FacilityMap.tsx         # Plotly.js interactive map
│   │   ├── FacilityTable.tsx
│   │   └── SampleRequestForm.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── VideoPlayer.tsx
│       └── ...
├── content/
│   ├── pages/                      # Page content (markdown or JSON)
│   └── reps/                       # Rep configuration files
│       └── [repId].json            # Per-rep customization
├── data/
│   ├── facilities/                 # Hospital/facility data for maps
│   └── physicians/                 # Physician targeting data
├── public/
│   ├── images/
│   │   ├── logos/
│   │   ├── products/
│   │   ├── team/
│   │   ├── textures/
│   │   └── trust/
│   ├── videos/
│   │   └── cleartract_patient_experience.mp4
│   └── brochures/                  # Downloadable PDFs
│       ├── ClearTract-Brochure.pdf
│       ├── Patient-Testimonials.pdf
│       └── ...
└── styles/
    └── globals.css
```

### 7.3 Page-by-Page Build Spec

#### Homepage (`/`)

| Section Order | Component | Content Source | Images |
|---------------|-----------|----------------|--------|
| 1 | `<Hero>` | `Silq Technologies.html` - main heading + intro paragraph | `Textures_SIL_6.jpg` or video background |
| 2 | `<FeatureGrid>` | 4 value propositions | Icons (create or use existing SVGs) |
| 3 | `<ImageTextSplit>` | ClearTract product intro | `boxnew.jpg` |
| 4 | `<VideoEmbed>` | Vimeo 869354523 | — |
| 5 | `<TestimonialsCarousel>` | 3 testimonials | — |
| 6 | `<TrustLogos>` | FDA, UCLA, Verizon award | `fda.png`, `ucla.jpg`, `vzt_...png` |
| 7 | `<ContactCTA>` | "Get in Touch" prompt | — |

**Trimming Notes:**
- Condense introductory paragraph to 2 sentences
- Keep all testimonials but standardize formatting

---

#### Technology (`/technology`)

| Section Order | Component | Content Source | Images |
|---------------|-----------|----------------|--------|
| 1 | `<Hero>` | "A Bioinspired Platform Technology" | `Textures_SIL_15.jpg` |
| 2 | `<ImageTextSplit>` | UCLA research origin paragraph | Lab stock photo |
| 3 | `<ImageTextSplit>` | Zwitterion chemistry explanation | `zwitterion.jpg` |
| 4 | `<ImageTextSplit>` | Clinical relevance | `Droplet+Angle.jpg` |
| 5 | `<CTABanner>` | Link to Advanced Materials publication | — |

**Trimming Notes:**
- Add bullet point summary at top for quick scanning
- Keep all technical content intact

---

#### ClearTract Catheters (`/products/cleartract`)

| Section Order | Component | Content Source | Images |
|---------------|-----------|----------------|--------|
| 1 | `<Hero>` | "ClearTract® Foley Catheters" | `Screenshot+2024-09-24+at+1.26.02+PM.png` |
| 2 | `<MetricsStrip>` | CAUTI statistics: "1 million cases/year", "$13,793 per case" | Icons |
| 3 | `<TestimonialsCarousel>` | 4 patient testimonials from source page | — |
| 4 | `<FeatureSection>` | "The Benefits of ClearTract®" heading + benefits text | — |
| 5 | `<Accordion>` | Expandable benefit details (if content supports) | — |
| 6 | `<ImageTextSplit>` | Antibiotic overuse concern section | — |
| 7 | `<TrustLogos>` | FDA clearance badge | `fda.png` |
| 8 | `<ContactCTA>` | "Contact us to learn more" | — |

**Content Mapping:**
- Source: `CLEARTRACT CATHETERS — Silq Technologies2.html`
- Testimonials: Extract 4 patient quotes (Son of patient, Dulce Garcia, Stephen/Dolores Newhouse, Ana Garcia)
- Statistics: Link to Nature and AHRQ sources

**Trimming Notes:**
- ✅ Page is complete—no owner action needed
- Verify external statistic links are current

---

#### Team (`/about/team`)

| Section Order | Component | Content Source | Images |
|---------------|-----------|----------------|--------|
| 1 | `<Hero>` | "The story. The team." | Optional texture |
| 2 | `<TextBlock>` | Company description (condensed) | — |
| 3 | `<TeamGrid>` | 6 team members | Team headshots |

**Team Members to Include:**
1. Verne Sharma - CEO (link to `/about/team/verne`)
2. Jack Kavanaugh - Chairman (link to `/about/team/jack`)
3. Richard Kaner - Chief Scientific Advisor (link to `/about/team/richard`)
4. Mahi De Silva - Board (link to `/about/team/mahi`)
5. Robert Snukal - Board (link to `/about/team/robert`)
6. Brian McVerry - CTO (link to `/about/team/brian`)

**Trimming Notes:**
- Move long company description to About overview or condense

---

#### Contact (`/contact`)

| Section Order | Component | Content Source | Images |
|---------------|-----------|----------------|--------|
| 1 | `<Hero>` | "Let's Talk." + "Samples available" | — |
| 2 | `<ContactForm>` | Name, Email, Message | — |
| 3 | `<ContactInfo>` | Email, phone, address | — |

---

#### Investors (`/about/investors`)

| Section Order | Component | Content Source | Images |
|---------------|-----------|----------------|--------|
| 1 | `<Hero>` | "Investor opportunities" | — |
| 2 | `<TextBlock>` | "Fill out the form below to speak to a member of our team" | `divider.png` |
| 3 | `<InvestorForm>` | Name, Organization, Email, Message (all required) | — |

**Content Mapping:**
- Source: `INVESTORS — Silq Technologies.html`
- Form fields: firstName, lastName, organization, email, message
- Success message: "Thank you for your inquiry! A Silq team member will be in contact with you shortly."

**Form Backend Requirements:**
- Email notification to investor relations team
- Consider CRM integration (HubSpot/Salesforce) for lead tracking
- reCAPTCHA spam protection

---

#### Rep Landing Page Template (`/rep/[repId]`)

| Section Order | Component | Content Source | Images |
|---------------|-----------|----------------|--------|
| 1 | `<RepHeader>` | Dynamic: Rep company name + contact email | — |
| 2 | `<VideoEmbed>` | "Silq's Treatment Demo" - Vimeo 1105287849 | — |
| 3 | `<VideoPlayer>` | Patient experience video (native MP4) | — |
| 4 | `<SampleRequestForm>` | Sample request form | — |
| 5 | `<FacilityMap>` | Plotly.js interactive territory map | — |
| 6 | `<FacilityTable>` | Highlighted facilities data table | — |

**Content Mapping:**
- Template: `Example Rep Page — Silq Technologies.html`
- Dynamic data from `/content/reps/[repId].json`:
  ```json
  {
    "repId": "dwb-medical",
    "companyName": "DWB Medical",
    "contactName": "Chuck G",
    "contactEmail": "ChuckG@Silq.tech",
    "territory": ["FL", "GA", "SC"],
    "highlightedFacilities": []
  }
  ```

**Technical Requirements:**
- Plotly.js for interactive map
- Data loading from `/data/facilities/` CSVs
- Dynamic route generation from rep configs
- Consider authentication/access control for rep-specific data

---

### 7.4 Reusable Components List

#### Layout Components
| Component | Description |
|-----------|-------------|
| `Header` | Logo, navigation, mobile menu, CTA button |
| `Footer` | Logo, nav links, contact info, legal links, social |
| `Layout` | Wrapper with header/footer |

#### Section Components
| Component | Props | Description |
|-----------|-------|-------------|
| `Hero` | `title`, `subtitle`, `cta`, `backgroundImage`, `variant` | Full-width hero section |
| `ImageTextSplit` | `title`, `content`, `image`, `imagePosition`, `cta` | 50/50 image + text layout |
| `FeatureGrid` | `features[]` | 2-4 column grid of feature cards |
| `TeamGrid` | `members[]` | Responsive team member card grid |
| `TestimonialsCarousel` | `testimonials[]` | Quote carousel with navigation |
| `MetricsStrip` | `metrics[]` | Horizontal stats display |
| `TrustLogos` | `logos[]` | Partner/certification logo row |
| `ContactForm` | `fields[]`, `submitEndpoint` | General contact form with validation |
| `InvestorForm` | `submitEndpoint` | Investor inquiry form (Name, Org, Email, Message) |
| `VideoEmbed` | `vimeoId` | Responsive Vimeo embed |
| `VideoPlayer` | `src`, `poster` | Native HTML5 video player |
| `CTABanner` | `title`, `cta`, `variant` | Full-width call-to-action |
| `Accordion` | `items[]` | Expandable FAQ/details sections |

#### Rep Page Components
| Component | Props | Description |
|-----------|-------|-------------|
| `RepHeader` | `companyName`, `contactEmail`, `contactName` | Customizable rep branding header |
| `FacilityMap` | `territory`, `facilities[]` | Plotly.js interactive territory map |
| `FacilityTable` | `facilities[]`, `columns[]` | Data table with sorting/filtering |
| `SampleRequestForm` | `repId`, `submitEndpoint` | Product sample request form |

#### UI Components
| Component | Description |
|-----------|-------------|
| `Button` | Primary/secondary/ghost variants |
| `Card` | Flexible card container |
| `Badge` | Status/label badges |
| `Icon` | SVG icon wrapper |
| `Image` | Next/Image wrapper with optimization |

### 7.5 Implementation Sequence

```
Phase 1: Foundation (Week 1)
├─ Project setup (Next.js, Tailwind, folder structure)
├─ Design tokens (colors, typography, spacing)
├─ Global styles and CSS reset
├─ Header component with navigation
├─ Footer component
├─ Layout wrapper
└─ Form API routes setup (contact, investor inquiry)

Phase 2: Core Pages (Week 2)
├─ Homepage implementation
├─ Technology page
├─ ClearTract product page ✅ (content available)
├─ Team page
├─ Contact page with form
└─ Basic routing

Phase 3: Secondary Pages (Week 3)
├─ Investors page with form ✅ (content available)
├─ Coating Solutions page (⚠️ pending content)
├─ Individual team member pages
├─ 404 page
└─ Downloadable brochures section

Phase 4: Rep Page System (Week 4)
├─ Rep landing page template
├─ Dynamic route setup (/rep/[repId])
├─ Rep configuration system (JSON-based)
├─ Plotly.js map integration
├─ Facility data table component
├─ Sample request form
└─ Video player components (Vimeo + native)

Phase 5: Polish (Week 5)
├─ Responsive testing and fixes
├─ Accessibility audit (WCAG 2.1 AA)
├─ Performance optimization (Core Web Vitals)
├─ Animation polish
├─ SEO metadata
├─ Analytics integration
└─ Final QA

Phase 6: Launch
├─ Hosting setup (Vercel/DigitalOcean/Cloudflare)
├─ DNS configuration (point silq.tech from Squarespace)
├─ SSL verification
├─ Redirects from old Squarespace URLs
├─ Final stakeholder review
└─ Go-live
```

---

## 8. Content Risk & Open Questions

### 8.1 Missing Content (⚠️ BLOCKS DEVELOPMENT)

| Item | Status | Impact | Owner Action Required |
|------|--------|--------|----------------------|
| External Coating Solutions page HTML | ❌ Missing | Cannot build B2B licensing page | Re-save page from live site OR provide content |
| Individual team bio pages | ❓ Unknown | Team detail pages referenced but not saved | Provide bios or confirm scope |

### 8.1.1 Previously Missing — Now Resolved ✅

| Item | Status | Notes |
|------|--------|-------|
| ClearTract Catheters page | ✅ Available | `CLEARTRACT CATHETERS — Silq Technologies2.html` |
| Investor Opportunities page | ✅ Available | `INVESTORS — Silq Technologies.html` |
| Rep page template | ✅ Available | `Example Rep Page — Silq Technologies.html` |
| Product brochures | ✅ Available | 4 PDFs in `Pages/Brochures/` |

### 8.2 Content Quality Concerns

| Item | Concern | Recommendation |
|------|---------|----------------|
| Team headshots | Low resolution (200-640px) | Source higher-res versions (800px+ minimum) |
| CDC Graphic | Filename suggests 2024 date | Verify statistics are current |
| Testimonials | No photos of testimonial sources | Add photos if available for credibility |
| Company description (Team page) | Very long paragraph | Condense or move to dedicated About page |

### 8.3 Strategic Questions for Owner

1. **Investor Opportunities Page:**
   - Should there be a downloadable investor deck? (PDF or gated content?)
   - Is CRM integration needed for investor leads? (HubSpot, Salesforce, Pipedrive)
   - Current form goes to email—is that sufficient or need tracking?

2. **Product Pages:**
   - Are there additional products beyond ClearTract and Coating Solutions?
   - Is there regulatory/compliance copy that must be included?
   - Are there product spec sheets or datasheets to embed?
   - **External Coating Solutions page is still missing—please provide content**

3. **Content Freshness:**
   - When was the CDC graphic data last verified?
   - Are all team members still current?
   - Any new press/awards since site was last updated?
   - Are the external links (Nature, AHRQ) still valid?

4. **Rep Page System:**
   - How many reps will need individual pages? (1, 5, 20+?)
   - Who will manage/create new rep pages? (Admin interface needed?)
   - Should rep pages be password-protected or public?
   - Is facility/hospital data up to date? (Last dated August 2025)
   - Should reps be able to edit their own page content?

5. **Brochures & Downloads:**
   - Should brochures be publicly downloadable or require contact info?
   - Are current PDFs final versions or need updates?
   - Any other documents to make available (spec sheets, whitepapers)?

6. **Analytics & Tracking:**
   - What analytics platform? (Google Analytics 4 recommended)
   - Specific conversion events to track:
     - Contact form submissions
     - Investor inquiry submissions
     - Sample request submissions
     - Brochure downloads
   - Heatmap/session recording needs? (Hotjar, FullStory)

7. **Hosting & Infrastructure:**
   - Confirm domain: silq.tech (currently on Squarespace DNS)
   - **Preference for hosting:** Vercel (recommended), DigitalOcean (owner familiar), or other?
   - Email sending service for forms? (Resend, SendGrid, or existing provider)
   - Any HIPAA considerations for form data?
   - Expected monthly traffic volume?

8. **Timeline & Priority:**
   - Is there a deadline (funding round, event, etc.)?
   - Should rep page system be Phase 1 or can it follow main site launch?

### 8.4 Assumptions Made

- Current content is approved and does not require legal review
- No e-commerce or product ordering functionality needed
- Contact form submissions can go to email (no CRM integration required initially)
- Current team members list is complete and current
- External legal pages (Privacy, Terms, Cookies) will remain on TermsFeed
- Domain (silq.tech) will remain registered via Squarespace (DNS only)
- Site will NOT be built on Squarespace platform—custom development only
- Rep page system can use static generation with JSON config (no database initially)
- Hospital/physician data (August 2025) is current enough for initial launch

---

## Appendix A: File Reference

### Pages Folder Structure
```
Pages/
├── Silq Technologies.html                              ✅ Homepage
├── Silq Technologies_files/                            (assets)
├── PLATFORM TECHNOLOGY — Silq Technologies.html        ✅ Technology
├── PLATFORM TECHNOLOGY — Silq Technologies_files/      (assets)
├── OUR TEAM — Silq Technologies.html                   ✅ Team
├── OUR TEAM — Silq Technologies_files/                 (assets)
├── Contact — Silq Technologies.html                    ✅ Contact
├── Contact — Silq Technologies_files/                  (assets)
├── CLEARTRACT CATHETERS — Silq Technologies2.html      ✅ ClearTract Product
├── CLEARTRACT CATHETERS — Silq Technologies2_files/    (assets)
├── INVESTORS — Silq Technologies.html                  ✅ Investors
├── INVESTORS — Silq Technologies_files/                (assets)
├── Example Rep Page — Silq Technologies.html           ✅ Rep Page Template
├── Example Rep Page — Silq Technologies_files/         (assets)
├── EXTERNAL COATING SOLUTIONS — Silq Technologies_files/ ⚠️ Assets only (HTML missing)
└── Brochures/
    ├── ClearTract+Patient+++MD+Testimonials.pdf        ✅ Testimonials PDF
    ├── L.SLQ011+B+Silq+ClearTract+Brochure+Bi-Fold.pdf ✅ Product Brochure
    ├── Sales+and+Marketing+for+1099+5_30_25.pdf        ✅ Sales Guide
    └── SILQ_ClearTract_Training+No+BE.pdf              ✅ Training Materials
```

### Images Folder Summary
```
Images/
├── Logos: Logo_Main_SIL+(3).png, Logo_OneLine_SIL+(2).png, Monogram_SIL_03_A.png
├── Product: boxnew.jpg, CDC+Graphic.png, Contact+Angle+Images_2.png, Screenshot+2024-09-24+...
├── Science: Droplet+Angle.jpg, Droplet1.jpg, Surface+Droplet.jpg, Surface+Droplet2.jpg
├── Textures: Textures_SIL_4.jpg, Textures_SIL_6.jpg, water5.jpg, bw.jpg, lightblue.jpg
├── Trust: fda.png, ucla.jpg, vzt_awardsupp_r_rgb_orn_pos.png, PRESSWIRE-LOGO-BLACK.png
└── UI: divider.png, various .svg icons
```

### Data Files (for Rep Page System)
```
new maps/
├── Doctors_08_2025/
│   ├── DAC_NationalDownloadableFile.csv      # Physician data
│   ├── DOC_Data_Dictionary.pdf               # Data documentation
│   ├── Facility_Affiliation.csv              # Facility links
│   └── ... (additional data files)
├── hospitals_08_2025/
│   └── ... (~50+ CSV files with hospital data)
├── html6.py                                   # Data processing script
└── TargetList2.py                             # Territory targeting script
```

### Video Assets
```
Videos (embedded/referenced):
├── Vimeo 869354523 - "Silq Technologies Overview ClearTract"  (Homepage, ClearTract page)
├── Vimeo 1105287849 - "Silq Coating Dye Test"                 (Rep Page template)
└── cleartract_catheter_patient_experience.mp4                 (Rep Page template - native)
```

---

## Appendix B: Domain & Hosting Notes

### Current Setup
- **Domain:** silq.tech
- **Domain Registrar/DNS:** Squarespace (will remain for DNS management only)
- **Current Hosting:** Squarespace (NOT to be used for new development)

### Recommended Migration Path
1. Build new site on chosen platform (Vercel/DigitalOcean/Cloudflare)
2. Test on staging URL (e.g., silq-new.vercel.app)
3. When ready to launch:
   - Log into Squarespace Domains
   - Update DNS records to point to new hosting provider
   - Keep Squarespace only for domain management (or transfer domain if preferred)

### DNS Records Needed (Example for Vercel)
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### SSL
All recommended hosting providers (Vercel, DigitalOcean, Cloudflare, Netlify) provide free automatic SSL certificates.

---

**END OF DOCUMENT**

*This plan is ready for developer implementation. The only outstanding content item is the External Coating Solutions page (HTML missing). All other pages and assets are available for build.*

**Version History:**
- v1.0 (Feb 6, 2026): Initial audit and plan
- v2.0 (Feb 6, 2026): Added ClearTract, Investors, Rep Page template; hosting recommendations; updated file inventory
