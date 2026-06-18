'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ProjectCard } from './ProjectCard'
import { AddProjectModal } from './AddProjectModal'
import { loadOverlay, saveOverlay } from './overlay'
import type {
  ProjectsData,
  OngoingProject,
  ActiveTarget,
  StalledProject,
  NoteEntry,
  SectionKey,
  Overlay,
} from './types'

// ── localStorage note: per-browser per-device only.
// For cross-device sync, migrate to an API route writing to a persistent volume.

function mergeData(base: ProjectsData, overlay: Overlay): ProjectsData {
  function applyOverlay<T extends { id: string; notes: NoteEntry[] }>(items: T[]): T[] {
    return items.map(item => {
      const entry = overlay[item.id]
      if (!entry) return item
      return {
        ...item,
        ...(entry.baseOverride ?? {}),
        notes: [...item.notes, ...(entry.notes ?? [])],
        _edited: !!entry.baseOverride,
      }
    })
  }

  const manualOngoing = Object.values(overlay)
    .filter(e => e.baseOverride?.source === 'manual' && e.baseOverride?.companyName)
    .map(e => e.baseOverride as OngoingProject)
    .filter(p => !base.ongoing.find(x => x.id === p.id))

  const manualTargets = Object.values(overlay)
    .filter(e => e.baseOverride?.source === 'manual' && e.baseOverride?.application !== undefined && !e.baseOverride?.projectStatus)
    .map(e => e.baseOverride as ActiveTarget)
    .filter(p => !base.targets.find(x => x.id === p.id))

  const manualStalled = Object.values(overlay)
    .filter(e => e.baseOverride?.source === 'manual' && e.baseOverride?.lastContact !== undefined && !e.baseOverride?.currentActionItem)
    .map(e => e.baseOverride as StalledProject)
    .filter(p => !base.stalled.find(x => x.id === p.id))

  return {
    ...base,
    ongoing: [...applyOverlay(base.ongoing), ...manualOngoing],
    targets: [...applyOverlay(base.targets), ...manualTargets],
    stalled: [...applyOverlay(base.stalled), ...manualStalled],
  }
}

interface NusilqDashboardProps {
  baseData: ProjectsData
}

