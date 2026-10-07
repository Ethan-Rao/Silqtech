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
  tier: 1 | 2 | 3 | 4
  lastUpdated: string | null
  nreStatus: string
  isInternal?: boolean
  logoPath?: string
  notes: NoteEntry[]
  source?: 'excel' | 'manual'
  _edited?: boolean
}

export interface RdProjectsData {
  generated: string
  tier1: RdProject[]
  tier2: RdProject[]
  tier3: RdProject[]
  tier4: RdProject[]
}

export interface RdFile {
  filename: string
  description: string
  uploadedAt: string
  oversized?: boolean
}

export type RdFilesManifest = Record<string, RdFile[]>

export interface OverlayEntry {
  notes?: NoteEntry[]
  baseOverride?: Partial<RdProject>
}

export type Overlay = Record<string, OverlayEntry>

export type TierKey = 'tier1' | 'tier2' | 'tier3' | 'tier4'
