export interface NoteEntry {
  id: string
  timestamp: string
  author: string
  text: string
}

export interface OngoingProject {
  id: string
  companyName: string
  currentActionItem: string
  projectStatus: string
  tNDA: string
  lastUpdated: string | null
  applicationDescription: string
  notes: NoteEntry[]
  source?: 'excel' | 'manual'
  _edited?: boolean
}

export interface ActiveTarget {
  id: string
  companyName: string
  application: string
  deviceDetails: string
  notes: NoteEntry[]
  source?: 'excel' | 'manual'
  _edited?: boolean
}

export interface StalledProject {
  id: string
  companyName: string
  projectStatus: string
  applicationDescription: string
  lastContact: string | null
  notes: NoteEntry[]
  source?: 'excel' | 'manual'
  _edited?: boolean
}

export interface ProjectsData {
  generated: string
  ongoing: OngoingProject[]
  targets: ActiveTarget[]
  stalled: StalledProject[]
}

export type AnyProject = OngoingProject | ActiveTarget | StalledProject
export type SectionKey = 'ongoing' | 'targets' | 'stalled'

/** What we store per project in the localStorage overlay */
export interface OverlayEntry {
  notes?: NoteEntry[]
  baseOverride?: Partial<OngoingProject & ActiveTarget & StalledProject>
}

export type Overlay = Record<string, OverlayEntry>
