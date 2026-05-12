/**
 * Regenerates silq-chat-here-badge.svg (self-contained) and silq-chat-here-badge.png (transparent).
 * Full-area logo with centered dialogue overlay. Run: npm run build:chat-badge
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

// viewBox 200x200: logo fills circle; speech bubble overlaid in center (rounded rect, no tail)
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-labelledby="badgeTitle badgeDesc">
  <title id="badgeTitle">Silq - Chat here</title>
  <desc id="badgeDesc">Silq monogram filling the badge with a centered Chat here speech bubble overlay.</desc>
  <defs>
    <clipPath id="logoClip">
      <circle cx="100" cy="100" r="100"/>
    </clipPath>
    <filter id="bubbleShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0e1216" flood-opacity="0.22"/>
    </filter>
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
  <!-- Centered dialogue box overlay (1.5x prior 112x44; center 100,100) -->
  <g filter="url(#bubbleShadow)">
    <rect
      x="16"
      y="67"
      width="168"
      height="66"
      rx="21"
      ry="21"
      fill="#ffffff"
      stroke="#314780"
      stroke-width="3.5"
    />
  </g>
  <!-- Geometric center of box = (100,100); middle of text at that point -->
  <g transform="translate(100, 100)">
    <text
      x="0"
      y="0"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="#0E1216"
      font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
      font-size="30"
      font-weight="700"
    >Chat here</text>
  </g>
</svg>
`

fs.writeFileSync(svgOut, svg, 'utf8')

await sharp(Buffer.from(svg), { density: 360 })
  .resize(200, 200, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(pngOut)

console.log('Wrote', path.relative(root, svgOut))
console.log('Wrote', path.relative(root, pngOut))
