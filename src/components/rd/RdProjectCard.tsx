'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AddNoteForm } from '@/components/nusilq/AddNoteForm'
import type { RdFile, RdProject } from './types'

const TIER_ACCENT = {
  1: {
    border: 'border-l-[3px] border-l-silq-blue',
    text: 'text-silq-blue',
    bg: 'bg-silq-blue/8',
    hover: 'hover:bg-silq-blue/[0.02]',
    badge: 'bg-silq-blue/10 text-silq-blue border-silq-blue/20',
  },
  2: {
    border: 'border-l-[3px] border-l-silq-teal',
    text: 'text-silq-teal',
    bg: 'bg-silq-teal/8',
    hover: 'hover:bg-silq-teal/[0.02]',
    badge: 'bg-silq-teal/10 text-silq-teal border-silq-teal/20',
  },
  3: {
    border: 'border-l-[3px] border-l-amber-400',
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-50/40',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  4: {
    border: 'border-l-[3px] border-l-slate-300',
    text: 'text-slate-500',
    bg: 'bg-slate-100',
    hover: 'hover:bg-slate-50',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
  },
} as const

const NRE_BADGE: Record<string, string> = {
  'Paid': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Feasibility Initiated': 'bg-silq-blue/10 text-silq-blue border-silq-blue/20',
  'Quote Sent': 'bg-amber-50 text-amber-700 border-amber-200',
  'Internal': 'bg-violet-50 text-violet-700 border-violet-200',
}

function formatDate(iso: string | null | undefined): string {
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

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getExt(filename: string): string {
  const i = filename.lastIndexOf('.')
  return i >= 0 ? filename.slice(i + 1).toLowerCase() : ''
}

function FileIcon({ ext }: { ext: string }) {
  if (ext === 'pdf') {
    return (
      <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 3v5h5M8 15h8M8 18h5" />
      </svg>
    )
  }
  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
    return (
      <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 9h16M4 14h16M9 3v18M15 3v18" />
      </svg>
    )
  }
  if (ext === 'docx' || ext === 'doc') {
    return (
      <svg className="w-4 h-4 shrink-0 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 3v5h5M8 13h8M8 17h6" />
      </svg>
    )
  }
  return (
    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 3v5h5" />
    </svg>
  )
}

interface RdProjectCardProps {
  project: RdProject
  files: RdFile[]
  onAddNote: (id: string, author: string, text: string) => void
  onEditBase: (id: string, updates: Partial<RdProject>) => void
  compact?: boolean
}

