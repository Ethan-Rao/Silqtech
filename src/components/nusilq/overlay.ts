import type { Overlay } from './types'

const OVERLAY_KEY = 'nusilq-notes-overlay'

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