export function NusilqDashboard({ baseData }: NusilqDashboardProps) {
  const [data, setData] = useState<ProjectsData>(baseData)
  const [overlay, setOverlay] = useState<Overlay>({})
  const [search, setSearch] = useState('')
  const [addModalSection, setAddModalSection] = useState<SectionKey | null>(null)

  // ResizeObserver: keeps Active Targets exactly as tall as Ongoing Projects
  const ongoingRef = useRef<HTMLElement>(null)
  const [ongoingHeight, setOngoingHeight] = useState<number | null>(null)

  useEffect(() => {
    const el = ongoingRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setOngoingHeight(el.offsetHeight))
    ro.observe(el)
    setOngoingHeight(el.offsetHeight)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const ov = loadOverlay()
    setOverlay(ov)
    setData(mergeData(baseData, ov))
  }, [baseData])

  const updateOverlay = useCallback(
    (newOverlay: Overlay) => {
      setOverlay(newOverlay)
      saveOverlay(newOverlay)
      setData(mergeData(baseData, newOverlay))
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
    (id: string, updates: Partial<OngoingProject & ActiveTarget & StalledProject>) => {
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
    (project: OngoingProject | ActiveTarget | StalledProject) => {
      const section = addModalSection!
      const newOverlay: Overlay = {
        ...overlay,
        [project.id]: {
          baseOverride: { ...project, source: 'manual' } as Partial<OngoingProject & ActiveTarget & StalledProject>,
          notes: [],
        },
      }
      const newBase = {
        ...baseData,
        [section]: [...(baseData[section] as (OngoingProject | ActiveTarget | StalledProject)[]), project],
      } as ProjectsData
      saveOverlay(newOverlay)
      setOverlay(newOverlay)
      setData(mergeData(newBase, newOverlay))
      setAddModalSection(null)
    },
    [addModalSection, overlay, baseData],
  )

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nusilq-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const q = search.toLowerCase()
  const filteredOngoing = data.ongoing.filter(p => p.companyName.toLowerCase().includes(q))
  const filteredTargets = data.targets.filter(p => p.companyName.toLowerCase().includes(q))
  const filteredStalled = data.stalled.filter(p => p.companyName.toLowerCase().includes(q))

  const generated = baseData.generated
    ? new Date(baseData.generated).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '—'

  return (
    // pt-20 accounts for the fixed site header (h-20 = 80px)
    <div className="min-h-screen bg-[#F4F5F7] pt-20">

      {/* ── STICKY TOOLBAR ──────────────────────────────────────────────── */}
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

      {/* ── TITLE / LOGO BANNER ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-screen-2xl mx-auto px-8 py-5">
          <div className="flex items-center gap-8">

            {/* Title — takes all available space */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-silq-dark tracking-tight">
                NuSil — Silq Project Dashboard
              </h1>
            </div>

            {/* Combo logo (SILQ + avantor|NuSil stacked) — right side */}
            <div className="shrink-0">
              <Image
                src="/images/logos/silq-nusil-combo.jpg"
                alt="Silq Technologies × Avantor NuSil"
                width={200}
                height={100}
                className="h-16 w-auto object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Top row: Ongoing (2/3) + Active Targets (1/3, height-matched) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">

          {/* ── Ongoing Projects — 2/3 width, 2-col card grid ── */}
          <section ref={ongoingRef} className="xl:col-span-2 flex flex-col gap-3">
            <SectionHeader
              title="Ongoing Projects"
              accent="blue"
              onAdd={() => setAddModalSection('ongoing')}
            />
            {filteredOngoing.length === 0
              ? <EmptyState />
              : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredOngoing.map(p => (
                    <ProjectCard
                      key={p.id}
                      section="ongoing"
                      project={p}
                      onAddNote={handleAddNote}
                      onEditBase={handleEditBase}
                      twoCol
                    />
                  ))}
                </div>
              )
            }
          </section>

          {/* ── Active Targets — 1/3 width, same height as Ongoing, card list scrolls ── */}
          <section
            className="xl:col-span-1 flex flex-col gap-3"
            style={ongoingHeight ? { height: `${ongoingHeight}px` } : undefined}
          >
            <SectionHeader
              title="Active Targets"
              accent="teal"
              onAdd={() => setAddModalSection('targets')}
            />
            {/* min-h-0 is required so the flex child can shrink below its content size */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-2.5 pr-0.5">
              {filteredTargets.length === 0
                ? <EmptyState />
                : filteredTargets.map(p => (
                    <ProjectCard
                      key={p.id}
                      section="targets"
                      project={p}
                      onAddNote={handleAddNote}
                      onEditBase={handleEditBase}
                    />
                  ))
              }
            </div>
          </section>
        </div>

        {/* ── Stalled Projects — full width ── */}
        <section className="flex flex-col gap-3">
          <SectionHeader
            title="Stalled Projects"
            accent="muted"
            onAdd={() => setAddModalSection('stalled')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredStalled.length === 0
              ? <EmptyState />
              : filteredStalled.map(p => (
                  <ProjectCard
                    key={p.id}
                    section="stalled"
                    project={p}
                    onAddNote={handleAddNote}
                    onEditBase={handleEditBase}
                  />
                ))
            }
          </div>
        </section>
      </main>

      {addModalSection && (
        <AddProjectModal
          section={addModalSection}
          onAdd={handleAddProject}
          onClose={() => setAddModalSection(null)}
        />
      )}
    </div>
  )
}

// ── Section header ─────────────────────────────────────────────────────────

const ACCENT_CONFIG = {
  blue:  { bar: 'bg-silq-blue',  text: 'text-silq-blue',  border: 'border-silq-blue/30' },
  teal:  { bar: 'bg-silq-teal',  text: 'text-silq-teal',  border: 'border-silq-teal/30' },
  muted: { bar: 'bg-slate-400',  text: 'text-slate-500',  border: 'border-slate-300' },
} as const

function SectionHeader({
  title,
  accent,
  onAdd,
}: {
  title: string
  accent: 'blue' | 'teal' | 'muted'
  onAdd: () => void
}) {
  const { bar, text, border } = ACCENT_CONFIG[accent]
  return (
    <div className={`flex items-center justify-between py-2 border-b ${border}`}>
      <div className="flex items-center gap-2.5">
        <div className={`w-1 h-5 rounded-full ${bar}`} />
        <h2 className={`font-semibold text-sm uppercase tracking-widest ${text}`}>
          {title}
        </h2>
      </div>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-silq-blue hover:border-silq-blue/40 hover:shadow-sm transition-all font-medium"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        Add
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="col-span-full flex items-center justify-center py-10 text-slate-400 text-sm">
      No projects match your search.
    </div>
  )
}
