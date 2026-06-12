'use client'

import { useState, useEffect, useCallback } from 'react'
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

  const totalActive = data.ongoing.length + data.targets.length

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO TITLE SECTION ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">

            {/* NuSil / Avantor logo */}
            <div className="shrink-0">
              <Image
                src="/images/logos/nusil-logo.png"
                alt="Avantor NuSil"
                width={220}
                height={56}
                className="h-10 w-auto object-contain"
                unoptimized
              />
            </div>

            {/* Center: title */}
            <div className="flex-1 text-center min-w-[200px]">
              <h1 className="text-xl md:text-2xl font-bold text-silq-dark tracking-tight">
                NuSil — Silq Project Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {totalActive} active partnerships · {data.stalled.length} stalled
              </p>
            </div>

            {/* Silq logo */}
            <div className="shrink-0">
              <Image
                src="/images/logos/logo-oneline.png"
                alt="Silq Technologies"
                width={180}
                height={40}
                className="h-7 w-auto object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── TOOLBAR ─────────────────────────────────────────────────────── */}
      <div className="bg-silq-dark text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-screen-xl mx-auto px-6 py-2.5 flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[180px]">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search all companies…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full max-w-xs pl-9 pr-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-silq-teal focus:bg-white/15 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 ml-auto">
            <span className="text-xs text-white/35 hidden md:block">
              Synced {generated}
            </span>
            <button
              onClick={handleExport}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-white/65 hover:text-white hover:border-white/40 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <main className="max-w-screen-xl mx-auto px-4 py-6">

        {/* Top row: Ongoing (2/3) + Active Targets (1/3) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

          {/* ── Ongoing Projects — 2 columns within 2/3 ── */}
          <section className="xl:col-span-2">
            <SectionHeader
              title="Ongoing Projects"
              count={filteredOngoing.length}
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

          {/* ── Active Targets — 1/3 ── */}
          <section className="xl:col-span-1">
            <SectionHeader
              title="Active Targets"
              count={filteredTargets.length}
              accent="teal"
              onAdd={() => setAddModalSection('targets')}
            />
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
          </section>
        </div>

        {/* ── Stalled Projects — full width, 3-col grid ── */}
        <section className="mt-8">
          <SectionHeader
            title="Stalled Projects"
            count={filteredStalled.length}
            accent="muted"
            onAdd={() => setAddModalSection('stalled')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

// ── helpers ────────────────────────────────────────────────────────────────

const ACCENT_DOT: Record<string, string> = {
  blue: 'bg-silq-blue',
  teal: 'bg-silq-teal',
  muted: 'bg-slate-400',
}

const ACCENT_BORDER: Record<string, string> = {
  blue: 'border-silq-blue',
  teal: 'border-silq-teal',
  muted: 'border-slate-300',
}

function SectionHeader({
  title,
  count,
  accent,
  onAdd,
}: {
  title: string
  count: number
  accent: 'blue' | 'teal' | 'muted'
  onAdd: () => void
}) {
  return (
    <div className={`flex items-center justify-between mb-3 pb-2.5 border-b-2 ${ACCENT_BORDER[accent]}`}>
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${ACCENT_DOT[accent]}`} />
        <h2 className="font-semibold text-silq-dark text-sm uppercase tracking-wide">
          {title}
          <span className="ml-2 font-normal text-slate-400 normal-case tracking-normal text-sm">({count})</span>
        </h2>
      </div>
      <button
        onClick={onAdd}
        className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-silq-blue hover:border-silq-blue bg-white transition-colors flex items-center gap-1 shadow-sm"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        Add New
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <p className="text-sm text-slate-400 py-6 text-center col-span-2">No projects match your search.</p>
  )
}
