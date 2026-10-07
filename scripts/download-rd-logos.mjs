import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'images', 'rd-logos')
mkdirSync(OUT, { recursive: true })

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept: 'text/html,image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
}

const LOGOS = [
  { slug: 'alcon', url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Alcon_Logo_2019.svg', ext: 'svg' },
  { slug: 'boston-scientific', url: 'https://www.bostonscientific.com/etc.clientlibs/gwc/clientlibs/assets/resources/img/bsc-logo-blue.svg', ext: 'svg' },
  { slug: 'aspero', url: 'https://images-v2.aventure.vc/logos/es1/ES1WWVRVeOFeM505h1OmJlw.jpeg', ext: 'jpg' },
  { slug: 'choc', url: 'https://choc.org/wp-content/uploads/2025/07/rch_logo-c.svg', ext: 'svg' },
  { slug: 'mayo-clinic', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Mayo_Clinic_logo.svg', ext: 'svg' },
]

const HOMEPAGES = [
  { slug: 'ab', url: 'https://www.advancedbionics.com' },
  { slug: 'neptune', url: 'https://neptunemedical.com' },
  { slug: 'liqid-medical', url: 'https://liqidmedical.com' },
  { slug: 'bmc', url: 'https://bmcbiomedical.com' },
]

function extFromUrl(url, contentType) {
  const clean = url.split('?')[0]
  const ext = extname(clean).toLowerCase().replace('.', '')
  if (['png', 'svg', 'jpg', 'jpeg', 'webp'].includes(ext)) return ext === 'jpeg' ? 'jpg' : ext
  if (contentType?.includes('svg')) return 'svg'
  if (contentType?.includes('png')) return 'png'
  if (contentType?.includes('jpeg')) return 'jpg'
  if (contentType?.includes('webp')) return 'webp'
  return 'png'
}

function resolveUrl(src, base) {
  try { return new URL(src, base).href } catch { return null }
}

function extractLogo(html, pageUrl) {
  const imgs = html.match(/<img\b[^>]*>/gi) ?? []
  for (const tag of imgs) {
    if (!/logo/i.test(tag)) continue
    const src = tag.match(/\b(?:src|data-src|nitro-lazy-src)=["']([^"']+)["']/i)
    const resolved = src && resolveUrl(src[1], pageUrl)
    if (resolved && !resolved.startsWith('data:') && /logo/i.test(resolved)) return resolved
  }

  const raw = html.match(/https?:\\?\/\\?\/[^"'\\\s>]*logo[^"'\\\s>]+\.(?:svg|png|jpe?g|webp)/i)
  if (raw) {
    const cleaned = raw[0].replace(/\\\//g, '/')
    const resolved = resolveUrl(cleaned, pageUrl)
    if (resolved) return resolved
  }
  return null
}

async function saveFromUrl(slug, url, ext) {
  const res = await fetch(url, { headers: HEADERS, redirect: 'follow' })
  if (!res.ok) {
    console.warn(`  ✗ ${slug}: HTTP ${res.status}`)
    return false
  }
  const type = res.headers.get('content-type') ?? ''
  if (type.includes('text/html')) {
    console.warn(`  ✗ ${slug}: response was HTML`)
    return false
  }
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 200) {
    console.warn(`  ✗ ${slug}: file too small (${buf.length} bytes)`)
    return false
  }
  const finalExt = ext || extFromUrl(url, type)
  for (const file of readdirSync(OUT)) {
    if (file.startsWith(`${slug}.`) && file !== `${slug}.${finalExt}`) unlinkSync(join(OUT, file))
  }
  writeFileSync(join(OUT, `${slug}.${finalExt}`), buf)
  console.log(`  ✓ ${slug}.${finalExt}`)
  return true
}

for (const { slug, url, ext } of LOGOS) {
  try {
    await saveFromUrl(slug, url, ext)
  } catch (e) {
    console.warn(`  ✗ ${slug}: ${e.message}`)
  }
}

for (const { slug, url } of HOMEPAGES) {
  if (readdirSync(OUT).some(file => file.startsWith(`${slug}.`))) continue
  try {
    const res = await fetch(url, { headers: HEADERS, redirect: 'follow' })
    if (!res.ok) {
      console.warn(`  ✗ ${slug}: homepage HTTP ${res.status}`)
      continue
    }
    const html = await res.text()
    const logoUrl = extractLogo(html, res.url || url)
    if (!logoUrl) {
      console.warn(`  ✗ ${slug}: no logo found on ${url}`)
      continue
    }
    await saveFromUrl(slug, logoUrl)
  } catch (e) {
    console.warn(`  ✗ ${slug}: ${e.message}`)
  }
}
