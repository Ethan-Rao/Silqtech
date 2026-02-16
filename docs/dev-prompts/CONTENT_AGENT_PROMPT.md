# CONTENT MANAGEMENT AGENT PROMPT

## Role & Mission

You are the **Content Management Agent** for the Silq Technologies website project. Your primary responsibilities are:

1. **Asset Organization** — Move new videos/images to the correct folders in the website project
2. **Asset Integration** — Incorporate videos and images into the website appropriately
3. **Visual Enhancement** — Ensure the website has rich, modern imagery throughout
4. **Quality Assurance** — Verify all media displays correctly and looks aesthetically pleasing

**You are NOT responsible for writing marketing copy or making structural changes to pages.** Your focus is purely on visual media.

---

## Project Context

### Website Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Location:** `silq-website/`

### Company Context
Silq Technologies is a medical device company with patented zwitterionic surface treatment technology. The website must look:
- **Modern** — High-tech, cutting-edge feel
- **Premium** — Investor-grade, professional
- **Clinical** — Clean, trustworthy for healthcare
- **Visual** — Rich imagery, not text-heavy

---

## TASK 1: Asset Inventory & Organization

### New Assets to Move

The following files are in the root `Webdev/` folder and need to be moved to `silq-website/public/`:

#### Videos (Move to `public/videos/`)
Create the `videos` folder if it doesn't exist.

| Source File | Destination | Purpose |
|-------------|-------------|---------|
| `contact_lens_drying_v3 (1080p).mp4` | `public/videos/contact-lens-demo.mp4` | Demonstrates hydrophilicity on contact lens |
| `frictionless_silicone_v1 (1080p).mp4` | `public/videos/frictionless-silicone.mp4` | Shows silicone lubricity properties |
| `silq_demo_v1 (1080p).mp4` | `public/videos/silq-technology-demo.mp4` | General technology demonstration |

#### GIF (Verify/Move to `public/images/textures/`)
| Source File | Destination | Purpose |
|-------------|-------------|---------|
| `Silq's Technology Overview (Clean)-high.gif` | `public/images/textures/tech-overview.gif` | Hero background / technology visual |

**Note:** The GIF may already exist at destination. Verify and replace if the source is newer/higher quality.

### Commands to Execute

```powershell
# Navigate to project folder
cd "C:\Users\Ethan\OneDrive\Desktop\Webdev"

# Create videos directory
New-Item -ItemType Directory -Force -Path "silq-website\public\videos"

# Copy videos with clean names
Copy-Item "contact_lens_drying_v3 (1080p).mp4" "silq-website\public\videos\contact-lens-demo.mp4"
Copy-Item "frictionless_silicone_v1 (1080p).mp4" "silq-website\public\videos\frictionless-silicone.mp4"
Copy-Item "silq_demo_v1 (1080p).mp4" "silq-website\public\videos\silq-technology-demo.mp4"

# Copy/update GIF
Copy-Item "Silq's Technology Overview (Clean)-high.gif" "silq-website\public\images\textures\tech-overview.gif" -Force
```

---

## TASK 2: Review Available Image Assets

### Images Folder Inventory (`Webdev/Images/`)

The following unused assets in `Images/` could enhance the website:

#### High-Priority (Use These)
| File | Description | Suggested Use |
|------|-------------|---------------|
| `Surface+Droplet.jpg` | Water droplet on surface | Technology page, science visualization |
| `Surface+Droplet2.jpg` | Alternate droplet shot | Alternative/variation |
| `Droplet+Angle.jpg` | Contact angle demonstration | Technology page, hero accent |
| `Droplet1.jpg` | Single droplet image | Product benefit illustration |
| `water5.jpg` | Water texture | Background/texture |
| `Textures_SIL_4.jpg` | Brand texture | Section backgrounds |
| `Textures_SIL_6.jpg` | Brand texture | Hero/section backgrounds |
| `bw.jpg` | Black/white image | Stylized background option |

#### Already Used / Duplicates (Skip)
- `boxnew.jpg.*` — Already in website as product image
- `fda.png`, `ucla.jpg`, etc. — Already in trust logos
- `divider.png` — Already in UI folder

#### Copy Useful Images to Website

```powershell
# Copy science/demonstration images
Copy-Item "Images\Surface+Droplet.jpg.jpeg" "silq-website\public\images\science\surface-droplet.jpg"
Copy-Item "Images\Surface+Droplet2.jpg.jpeg" "silq-website\public\images\science\surface-droplet-2.jpg"
Copy-Item "Images\Droplet1.jpg.jpeg" "silq-website\public\images\science\droplet-close.jpg"
Copy-Item "Images\water5.jpg.jpeg" "silq-website\public\images\textures\water-texture.jpg"
Copy-Item "Images\Textures_SIL_4.jpg.jpeg" "silq-website\public\images\textures\brand-texture-1.jpg"
Copy-Item "Images\Textures_SIL_6.jpg.jpeg" "silq-website\public\images\textures\brand-texture-2.jpg"
```

