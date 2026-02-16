# Silq Technologies Website

A modern, investor-grade medical device company website built with Next.js 14, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Navigate to the project directory:
   ```bash
   cd silq-website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up images (see [Image Setup](#image-setup) below)

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Image Setup

The website expects images in the `public/images/` directory. Copy images from the existing assets:

### Required Directory Structure

```
public/
├── images/
│   ├── logos/
│   │   ├── logo-main.png        # Main logo (header)
│   │   └── logo-oneline.png     # One-line logo (footer)
│   ├── products/
│   │   ├── boxnew.jpg           # ClearTract packaging
│   │   └── cleartract-hero.png  # Product hero image
│   ├── team/
│   │   ├── verne-sharma.jpg
│   │   ├── jack-kavanaugh.jpg
│   │   ├── richard-kaner.jpg
│   │   ├── brian-mcverry.jpg
│   │   ├── mahi-desilva.jpg
│   │   └── robert-snukal.jpg
│   ├── textures/
│   │   ├── texture-hero.jpg     # Homepage hero background
│   │   ├── texture-tech.jpg     # Technology page background
│   │   ├── texture-lab.jpg      # Lab/research image
│   │   └── texture-coating.jpg  # Coating solutions background
│   ├── science/
│   │   ├── zwitterion.jpg       # Molecular diagram
│   │   ├── droplet-angle.jpg    # Surface contact angle
│   │   └── contact-angle.png    # Contact angle demonstration
│   ├── trust/
│   │   ├── fda.png              # FDA clearance badge
│   │   ├── ucla.jpg             # UCLA logo
│   │   └── verizon-award.png    # Verizon award badge
│   └── ui/
│       └── divider.png          # Decorative divider
└── favicon.ico
```

### Copying from Existing Assets

From the project root (Webdev folder), copy the images:

```bash
# Create directories
mkdir -p silq-website/public/images/{logos,products,team,textures,science,trust,ui}

# Copy logos
cp "Images/Logo_Main_SIL+%283%29.png.webp" silq-website/public/images/logos/logo-main.png
cp "Images/Logo_OneLine_SIL+%282%29.png.webp" silq-website/public/images/logos/logo-oneline.png

# Copy product images
cp "Images/boxnew.jpg.jpeg" silq-website/public/images/products/boxnew.jpg

# Copy team photos (from Pages/_files folders)
# [Team photos need to be copied from OUR TEAM folder]

# Copy textures
cp "Images/Textures_SIL_6.jpg.jpeg" silq-website/public/images/textures/texture-hero.jpg
cp "Images/Textures_SIL_4.jpg.jpeg" silq-website/public/images/textures/texture-tech.jpg
cp "Images/water5.jpg.jpeg" silq-website/public/images/textures/texture-coating.jpg

# Copy science images
cp "Images/Droplet+Angle.jpg.jpeg" silq-website/public/images/science/droplet-angle.jpg

# Copy trust badges
cp "Images/fda.png" silq-website/public/images/trust/fda.png
cp "Images/ucla.jpg.webp" silq-website/public/images/trust/ucla.jpg
cp "Images/vzt_awardsupp_r_rgb_orn_pos.png" silq-website/public/images/trust/verizon-award.png

# Copy UI elements
cp "Images/divider.png" silq-website/public/images/ui/divider.png

# Copy favicon
cp "Images/favicon.ico.png" silq-website/public/favicon.ico
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Global layout
│   ├── globals.css                 # Global styles
│   ├── not-found.tsx              # 404 page
│   ├── technology/
│   │   └── page.tsx               # Platform Technology
│   ├── products/
│   │   ├── page.tsx               # Products overview
│   │   ├── cleartract/
│   │   │   └── page.tsx           # ClearTract Catheters
│   │   └── coating-solutions/
│   │       └── page.tsx           # External Coating Solutions
│   ├── about/
│   │   ├── team/
│   │   │   └── page.tsx           # Our Team
│   │   └── investors/
│   │       └── page.tsx           # Investor Opportunities
│   ├── contact/
│   │   └── page.tsx               # Contact form
│   └── api/
│       ├── contact/
│       │   └── route.ts           # Contact form API
│       └── investor-inquiry/
│           └── route.ts           # Investor form API
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
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
│   │   ├── CTABanner.tsx
│   │   └── Accordion.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       └── VideoEmbed.tsx
└── lib/
    └── utils.ts
```

## Key Features

- **Responsive Design:** Mobile-first approach, works on all devices
- **Accessibility:** WCAG 2.1 AA compliant with skip links, ARIA labels, and keyboard navigation
- **Performance:** Optimized images, lazy loading, and minimal JavaScript
- **SEO:** Meta tags, semantic HTML, and proper heading hierarchy
- **Forms:** Validated forms with success states and error handling
- **Animations:** Smooth scroll-triggered animations with Framer Motion

## Environment Variables

For form submissions, you'll need to configure email services:

```env
# .env.local
RESEND_API_KEY=your_resend_api_key
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Deploy automatically

### Other Platforms

Build the production version:
```bash
npm run build
npm run start
```

## DNS Configuration

To point silq.tech to your hosting:

### Vercel
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### Cloudflare Pages
Follow Cloudflare's custom domain setup instructions.

## License

Proprietary - Silq Technologies

## Support

For technical issues, contact the development team.
