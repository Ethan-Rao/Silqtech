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
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function tNDABadge(val: string) {
  if (!val) return null
  const lower = val.toLowerCase()
  if (lower.includes('signed')) return { label: 'Signed', cls: 'bg-green-100 text-green-700' }
  if (lower.includes('sent') || lower.includes('pending') || lower.includes('development') || lower.includes('review') || lower.includes('awaiting'))
    return { label: val, cls: 'bg-yellow-100 text-yellow-700' }
  return { label: val, cls: 'bg-silq-light text-silq-dark/60' }
}

// ── accent per section ─────────────────────────────────────────────────────

const ACCENTS: Record<SectionKey, string> = {
  ongoing: 'border-l-4 border-silq-blue',
  targets: 'border-l-4 border-silq-teal',
  stalled: 'border-l-4 border-silq-dark/30',
}

// ── sub-types ──────────────────────────────────────────────────────────────

type ProjectCardProps = {
  section: 'ongoing'
  project: OngoingProject
  onAddNote: (id: string, author: string, text: string) => void
  onEditBase: (id: string, updates: Partial<OngoingProject>) => void
} | {
  section: 'targets'
  project: ActiveTarget
  onAddNote: (id: string, author: string, text: string) => void
  onEditBase: (id: string, updates: Partial<ActiveTarget>) => void
} | {
  section: 'stalled'
  project: StalledProject
  onAddNote: (id: string, author: string, text: string) => void
  onEditBase: (id: string, updates: Partial<StalledProject>) => void
}

// ── component ──────────────────────────────────────────────────────────────

