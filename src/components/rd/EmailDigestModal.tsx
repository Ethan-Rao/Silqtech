'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RdProject, RdProjectsData } from './types'

const RECIPIENTS_KEY = 'rd-digest-recipients'
const DASHBOARD_PASSWORD = 'Membrane1'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_RECIPIENTS = 20

const SECTIONS = [
  { key: 'tier1' as const, title: 'Tier 1 — Immediate Action', border: 'border-l-silq-blue', titleClass: 'text-silq-blue' },
  { key: 'tier2' as const, title: 'Tier 2 — Awaiting Partner', border: 'border-l-silq-teal', titleClass: 'text-silq-teal' },
  { key: 'tier3' as const, title: 'Tier 3 — Pending Follow-Up', border: 'border-l-amber-500', titleClass: 'text-amber-600' },
]

function parseRecipients(raw: string): { valid: string[]; invalid: string[] } {
  const seen = new Set<string>()
  const valid: string[] = []
  const invalid: string[] = []
  for (const token of raw.split(/[,;\n]+/)) {
    const email = token.trim().toLowerCase()
    if (!email || seen.has(email)) continue
    seen.add(email)
    if (EMAIL_PATTERN.test(email)) valid.push(email)
    else invalid.push(email)
  }
  return { valid, invalid }
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

interface EmailDigestModalProps {
  projects: RdProjectsData
  onClose: () => void
}

export function EmailDigestModal({ projects, onClose }: EmailDigestModalProps) {
  const [recipients, setRecipients] = useState('')
  const [intro, setIntro] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sentTo, setSentTo] = useState<string[] | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(RECIPIENTS_KEY)
    if (saved) setRecipients(saved)
  }, [])

  const parsed = useMemo(() => parseRecipients(recipients), [recipients])
  const tooMany = parsed.valid.length > MAX_RECIPIENTS
  const canSend = parsed.valid.length > 0 && parsed.invalid.length === 0 && !tooMany && !sending

  const handleClose = () => {
    if (sending) return
    onClose()
  }

  const handleSend = async () => {
    if (!canSend) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/rd/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: DASHBOARD_PASSWORD,
          intro: intro.trim(),
          recipients: parsed.valid,
          projects,
        }),
      })
      const body = await res.json().catch(() => ({})) as { error?: string; sentTo?: string[] }
      if (!res.ok) {
        setError(body.error || 'Email failed to send')
        setSending(false)
        return
      }
      const sent = body.sentTo ?? parsed.valid
      localStorage.setItem(RECIPIENTS_KEY, sent.join(', '))
      setSentTo(sent)
      setSending(false)
    } catch {
      setError('Email failed to send')
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="digest-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          key="digest-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-silq-dark">Email the R&D team</h2>
            <button
              onClick={handleClose}
              disabled={sending}
              className="text-silq-dark/40 hover:text-silq-dark transition-colors p-1 disabled:opacity-40"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {sentTo ? (
            <div className="pt-4">
              <p className="text-sm text-slate-700">Sent to {sentTo.join(', ')}</p>
              <button
                onClick={onClose}
                className="mt-6 px-4 py-2 rounded-lg bg-silq-blue text-white text-sm font-semibold hover:bg-silq-blue/90"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-5">
                Sends Tiers 1–3 as they look on this dashboard. Files and On Hold projects are not included.
              </p>

              <label className="block text-sm font-medium text-silq-dark mb-1" htmlFor="rd-digest-to">To</label>
              <textarea
                id="rd-digest-to"
                value={recipients}
                onChange={e => setRecipients(e.target.value)}
                rows={2}
                placeholder="name@company.com, other@company.com"
                className="w-full px-3 py-2 rounded-lg border border-silq-dark/20 focus:border-silq-blue focus:ring-1 focus:ring-silq-blue/20 outline-none text-sm"
              />
              {parsed.invalid.length > 0 && (
                <p className="text-red-500 text-xs mt-1">Check the email addresses.</p>
              )}
              {tooMany && (
                <p className="text-red-500 text-xs mt-1">Send to 20 recipients or fewer.</p>
              )}

              <label className="block text-sm font-medium text-silq-dark mt-4 mb-1" htmlFor="rd-digest-note">
                Note for this update
              </label>
              <textarea
                id="rd-digest-note"
                value={intro}
                onChange={e => setIntro(e.target.value)}
                maxLength={2000}
                rows={3}
                placeholder="Optional context for the team"
                className="w-full px-3 py-2 rounded-lg border border-silq-dark/20 focus:border-silq-blue focus:ring-1 focus:ring-silq-blue/20 outline-none text-sm resize-none"
              />

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Preview</p>
                {intro.trim() && (
                  <p className="text-sm text-slate-700 whitespace-pre-wrap mb-4">{intro.trim()}</p>
                )}
                {SECTIONS.map(section => {
                  const items = projects[section.key] ?? []
                  return (
                    <div key={section.key} className="mb-4 last:mb-0">
                      <h3 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${section.titleClass}`}>
                        {section.title}
                      </h3>
                      {items.length === 0 ? (
                        <p className="text-sm text-slate-400">None.</p>
                      ) : items.map(project => (
                        <PreviewProject key={project.id} project={project} border={section.border} />
                      ))}
                    </div>
                  )
                })}
              </div>

              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

              <div className="flex gap-3 pt-5">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={sending}
                  className="flex-1 py-2 rounded-lg border border-silq-dark/20 text-silq-dark text-sm font-medium hover:bg-silq-cream transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend}
                  className="flex-1 py-2 rounded-lg bg-silq-blue text-white text-sm font-semibold hover:bg-silq-blue/90 transition-colors disabled:opacity-40"
                >
                  {sending ? 'Sending…' : 'Send update'}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function PreviewProject({ project, border }: { project: RdProject; border: string }) {
  const notes = project.notes ?? []
  return (
    <div className={`mb-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 border-l-4 ${border}`}>
      <p className="text-sm font-semibold text-slate-800">
        {project.companyName}
        {project.isInternal && <span className="ml-2 text-[10px] font-semibold text-violet-700">Internal</span>}
      </p>
      <p className="text-xs text-slate-500 mt-0.5">Application: {project.application || '—'}</p>
      <p className="text-sm text-slate-700 mt-1">{project.projectStatus || '—'}</p>
      {project.nreStatus && <p className="text-xs text-slate-500 mt-1">NRE: {project.nreStatus}</p>}
      <p className="text-xs text-slate-500 mt-0.5">Last updated: {formatDay(project.lastUpdated)}</p>
      {notes.length > 0 && (
        <div className="mt-2 rounded-lg bg-slate-50 px-2.5 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Notes</p>
          {notes.map(note => (
            <div key={note.id} className="mt-1.5">
              <p className="text-[11px] text-slate-400">{note.author} — {formatNoteWhen(note.timestamp)}</p>
              <p className="text-xs text-slate-600 whitespace-pre-wrap">{note.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
