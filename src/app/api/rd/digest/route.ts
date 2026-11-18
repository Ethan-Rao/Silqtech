import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import type { NoteEntry, RdProject, RdProjectsData } from '@/components/rd/types'
import { memberByEmail, prioritiesFor, type RdTeamMember } from '@/lib/rd/team'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DASHBOARD_PASSWORD = 'Membrane1'
const REPLY_TO = 'ethanr@silq.tech'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_RECIPIENTS = 20
const MAX_INTRO = 2000
const MAX_NOTE = 5000

const SUBJECT = 'Silq NRE Project Weekly Brief'

const CLASS_SECTIONS = [
  { key: 'tier1' as const, title: 'Class I — Immediate Action', color: '#1B6CA8' },
  { key: 'tier2' as const, title: 'Class II — Awaiting Partner', color: '#1F8A8A' },
]

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function clip(value: string, max: number): string {
  if (value.length <= max) return value
  return value.slice(0, max) + '…'
}

function formatSent(date: Date): string {
  return date.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDay(iso: string | null | undefined): string {
  if (!iso) return '—'
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00Z` : iso
  const d = new Date(normalized)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function formatNoteWhen(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function normalizeRecipients(input: unknown): { recipients?: string[]; error?: string } {
  if (!Array.isArray(input)) return { error: 'Enter at least one recipient' }
  const seen = new Set<string>()
  const recipients: string[] = []
  for (const item of input) {
    if (typeof item !== 'string') return { error: 'One or more email addresses are invalid' }
    const email = item.trim().toLowerCase()
    if (!email) continue
    if (!EMAIL_PATTERN.test(email)) return { error: 'One or more email addresses are invalid' }
    if (seen.has(email)) continue
    seen.add(email)
    recipients.push(email)
  }
  if (recipients.length === 0) return { error: 'Enter at least one recipient' }
  if (recipients.length > MAX_RECIPIENTS) return { error: 'Send to 20 recipients or fewer' }
  return { recipients }
}

function isProjectArray(value: unknown): value is RdProject[] {
  return Array.isArray(value)
}

function projectText(project: RdProject): string {
  const name = project.isInternal ? `${project.companyName} (Internal)` : project.companyName
  const lines = [
    name,
    `Application: ${project.application || '—'}`,
    `Status: ${project.projectStatus || '—'}`,
  ]
  if (project.nreStatus) lines.push(`NRE: ${project.nreStatus}`)
  lines.push(`Last updated: ${formatDay(project.lastUpdated)}`)
  const notes = project.notes ?? []
  if (notes.length > 0) {
    lines.push('Notes:')
    for (const note of notes) {
      lines.push(`- ${note.author} — ${formatNoteWhen(note.timestamp)}`)
      lines.push(`  ${clip(note.text || '', MAX_NOTE)}`)
    }
  }
  return lines.join('\n')
}

function emailSections(projects: RdProjectsData, name: string) {
  return [
    { title: `${name} Action Items`, color: '#1C2333', items: prioritiesFor(projects, name) },
    ...CLASS_SECTIONS.map(section => ({
      title: section.title,
      color: section.color,
      items: projects[section.key] ?? [],
    })),
  ]
}

function buildText(intro: string, projects: RdProjectsData, sentAt: Date, name: string): string {
  const parts = ['Silq NRE Project Weekly Brief', formatSent(sentAt), `Prepared for ${name}`]
  if (intro) parts.push('', intro)
  for (const section of emailSections(projects, name)) {
    parts.push('', section.title)
    if (section.items.length === 0) {
      parts.push('None.')
      continue
    }
    for (const project of section.items) {
      parts.push('', projectText(project))
    }
  }
  return parts.join('\n')
}

function noteHtml(note: NoteEntry): string {
  return `<div style="margin-top:8px;">
    <div style="font-size:12px;color:#64748b;">${escapeHtml(note.author)} — ${escapeHtml(formatNoteWhen(note.timestamp))}</div>
    <div style="white-space:pre-wrap;">${escapeHtml(clip(note.text || '', MAX_NOTE))}</div>
  </div>`
}

function projectHtml(project: RdProject, color: string): string {
  const name = project.isInternal
    ? `${escapeHtml(project.companyName)} <span style="font-weight:600;color:#6d28d9;">Internal</span>`
    : escapeHtml(project.companyName)
  const notes = project.notes ?? []
  const notesBlock = notes.length
    ? `<div style="margin-top:10px;padding:10px 12px;background:#f8fafc;border-radius:8px;font-size:13px;color:#334155;">
        <div style="font-size:11px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#94a3b8;">Notes</div>
        ${notes.map(noteHtml).join('')}
      </div>`
    : ''
  const nre = project.nreStatus
    ? `<div style="margin-top:4px;font-size:13px;color:#475569;">NRE: ${escapeHtml(project.nreStatus)}</div>`
    : ''
  return `<div style="margin:0 0 12px;padding:12px 14px;border-left:4px solid ${color};background:#ffffff;border-radius:8px;">
    <div style="font-size:16px;font-weight:700;color:#0f172a;">${name}</div>
    <div style="margin-top:4px;font-size:13px;color:#64748b;">Application: ${escapeHtml(project.application || '—')}</div>
    <div style="margin-top:6px;font-size:14px;color:#1e293b;">${escapeHtml(project.projectStatus || '—')}</div>
    ${nre}
    <div style="margin-top:4px;font-size:13px;color:#64748b;">Last updated: ${escapeHtml(formatDay(project.lastUpdated))}</div>
    ${notesBlock}
  </div>`
}

function buildHtml(intro: string, projects: RdProjectsData, sentAt: Date, name: string): string {
  const sections = emailSections(projects, name).map(section => {
    const body = section.items.length
      ? section.items.map(project => projectHtml(project, section.color)).join('')
      : `<p style="margin:0 0 16px;color:#64748b;font-size:14px;">None.</p>`
    return `<h2 style="margin:24px 0 12px;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:${section.color};">${escapeHtml(section.title)}</h2>${body}`
  }).join('')
  const introBlock = intro
    ? `<p style="margin:16px 0 0;font-size:15px;color:#1e293b;white-space:pre-wrap;">${escapeHtml(intro)}</p>`
    : ''
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;">
    <div style="background:#1C2333;color:#ffffff;padding:24px;">
      <h1 style="margin:0;font-size:22px;">Silq NRE Project Weekly Brief</h1>
      <p style="margin:8px 0 0;font-size:13px;color:#cbd5e1;">${escapeHtml(formatSent(sentAt))}</p>
      <p style="margin:4px 0 0;font-size:13px;color:#cbd5e1;">Prepared for ${escapeHtml(name)}</p>
    </div>
    <div style="padding:8px 24px 24px;">
      ${introBlock}
      ${sections}
    </div>
  </div>
</body>
</html>`
}

export async function POST(req: Request) {
  let body: {
    password?: string
    intro?: string
    recipients?: unknown
    projects?: RdProjectsData
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (body.password !== DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = normalizeRecipients(body.recipients)
  if (!parsed.recipients) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const members: RdTeamMember[] = []
  for (const email of parsed.recipients) {
    const member = memberByEmail(email)
    if (!member) {
      return NextResponse.json({ error: 'Choose a team member' }, { status: 400 })
    }
    members.push(member)
  }

  const projects = body.projects
  if (!projects || !isProjectArray(projects.tier1) || !isProjectArray(projects.tier2)) {
    return NextResponse.json({ error: 'Project data is missing' }, { status: 400 })
  }

  const intro = typeof body.intro === 'string' ? body.intro.trim() : ''
  if (intro.length > MAX_INTRO) {
    return NextResponse.json({ error: 'Note is too long' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Email is not configured' }, { status: 500 })
  }

  const sentAt = new Date()
  const sentTo: string[] = []

  try {
    const resend = new Resend(apiKey)
    for (const member of members) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Silq Website <noreply@silq.tech>',
        to: member.email,
        replyTo: REPLY_TO,
        subject: SUBJECT,
        html: buildHtml(intro, projects, sentAt, member.name),
        text: buildText(intro, projects, sentAt, member.name),
      })
      sentTo.push(member.email)
    }
  } catch (err) {
    console.error('[POST /api/rd/digest]', sentAt.toISOString(), err instanceof Error ? err.name : 'send failed')
    const message = err instanceof Error && err.message ? err.message : 'Email failed to send'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  console.log('[POST /api/rd/digest]', sentAt.toISOString(), 'recipients', sentTo.length)
  return NextResponse.json({ ok: true, sentTo })
}