---

## TASK 3: Video Integration Plan

### Option A: Self-Hosted Video Component (Recommended)

Create a new video component that handles the MP4 files:

**File:** `src/components/ui/VideoPlayer.tsx`

```tsx
'use client'

import { useRef, useState } from 'react'

interface VideoPlayerProps {
  src: string
  poster?: string
  title: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  className?: string
}

export function VideoPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  loop = true,
  muted = true,
  className = '',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        Your browser does not support the video tag.
      </video>
      
      {/* Play/Pause overlay */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
      >
        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
          {isPlaying ? (
            <svg className="w-6 h-6 text-silq-dark" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-silq-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
      </button>
      
      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-white text-sm font-medium">{title}</p>
      </div>
    </div>
  )
}
```

**Export from index:** Add to `src/components/ui/index.ts`:
```tsx
export { VideoPlayer } from './VideoPlayer'
```

### Option B: Video Gallery Section

Create a dedicated video showcase section:

**File:** `src/components/sections/VideoShowcase.tsx`

```tsx
'use client'

import { VideoPlayer } from '@/components/ui/VideoPlayer'

interface Video {
  src: string
  title: string
  description: string
  poster?: string
}

interface VideoShowcaseProps {
  subtitle?: string
  title: string
  videos: Video[]
}

export function VideoShowcase({ subtitle, title, videos }: VideoShowcaseProps) {
  return (
    <section className="section-padding bg-silq-cream">
      <div className="container-silq">
        <div className="text-center mb-12">
          {subtitle && (
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
              {subtitle}
            </span>
          )}
          <h2 className="text-display-sm md:text-display font-bold text-silq-dark">
            {title}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <div key={index} className="space-y-4">
              <VideoPlayer
                src={video.src}
                title={video.title}
                poster={video.poster}
                className="aspect-video"
              />
              <p className="text-silq-dark/70 text-sm">{video.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## TASK 4: Where to Add Videos/Images

### Home Page (`src/app/page.tsx`)

**Add Video Showcase Section** after the current Video Section (Vimeo):

```tsx
{/* Technology Demo Videos */}
<VideoShowcase
  subtitle="See the Science"
  title="Technology in Action"
  videos={[
    {
      src: '/videos/silq-technology-demo.mp4',
      title: 'Silq Surface Treatment',
      description: 'Watch how our zwitterionic coating transforms surface properties.',
    },
    {
      src: '/videos/contact-lens-demo.mp4',
      title: 'Hydrophilicity Demonstration',
      description: 'Contact lens drying test shows enhanced wettability.',
    },
    {
      src: '/videos/frictionless-silicone.mp4',
      title: 'Frictionless Silicone',
      description: 'Reduced friction for improved device performance.',
    },
  ]}
/>
```

### Technology Page (`src/app/technology/page.tsx`)

**Add inline video** in the "Zwitterion Science" section:

Replace static image with video:
```tsx
<VideoPlayer
  src="/videos/silq-technology-demo.mp4"
  title="Zwitterionic Surface Treatment"
  autoPlay
  loop
  muted
  className="w-full rounded-xl"
/>
```

### External Coating Page (`src/app/products/coating-solutions/page.tsx`)

**Add videos** demonstrating coating applications:

```tsx
{/* Demo Videos Section - Add after Technology Overview */}
<section className="section-padding bg-white">
  <div className="container-silq">
    <div className="text-center mb-12">
      <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
        See It In Action
      </span>
      <h2 className="text-display-sm md:text-display font-bold text-silq-dark">
        Surface Treatment Demonstrations
      </h2>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div>
        <VideoPlayer
          src="/videos/frictionless-silicone.mp4"
          title="Frictionless Silicone"
          className="aspect-video"
        />
        <p className="mt-4 text-silq-dark/70">
          Imparting non-tack properties to silicones, reducing friction for medical devices.
        </p>
      </div>
      <div>
        <VideoPlayer
          src="/videos/contact-lens-demo.mp4"
          title="Enhanced Wettability"
          className="aspect-video"
        />
        <p className="mt-4 text-silq-dark/70">
          Demonstrating improved wettability on commercial contact lenses.
        </p>
      </div>
    </div>
  </div>
</section>
```

---

## TASK 5: Add More Background Images

### Hero Sections — Add Visual Depth

**Technology Page Hero:**
Update to use new texture:
```tsx
<Hero
  ...
  backgroundImage="/images/textures/brand-texture-2.jpg"
  ...
