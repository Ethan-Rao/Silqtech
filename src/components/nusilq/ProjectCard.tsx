'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AddNoteForm } from './AddNoteForm'
import type { OngoingProject, ActiveTarget, StalledProject, NoteEntry, SectionKey } from './types'

// ── helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00Z')
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// tNDA status → badge config
function tNDAConfig(val: string): { label: string; dot: string; pill: string } | null {
  if (!val) return null
  const lower = val.toLowerCase()
  if (lower.includes('signed'))
    return { label: 'Signed', dot: 'bg-emerald-400', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  if (lower.includes('sent') || lower.includes('pending') || lower.includes('development') || lower.includes('review') || lower.includes('awaiting'))
    return { label: val.length > 20 ? 'In Progress' : val, dot: 'bg-amber-400', pill: 'bg-amber-50 text-amber-700 border-amber-200' }
  return { label: val.length > 20 ? val.slice(0, 18) + '…' : val, dot: 'bg-slate-300', pill: 'bg-slate-50 text-slate-600 border-slate-200' }
}

// ── per-section card style ──────────────────────────────────────────────────

const CARD_ACCENT: Record<SectionKey, string> = {
  ongoing: 'border-l-[3px] border-l-silq-blue',
  targets: 'border-l-[3px] border-l-silq-teal',
  stalled: 'border-l-[3px] border-l-slate-300',
}

const HOVER_BG: Record<SectionKey, string> = {
  ongoing: 'hover:bg-silq-blue/[0.02]',
  targets: 'hover:bg-silq-teal/[0.02]',
  stalled: 'hover:bg-slate-50',
}

// ── types ──────────────────────────────────────────────────────────────────

type ProjectCardProps = {
  section: 'ongoing'
  project: OngoingProject
  onAddNote: (id: string, author: string, text: string) => void
  onEditBase: (id: string, updates: Partial<OngoingProject>) => void
  twoCol?: boolean
} | {
  section: 'targets'
  project: ActiveTarget
  onAddNote: (id: string, author: string, text: string) => void
  onEditBase: (id: string, updates: Partial<ActiveTarget>) => void
  twoCol?: boolean
} | {
  section: 'stalled'
  project: StalledProject
  onAddNote: (id: string, author: string, text: string) => void
  onEditBase: (id: string, updates: Partial<StalledProject>) => void
  twoCol?: boolean
}

// ── component ──────────────────────────────────────────────────────────────

export function ProjectCard(props: ProjectCardProps) {
  const { section, project, onAddNote, twoCol } = props
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editState, setEditState] = useState<Record<string, string>>({})

  const isEdited = project._edited

  // ── collapsed-card derived display ─────────────────────────────────────

  let subtitle = ''
  let actionLabel = ''
  let dateValue: string | null = null
  let tNDA = ''

  if (section === 'ongoing') {
    const p = project as OngoingProject
    subtitle = p.applicationDescription
    actionLabel = p.currentActionItem || p.projectStatus
    dateValue = p.lastUpdated
    tNDA = p.tNDA
  } else if (section === 'targets') {
    const p = project as ActiveTarget
    subtitle = p.application
    actionLabel = p.deviceDetails
  } else {
    const p = project as StalledProject
    subtitle = p.applicationDescription
    actionLabel = p.projectStatus
    dateValue = p.lastContact
  }

  const tNDAInfo = section === 'ongoing' ? tNDAConfig(tNDA) : null

  // ── edit helpers ───────────────────────────────────────────────────────

  const startEditing = () => {
    const base: Record<string, string> = {}
    if (section === 'ongoing') {
      const p = project as OngoingProject
      Object.assign(base, {
        companyName: p.companyName, currentActionItem: p.currentActionItem,
        projectStatus: p.projectStatus, tNDA: p.tNDA,
        lastUpdated: p.lastUpdated ?? '', applicationDescription: p.applicationDescription,
      })
    } else if (section === 'targets') {
      const p = project as ActiveTarget
      Object.assign(base, { companyName: p.companyName, application: p.application, deviceDetails: p.deviceDetails })
    } else {
      const p = project as StalledProject
      Object.assign(base, {
        companyName: p.companyName, projectStatus: p.projectStatus,
        applicationDescription: p.applicationDescription, lastContact: p.lastContact ?? '',
      })
    }
    setEditState(base)
    setEditing(true)
  }

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (section === 'ongoing') {
      props.onEditBase(project.id, {
        companyName: editState.companyName, currentActionItem: editState.currentActionItem,
        projectStatus: editState.projectStatus, tNDA: editState.tNDA,
        lastUpdated: editState.lastUpdated || null, applicationDescription: editState.applicationDescription,
      })
    } else if (section === 'targets') {
      props.onEditBase(project.id, {
        companyName: editState.companyName, application: editState.application, deviceDetails: editState.deviceDetails,
      })
    } else {
      props.onEditBase(project.id, {
        companyName: editState.companyName, projectStatus: editState.projectStatus,
        applicationDescription: editState.applicationDescription, lastContact: editState.lastContact || null,
      })
    }
    setEditing(false)
  }

  const editFields: { key: string; label: string; type?: 'date' }[] =
    section === 'ongoing'
      ? [
          { key: 'companyName', label: 'Company Name' },
          { key: 'currentActionItem', label: 'Current Action Item' },
          { key: 'projectStatus', label: 'Project Status' },
          { key: 'tNDA', label: 'tNDA' },
          { key: 'lastUpdated', label: 'Last Updated', type: 'date' },
          { key: 'applicationDescription', label: 'Application' },
        ]
      : section === 'targets'
      ? [
          { key: 'companyName', label: 'Company Name' },
          { key: 'application', label: 'Application' },
          { key: 'deviceDetails', label: 'Device Details' },
        ]
      : [
          { key: 'companyName', label: 'Company Name' },
          { key: 'projectStatus', label: 'Project Status' },
          { key: 'applicationDescription', label: 'Application' },
          { key: 'lastContact', label: 'Last Contact', type: 'date' },
        ]

  return (
    <div
      className={[
        'bg-white rounded-xl border border-slate-100 shadow-sm',
        'overflow-hidden transition-shadow duration-200 hover:shadow-md',
        CARD_ACCENT[section],
        twoCol && expanded ? 'md:col-span-2' : '',
      ].join(' ')}
    >
      {/* ── collapsed header ──────────────────────────────────────────── */}
      <button
        onClick={() => setExpanded(v => !v)}
        className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors ${HOVER_BG[section]}`}
      >
        <div className="flex-1 min-w-0">
          {/* Company name row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-800 text-[15px] leading-tight">
              {project.companyName}
            </span>
            {isEdited && (
              <span className="text-[10px] font-medium text-silq-blue bg-silq-blue/8 border border-silq-blue/20 rounded px-1.5 py-0.5 leading-none">
                edited
              </span>
            )}
            {project.source === 'manual' && (
              <span className="text-[10px] font-medium text-silq-teal bg-silq-teal/8 border border-silq-teal/20 rounded px-1.5 py-0.5 leading-none">
                manual
              </span>
            )}
          </div>

          {/* Application subtitle */}
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>
          )}

          {/* Action item / status */}
          {actionLabel && (
            <p className="text-xs text-silq-blue font-medium mt-1.5 leading-snug line-clamp-2">
              {actionLabel}
            </p>
          )}

          {/* tNDA badge — only on ongoing cards, shown inline */}
          {tNDAInfo && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${tNDAInfo.dot}`} />
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border leading-none ${tNDAInfo.pill}`}>
                tNDA {tNDAInfo.label}
              </span>
            </div>
          )}
        </div>

        {/* Right column: date + notes badge + chevron */}
        <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
          {dateValue && (
            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap tabular-nums">
              {formatDate(dateValue)}
            </span>
          )}
          {project.notes.length > 0 && (
            <span className="text-[10px] font-semibold bg-silq-blue/10 text-silq-blue rounded-full px-2 py-0.5 leading-tight whitespace-nowrap">
              {project.notes.length} note{project.notes.length !== 1 ? 's' : ''}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-slate-300 transition-transform duration-200 mt-0.5 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* ── expanded body ─────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-4 pt-4 pb-5 space-y-4">

              {/* ── field detail rows ── */}
              {!editing && (
                <dl className="space-y-2">
                  {section === 'ongoing' && (() => {
                    const p = project as OngoingProject
                    const badge = tNDAConfig(p.tNDA)
                    return (
                      <>
                        {p.currentActionItem && <Field label="Action Item" value={p.currentActionItem} />}
                        {p.projectStatus && <Field label="Status" value={p.projectStatus} />}
                        {p.applicationDescription && <Field label="Application" value={p.applicationDescription} />}
                        <div className="flex gap-3 text-sm">
                          <dt className="text-slate-400 shrink-0 w-24 pt-0.5">tNDA</dt>
                          {badge
                            ? <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badge.pill}`}>{badge.label}</span>
                            : <dd className="text-slate-500">—</dd>
                          }
                        </div>
                        <Field label="Last Updated" value={formatDate(p.lastUpdated)} />
                      </>
                    )
                  })()}
                  {section === 'targets' && (() => {
                    const p = project as ActiveTarget
                    return (
                      <>
                        {p.application && <Field label="Application" value={p.application} />}
                        {p.deviceDetails && <Field label="Device Details" value={p.deviceDetails} />}
                      </>
                    )
                  })()}
                  {section === 'stalled' && (() => {
                    const p = project as StalledProject
                    return (
                      <>
                        {p.projectStatus && <Field label="Status" value={p.projectStatus} />}
                        {p.applicationDescription && <Field label="Application" value={p.applicationDescription} />}
                        <Field label="Last Contact" value={formatDate(p.lastContact)} />
                      </>
                    )
                  })()}
                </dl>
              )}

              {/* ── edit form ── */}
              {editing && (
                <form onSubmit={submitEdit} className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-3">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Edit Info</p>
                  {editFields.map(f => (
                    <div key={f.key}>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">{f.label}</label>
                      <input
                        type={f.type === 'date' ? 'date' : 'text'}
                        value={editState[f.key] ?? ''}
                        onChange={e => setEditState(s => ({ ...s, [f.key]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-silq-blue focus:ring-2 focus:ring-silq-blue/10 outline-none text-sm bg-white text-slate-800"
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <button type="submit" className="px-4 py-2 bg-silq-blue text-white text-xs font-semibold rounded-lg hover:bg-silq-blue/90 transition-colors">
                      Save changes
                    </button>
                    <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 border border-slate-200 text-slate-600 text-xs rounded-lg hover:bg-white transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* ── edit base info link ── */}
              {!editing && (
                <button
                  onClick={startEditing}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-silq-blue transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit info
                </button>
              )}

              {/* ── notes timeline ── */}
              {project.notes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Notes</p>
                  {project.notes.map((note: NoteEntry) => (
                    <div key={note.id} className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-700">{note.author}</span>
                        <span className="text-[10px] text-slate-400">{formatDateTime(note.timestamp)}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── add note form ── */}
              <AddNoteForm onSubmit={(author, text) => onAddNote(project.id, author, text)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── field row ──────────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <dt className="text-slate-400 shrink-0 w-24">{label}</dt>
      <dd className="text-slate-700 leading-snug">{value || '—'}</dd>
    </div>
  )
}
