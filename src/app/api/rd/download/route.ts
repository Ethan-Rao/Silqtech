import { NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const file = searchParams.get('file')

  if (!slug || !file || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Missing slug or file' }, { status: 400 })
  }

  if (slug.includes('..') || file.includes('..') || file.includes('/') || file.includes('\\') || file.includes('"')) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  const s3 = new S3Client({
    endpoint: `https://${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`,
    region: process.env.DO_SPACES_REGION!,
    credentials: {
      accessKeyId: process.env.DO_SPACES_KEY!,
      secretAccessKey: process.env.DO_SPACES_SECRET!,
    },
    forcePathStyle: false,
  })

  const key = `rd-files/${slug}/${file}`
  const cmd = new GetObjectCommand({
    Bucket: process.env.DO_SPACES_BUCKET!,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${file}"`,
  })

  try {
    const url = await getSignedUrl(s3, cmd, { expiresIn: 3600 })
    return NextResponse.redirect(url)
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
