/**
 * Regenerates silq-chat-here-badge.svg (self-contained) and silq-chat-here-badge.png (transparent).
 * SVG viewBox stays 200×200; PNG is rasterized at PNG_SIZE (280px) for larger embeds. Run: npm run build:chat-badge
 *
 * Note: Sharp uses librsvg for SVG rasterization. librsvg largely treats <text y> as the
 * alphabetic baseline and ignores dominant-baseline="middle", which makes PNGs look top-heavy.
 * We position y explicitly so SVG (browser) and PNG (rsvg) match.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const monogramPath = path.join(root, 'public/images/logos/silq-monogram.png')
const svgOut = path.join(root, 'public/images/logos/silq-chat-here-badge.svg')
const pngOut = path.join(root, 'public/images/logos/silq-chat-here-badge.png')

const b64 = fs.readFileSync(monogramPath).toString('base64')
const dataUri = `data:image/png;base64,${b64}`

const FONT_SIZE = 32
// Local y inside translate(100,100): alphabetic baseline below center for optical vertical centering
const TEXT_BASELINE_Y = Math.round(FONT_SIZE * 0.38)
/** Neutral tracking — negative values pull glyphs into rounded ends and read as clipped in PNG raster. */
const LETTER_SPACING = 0

/**
 * Pill inscribed in circle (r≈100): shorter + max width + moderate rx so flat run is long enough
 * that “C” / “!” are not clipped by end caps at FONT_SIZE 32.
 */
const BUBBLE = { x: 5, y: 73, w: 190, h: 54, rx: 20 }

/** Raster output: was 200px; ≥30% larger for Milly / embeds (Sharp uses this after SVG rasterize). */
const PNG_SIZE = 280
const SVG_RASTER_DENSITY = Math.round(360 * (PNG_SIZE / 200))

// viewBox 200x200: logo fills circle; speech bubble overlaid in center (rounded rect, no tail)
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-labelledby="badgeTitle badgeDesc">
  <title id="badgeTitle">Silq - Chat Here!</title>
  <desc id="badgeDesc">Silq monogram filling the badge with a centered Chat Here! speech bubble overlay.</desc>
  <defs>
    <clipPath id="logoClip">
      <circle cx="100" cy="100" r="100"/>
    </clipPath>
    <filter id="bubbleShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0e1216" flood-opacity="0.22"/>
    </filter>
    <!-- Stroke gradient: echoes monogram (warm / teal / navy / cream) in user space for stable PNG raster -->
    <linearGradient id="bubbleBorderGrad" x1="28" y1="48" x2="172" y2="168" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E8877A"/>
      <stop offset="22%" stop-color="#5EB8E8"/>
      <stop offset="48%" stop-color="#00ADEF"/>
      <stop offset="72%" stop-color="#314780"/>
      <stop offset="100%" stop-color="#EDE4D3"/>
    </linearGradient>
  </defs>
  <!-- Logo fills circular badge -->
  <g clip-path="url(#logoClip)">
    <rect x="0" y="0" width="200" height="200" fill="#0E1216"/>
    <image
      href="${dataUri}"
      x="0"
      y="0"
      width="200"
      height="200"
      preserveAspectRatio="xMidYMid slice"
    />
  </g>
  <circle cx="100" cy="100" r="99.5" fill="none" stroke="#0E1216" stroke-width="1" opacity="0.25"/>
  <!-- Centered dialogue: widened pill for horizontal padding around type (inscribed in circle) -->
  <g filter="url(#bubbleShadow)">
    <rect
      x="${BUBBLE.x}"
      y="${BUBBLE.y}"
      width="${BUBBLE.w}"
      height="${BUBBLE.h}"
      rx="${BUBBLE.rx}"
      ry="${BUBBLE.rx}"
      fill="#ffffff"
      stroke="url(#bubbleBorderGrad)"
      stroke-width="4.5"
      stroke-linejoin="round"
    />
  </g>
  <!-- Origin = box center; y = alphabetic baseline (rsvg-compatible) -->
  <g transform="translate(100, 100)">
    <text
      x="0"
      y="${TEXT_BASELINE_Y}"
      text-anchor="middle"
      dominant-baseline="alphabetic"
      letter-spacing="${LETTER_SPACING}"
      fill="#0E1216"
      font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
      font-size="${FONT_SIZE}"
      font-weight="700"
    >Chat Here!</text>
  </g>
</svg>
`

fs.writeFileSync(svgOut, svg, 'utf8')

await sharp(Buffer.from(svg), { density: SVG_RASTER_DENSITY })
  .resize(PNG_SIZE, PNG_SIZE, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(pngOut)

console.log('Wrote', path.relative(root, svgOut))
console.log('Wrote', path.relative(root, pngOut))
