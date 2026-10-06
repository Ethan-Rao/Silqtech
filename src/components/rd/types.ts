export interface NoteEntry {
  id: string
  timestamp: string
  author: string
  text: string
}

export interface RdProject {
  id: string
  companyName: string
  application: string
  projectStatus: string
  tier: 1 | 2 | 3
  lastUpdated: string | null
  notes: NoteEntry[]
  source?: 'excel' | 'manual'
  _edited?: boolean
}

export interface RdProjectsData {
  generated: string
  tier1: RdProject[]
  tier2: RdProject[]
  tier3: RdProject[]
}

export interface RdFile {
  filename: string
  description: string
  uploadedAt: string
}

export type RdFilesManifest = Record<string, RdFile[]>

export interface OverlayEntry {
  notes?: NoteEntry[]
  baseOverride?: Partial<RdProject>
}

export type Overlay = Record<string, OverlayEntry>

export type TierKey = 'tier1' | 'tier2' | 'tier3'