export function ProjectCard(props: ProjectCardProps) {
  const { section, project, onAddNote } = props
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editState, setEditState] = useState<Record<string, string>>({})

  const accentClass = ACCENTS[section]
  const isEdited = project._edited

  // ── derived display fields ─────────────────────────────────────────────

  let subtitle = ''
  let actionLabel = ''
  let dateValue: string | null = null

  if (section === 'ongoing') {
    const p = project as OngoingProject
    subtitle = p.applicationDescription
    actionLabel = p.currentActionItem || p.projectStatus
    dateValue = p.lastUpdated
  } else if (section === 'targets') {
    const p = project as ActiveTarget
    subtitle = p.application
    actionLabel = p.deviceDetails
    dateValue = null
  } else {
    const p = project as StalledProject
    subtitle = p.applicationDescription
    actionLabel = p.projectStatus
    dateValue = p.lastContact
  }

  // ── edit form helpers ──────────────────────────────────────────────────

  const startEditing = () => {
    const base: Record<string, string> = {}
    if (section === 'ongoing') {
      const p = project as OngoingProject
      base.companyName = p.companyName
      base.currentActionItem = p.currentActionItem
      base.projectStatus = p.projectStatus
      base.tNDA = p.tNDA
      base.lastUpdated = p.lastUpdated ?? ''
      base.applicationDescription = p.applicationDescription
    } else if (section === 'targets') {
      const p = project as ActiveTarget
      base.companyName = p.companyName
      base.application = p.application
      base.deviceDetails = p.deviceDetails
    } else {
      const p = project as StalledProject
      base.companyName = p.companyName
      base.projectStatus = p.projectStatus
      base.applicationDescription = p.applicationDescription
      base.lastContact = p.lastContact ?? ''
    }
    setEditState(base)
    setEditing(true)
  }

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (section === 'ongoing') {
      props.onEditBase(project.id, {
        companyName: editState.companyName,
        currentActionItem: editState.currentActionItem,
        projectStatus: editState.projectStatus,
        tNDA: editState.tNDA,
        lastUpdated: editState.lastUpdated || null,
        applicationDescription: editState.applicationDescription,
      })
    } else if (section === 'targets') {
      props.onEditBase(project.id, {
        companyName: editState.companyName,
        application: editState.application,
        deviceDetails: editState.deviceDetails,
      })
    } else {
      props.onEditBase(project.id, {
        companyName: editState.companyName,
        projectStatus: editState.projectStatus,
        applicationDescription: editState.applicationDescription,
        lastContact: editState.lastContact || null,
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
          { key: 'applicationDescription', label: 'Application Description' },
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
          { key: 'applicationDescription', label: 'Application Description' },
          { key: 'lastContact', label: 'Last Contact', type: 'date' },
        ]

  return (
    <div className={`bg-white rounded-xl shadow-sm ${accentClass} overflow-hidden mb-3`}>
      {/* ── collapsed header ── */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left px-4 py-4 flex items-start gap-3 hover:bg-silq-cream/40 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-silq-dark text-base leading-tight">{project.companyName}</span>
            {isEdited && (
              <span className="text-[10px] font-medium text-silq-blue/70 bg-silq-blue/10 rounded px-1.5 py-0.5">✎ edited</span>
            )}
            {project.source === 'manual' && (
              <span className="text-[10px] font-medium text-silq-teal/70 bg-silq-teal/10 rounded px-1.5 py-0.5">manual</span>
            )}
          </div>
          {subtitle && <p className="text-sm text-silq-dark/60 mt-0.5 truncate">{subtitle}</p>}
          {actionLabel && (
            <p className="text-sm text-silq-blue font-medium mt-1 truncate">{actionLabel}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {(section === 'ongoing' || section === 'stalled') && (
            <span className="text-xs text-silq-dark/40 whitespace-nowrap">{formatDate(dateValue)}</span>
          )}
          {project.notes.length > 0 && (
            <span className="text-[10px] bg-silq-blue/10 text-silq-blue rounded-full px-2 py-0.5 font-medium">
              {project.notes.length} note{project.notes.length !== 1 ? 's' : ''}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-silq-dark/30 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* ── expanded body ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-silq-light pt-3 space-y-4">

              {/* ── field rows ── */}
              {!editing && (
                <dl className="grid grid-cols-1 gap-2 text-sm">
                  {section === 'ongoing' && (() => {
                    const p = project as OngoingProject
                    const badge = tNDABadge(p.tNDA)
                    return (
                      <>
                        {p.currentActionItem && <Field label="Current Action Item" value={p.currentActionItem} />}
                        {p.projectStatus && <Field label="Project Status" value={p.projectStatus} />}
                        {p.applicationDescription && <Field label="Application" value={p.applicationDescription} />}
                        <div className="flex gap-2 items-center">
                          <dt className="text-silq-dark/50 shrink-0">tNDA</dt>
                          {badge
                            ? <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                            : <dd className="text-silq-dark">—</dd>
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
                        {p.projectStatus && <Field label="Project Status" value={p.projectStatus} />}
                        {p.applicationDescription && <Field label="Application" value={p.applicationDescription} />}
                        <Field label="Last Contact" value={formatDate(p.lastContact)} />
                      </>
                    )
                  })()}
                </dl>
              )}

              {/* ── edit form ── */}
              {editing && (
                <form onSubmit={submitEdit} className="space-y-3 bg-silq-cream rounded-xl p-4">
                  <p className="text-xs font-semibold text-silq-dark/50 uppercase tracking-wider">Edit Info</p>
                  {editFields.map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-silq-dark/60 mb-1">{f.label}</label>
                      <input
                        type={f.type === 'date' ? 'date' : 'text'}
                        value={editState[f.key] ?? ''}
                        onChange={e => setEditState(s => ({ ...s, [f.key]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-silq-dark/15 focus:border-silq-blue focus:ring-1 focus:ring-silq-blue/20 outline-none text-sm bg-white"
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-silq-blue text-white text-sm font-semibold rounded-lg hover:bg-silq-blue/90 transition-colors">Save</button>
                    <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 border border-silq-dark/20 text-silq-dark text-sm rounded-lg hover:bg-white transition-colors">Cancel</button>
                  </div>
                </form>
              )}

              {/* ── edit base info button ── */}
              {!editing && (
                <button
                  onClick={startEditing}
                  className="text-xs text-silq-dark/40 hover:text-silq-blue transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit base info
                </button>
              )}

              {/* ── notes timeline ── */}
              {project.notes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-silq-dark/50 uppercase tracking-wider">Notes</p>
                  {project.notes.map((note: NoteEntry) => (
                    <div key={note.id} className="bg-silq-cream rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-silq-dark">{note.author}</span>
                        <span className="text-[10px] text-silq-dark/40">{formatDateTime(note.timestamp)}</span>
                      </div>
                      <p className="text-sm text-silq-dark/80 whitespace-pre-wrap">{note.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── add note form ── */}
              <AddNoteForm
                onSubmit={(author, text) => onAddNote(project.id, author, text)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── tiny helper sub-component ──────────────────────────────────────────────

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-silq-dark/50 shrink-0 w-28">{label}</dt>
      <dd className="text-silq-dark">{value || '—'}</dd>
    </div>
  )
}
