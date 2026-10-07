import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_PATH = join(ROOT, 'public', 'data', 'rd', 'projects.json')
const LOGO_DIR = join(ROOT, 'public', 'images', 'rd-logos')

const IMAGE_EXTS = new Set(['.png', '.svg', '.jpg', '.jpeg', '.webp'])
const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'))

let files = []
try { files = readdirSync(LOGO_DIR) } catch { files = [] }

const logoBySlug = {}
for (const file of files) {
  const ext = extname(file).toLowerCase()
  if (!IMAGE_EXTS.has(ext)) continue
  const slug = file.slice(0, -ext.length)
  logoBySlug[slug] = `/images/rd-logos/${file}`
}

let patched = 0
for (const key of ['tier1', 'tier2', 'tier3', 'tier4']) {
  for (const project of data[key] ?? []) {
    if (project.id === 'choc') project.companyName = "CHOC (Rady Children's Health)"
    if (!logoBySlug[project.id]) continue
    if (project.logoPath !== logoBySlug[project.id]) patched += 1
    project.logoPath = logoBySlug[project.id]
  }
}

writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
console.log(`Patched ${patched} logo path(s)`)
