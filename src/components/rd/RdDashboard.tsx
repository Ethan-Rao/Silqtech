'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { RdProjectCard } from './RdProjectCard'
import { AddProjectModal } from './AddProjectModal'
import { loadOverlay, saveOverlay, mergeData } from './overlay'
import type {
  RdProjectsData,
  RdFilesManifest,
  RdProject,
  NoteEntry,
  Overlay,
  TierKey,
} from './types'

function mergeOverlays(a: Overlay, b: Overlay): Overlay {
  const allIds = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]))
  const merged: Overlay = {}
  for (const id of allIds) {
    const ea = a[id] ?? {}
    const eb = b[id] ?? {}
    const noteMap = new Map<string, NoteEntry>()
    for (const n of ea.notes ?? []) noteMap.set(n.id, n)
    for (const n of eb.notes ?? []) noteMap.set(n.id, n)
    const notes = Array.from(noteMap.values()).sort((x, y) => x.timestamp.localeCompare(y.timestamp))
    const baseOverride =
      ea.baseOverride || eb.baseOverride
        ? { ...(ea.baseOverride ?? {}), ...(eb.baseOverride ?? {}) }
        : undefined
    merged[id] = {
      ...(notes.length ? { notes } : {}),
      ...(baseOverride ? { baseOverride } : {}),
    }
  }
  return merged
}

async function fetchSpacesOverlay(): Promise<Overlay> {
  const res = await fetch('/api/rd/notes', { cache: 'no-store' })
  if (!res.ok) return {}
  return (await res.json()) as Overlay
}

async function pushSpacesOverlay(overlay: Overlay): Promise<void> {
  const res = await fetch('/api/rd/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(overlay),
  })
  if (!res.ok) throw new Error('Notes sync failed')
}

function sortByDate(items: RdProject[]): RdProject[] {
  return [...items].sort((a, b) => {
    if (!a.lastUpdated && !b.lastUpdated) return 0
    if (!a.lastUpdated) return 1
    if (!b.lastUpdated) return -1
    return b.lastUpdated.localeCompare(a.lastUpdated)
  })
}

interface RdDashboardProps {
  baseData: RdProjectsData
  filesManifest: RdFilesManifest
}

export function RdDashboard({ baseData, filesManifest }: RdDashboardProps) {
  const [data, setData] = useState<RdProjectsData>(baseData)
  const [overlay, setOverlay] = useState<Overlay>({})
  const [search, setSearch] = useState('')
  const [addTier, setAddTier] = useState<1 | 2 | 3 | 4 | null>(null)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')

  useEffect(() => {
    const local = loadOverlay()
    setOverlay(local)
    setData(mergeData(baseData, local))

    setSyncStatus('syncing')
    fetchSpacesOverlay()
      .then(spaces => {
        const merged = mergeOverlays(spaces, local)
        setOverlay(merged)
        saveOverlay(merged)
        setData(mergeData(baseData, merged))
        return pushSpacesOverlay(merged)
      })
      .then(() => setSyncStatus('synced'))
      .catch(() => setSyncStatus('error'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseData])

  const updateOverlay = useCallback(
    (newOverlay: Overlay) => {
      setOverlay(newOverlay)
      saveOverlay(newOverlay)
      setData(mergeData(baseData, newOverlay))
      setSyncStatus('syncing')
      pushSpacesOverlay(newOverlay)
        .then(() => setSyncStatus('synced'))
        .catch(() => setSyncStatus('error'))
    },
    [baseData],
  )

  const handleAddNote = useCallback(
    (id: string, author: string, text: string) => {
      const note: NoteEntry = {
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: new Date().toISOString(),
        author,
        text,
      }
      const newOverlay: Overlay = {
        ...overlay,
        [id]: { ...overlay[id], notes: [...(overlay[id]?.notes ?? []), note] },
      }
      updateOverlay(newOverlay)
    },
    [overlay, updateOverlay],
  )

  const handleEditBase = useCallback(
    (id: string, updates: Partial<RdProject>) => {
      const newOverlay: Overlay = {
        ...overlay,
        [id]: {
          ...overlay[id],
          baseOverride: { ...(overlay[id]?.baseOverride ?? {}), ...updates },
        },
      }
      updateOverlay(newOverlay)
    },
    [overlay, updateOverlay],
  )

  const handleAddProject = useCallback(
    (project: RdProject) => {
      const newOverlay: Overlay = {
        ...overlay,
        [project.id]: {
          baseOverride: { ...project, source: 'manual' },
          notes: [],
        },
      }
      updateOverlay(newOverlay)
      setAddTier(null)
    },
    [overlay, updateOverlay],
  )

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rd-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const q = search.toLowerCase()
  const matches = (p: RdProject) =>
    p.companyName.toLowerCase().includes(q) ||
    p.application.toLowerCase().includes(q) ||
    p.projectStatus.toLowerCase().includes(q)

  const filtered: Record<TierKey, RdProject[]> = {
    tier1: sortByDate(data.tier1.filter(matches)),
    tier2: sortByDate(data.tier2.filter(matches)),
    tier3: sortByDate(data.tier3.filter(matches)),
    tier4: sortByDate((data.tier4 ?? []).filter(matches)),
  }

  const generated = baseData.generated
    ? new Date(baseData.generated).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '—'

  return (
    <div className="min-h-screen bg-[#F4F5F7] pt-20">
      <div className="sticky top-20 z-40 bg-[#1C2333] border-b border-white/5 shadow-lg">
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center gap-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search companies…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/8 border border-white/12 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-silq-teal/60 focus:bg-white/12 transition-all"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xs text-white/30 hidden lg:block">Data synced {generated}</span>
            {syncStatus === 'syncing' && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/35">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Syncing…
              </span>
            )}
            {syncStatus === 'synced' && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-emerald-400/70">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Synced
              </span>
            )}
            {syncStatus === 'error' && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-amber-400/70" title="Notes saved locally — cloud sync unavailable">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                </svg>
                Local only
              </span>
            )}
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 text-xs px-3.5 py-2 rounded-lg border border-white/15 text-white/55 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-screen-2xl mx-auto px-8 py-5">
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-silq-dark tracking-tight">
                Silq R&D Project Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-1">Last data refresh: {generated}</p>
            </div>
            <div className="shrink-0">
              <Image
                src="/images/branding/logo-oneline.webp"
                alt="Silq Technologies"
                width={180}
                height={48}
                className="h-10 w-auto object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        <TierSection
          title="Tier 1 — Immediate Action"
          accent="blue"
          projects={filtered.tier1}
          filesManifest={filesManifest}
          columns="md:grid-cols-2"
          onAdd={() => setAddTier(1)}
          onAddNote={handleAddNote}
          onEditBase={handleEditBase}
        />
        <TierSection
          title="Tier 2 — Awaiting Partner"
          accent="teal"
          projects={filtered.tier2}
          filesManifest={filesManifest}
          columns="md:grid-cols-2"
          onAdd={() => setAddTier(2)}
          onAddNote={handleAddNote}
          onEditBase={handleEditBase}
        />
        <TierSection
          title="Tier 3 — Pending Follow-Up"
          accent="amber"
          projects={filtered.tier3}
          filesManifest={filesManifest}
          columns="md:grid-cols-2 lg:grid-cols-3"
          compact
          onAdd={() => setAddTier(3)}
          onAddNote={handleAddNote}
          onEditBase={handleEditBase}
        />
        <TierSection
          title="On Hold"
          accent="muted"
          projects={filtered.tier4}
          filesManifest={filesManifest}
          columns="md:grid-cols-2 lg:grid-cols-3"
          compact
          collapsible
          defaultCollapsed
          onAdd={() => setAddTier(4)}
          onAddNote={handleAddNote}
          onEditBase={handleEditBase}
        />
      </main>

      {addTier && (
        <AddProjectModal
          tier={addTier}
          onAdd={handleAddProject}
          onClose={() => setAddTier(null)}
        />
      )}
    </div>
  )
}

