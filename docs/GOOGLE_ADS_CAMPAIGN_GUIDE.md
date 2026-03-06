# Google Ads Campaign Guide for Silq Technologies
## ClearTract® Foley Catheter - Patient & Physician Acquisition

---

## Your Account Information

**Account Name:** Silq Technologies  
**Account ID:** 721-451-6564  
**Website:** silq.tech (NEW - previously ran campaigns for old site)

---

## Campaign Overview

**Objective:** Generate leads (contact form submissions, phone calls) from:
1. **Catheter patients** (or their caregivers) seeking better catheter solutions
2. **Physicians/urologists** interested in superior catheter technology

**Daily Budget:** $10-$20/day (monthly: ~$300-$600)

**Primary Conversion Actions:**
- Contact form submissions
- Phone call clicks
- "Patient Ordering" / "Healthcare Facility Ordering" button clicks

---

## Part 1: Account Preparation

### Step 1: Log Into Your Existing Account

1. Go to [ads.google.com](https://ads.google.com)
2. Sign in with your existing credentials
3. Verify you see account **721-451-6564** (Silq Technologies)

### Step 2: Verify/Update Billing

1. Click the **Tools** icon (wrench) or gear icon
2. Go to **Billing & payments**
3. Ensure your payment method is current

### Step 3: Update Conversion Tracking for New Site

Since you're now using silq.tech (new site), you'll want to verify your conversion tracking:

1. Click **Tools** → **Conversions** (or **Goals** → **Conversions**)
2. Check if you have existing conversion actions
3. If conversions exist from old site, you may need to update them

**Create/Verify These Conversion Actions:**

| Conversion Name | Category | What It Tracks |
|-----------------|----------|----------------|
| Contact Form Submission | Lead form | Form completions on /contact |
| Phone Call Click | Phone call | Clicks on phone number |
| Ordering Button Click | Other | Clicks on ordering buttons |

**To Create a New Conversion:**
1. Click **+ New conversion action**
2. Select **Website**
3. Choose **Manual setup** (simpler)
4. Fill in:
   - Name: e.g., "Contact Form Submission"
   - Category: "Submit lead form"
   - Value: Don't use a value (or $50 estimated)
   - Count: One per user
5. Copy the Conversion ID and Label for GTM setup

---

## Part 2: Setting Up Conversion Tags in Google Tag Manager

You already have GTM installed on the site (GTM-WW5WDN4T). Now connect your conversions.

### Access Your GTM Container

1. Go to [tagmanager.google.com](https://tagmanager.google.com)
2. Select container: **www.Silq.tech** (GTM-WW5WDN4T)
3. You already have some tags set up (I can see from your screenshot):
   - GA4 Configuration ✓
   - Conversion Linker ✓
   - Google Ads Conversion Tracking for Form Submission (not firing yet)

### Configure the Form Submission Conversion Tag

Based on your screenshot, you have a tag "Google Ads Conversion Tracking for Form Submission" that's not firing. Let's fix that:

1. Click on the tag **"Google Ads Conversion Tracking for Form Submission"**
2. Verify the **Conversion ID** and **Conversion Label** match what's in Google Ads
3. Check the **Trigger** — it should fire on a custom event

**Create the Trigger (if not exists):**
1. Go to **Triggers** → **New**
2. Trigger Type: **Custom Event**
3. Event name: `form_submission_success`
4. Name it: "Form Submission Success Event"
5. Save

4. Attach this trigger to your conversion tag
5. Click **Submit** (top right) to publish changes

---

## Part 3: Create Your Campaigns

### Smart Campaign Setup (Simpler Interface)

Since you prefer the standard view, here's how to create effective campaigns:

### Campaign 1: ClearTract for Patients

1. Click **+ New campaign**
2. Select goal: **Get more website leads** or **Get more calls**
3. Enter your website: `silq.tech`
4. Google will scan your site automatically

**Business Info:**
- Business name: Silq Technologies
- Business category: Medical devices / Healthcare

**Ad Setup:**
- Google will suggest headlines and descriptions
- Customize with these high-performing options:

**Headlines to Use:**
```
FDA-Cleared Catheter Technology
Reduce Catheter Infections
Drug-Free UTI Prevention
ClearTract® Foley Catheters
Stop Recurring Catheter UTIs
No More Catheter Blockages
UCLA-Developed Technology
Patients Report Life-Changing Results
Antibiotic-Free Solution
Request Information Today
```

**Descriptions to Use:**
```
Advanced coating resists bacteria & biofilm. FDA cleared. Real patient testimonials. Contact us for samples.

Tired of catheter infections? ClearTract uses proven technology to reduce UTIs & encrustation. Samples available.

Drug-free surface treatment reduces infection & improves comfort. See why patients are switching to ClearTract.
```

**Keywords/Themes to Add:**
When prompted for keywords or business themes, include:
- catheter infection prevention
- foley catheter UTI
- reduce catheter infections
- comfortable catheter
- suprapubic catheter infection
- long term catheter
- catheter that prevents infection
- biofilm resistant catheter

**Budget:** $10/day

**Location:** United States

### Campaign 2: ClearTract for Healthcare Professionals

Create a second campaign targeting medical professionals:

**Headlines:**
```
Reduce CAUTI in Your Practice
FDA 510(k) Cleared Catheters
Premier GPO Contract Available
Vizient Contract Member
Zwitterionic Surface Technology
Samples for Clinical Evaluation
Published Peer-Reviewed Research
Improve Patient Outcomes
```

**Descriptions:**
```
ClearTract® with proven antibiofouling technology. Reduce infection rates & improve outcomes. Request samples for evaluation.

UCLA-developed zwitterionic coating. GPO contracts with Premier & Vizient. Contact us for facility ordering information.
```

**Keywords/Themes:**
- CAUTI prevention
- catheter for urology practice
- hospital catheter procurement
- reduce catheter associated UTI
- biofilm resistant catheter
- advanced foley catheter

**Budget:** $7/day

---

## Part 4: Negative Keywords (Important!)

Add these to prevent wasting money on irrelevant clicks:

1. Go to your campaign
2. Find **Keywords** → **Negative keywords**
3. Add these:

```
job
jobs
hiring
career
salary
nurse training
how to insert catheter
catheter insertion video
catheter insertion training
certification
wholesale
bulk order
manufacturer jobs
catheter manufacturer
```

---

## Part 5: Monitor & Optimize

### Weekly Check-In (15 minutes)

1. **Log into Google Ads**
2. **Check Key Metrics:**
   - Clicks: Are people clicking?
   - Conversions: Are they filling out forms?
   - Cost per conversion: Is it reasonable? (Target: under $75)
   
3. **Review Search Terms:**
   - Go to **Keywords** → **Search terms**
   - Add irrelevant terms as negative keywords
   - Add high-performing terms as keywords

### What Good Performance Looks Like

| Metric | Good | Needs Work |
|--------|------|------------|
| Click-through rate (CTR) | >3% | <2% |
| Cost per click | <$8 | >$12 |
| Conversion rate | >2% | <1% |
| Cost per conversion | <$75 | >$150 |

### First Two Weeks: Learning Phase

- **Don't make major changes** — let Google learn
- Just monitor for obvious issues (no conversions = tracking problem)
- Check that your site is loading properly from ad clicks

### After Two Weeks: Optimize

- Pause low-performing keywords
- Increase budget on what's working
- Test new ad copy

---

## Part 6: Quick Reference - Your Setup

### Google Tag Manager (GTM)
- **Container ID:** GTM-WW5WDN4T
- **Container Name:** www.Silq.tech
- **Tags Already Set Up:**
  - GA4 Configuration (firing ✓)
  - Conversion Linker (firing ✓)
  - Google Ads Conversion Tracking for Form Submission (needs trigger)

### Google Analytics 4 (GA4)
- **Property ID:** G-V2YQCJ9QD1

### Conversion Tracking Event
The website now pushes this event when forms submit:
```javascript
dataLayer.push({
  event: 'form_submission_success',
  form_type: 'contact', // or 'investor'
  form_location: '/contact'
});
```

Use this to trigger your conversion tags in GTM.

---

## Part 7: Troubleshooting

### "Conversion Tag Not Firing"

1. Open GTM Preview mode (Preview button in GTM)
2. Go to silq.tech/contact in a new tab
3. Submit a test form
4. Check GTM debugger — does `form_submission_success` appear?
5. If yes → Check your tag's trigger configuration
6. If no → The website code may need verification

### "No Conversions Showing in Google Ads"

- Conversions can take 24-48 hours to appear
- Verify the Conversion ID/Label in GTM matches Google Ads
- Test with GTM Preview mode

### "Ads Not Getting Impressions"

- Check if campaigns are enabled (not paused)
- Verify billing is active
- Budget may be too low for competitive keywords
- Check if ads are approved (can take 24 hours)

---

## Appendix: Ready-to-Use Ad Copy

### For Patients

**Headline Options:**
1. FDA-Cleared Catheter Technology
2. Reduce Catheter Infections
3. Drug-Free UTI Prevention
4. ClearTract® Foley Catheters
5. Stop Recurring Catheter UTIs
6. No More Catheter Blockages
7. UCLA-Developed Innovation
8. Life-Changing Results
9. Antibiotic-Free Solution
10. Real Patient Testimonials

**Description Options:**
1. Advanced zwitterionic coating resists bacteria & biofilm. FDA cleared. Contact us today for samples and information.
2. Tired of infections? ClearTract uses proven drug-free technology. Patients report dramatic improvement. Learn more.
3. No more chronic UTIs. No more frequent changes. ClearTract technology works. Request information now.

### For Healthcare Professionals

**Headline Options:**
1. Reduce CAUTI Rates Now
2. FDA 510(k) Cleared Device
3. Premier GPO Contract
4. Vizient Contract Available
5. Zwitterionic Technology
6. Published Research
7. Samples Available
8. Improve Patient Outcomes
9. Advanced Foley Catheter
10. Clinical Evidence

**Description Options:**
1. ClearTract® with proven antibiofouling technology. GPO contracts available. Request samples for clinical evaluation.
2. UCLA-developed coating published in Advanced Materials. Reduce infection & encrustation. Contact for facility pricing.

---

## Next Steps Checklist

### Immediate (Today)
- [ ] Log into Google Ads (721-451-6564)
- [ ] Verify/update billing information
- [ ] Check existing conversion actions

### This Week
- [ ] Set up conversion trigger in GTM for `form_submission_success`
- [ ] Create Patient campaign ($10/day)
- [ ] Create Healthcare Professional campaign ($7/day)
- [ ] Add negative keywords

### Ongoing
- [ ] Monitor weekly (15 min)
- [ ] Review search terms report
- [ ] Add negative keywords as needed
- [ ] Adjust budgets based on performance

---

*Document updated: March 5, 2026*  
*Account: Silq Technologies (721-451-6564)*  
*Website: silq.tech*
