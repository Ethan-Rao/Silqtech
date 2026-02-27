# Dev Prompt: Image Display Fixes & Site Cleanup

## Priority: HIGH - Images Not Displaying on Production

### Problem Summary
After recent image updates, the bacteria panel and box images are not displaying on the deployed site. The images exist in the repository but are not rendering. This needs immediate investigation and resolution.

---

## Task 1: Diagnose and Fix Image Display Issues

### Current State
- `BoxV2.jpg` (~11.8MB) - Located at `public/images/products/BoxV2.jpg`
- `BacPanelV2.png` - Located at `public/images/science/BacPanelV2.png`
- Images were committed and pushed but show blank spaces on the deployed site

### Investigation Steps
1. **Check if images are too large** - BoxV2.jpg is ~11.8MB which may exceed Next.js image optimization limits
2. **Verify file paths are correct** in the code
3. **Check Next.js image configuration** in `next.config.js`
4. **Test locally** to see if images load on localhost:3000

### Source Files to Copy
Copy these files from `C:\Users\Ethan\OneDrive\Desktop\Webdev\` to the project:
- `BoxV2.jpg` → `public/images/products/BoxV2.jpg`
- `BacPanelV2.png` → `public/images/science/BacPanelV2.png`
- `HeaderLogo.png` → `public/images/branding/HeaderLogo.png`

### Potential Fixes
1. **If file size is the issue**: Compress/optimize the images before adding
2. **If path is the issue**: Verify exact paths match in code vs file system
3. **If Next.js config issue**: Update `next.config.js` to handle larger images:

```javascript
// next.config.js
module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    // Add unoptimized for large images if needed
  },
}
```

4. **Alternative approach**: Use unoptimized images for large files:
```tsx
<Image 
  src="/images/products/BoxV2.jpg"
  alt="ClearTract Product Box"
  width={400}
  height={300}
  unoptimized // Add this for large images
/>
```

### Files to Update

#### Box Image References
Update these files to use `BoxV2.jpg`:
- `src/app/page.tsx` - Homepage ClearTract section
- `src/app/products/cleartract/page.tsx` - Product page hero
- `src/app/about/investors/page.tsx` - Investors page (if applicable)
- `src/app/products/page.tsx` - Products listing

#### Bacteria Panel References  
Update these files to use `BacPanelV2.png`:
- `src/app/products/cleartract/page.tsx` - Bacteria adhesion section
- `src/app/products/surface-treatment/page.tsx` - Bacteria panel section
- `src/app/technology/page.tsx` - Technology page bacteria section

---

## Task 2: Replace Header Logo

### Current State
The header currently uses `logo-main.png` for the site logo.

### Required Change
Replace with `HeaderLogo.png` which shows "SILQ Technologies Corp" in the brand colors.

### Source File
Copy `C:\Users\Ethan\OneDrive\Desktop\Webdev\HeaderLogo.png` to `public/images/branding/HeaderLogo.png`

### File to Update
`src/components/layout/Header.tsx`

Find the current logo Image component and update:
```tsx
<Image
  src="/images/branding/HeaderLogo.png"
  alt="Silq Technologies Corp"
  width={280}  // Adjust based on actual image dimensions
  height={50}  // Adjust based on actual image dimensions
  priority
  className="h-10 md:h-12 w-auto"
/>
```

**Note**: The HeaderLogo.png is a wide format showing the full company name. Adjust dimensions to fit the header appropriately while maintaining readability.

---

## Task 3: Site-Wide Visual Cleanup

### Review Checklist
Go through each page and ensure:

#### Typography & Spacing
- [ ] Consistent heading sizes across pages
- [ ] Adequate padding/margins between sections
- [ ] Text is readable (not too small, good contrast)

#### Images
- [ ] All images load properly
- [ ] Images are appropriately sized (not stretched/compressed)
- [ ] Alt text is present for accessibility

#### Buttons & CTAs
- [ ] Consistent button styling
- [ ] Hover states work properly
- [ ] Links are clearly identifiable

#### Mobile Responsiveness
- [ ] Navigation menu works on mobile
- [ ] Content doesn't overflow on small screens
- [ ] Images scale appropriately

#### Footer
- [ ] Logo displays correctly
- [ ] Links are functional
- [ ] Layout is balanced

### Pages to Review
1. Homepage (`/`)
2. Technology (`/technology`)
3. ClearTract (`/products/cleartract`)
4. Surface Treatment Services (`/products/surface-treatment`)
5. About/Team (`/about/team`)
6. About/Investors (`/about/investors`)
7. Contact (`/contact`)
8. Rep Directory (`/rep`)
9. Individual Rep Pages (`/rep/[slug]`)

---

## Task 4: Commit and Deploy

### After All Changes
1. Test locally at `http://localhost:3000`
2. Verify all images load correctly
3. Check responsive layouts on different screen sizes
4. Commit with descriptive message:
   ```
   git add -A
   git commit -m "Fix image display issues, update header logo, visual cleanup"
   git push origin main
   git push origin main:staging --force
   ```

### Post-Deployment Verification
After Digital Ocean deploys:
1. Hard refresh the site (Ctrl+Shift+R)
2. Check all pages for image loading
3. Verify header logo appears correctly
4. Test on mobile viewport

---

## Reference: Expected Image Locations After Fix

```
public/
├── images/
│   ├── branding/
│   │   ├── HeaderLogo.png (NEW - full company name logo)
│   │   ├── logo-main.png
│   │   └── ...
│   ├── products/
│   │   ├── BoxV2.jpg (product box image)
│   │   └── ...
│   └── science/
│       ├── BacPanelV2.png (bacteria adhesion panel)
│       └── ...
```

---

## Success Criteria
- [ ] BoxV2.jpg displays on homepage and ClearTract page
- [ ] BacPanelV2.png displays on ClearTract, Technology, and Surface Treatment pages
- [ ] HeaderLogo.png displays in the site header
- [ ] All pages look clean and professional
- [ ] No visual regressions on any page
- [ ] Changes deployed to staging successfully
