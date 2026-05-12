/**
 * Regenerates silq-chat-here-badge.svg (self-contained) and silq-chat-here-badge.png (transparent).
 * Run: npm run build:chat-badge
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

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-labelledby="badgeTitle badgeDesc">
  <title id="badgeTitle">Silq - Chat here</title>
  <desc id="badgeDesc">Silq monogram with a speech bubble above that says Chat here.</desc>
  <defs>
    <filter id="bubbleShadow" x="-8%" y="-8%" width="116%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0e1216" flood-opacity="0.14"/>
    </filter>
    <filter id="logoShadow" x="-12%" y="-12%" width="124%" height="124%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0e1216" flood-opacity="0.18"/>
    </filter>
  </defs>
  <g filter="url(#logoShadow)">
    <circle cx="100" cy="150" r="48" fill="#0E1216"/>
    <image href="${dataUri}" x="56" y="106" width="88" height="88" preserveAspectRatio="xMidYMid meet"/>
  </g>
  <g filter="url(#bubbleShadow)">
    <rect x="18" y="8" width="164" height="54" rx="16" fill="#ffffff" stroke="#314780" stroke-width="2.5"/>
    <path d="M 76 62 L 100 102 L 124 62 Z" fill="#ffffff" stroke="#314780" stroke-width="2.5" stroke-linejoin="round"/>
    <rect x="22" y="56" width="156" height="10" fill="#ffffff"/>
  </g>
  <text x="100" y="44" text-anchor="middle" fill="#0E1216" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="15" font-weight="700">Chat here</text>
</svg>
`

fs.writeFileSync(svgOut, svg, 'utf8')

await sharp(Buffer.from(svg), { density: 192 })
  .resize(512, 512, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(pngOut)

console.log('Wrote', path.relative(root, svgOut))
console.log('Wrote', path.relative(root, pngOut))
