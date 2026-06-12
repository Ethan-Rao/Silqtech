import { readFileSync, mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── helpers ────────────────────────────────────────────────────────────────

function slugify(str) {
  if (!str) return 'unknown'
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Convert an Excel serial date (e.g. 46182) to an ISO date string "YYYY-MM-DD".
 * If the cell is already a string that looks like a date, pass it through.
 * Returns null for empty/invalid values.
 */
function toISODate(value) {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'number') {
    const d = new Date(Date.UTC(1899, 11, 30) + value * 86400000)
    return d.toISOString().slice(0, 10)
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed || trimmed === '(none)') return null
    // If it already looks like YYYY-MM-DD, keep it
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
    // Try parsing as a date
    const parsed = new Date(trimmed)
    if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10)
    return null
  }
  return null
}

function clean(value) {
  if (value === null || value === undefined) return ''
  const s = String(value).trim()
  if (s === '(none)' || s === 'undefined') return ''
  return s
}

// ── read workbook ──────────────────────────────────────────────────────────

const xlsxPath = join(ROOT, 'NuSilq', 'Silq-NuSil ongoing projects Offline.xlsx')
const workbook = XLSX.readFile(xlsxPath, { cellDates: false })

// ── Ongoing Projects ───────────────────────────────────────────────────────

function parseOngoing() {
  const sheet = workbook.Sheets['Ongoing Projects']
  if (!sheet) throw new Error('Sheet "Ongoing Projects" not found')
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  return rows
    .filter(row => {
      // Skip rows where Company Name is empty or looks like a header repeat
      const name = clean(row['Company Name'])
      return name && name.toLowerCase() !== 'company name'
    })
    .filter(row => !row['__EMPTY'])
    .map((row, i) => {
      const companyName = clean(row['Company Name'])
      return {
        id: slugify(companyName) || `ongoing-${i}`,
        companyName,
        currentActionItem: clean(row['Current Action Item']),
        projectStatus: clean(row['Project Status']),
        tNDA: clean(row['tNDA']),
        lastUpdated: toISODate(row['Last Update made']),
        applicationDescription: clean(row['Application Description']),
        notes: [],
      }
    })
}

// ── Active Targets ─────────────────────────────────────────────────────────

function parseTargets() {
  const sheet = workbook.Sheets['Potential Targets']
  if (!sheet) throw new Error('Sheet "Potential Targets" not found')
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  return rows
    .filter(row => {
      const name = clean(row['Company'])
      return name && name.toLowerCase() !== 'company'
    })
    .map((row, i) => {
      const companyName = clean(row['Company'])
      const seedNote = clean(row['Notes'])
      const notes = seedNote
        ? [
            {
              id: `seed-${slugify(companyName)}-0`,
              timestamp: new Date().toISOString(),
              author: 'Excel import',
              text: seedNote,
            },
          ]
        : []
      return {
        id: slugify(companyName) || `target-${i}`,
        companyName,
        application: clean(row['Application']),
        deviceDetails: clean(row['Device Details']),
        notes,
      }
    })
}

// ── Stalled Projects ───────────────────────────────────────────────────────

function parseStalled() {
  const sheet = workbook.Sheets['Currently Stalled Projects']
  if (!sheet) throw new Error('Sheet "Currently Stalled Projects" not found')
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  return rows
    .filter(row => {
      const name = clean(row['Company Name'])
      return name && name.toLowerCase() !== 'company name'
    })
    .map((row, i) => {
      const companyName = clean(row['Company Name'])
      return {
        id: slugify(companyName) || `stalled-${i}`,
        companyName,
        projectStatus: clean(row['Project Status']),
        applicationDescription: clean(row['Application Description']),
        lastContact: toISODate(row['Last Contact Date']),
        notes: [],
      }
    })
}

// ── output ─────────────────────────────────────────────────────────────────

const ongoing = parseOngoing()
const targets = parseTargets()
const stalled = parseStalled()

const output = {
  generated: new Date().toISOString(),
  ongoing,
  targets,
  stalled,
}

const outDir = join(ROOT, 'public', 'data', 'nusilq')
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, 'projects.json')
writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8')

console.log(`✓ Generated ${outPath}`)
console.log(`  Ongoing Projects : ${ongoing.length}`)
console.log(`  Active Targets   : ${targets.length}`)
console.log(`  Stalled Projects : ${stalled.length}`)