const ACCENT_CONFIG = {
  blue:  { bar: 'bg-silq-blue', text: 'text-silq-blue', border: 'border-silq-blue/30' },
  teal:  { bar: 'bg-silq-teal', text: 'text-silq-teal', border: 'border-silq-teal/30' },
  amber: { bar: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200' },
  muted: { bar: 'bg-slate-400', text: 'text-slate-500', border: 'border-slate-300' },
} as const

function TierSection({
  title,
  accent,
  projects,
  filesManifest,
  columns,
  compact,
  collapsible,
  defaultCollapsed,
  onAdd,
  onAddNote,
  onEditBase,
}: {
  title: string
  accent: 'blue' | 'teal' | 'amber' | 'muted'
  projects: RdProject[]
  filesManifest: RdFilesManifest
  columns: string
  compact?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
  onAdd: () => void
  onAddNote: (id: string, author: string, text: string) => void
  onEditBase: (id: string, updates: Partial<RdProject>) => void
}) {
  const [open, setOpen] = useState(!defaultCollapsed)
  const { bar, text, border } = ACCENT_CONFIG[accent]
  const collapsed = !!collapsible && !open

  return (
    <section className="flex flex-col gap-3">
      <div className={`flex items-center justify-between py-2 border-b ${border}`}>
        {collapsed ? (
          <button
            onClick={() => setOpen(true)}
            className={`inline-flex items-center gap-2 font-semibold text-sm ${text}`}
          >
            <span aria-hidden>▶</span>
            Show On Hold ({projects.length})
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className={`w-1 h-5 rounded-full ${bar}`} />
            <h2 className={`font-semibold text-sm uppercase tracking-widest ${text}`}>
              {title}
              <span className="font-normal normal-case tracking-normal text-sm opacity-60 ml-2">
                ({projects.length})
              </span>
            </h2>
            {collapsible && (
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 ml-2"
              >
                Hide
              </button>
            )}
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-silq-blue hover:border-silq-blue/40 hover:shadow-sm transition-all font-medium"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        )}
      </div>
      {!collapsed && (
        projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={`grid grid-cols-1 ${columns} gap-3`}>
            {projects.map(p => (
              <RdProjectCard
                key={p.id}
                project={p}
                files={filesManifest[p.id] ?? []}
                onAddNote={onAddNote}
                onEditBase={onEditBase}
                compact={compact}
              />
            ))}
          </div>
        )
      )}
    </section>
  )
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-10 text-slate-400 text-sm">
      No projects match your search.
    </div>
  )
}
