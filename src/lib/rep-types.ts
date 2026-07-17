// Rep Page Data Types

export interface Physician {
  name: string
  npi: string
  specialty: string
  billsCatheterProcedures?: boolean
}

export interface Facility {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  hospitalType: string
  ownership: string
  gpo: string
  catheterDays: number
  observedCAUTI: number
  predictedCAUTI: number
  sir: number | null
  cautiStatus: string
  priority: FacilityPriority
  hacStatus?: 'HAC_PENALIZED' | 'HAC_AT_RISK' | null
  physicians: Physician[]
  physicianCount: number
  hacTierLabel?: string | null
  hacTotalScore?: number | null
  cautiSirHac?: number | null
  cautiWzScore?: number | null
  cautiVbpScore?: number | null
  cautiVbpPerformanceRate?: number | null
  starRating?: number | null
}

export type FacilityPriority = 'HIGH_CAUTI' | 'HIGH_VOLUME' | 'VA' | 'STANDARD'

export interface RepMeta {
  slug: string
  company: string
  name: string
  email: string
  territory: string[]
  generated: string
  dataVersion: string
}

export interface RepStats {
  facilityCount: number
  totalCatheterDays: number
  highCautiCount: number
  highVolumeCount: number
  hacPenalizedCount?: number
  hacAtRiskCount?: number
  physicianCount: number
}

export interface MapConfig {
  priorityColors: Record<FacilityPriority, string>
  facilityTypes: string[]
}

export interface RepData {
  meta: RepMeta
  stats: RepStats
  facilities: Facility[]
  mapConfig?: MapConfig
}

export interface RepManifestEntry {
  slug: string
  company: string
  name: string
  email: string
  territory: string[]
  facilityCount: number
  physicianCount: number
  highCautiCount: number
  highVolumeCount: number
}

export interface RepManifest {
  generated: string
  dataVersion: string
  totalReps: number
  reps: RepManifestEntry[]
}

// Priority colors for consistent styling
export const PRIORITY_COLORS: Record<FacilityPriority, string> = {
  HIGH_CAUTI: '#e41a1c',
  HIGH_VOLUME: '#377eb8',
  VA: '#ff7f00',
  STANDARD: '#4daf4a',
}

export const PRIORITY_BG_COLORS: Record<FacilityPriority, string> = {
  HIGH_CAUTI: 'bg-red-500',
  HIGH_VOLUME: 'bg-blue-500',
  VA: 'bg-orange-500',
  STANDARD: 'bg-green-500',
}

export const PRIORITY_LABELS: Record<FacilityPriority, string> = {
  HIGH_CAUTI: 'High CAUTI',
  HIGH_VOLUME: 'High Volume',
  VA: 'VA',
  STANDARD: 'Standard',
}
