import XLSX from 'xlsx'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const XLSX_PATH = join(ROOT, '..', 'R&DDashboard', 'Silq 2026 NRE Projects.xlsx')
const OUT_PATH = join(ROOT, 'public', 'data', 'rd', 'projects.json')

function slugify(name) {
  const parts = name.split('/')
  const base = parts[parts.length - 1].trim()
  return base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function excelSerialToISO(serial) {
  if (!serial || typeof serial !== 'number') return null
  const date = new Date((serial - 25569) * 86400 * 1000)
  return date.toISOString().slice(0, 10)
}

const SLUG_OVERRIDES = {
  'Ernesto Andrade/Momentum': 'momentum',
  'P-Trap': 'p-trap',
  'Design 33': 'design-33',
  'Liqid Medical': 'liqid-medical',
  'Mayo Clinic': 'mayo-clinic',
  'Boston Scientific': 'boston-scientific',
  'Ureteral Stent': 'ureteral-stent',
  'CHOC': 'choc',
}

const DISPLAY_NAMES = {
  CHOC: "CHOC (Rady Children's Health)",
}

const DESIGN_33 = {
  id: 'design-33',
  companyName: 'Design 33',
  application: 'PU Device (friction reduction)',
  projectStatus: 'PU samples sent for evaluation. No further engagement.',
  tier: 4,
  lastUpdated: null,
  nreStatus: '',
  isInternal: false,
  notes: [
    {
      id: 'note-design33-onhold',
      timestamp: '2026-10-07T00:00:00.000Z',
      author: 'Oct 2026 update',
      text: 'Moved to On Hold. Was removed from active Excel tracker Oct 7, 2026. Project folder is empty — no samples or agreements received.',
    },
  ],
}

let existingTier4 = []
const priorById = {}
try {
  const existing = JSON.parse(readFileSync(OUT_PATH, 'utf8'))
  existingTier4 = existing.tier4 ?? []
  for (const list of [existing.tier1, existing.tier2, existing.tier3, existing.tier4]) {
    for (const project of list ?? []) priorById[project.id] = project
  }
} catch {
  existingTier4 = []
}

if (existingTier4.length === 0) existingTier4 = [DESIGN_33]

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
  const tier = Number(row['Action Priority']) || 3
  const nreStatus = String(row['NRE Status'] || '').trim()
  const entry = {
    id: slug,
    companyName: DISPLAY_NAMES[company] ?? company,
    application: String(row['Application'] || '').trim(),
    projectStatus: String(row['Project Status'] || '').trim(),
    tier,
    lastUpdated: excelSerialToISO(row['Last Updated']),
    nreStatus,
    isInternal: nreStatus.toLowerCase() === 'internal',
    notes: [],
  }
  if (priorById[slug]?.logoPath) entry.logoPath = priorById[slug].logoPath
  if (tier === 1) tier1.push(entry)
  else if (tier === 2) tier2.push(entry)
  else if (tier === 4) {
    if (!existingTier4.some(project => project.id === slug)) existingTier4.push(entry)
  } else tier3.push(entry)
}

mkdirSync(join(ROOT, 'public', 'data', 'rd'), { recursive: true })
const output = { generated: new Date().toISOString(), tier1, tier2, tier3, tier4: existingTier4 }
writeFileSync(OUT_PATH, JSON.stringify(output, null, 2))
console.log(`Written: ${OUT_PATH} (T1:${tier1.length} T2:${tier2.length} T3:${tier3.length} T4:${existingTier4.length})`)
