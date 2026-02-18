import { NextRequest, NextResponse } from 'next/server'
import { getSubmissions, getSubmissionCount, getRecipients } from '@/lib/submissions-store'

// Simple password protection - in production, use proper auth
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'silq-admin-2026'

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false
  
  const [type, credentials] = authHeader.split(' ')
  if (type !== 'Bearer') return false
  
  return credentials === ADMIN_PASSWORD
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '100')
  const offset = parseInt(searchParams.get('offset') || '0')

  const submissions = getSubmissions(limit, offset)
  const total = getSubmissionCount()
  const recipients = getRecipients()

  return NextResponse.json({
    submissions,
    total,
    limit,
    offset,
    recipients,
    hasMore: offset + submissions.length < total,
  })
}