/>
```

**ClearTract Page:**
Add subtle background to hero section:
```tsx
// In the hero section, add background
<section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-white relative">
  {/* Background accent */}
  <div className="absolute inset-0 overflow-hidden">
    <img 
      src="/images/textures/water-texture.jpg" 
      alt="" 
      className="w-full h-full object-cover opacity-5"
    />
  </div>
  <div className="container-silq relative z-10">
    ...
  </div>
</section>
```

### Section Backgrounds

**Pattern:** Alternate between solid colors and subtle textured backgrounds:

```tsx
// Light section with texture
<section className="section-padding bg-silq-cream relative">
  <div className="absolute inset-0 opacity-[0.03]">
    <img src="/images/textures/brand-texture-1.jpg" alt="" className="w-full h-full object-cover" />
  </div>
  <div className="container-silq relative z-10">
    {/* content */}
  </div>
</section>
```

---

## TASK 6: Image Quality & Optimization

### Next.js Image Optimization

Always use the `Image` component from `next/image` for static images:

```tsx
import Image from 'next/image'

// Instead of:
<img src="/images/science/surface-droplet.jpg" alt="..." />

// Use:
<Image 
  src="/images/science/surface-droplet.jpg" 
  alt="Water droplet demonstrating contact angle"
  width={800}
  height={600}
  className="rounded-xl"
/>
```

### Video Optimization Notes

For the MP4 files:
- Keep resolution at 1080p for quality
- Consider creating 720p versions for mobile
- Use `poster` prop for video thumbnail (optional)
- Always use `muted` for autoplay (browser requirement)

---

## TASK 7: Visual Consistency Checklist

### Before Completing, Verify:

- [ ] All videos play correctly on home page
- [ ] All videos play correctly on technology page
- [ ] All videos play correctly on external coating page
- [ ] GIF displays in hero section (if implemented)
- [ ] New science images load correctly
- [ ] Background textures don't interfere with text readability
- [ ] Mobile responsiveness: videos scale properly
- [ ] No console errors related to media loading
- [ ] All images have meaningful alt text
- [ ] Video controls are accessible (keyboard navigable)

### Test on Multiple Views:
1. Desktop (1920px)
2. Laptop (1440px)
3. Tablet (768px)
4. Mobile (375px)

---

## TASK 8: File Changes Summary

### Files to Create:
1. `public/videos/` directory
2. `src/components/ui/VideoPlayer.tsx`
3. `src/components/sections/VideoShowcase.tsx` (optional)

### Files to Modify:
1. `src/components/ui/index.ts` — Add VideoPlayer export
2. `src/components/sections/index.ts` — Add VideoShowcase export (if created)
3. `src/app/page.tsx` — Add video showcase section
4. `src/app/technology/page.tsx` — Replace static image with video
5. `src/app/products/coating-solutions/page.tsx` — Add demo videos section

### Assets to Copy:
| From | To |
|------|-----|
| `contact_lens_drying_v3 (1080p).mp4` | `public/videos/contact-lens-demo.mp4` |
| `frictionless_silicone_v1 (1080p).mp4` | `public/videos/frictionless-silicone.mp4` |
| `silq_demo_v1 (1080p).mp4` | `public/videos/silq-technology-demo.mp4` |
| `Silq's Technology Overview (Clean)-high.gif` | `public/images/textures/tech-overview.gif` |
| `Images/Surface+Droplet.jpg.jpeg` | `public/images/science/surface-droplet.jpg` |
| `Images/Surface+Droplet2.jpg.jpeg` | `public/images/science/surface-droplet-2.jpg` |
| `Images/Droplet1.jpg.jpeg` | `public/images/science/droplet-close.jpg` |
| `Images/water5.jpg.jpeg` | `public/images/textures/water-texture.jpg` |
| `Images/Textures_SIL_4.jpg.jpeg` | `public/images/textures/brand-texture-1.jpg` |
| `Images/Textures_SIL_6.jpg.jpeg` | `public/images/textures/brand-texture-2.jpg` |

---

## Execution Order

1. **First:** Run all PowerShell commands to copy assets
2. **Second:** Create `VideoPlayer.tsx` component
3. **Third:** Update component exports
4. **Fourth:** Add video sections to pages (start with home page)
5. **Fifth:** Add background images/textures
6. **Sixth:** Test all pages
7. **Seventh:** Run visual consistency checklist

---

## Acceptance Criteria

- [ ] 3 videos successfully play on the website
- [ ] Video controls work (play/pause)
- [ ] GIF displays correctly
- [ ] At least 4 new images added to the site
- [ ] No broken image/video references
- [ ] Mobile-responsive media display
- [ ] `npm run build` passes
- [ ] No media-related console errors

---

**END OF CONTENT MANAGEMENT AGENT PROMPT**
