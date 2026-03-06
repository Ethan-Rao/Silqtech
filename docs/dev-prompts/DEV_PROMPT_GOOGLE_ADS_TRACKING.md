# Dev Prompt: Google Ads Conversion Tracking Enhancements

## Overview
Add data layer events and tracking capabilities to support Google Ads conversion tracking. These are technical additions that don't change any visible content — they simply push events that Google Tag Manager can use for conversion tracking.

## Task 1: Add DataLayer Push for Contact Form Submission

When the contact form is successfully submitted, push an event to the dataLayer.

**File:** `src/components/sections/ContactForm.tsx`

**Changes:**
After the form successfully submits (when `setIsSubmitted(true)` is called), add:

```typescript
// Push event to dataLayer for Google Ads conversion tracking
if (typeof window !== 'undefined' && window.dataLayer) {
  window.dataLayer.push({
    event: 'form_submission_success',
    form_type: 'contact',
    form_location: window.location.pathname
  });
}
```

**Also add TypeScript declaration at top of file:**
```typescript
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
```

## Task 2: Add DataLayer Push for Investor Form Submission

**File:** `src/components/sections/InvestorForm.tsx`

**Changes:**
Same pattern as contact form, but with `form_type: 'investor'`

```typescript
if (typeof window !== 'undefined' && window.dataLayer) {
  window.dataLayer.push({
    event: 'form_submission_success',
    form_type: 'investor',
    form_location: window.location.pathname
  });
}
```

## Task 3: Add Phone Click Tracking Attribute

Add a data attribute to phone links for easier GTM targeting.

**File:** `src/app/contact/page.tsx`

**Change the phone link from:**
```tsx
<a
  href="tel:4243098523"
  className="text-silq-blue hover:underline"
>
```

**To:**
```tsx
<a
  href="tel:4243098523"
  className="text-silq-blue hover:underline"
  data-track="phone-click"
>
```

## Task 4: Add Ordering Button Tracking Attributes

Add data attributes to ordering buttons for GTM conversion tracking.

**Files:** 
- `src/app/page.tsx` (homepage)
- `src/app/products/cleartract/page.tsx`

**For the ordering buttons, add data-track attributes:**

```tsx
<Link href="/contact" data-track="ordering-facility">
  {/* Healthcare Facility Ordering button */}
</Link>

<Link href="/contact" data-track="ordering-patient">
  {/* Patient Ordering button */}
</Link>
```

## Task 5: Add Schema.org Structured Data for Medical Device

Add JSON-LD structured data to improve ad quality score and SEO.

**File:** `src/app/products/cleartract/page.tsx`

**Add at the top of the component return, before the first section:**

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MedicalDevice",
      "name": "ClearTract® Foley Catheter",
      "description": "FDA-cleared urinary catheter with drug-free zwitterionic surface treatment to reduce infection, encrustation, and improve patient comfort.",
      "manufacturer": {
        "@type": "Organization",
        "name": "Silq Technologies",
        "url": "https://silq.tech"
      },
      "url": "https://silq.tech/products/cleartract",
      "category": "Urinary Catheter",
      "relevantSpecialty": "Urology",
      "availableIn": {
        "@type": "Country",
        "name": "United States"
      }
    })
  }}
/>
```

## Task 6: Add Schema.org Organization Data

**File:** `src/app/layout.tsx`

**Add inside the `<head>` section, after GTM script:**

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "Silq Technologies",
      "url": "https://silq.tech",
      "logo": "https://silq.tech/images/logos/silq-logo.png",
      "description": "Medical device company developing advanced biomaterials technology for safer medical implants.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "323 Sunny Isles Blvd., 7th Floor",
        "addressLocality": "Sunny Isles Beach",
        "addressRegion": "FL",
        "postalCode": "33160",
        "addressCountry": "US"
      },
      "telephone": "+1-424-309-8523",
      "email": "info@silq.tech",
      "sameAs": []
    })
  }}
/>
```

## Testing Checklist

After implementation, verify:

1. **DataLayer Events:**
   - Open browser DevTools → Console
   - Type `dataLayer` and press Enter
   - Submit a contact form
   - Check that `form_submission_success` event appears

2. **Data Attributes:**
   - Inspect ordering buttons, verify `data-track` attributes present
   - Inspect phone link, verify `data-track="phone-click"` present

3. **Schema Markup:**
   - Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Enter `https://silq.tech/products/cleartract`
   - Verify MedicalDevice schema is detected

## Notes

- These changes add no visible UI changes
- All existing content remains exactly as-is
- These enable Google Tag Manager to fire conversion tags
- The dataLayer events will be picked up by GTM triggers configured in Google Tag Manager
