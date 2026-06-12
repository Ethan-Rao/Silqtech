'use client'

import { useState, useEffect, useCallback } from 'react'
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

function mergeData(
  base: ProjectsData,
  overlay: Overlay,
): ProjectsData {
  function applyOverlay<T extends { id: string; notes: NoteEntry[] }>(items: T[]): T[] {
    return items.map(item => {
      const entry = overlay[item.id]
      if (!entry) return item
      const mergedNotes = [
        ...item.notes,
        ...(entry.notes ?? []),
      ]
      return {
        ...item,
        ...(entry.baseOverride ?? {}),
        notes: mergedNotes,
        _edited: !!entry.baseOverride,
      }
    })
  }

  // Also include manually-added projects stored in overlay
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

  // Load overlay on mount
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

  // ── add note ──────────────────────────────────────────────────────────

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
        [id]: {
          ...overlay[id],
          notes: [...(overlay[id]?.notes ?? []), note],
        },
      }
      updateOverlay(newOverlay)
    },
    [overlay, updateOverlay],
  )

  // ── edit base info ───────────────────────────────────────────────────

  const handleEditBase = useCallback(
    (id: string, updates: Partial<OngoingProject & ActiveTarget & StalledProject>) => {
      const newOverlay: Overlay = {
        ...overlay,
        [id]: {
          ...overlay[id],
          baseOverride: {
            ...(overlay[id]?.baseOverride ?? {}),
            ...updates,
          },
        },
      }
      updateOverlay(newOverlay)
    },
    [overlay, updateOverlay],
  )

  // ── add new project ──────────────────────────────────────────────────

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
      // Also splice it into the base section so mergeData picks it up
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

  // ── export ────────────────────────────────────────────────────────────

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nusilq-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── search filter ────────────────────────────────────────────────────

  const q = search.toLowerCase()
  const filteredOngoing = data.ongoing.filter(p => p.companyName.toLowerCase().includes(q))
  const filteredTargets = data.targets.filter(p => p.companyName.toLowerCase().includes(q))
  const filteredStalled = data.stalled.filter(p => p.companyName.toLowerCase().includes(q))

  const generated = baseData.generated
    ? new Date(baseData.generated).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—'

  return (
    <div className="min-h-screen bg-silq-cream">
      {/* ── top bar ── */}
      <header className="bg-silq-dark text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
          <h1 className="text-lg font-bold tracking-tight shrink-0">NuSilq Dashboard</h1>
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search companies…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-sm px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-silq-teal transition-colors"
            />
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <span className="text-xs text-white/40 hidden sm:block">
              Synced {generated}
            </span>
            <button
              onClick={handleExport}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export JSON
            </button>
          </div>
        </div>
      </header>

      {/* ── main grid ── */}
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Ongoing Projects (65%) ── */}
          <section className="flex-[65]">
            <SectionHeader
              title="Ongoing Projects"
              count={filteredOngoing.length}
              accentColor="bg-silq-blue"
              onAdd={() => setAddModalSection('ongoing')}
            />
            {filteredOngoing.length === 0
              ? <EmptyState />
              : filteredOngoing.map(p => (
                  <ProjectCard
                    key={p.id}
                    section="ongoing"
                    project={p}
                    onAddNote={handleAddNote}
                    onEditBase={handleEditBase}
                  />
                ))
            }
          </section>

          {/* ── Active Targets (35%) ── */}
          <section className="flex-[35]">
            <SectionHeader
              title="Active Targets"
              count={filteredTargets.length}
              accentColor="bg-silq-teal"
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

        {/* ── Stalled Projects (full width) ── */}
        <section className="mt-6">
          <SectionHeader
            title="Stalled Projects"
            count={filteredStalled.length}
            accentColor="bg-silq-dark/40"
            onAdd={() => setAddModalSection('stalled')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
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

      {/* ── Add Project Modal ── */}
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

function SectionHeader({
  title,
  count,
  accentColor,
  onAdd,
}: {
  title: string
  count: number
  accentColor: string
  onAdd: () => void
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${accentColor}`} />
        <h2 className="font-bold text-silq-dark text-base">
          {title} <span className="font-normal text-silq-dark/50">({count})</span>
        </h2>
      </div>
      <button
        onClick={onAdd}
        className="text-xs px-3 py-1.5 rounded-lg border border-silq-dark/20 text-silq-dark/60 hover:text-silq-blue hover:border-silq-blue transition-colors flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add New
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <p className="text-sm text-silq-dark/40 py-4 text-center">No projects found.</p>
  )
}
