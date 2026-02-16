# Dev Agent Prompt: System Verification, Bug Fixes & Deployment Prep

**Priority:** 🔴 CRITICAL  
**Created:** 2026-02-16  
**Status:** Ready for Implementation

---

## Overview

This prompt addresses three critical areas:
1. **System Verification** - Ensure all pages function properly at `http://localhost:3000/`
2. **Feature Enhancements** - Surface Treatment Services section improvements
3. **Deployment Preparation** - Set up email functionality and deployment to Digital Ocean

---

## PART 1: SYSTEM VERIFICATION & BUG FIXES

### Step 1: Start the Development Server

The dev server may not be running. Start it on port 3000:

```bash
cd C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website

# Clear any corrupted cache first
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Start the development server
npm run dev
```

The server should start at `http://localhost:3000`. If port 3000 is in use, Next.js will try 3001, 3002, etc. To force port 3000:

```bash
# Kill any process on port 3000 first (if needed)
npx kill-port 3000

# Then start
npm run dev
```

### Step 2: Verify All Page Routes

Test each route manually or with automated checks:

| Route | Expected Behavior |
|-------|-------------------|
| `/` | Homepage with hero, features, ClearTract section, testimonials, news |
| `/technology` | Technology platform page |
| `/products` | Products index with ClearTract and Surface Treatment cards |
| `/products/cleartract` | ClearTract product page |
| `/products/surface-treatment` | Surface Treatment services page |
| `/about/team` | Team page with member grid |
| `/about/investors` | Investor information and inquiry form |
| `/contact` | Contact form page |
| `/rep` | Rep directory listing all territories |
| `/rep/[slug]` | Individual rep pages (e.g., `/rep/proactive`, `/rep/zenecare-llc`) |

### Step 3: Verify Rep Pages Load Correctly

Rep pages fetch data from `/data/reps/[slug].json`. Verify:

1. The manifest file exists at `public/data/rep-manifest.json`
2. Individual rep JSON files exist in `public/data/reps/`
3. Test a few rep pages:
   - `http://localhost:3000/rep/proactive`
   - `http://localhost:3000/rep/zenecare-llc`
   - `http://localhost:3000/rep/jh-medical`

**If rep pages show "Territory Not Found":**
- Check browser dev tools Network tab for 404 errors on JSON files
- Verify file permissions
- Check the fetch URL matches the file path

### Step 4: Check for Console Errors

Open browser developer tools (F12) and check for:
- JavaScript errors
- Failed network requests
- React hydration warnings

Fix any errors found.

---

## PART 2: SURFACE TREATMENT SERVICES ENHANCEMENT

### Enhancement: Improve Surface Treatment Teaser on Homepage

**File:** `src/app/page.tsx`

The current Surface Treatment Services section (Section 4) is minimal. Enhance it with more compelling visuals and information.

**Current (lines 343-365):**
```jsx
<section className="section-padding bg-silq-cream">
  <div className="container-silq">
    <div className="max-w-4xl mx-auto text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
        For Medical Device Manufacturers
      </p>
      <h2 className="text-display-sm font-bold text-silq-dark mb-4">
        Surface Treatment Services
      </h2>
      <p className="text-silq-dark/70 mb-8 max-w-2xl mx-auto">
        License our patented zwitterionic technology for your products. Scalable manufacturing, FDA-cleared platform, customizable surface properties.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link href="/products/surface-treatment">
          <Button variant="primary" size="lg">Learn About Partnerships</Button>
        </Link>
        <Link href="/technology">
          <Button variant="secondary" size="lg">View Platform Technology</Button>
        </Link>
      </div>
    </div>
  </div>
</section>
```

**Replace with enhanced version:**
```jsx
<section className="section-padding bg-silq-cream relative overflow-hidden">
  {/* Subtle background pattern */}
  <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1E4A6D 1px, transparent 0)', backgroundSize: '40px 40px' }} />
  </div>
  
  <div className="container-silq relative">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left: Content */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
          B2B Partnerships
        </span>
        <h2 className="text-display-sm font-bold text-silq-dark mb-4">
          Surface Treatment Services
        </h2>
        <p className="text-silq-dark/70 mb-6">
          Bring our proven antibiofouling technology to your medical devices. We offer contract surface treatment services with customizable properties for various substrates.
        </p>
        
        {/* Key capabilities grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: '🔬', label: 'Custom Formulations' },
            { icon: '📏', label: 'Multi-Substrate' },
            { icon: '🏭', label: 'Scalable Production' },
            { icon: '✓', label: 'FDA Platform' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-silq-dark/80">
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Link href="/products/surface-treatment">
            <Button variant="primary" size="lg">Explore Partnership</Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary" size="lg">Contact Us</Button>
          </Link>
        </div>
      </motion.div>
      
      {/* Right: Visual */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="rounded-2xl overflow-hidden shadow-xl bg-white">
          <Image 
            src="/images/science/silq-machine.gif"
            alt="Silq surface treatment process"
            width={500}
            height={400}
            className="w-full object-cover"
          />
          <div className="p-4 bg-gradient-to-r from-silq-blue to-silq-teal text-white">
            <p className="text-sm font-medium">Scalable Treatment Process</p>
            <p className="text-xs text-white/70">In-house manufacturing capability</p>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>
```

