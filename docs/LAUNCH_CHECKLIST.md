# Silq.tech Launch Checklist & Email Setup Guide

## 🚨 CRITICAL BUGS TO FIX BEFORE LAUNCH

### Bug #1: Contact Form Not Sending to API
**File:** `src/components/sections/ContactForm.tsx`

The contact form currently does NOT send data to the API. It uses a fake delay instead of actually submitting.

**Current Code (Lines 38-48):**
```tsx
const onSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true)
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // ❌ FAKE - doesn't send data!
    setIsSubmitted(true)
    reset()
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    setIsSubmitting(false)
  }
}
```

**Fixed Code:**
```tsx
const onSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true)
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit form')
    }
    
    setIsSubmitted(true)
    reset()
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('There was an error submitting your message. Please try again or email us directly at info@silq.tech')
  } finally {
    setIsSubmitting(false)
  }
}
```

---

### Bug #2: Investor Form Not Sending to API
**File:** `src/components/sections/InvestorForm.tsx`

Same issue as ContactForm - doesn't actually send data.

**Current Code (Lines 38-48):**
```tsx
const onSubmit = async (data: InvestorFormData) => {
  setIsSubmitting(true)
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // ❌ FAKE - doesn't send data!
    setIsSubmitted(true)
    reset()
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    setIsSubmitting(false)
  }
}
```

**Fixed Code:**
```tsx
const onSubmit = async (data: InvestorFormData) => {
  setIsSubmitting(true)
  try {
    const response = await fetch('/api/investor-inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit form')
    }
    
    setIsSubmitted(true)
    reset()
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('There was an error submitting your inquiry. Please try again or email us directly at info@silq.tech')
  } finally {
    setIsSubmitting(false)
  }
}
```

---

## 📧 EMAIL SETUP - Step by Step

Your DNS already has the Resend records configured! You just need to verify the domain and get the API key.

### Step 1: Create/Login to Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up or log in

### Step 2: Verify Your Domain

1. In Resend dashboard, go to **Domains** → **Add Domain**
2. Enter: `silq.tech`
3. Resend will show you DNS records to add

**Good news:** Based on your DNS settings, you ALREADY have these records configured:

| Record Type | Host | Value |
|-------------|------|-------|
| TXT | `resend._domainkey` | ✅ Already configured |
| MX | `send` | ✅ `feedback-smtp.us-east-1.amazonses.com` |
| TXT | `send` | ✅ `v=spf1 include:amazonses.com ~all` |

4. Click **Verify** in Resend - it should verify immediately since records exist

### Step 3: Get Your API Key

1. In Resend dashboard, go to **API Keys** → **Create API Key**
2. Name it: `silq-website-production`
3. Permissions: **Sending access**
4. Copy the API key (starts with `re_...`)

**⚠️ IMPORTANT:** Save this key securely - you won't see it again!

### Step 4: Configure Digital Ocean Environment Variables

