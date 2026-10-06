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
}

const IGNORED_FILES = new Set(['README.md', '.DS_Store', 'Thumbs.db'])

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
    if (!statSync(filePath).isFile()) continue

    const objectKey = `rd-files/${slug}/${file}`
    const body = readFileSync(filePath)
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: body,
      ACL: 'private',
      ContentType: getContentType(extname(file)),
    }))

    const prior = previous.find(entry => entry.filename === file)
    manifest[slug].push({
      filename: file,
      description: prior?.description ?? '',
      uploadedAt: prior?.uploadedAt ?? new Date().toISOString(),
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
    '.zip': 'application/zip',
  }
  return map[ext.toLowerCase()] ?? 'application/octet-stream'
}
