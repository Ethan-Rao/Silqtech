import XLSX from 'xlsx'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync, mkdirSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const XLSX_PATH = join(ROOT, '..', 'R&DDashboard', 'Silq 2026 NRE Projects.xlsx')
const OUT_PATH = join(ROOT, 'public', 'data', 'rd', 'projects.json')

function slugify(name) {
  const parts = name.split('/')
  const base = parts[parts.length - 1].trim()
  return base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const SLUG_OVERRIDES = {
  'Ernesto Andrade/Momentum': 'momentum',
  'P-Trap': 'p-trap',
  'Design 33': 'design-33',
  'Liqid Medical': 'liqid-medical',
  'Mayo Clinic': 'mayo-clinic',
  'Boston Scientific': 'boston-scientific',
}

const wb = XLSX.readFile(XLSX_PATH, { cellDates: false })
const ws = wb.Sheets['Active']
const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })

const tier1 = []
const tier2 = []
const tier3 = []

for (const row of rows) {
  const company = String(row['Company'] || '').trim()
  if (!company) continue
  const slug = SLUG_OVERRIDES[company] ?? slugify(company)
  const tier = Number(row['Tier']) || 3
  const entry = {
    id: slug,
    companyName: company,
    application: String(row['Application'] || '').trim(),
    projectStatus: String(row['Project Status'] || '').trim(),
    tier,
    lastUpdated: null,
    notes: [],
  }
  if (tier === 1) tier1.push(entry)
  else if (tier === 2) tier2.push(entry)
  else tier3.push(entry)
}

mkdirSync(join(ROOT, 'public', 'data', 'rd'), { recursive: true })
const output = { generated: new Date().toISOString(), tier1, tier2, tier3 }
writeFileSync(OUT_PATH, JSON.stringify(output, null, 2))
console.log(`Written: ${OUT_PATH} (T1:${tier1.length} T2:${tier2.length} T3:${tier3.length})`)
