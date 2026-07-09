import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import type { Overlay } from '@/components/nusilq/types'

const NOTES_KEY = 'nusilq/notes.json'

function getClient() {
  const region = process.env.DO_SPACES_REGION
  const key = process.env.DO_SPACES_KEY
  const secret = process.env.DO_SPACES_SECRET

  if (!region || !key || !secret) {
    throw new Error('Missing DO_SPACES_REGION / DO_SPACES_KEY / DO_SPACES_SECRET env vars')
  }

  return new S3Client({
    endpoint: `https://${region}.digitaloceanspaces.com`,
    region,
    credentials: { accessKeyId: key, secretAccessKey: secret },
    forcePathStyle: false,
  })
}

function getBucket() {
  const bucket = process.env.DO_SPACES_BUCKET
  if (!bucket) throw new Error('Missing DO_SPACES_BUCKET env var')
  return bucket
}

export async function readNotesOverlay(): Promise<Overlay> {
  try {
    const cmd = new GetObjectCommand({ Bucket: getBucket(), Key: NOTES_KEY })
    const res = await getClient().send(cmd)
    const body = await res.Body?.transformToString()
    return body ? (JSON.parse(body) as Overlay) : {}
  } catch (err: unknown) {
    const code = (err as { Code?: string; name?: string }).Code ?? (err as { name?: string }).name
    if (code === 'NoSuchKey' || code === 'NotFound') return {}
    console.error('[nusilq/spaces] read error:', err)
    return {}
  }
}

export async function writeNotesOverlay(overlay: Overlay): Promise<void> {
  const cmd = new PutObjectCommand({
    Bucket: getBucket(),
    Key: NOTES_KEY,
    Body: JSON.stringify(overlay),
    ContentType: 'application/json',
    ACL: 'private',
  })
  await getClient().send(cmd)
}