export function RdProjectCard({ project, files, onAddNote, onEditBase, compact }: RdProjectCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const [editState, setEditState] = useState({
    companyName: '',
    application: '',
    projectStatus: '',
    lastUpdated: '',
  })

  const accent = TIER_ACCENT[project.tier]
  const tierLabel = project.tier === 4 ? 'On Hold' : `Tier ${project.tier}`
  const nreClass = NRE_BADGE[project.nreStatus]

  const startEditing = () => {
    setEditState({
      companyName: project.companyName,
      application: project.application,
      projectStatus: project.projectStatus,
      lastUpdated: project.lastUpdated ?? '',
    })
    setEditing(true)
  }

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault()
    onEditBase(project.id, {
      companyName: editState.companyName,
      application: editState.application,
      projectStatus: editState.projectStatus,
      lastUpdated: editState.lastUpdated || null,
    })
    setEditing(false)
  }

  return (
    <div
      className={[
        'bg-white rounded-xl border border-slate-100 shadow-sm',
        'overflow-hidden transition-shadow duration-200 hover:shadow-md',
        accent.border,
        project.tier === 4 ? 'opacity-80 hover:opacity-100' : '',
        expanded ? 'col-span-full' : '',
      ].join(' ')}
    >
      <button
        onClick={() => setExpanded(v => !v)}
        className={`w-full text-left ${compact ? 'px-3.5 py-3' : 'px-4 py-3.5'} flex items-start gap-3 transition-colors ${accent.hover}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold text-slate-800 leading-tight ${compact ? 'text-sm' : 'text-[15px]'}`}>
              {project.companyName}
            </span>
            {project._edited && (
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

          {(nreClass || project.isInternal) && (
            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
              {nreClass && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border leading-none ${nreClass}`}>
                  {project.nreStatus}
                </span>
              )}
              {project.isInternal && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  ⚙ Internal
                </span>
              )}
            </div>
          )}

          {project.application && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{project.application}</p>
          )}

          {project.projectStatus && (
            <p className={`text-xs font-medium mt-1.5 leading-snug line-clamp-2 ${accent.text}`}>
              {project.projectStatus}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
          {project.logoPath && !logoFailed && (
            <div className="shrink-0 w-12 h-8 flex items-center justify-end">
              <img
                src={project.logoPath}
                alt={`${project.companyName} logo`}
                className="max-h-7 max-w-[48px] object-contain opacity-75"
                onError={() => setLogoFailed(true)}
              />
            </div>
          )}
          {project.lastUpdated && (
            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap tabular-nums">
              {formatDate(project.lastUpdated)}
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
              {!editing && (
                <dl className="space-y-2">
                  <Field label="Status" value={project.projectStatus} />
                  <Field label="Application" value={project.application} />
                  <Field label="NRE Status" value={project.nreStatus} />
                  <Field label="Last Updated" value={formatDate(project.lastUpdated)} />
                  {project.isInternal && (
                    <p className="text-xs text-slate-400 italic">This is a Silq internal R&D project.</p>
                  )}
                  <div className="flex gap-3 text-sm">
                    <dt className="text-slate-400 shrink-0 w-28">Tier</dt>
                    <dd>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${accent.badge}`}>
                        {tierLabel}
                      </span>
                    </dd>
                  </div>
                </dl>
              )}

              {editing && (
                <form onSubmit={submitEdit} className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-3">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Edit Info</p>
                  {(
                    [
                      { key: 'companyName', label: 'Company Name', type: 'text' },
                      { key: 'application', label: 'Application', type: 'text' },
                      { key: 'projectStatus', label: 'Project Status', type: 'text' },
                      { key: 'lastUpdated', label: 'Last Updated', type: 'date' },
                    ] as const
                  ).map(f => (
                    <div key={f.key}>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">{f.label}</label>
                      <input
                        type={f.type === 'date' ? 'date' : 'text'}
                        value={editState[f.key]}
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

              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Files</p>
                {files.length === 0 ? (
                  <p className="text-xs text-slate-400">No files uploaded yet</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {files.map(f => (
                      f.oversized ? (
                        <div
                          key={f.filename}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-sm text-slate-400"
                        >
                          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="truncate max-w-xs">{f.filename}</span>
                          {f.description && <span className="text-xs truncate">— {f.description}</span>}
                          <span className="ml-auto text-xs font-medium text-amber-600 whitespace-nowrap">
                            Large file — contact Ethan
                          </span>
                        </div>
                      ) : (
                        <a
                          key={f.filename}
                          href={`/api/rd/download?slug=${project.id}&file=${encodeURIComponent(f.filename)}`}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-silq-blue/40 hover:bg-silq-blue/5 transition-all text-sm text-slate-700 hover:text-silq-blue"
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileIcon ext={getExt(f.filename)} />
                          <span className="font-medium truncate max-w-xs">{f.filename}</span>
                          {f.description && <span className="text-xs text-slate-400 truncate">— {f.description}</span>}
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>

              {project.notes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Notes</p>
                  {project.notes.map(note => (
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

              <AddNoteForm onSubmit={(author, text) => onAddNote(project.id, author, text)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <dt className="text-slate-400 shrink-0 w-28">{label}</dt>
      <dd className="text-slate-700 leading-snug">{value || '—'}</dd>
    </div>
  )
}
