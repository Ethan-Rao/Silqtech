import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readFileSync, readdirSync, writeFileSync, statSync, existsSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import { config as loadEnv } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const RD_ROOT = join(ROOT, '..', 'R&DDashboard')
const MANIFEST_PATH = join(ROOT, 'public', 'data', 'rd', 'files.json')

loadEnv({ path: join(ROOT, '.env') })
loadEnv({ path: join(ROOT, '.env.local'), override: true })

const FOLDER_SLUG_MAP = {
  'AB': 'ab',
  'Neptune': 'neptune',
  'Momentum': 'momentum',
  'Mayo-Clinic': 'mayo-clinic',
  'Fearsome': 'fearsome',
  'Aspero': 'aspero',
  'Alcon': 'alcon',
  'Abyrx': 'abyrx',
  'Boston-Scientific': 'boston-scientific',
  'Medicone': 'medicone',
  'P-Trap': 'p-trap',
  'Mazon': 'mazon',
  'Design-33': 'design-33',
  'Liqid-Medical': 'liqid-medical',
  'BMC': 'bmc',
  'CHOC': 'choc',
  'Ureteral-Stent': 'ureteral-stent',
}

const IGNORED_FILES = new Set(['README.md', '.DS_Store', 'Thumbs.db'])
const MAX_BYTES = 50 * 1024 * 1024

const region = process.env.DO_SPACES_REGION
const key = process.env.DO_SPACES_KEY
const secret = process.env.DO_SPACES_SECRET
const bucket = process.env.DO_SPACES_BUCKET

if (!region || !key || !secret || !bucket) {
  console.error('Missing DO_SPACES_REGION / DO_SPACES_KEY / DO_SPACES_SECRET / DO_SPACES_BUCKET')
  process.exit(1)
}

const s3 = new S3Client({
  endpoint: `https://${region}.digitaloceanspaces.com`,
  region,
  credentials: {
    accessKeyId: key,
    secretAccessKey: secret,
  },
  forcePathStyle: false,
})

let existing = {}
if (existsSync(MANIFEST_PATH)) {
  try {
    existing = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
  } catch {
    existing = {}
  }
}

const manifest = {}

for (const [folder, slug] of Object.entries(FOLDER_SLUG_MAP)) {
  const folderPath = join(RD_ROOT, folder)
  let files
  try { files = readdirSync(folderPath) } catch { continue }

  manifest[slug] = []
  const previous = Array.isArray(existing[slug]) ? existing[slug] : []

  for (const file of files) {
    if (IGNORED_FILES.has(file) || file.startsWith('.')) continue
    const filePath = join(folderPath, file)
    const stats = statSync(filePath)
    if (!stats.isFile()) continue

    const prior = previous.find(entry => entry.filename === file)
    const objectKey = `rd-files/${slug}/${file}`

    if (stats.size > MAX_BYTES) {
      console.warn(`  ⚠ SKIPPED (>50MB): ${objectKey} (${(stats.size / 1024 / 1024).toFixed(1)} MB)`)
      manifest[slug].push({
        filename: file,
        description: prior?.description ?? '',
        uploadedAt: prior?.uploadedAt ?? new Date().toISOString(),
        oversized: true,
      })
      continue
    }

    const body = readFileSync(filePath)
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: body,
      ACL: 'private',
      ContentType: getContentType(extname(file)),
    }))

    manifest[slug].push({
      filename: file,
      description: prior?.description ?? '',
      uploadedAt: prior?.uploadedAt ?? new Date().toISOString(),
      ...(prior?.oversized ? { oversized: false } : {}),
    })
    console.log(`  ✓ Uploaded: ${objectKey}`)
  }
}

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
console.log('Written: public/data/rd/files.json')

function getContentType(ext) {
  const map = {
    '.pdf': 'application/pdf',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.csv': 'text/csv',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.zip': 'application/zip',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  }
  return map[ext.toLowerCase()] ?? 'application/octet-stream'
}
