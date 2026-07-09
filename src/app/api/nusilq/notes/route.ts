import { NextResponse } from 'next/server'
import { readNotesOverlay, writeNotesOverlay } from '@/lib/nusilq/spaces'
import type { Overlay } from '@/components/nusilq/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const overlay = await readNotesOverlay()
    return NextResponse.json(overlay, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('[GET /api/nusilq/notes]', err)
    return NextResponse.json({} as Overlay, { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const overlay = (await req.json()) as Overlay
    await writeNotesOverlay(overlay)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/nusilq/notes]', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
