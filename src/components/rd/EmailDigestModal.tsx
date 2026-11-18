'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RdProject, RdProjectsData } from './types'
import { RD_TEAM, prioritiesFor } from '@/lib/rd/team'

const RECIPIENTS_KEY = 'rd-digest-recipients'
const DASHBOARD_PASSWORD = 'Membrane1'

const CLASS_SECTIONS = [
  { key: 'tier1' as const, title: 'Class I — Immediate Action', border: 'border-l-silq-blue', titleClass: 'text-silq-blue' },
  { key: 'tier2' as const, title: 'Class II — Awaiting Partner', border: 'border-l-silq-teal', titleClass: 'text-silq-teal' },
]

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
  const [selected, setSelected] = useState<string[]>(RD_TEAM.map(member => member.email))
  const [previewEmail, setPreviewEmail] = useState(RD_TEAM[0].email)
  const [intro, setIntro] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sentTo, setSentTo] = useState<string[] | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(RECIPIENTS_KEY)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved) as unknown
      if (!Array.isArray(parsed)) return
      const emails = parsed.filter((email): email is string =>
        typeof email === 'string' && RD_TEAM.some(member => member.email === email)
      )
      if (emails.length > 0) {
        setSelected(emails)
        setPreviewEmail(emails[0])
      }
    } catch {
      // Older saves were a plain address string. Start from the full team.
    }
  }, [])

  const previewMember = RD_TEAM.find(member => member.email === previewEmail) ?? RD_TEAM[0]
  const personal = useMemo(
    () => prioritiesFor(projects, previewMember.name),
    [projects, previewMember.name],
  )
  const canSend = selected.length > 0 && !sending

  const toggle = (email: string) => {
    setSelected(current => {
      const next = current.includes(email) ? current.filter(item => item !== email) : [...current, email]
      if (!next.includes(previewEmail) && next.length > 0) setPreviewEmail(next[0])
      return next
    })
  }

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
          recipients: selected,
          projects,
        }),
      })
      const body = await res.json().catch(() => ({})) as { error?: string; sentTo?: string[] }
      if (!res.ok) {
        setError(body.error || 'Email failed to send')
        setSending(false)
        return
      }
      const sent = body.sentTo ?? selected
      localStorage.setItem(RECIPIENTS_KEY, JSON.stringify(sent))
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
                Each person gets their own email. Their projects are listed first, then every Class I and Class II project. Pending Follow-Up, On Hold, and files are not included.
              </p>

              <p className="block text-sm font-medium text-silq-dark mb-2">To</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {RD_TEAM.map(member => (
                  <label key={member.email} className="flex items-start gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={selected.includes(member.email)}
                      onChange={() => toggle(member.email)}
                    />
                    <span>
                      <span className="font-medium text-slate-800">{member.name}</span>
                      <span className="block text-xs text-slate-400">{member.email}</span>
                    </span>
                  </label>
                ))}
              </div>

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
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Preview</p>
                  <label className="text-xs text-slate-500 flex items-center gap-2">
                    As
                    <select
                      value={previewMember.email}
                      onChange={e => setPreviewEmail(e.target.value)}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
                    >
                      {RD_TEAM.filter(member => selected.includes(member.email)).map(member => (
                        <option key={member.email} value={member.email}>{member.name}</option>
                      ))}
                    </select>
                  </label>
                </div>
                {intro.trim() && (
                  <p className="text-sm text-slate-700 whitespace-pre-wrap mb-4">{intro.trim()}</p>
                )}
                <PreviewSection title={`${previewMember.name} Action Items`} titleClass="text-slate-700" border="border-l-slate-800" projects={personal} />
                {CLASS_SECTIONS.map(section => (
                  <PreviewSection
                    key={section.key}
                    title={section.title}
                    titleClass={section.titleClass}
                    border={section.border}
                    projects={projects[section.key] ?? []}
                  />
                ))}
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

function PreviewSection({
  title,
  titleClass,
  border,
  projects,
}: {
  title: string
  titleClass: string
  border: string
  projects: RdProject[]
}) {
  return (
    <div className="mb-4 last:mb-0">
      <h3 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${titleClass}`}>{title}</h3>
      {projects.length === 0 ? (
        <p className="text-sm text-slate-400">None.</p>
      ) : projects.map(project => (
        <PreviewProject key={`${title}-${project.id}`} project={project} border={border} />
      ))}
    </div>
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
