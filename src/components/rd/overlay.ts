import type { Overlay, RdProjectsData, RdProject, TierKey } from './types'

const OVERLAY_KEY = 'rd-notes-overlay'

export function loadOverlay(): Overlay {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(OVERLAY_KEY)
    return raw ? (JSON.parse(raw) as Overlay) : {}
  } catch {
    return {}
  }
}

export function saveOverlay(overlay: Overlay): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(OVERLAY_KEY, JSON.stringify(overlay))
}

function asTier(value: unknown): 1 | 2 | 3 | 4 {
  return value === 1 || value === 2 || value === 3 || value === 4 ? value : 3
}

export function mergeData(base: RdProjectsData, overlay: Overlay): RdProjectsData {
  function applyOverlay(items: RdProject[]): RdProject[] {
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

  const tier4 = base.tier4 ?? []
  const known = new Set<string>([
    ...base.tier1.map(p => p.id),
    ...base.tier2.map(p => p.id),
    ...base.tier3.map(p => p.id),
    ...tier4.map(p => p.id),
  ])

  const manuals = Object.entries(overlay)
    .filter(([id, entry]) => entry.baseOverride?.source === 'manual' && !known.has(id))
    .map(([id, entry]): RdProject => {
      const override = entry.baseOverride ?? {}
      return {
        id,
        companyName: override.companyName ?? '',
        application: override.application ?? '',
        projectStatus: override.projectStatus ?? '',
        tier: asTier(override.tier),
        lastUpdated: override.lastUpdated ?? null,
        nreStatus: override.nreStatus ?? '',
        isInternal: override.isInternal,
        logoPath: override.logoPath,
        notes: [...(override.notes ?? []), ...(entry.notes ?? [])],
        source: 'manual',
      }
    })

  const byTier = (tier: 1 | 2 | 3 | 4, key: TierKey) => [
    ...applyOverlay(key === 'tier4' ? tier4 : base[key]),
    ...manuals.filter(p => p.tier === tier),
  ]

  return {
    ...base,
    tier1: byTier(1, 'tier1'),
    tier2: byTier(2, 'tier2'),
    tier3: byTier(3, 'tier3'),
    tier4: byTier(4, 'tier4'),
  }
}