1. Go to [Digital Ocean App Platform](https://cloud.digitalocean.com/apps)
2. Select your **silq-website** app
3. Go to **Settings** → **App-Level Environment Variables**
4. Click **Edit** and add these variables:

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | `re_xxxxx...` (your API key from Step 3) |
| `EMAIL_FROM` | `Silq Website <noreply@silq.tech>` |
| `CONTACT_EMAIL_RECIPIENTS` | `ethanr@silq.tech,brianm@silq.tech,chuckg@silq.tech` |

5. Click **Save**
6. The app will automatically redeploy with the new settings

### Step 5: Test the Forms

1. Go to your staging URL or `silq.tech/contact`
2. Submit a test message
3. Check if emails arrive at the recipient addresses
4. Also check Digital Ocean logs for any errors:
   - Go to your app → **Runtime Logs**

---

## 🌐 DOMAIN CONFIGURATION FOR silq.tech

### Current Status
Your domain `silq.tech` is currently pointing to Squarespace. You need to redirect it to Digital Ocean.

### Option A: Point silq.tech directly to Digital Ocean (Recommended)

1. In **Digital Ocean App Platform**:
   - Go to your app → **Settings** → **Domains**
   - Click **Add Domain**
   - Enter: `silq.tech`
   - Also add: `www.silq.tech`
   - Digital Ocean will show you the required DNS records

2. In **Squarespace DNS Settings**:
   - Delete or modify the existing **Squarespace Defaults** A records
   - Add new records per Digital Ocean instructions (usually a CNAME or A record)

**Typical Digital Ocean DNS setup:**

| Type | Host | Value |
|------|------|-------|
| CNAME | `@` | `your-app.ondigitalocean.app` |
| CNAME | `www` | `your-app.ondigitalocean.app` |

OR (if Digital Ocean requires A records):

| Type | Host | Value |
|------|------|-------|
| A | `@` | `[Digital Ocean IP]` |
| CNAME | `www` | `silq.tech` |

### Option B: Keep Squarespace, proxy to Digital Ocean
Not recommended - adds complexity and potential latency.

---

## ✅ PRE-LAUNCH CHECKLIST

### Code Fixes
- [ ] Fix ContactForm to call `/api/contact`
- [ ] Fix InvestorForm to call `/api/investor-inquiry`
- [ ] Push fixes to main branch
- [ ] Verify deployment completes successfully

### Email Setup
- [ ] Verify silq.tech domain in Resend
- [ ] Create API key in Resend
- [ ] Add `RESEND_API_KEY` to Digital Ocean
- [ ] Add `EMAIL_FROM` to Digital Ocean
- [ ] Add `CONTACT_EMAIL_RECIPIENTS` to Digital Ocean
- [ ] Test contact form submission
- [ ] Test investor inquiry form submission
- [ ] Verify emails are received

### DNS Configuration
- [ ] Add silq.tech domain to Digital Ocean app
- [ ] Add www.silq.tech domain to Digital Ocean app
- [ ] Update Squarespace DNS to point to Digital Ocean
- [ ] Wait for DNS propagation (up to 48 hours, usually faster)
- [ ] Verify SSL certificate is issued

### Final Verification
- [ ] Test all pages load correctly on silq.tech
- [ ] Test contact form on production
- [ ] Test investor inquiry form on production
- [ ] Test mobile responsiveness
- [ ] Check all images load
- [ ] Verify header logo displays correctly
- [ ] Check footer links work
- [ ] Test rep directory pages

---

## 🔧 QUICK FIX COMMANDS

After the dev agent fixes the form bugs, deploy with:

```bash
cd silq-website
git add -A
git commit -m "Fix contact and investor forms to call API endpoints"
git push origin main
git push origin main:staging --force
```

---

## 📞 TROUBLESHOOTING

### Forms not sending emails
1. Check Digital Ocean Runtime Logs for errors
2. Verify `RESEND_API_KEY` is set correctly (no extra spaces)
3. Verify domain is verified in Resend dashboard
4. Check that `EMAIL_FROM` uses a verified domain (silq.tech)

### Domain not resolving
1. Use [https://dnschecker.org](https://dnschecker.org) to check propagation
2. Verify DNS records are correct in Squarespace
3. Wait up to 48 hours for full propagation

### SSL Certificate errors
1. Digital Ocean auto-provisions SSL via Let's Encrypt
2. May take a few minutes after DNS propagates
3. If stuck, try removing and re-adding the domain in Digital Ocean

---

## 📋 DNS RECORDS TO KEEP

When updating DNS for Digital Ocean, **KEEP** these existing records:

| Purpose | Records to KEEP |
|---------|-----------------|
| Google Workspace Email | All MX records pointing to `*.google.com` |
| Resend Email Sending | `resend._domainkey`, `send` MX, `send` TXT |
| Google Site Verification | TXT records with `google-site-verification=...` |
| DKIM for Google | `google._domainkey` TXT record |

**REMOVE/MODIFY** these records:

| Record | Action |
|--------|--------|
| Squarespace A records (198.x.x.x) | Remove or replace with Digital Ocean |
| `www` CNAME to Squarespace | Update to point to Digital Ocean |
| `_domainconnect` CNAME | Can keep or remove (Squarespace-specific) |