**Don't forget to import `Image` from `next/image` if not already at the top of the file.**

---

## PART 3: CONTACT FORM EMAIL FUNCTIONALITY

### Current State

The contact form API route (`src/app/api/contact/route.ts`) currently only logs submissions to the console. We need to send actual emails.

### Step 1: Install Resend

Resend is a modern email API that works well with Next.js.

```bash
cd C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website
npm install resend
```

### Step 2: Create Environment Variables

Create a `.env.local` file in the project root (this file is gitignored):

```env
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL_RECIPIENTS=ethanr@silq.tech,brianm@silq.tech
```

**Note:** The Resend API key will need to be obtained from https://resend.com/. 

### Step 3: Update Contact API Route

**File:** `src/app/api/contact/route.ts`

**Replace entire file with:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Parse recipients from env (comma-separated)
const getRecipients = () => {
  const recipients = process.env.CONTACT_EMAIL_RECIPIENTS || 'ethanr@silq.tech,brianm@silq.tech'
  return recipients.split(',').map(email => email.trim())
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, phone, message, inquiryType } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const recipients = getRecipients()

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Silq Website <noreply@silq.tech>',
      to: recipients,
      replyTo: email,
      subject: `New Contact Form: ${inquiryType || 'General Inquiry'} from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1E4A6D 0%, #2D5F7E 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 16px; }
            .label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { font-size: 15px; color: #1a1a1a; margin-top: 4px; }
            .message-box { background: white; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb; margin-top: 8px; }
            .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 20px;">New Contact Form Submission</h1>
              <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">${inquiryType || 'General Inquiry'}</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              ${company ? `
              <div class="field">
                <div class="label">Company</div>
                <div class="value">${company}</div>
              </div>
              ` : ''}
              ${phone ? `
              <div class="field">
                <div class="label">Phone</div>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">Message</div>
                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
              </div>
              <div class="footer">
                <p>Submitted from silq.tech contact form</p>
                <p>Reply directly to this email to respond to ${name}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', data)

    return NextResponse.json(
      { success: true, message: 'Form submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Step 4: Update Investor Form API (if exists)

**File:** `src/app/api/investor-inquiry/route.ts`

Apply similar changes to send emails for investor inquiries.

---

## PART 4: IMAGE PLACEHOLDER PLAN

### Current Placeholders Needing Real Images

Review these placeholder locations and plan for image replacement:

| Location | File | Current State | Image Needed |
|----------|------|---------------|--------------|
| Products Page | `products/page.tsx` | `ImagePlaceholder` for Surface Treatment | Professional surface treatment image or process photo |
| Investors Page | `about/investors/page.tsx` | Manufacturing facility placeholder | Cleanroom/manufacturing photos |
| Technology Page | `technology/page.tsx` | Various placeholders | Contact angle diagrams, process images |

### Image Specifications

For best results on the website:
- **Hero images:** 1920x1080 min, WebP or optimized JPG
- **Product images:** 800x800, square aspect ratio
- **Science/process images:** 1200x800, maintain legibility
- **Team photos:** 600x600, square, professional headshots

### To Replace Placeholders

1. Add new images to `public/images/` in appropriate subfolders
2. Update the component to use `<Image src="/images/your-image.jpg" ...>`
3. Remove `<ImagePlaceholder>` component usage

---

## PART 5: DEPLOYMENT PREPARATION

### Deployment Strategy: GitHub + Digital Ocean App Platform

This setup provides:
- Automated deployments on git push
- Staging environment for review before production
- Easy rollback capability

### Step 1: Initialize Git Repository (if not done)

```bash
cd C:\Users\Ethan\OneDrive\Desktop\Webdev\silq-website

# Initialize git if not already
git init

# Create .gitignore if it doesn't exist
```

Ensure `.gitignore` includes:
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### Step 2: Push to GitHub Repository

The repository has already been created at: **https://github.com/Ethan-Rao/Silqtech**

```bash
# Add GitHub as remote
git remote add origin https://github.com/Ethan-Rao/Silqtech.git

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Silq Technologies website"

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** If you get authentication errors, you may need to:
- Use GitHub CLI: `gh auth login`
- Or create a Personal Access Token at https://github.com/settings/tokens

### Step 3: Set Up Digital Ocean App Platform

1. **Create Digital Ocean Account** (if not exists)
   - Go to https://cloud.digitalocean.com/

2. **Create New App**
   - Navigate to App Platform
   - Click "Create App"
   - Select "GitHub" as source
   - Authorize Digital Ocean to access your GitHub
   - Select `Ethan-Rao/Silqtech` repository

3. **Configure Build Settings**
   ```yaml
   Build Command: npm run build
   Run Command: npm run start
   Node Version: 18 (or 20)
   ```

4. **Environment Variables** (Add in DO dashboard)
   ```
   RESEND_API_KEY=re_your_api_key
   CONTACT_EMAIL_RECIPIENTS=ethanr@silq.tech,brianm@silq.tech
   NODE_ENV=production
   ```

5. **Create Staging Branch**
   ```bash
   git checkout -b staging
   git push -u origin staging
   ```

6. **Set Up Two Apps in Digital Ocean**
   
   **App 1: Staging**
   - Name: `silq-website-staging`
   - Branch: `staging`
   - Auto-deploy: enabled
   - URL will be something like: `silq-website-staging-xxxxx.ondigitalocean.app`
   
   **App 2: Production**
   - Name: `silq-website-production`
   - Branch: `main`
   - Auto-deploy: enabled (or manual for more control)
   - URL: Configure custom domain `silq.tech` later

### Step 4: Deployment Workflow

**For changes:**
1. Make changes locally
2. Commit and push to `staging` branch
3. Review at staging URL
4. When approved, merge to `main`:
   ```bash
   git checkout main
   git merge staging
   git push origin main
   ```
5. Production auto-deploys (or manually trigger)

### Step 5: Configure Custom Domain (Later)

When ready to go live on `silq.tech`:
1. In DO App Platform, go to Settings > Domains
2. Add `silq.tech` as custom domain
3. Add DNS records:
   - CNAME: `www` → `your-app.ondigitalocean.app`
   - A record: `@` → Digital Ocean's IP (provided in dashboard)
4. Enable automatic SSL certificate

---

## PART 6: CODE CLEANUP

### Delete Unused Components

These components are not imported anywhere:

```bash
# Delete unused files
rm src/components/ui/VideoPlayer.tsx
rm src/components/ui/Badge.tsx
```

### Update UI Index

**File:** `src/components/ui/index.ts`

```typescript
export { Button } from './Button'
export { Card, CardHeader, CardContent, CardFooter } from './Card'
export { VideoEmbed } from './VideoEmbed'
```

(Remove Badge and VideoPlayer exports)

### Check for Other Dead Code

Run this to find potentially unused exports:
```bash
# Search for unused imports/exports
npx knip
```

Or manually review files in `src/components/` to ensure each is used.

---

## FINAL CHECKLIST

After completing all steps, verify:

- [ ] Development server runs at `http://localhost:3000/`
- [ ] All public pages load without errors
- [ ] All rep pages load their JSON data correctly
- [ ] Interactive map displays facility markers
- [ ] Contact form submission works (test with console log first, then email)
- [ ] Surface Treatment section enhanced on homepage
- [ ] GitHub repository created and code pushed
- [ ] Digital Ocean staging app deployed
- [ ] Staging URL accessible and functional
- [ ] No console errors in browser dev tools
- [ ] Mobile responsiveness verified
- [ ] Build succeeds: `npm run build`

---

## NEXT STEPS FOR USER

After the dev agent completes this work, provide the user with:

1. **Staging URL** - The Digital Ocean staging app URL
2. **GitHub Repository** - https://github.com/Ethan-Rao/Silqtech
3. **Instructions for:**
   - How to add/update testimonials
   - How to add new rep data
   - How to add news items
   - How to deploy changes
4. **Resend Setup** - Instructions to create Resend account and add API key
5. **Domain Configuration** - Steps to point `silq.tech` to the production app when ready

---

## TROUBLESHOOTING

### If `npm run dev` fails:
1. Delete `node_modules` and `.next`
2. Run `npm install`
3. Try again

### If rep pages show 404:
1. Verify JSON files exist in `public/data/reps/`
2. Check file names match slugs in manifest
3. Clear browser cache

### If styles look broken:
1. Delete `.next` folder
2. Restart dev server

### If deployment fails:
1. Check build logs in Digital Ocean
2. Verify all environment variables are set
3. Ensure no TypeScript errors: `npm run build`
