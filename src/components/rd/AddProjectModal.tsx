'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RdProject } from './types'

interface AddProjectModalProps {
  tier: 1 | 2 | 3 | 4
  onAdd: (project: RdProject) => void
  onClose: () => void
}

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const TIER_TITLE: Record<1 | 2 | 3 | 4, string> = {
  1: 'Tier 1 — Immediate Action',
  2: 'Tier 2 — Awaiting Partner',
  3: 'Tier 3 — Pending Follow-Up',
  4: 'On Hold',
}

export function AddProjectModal({ tier, onAdd, onClose }: AddProjectModalProps) {
  const [companyName, setCompanyName] = useState('')
  const [application, setApplication] = useState('')
  const [projectStatus, setProjectStatus] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim()) {
      setError('Company name is required')
      return
    }
    const project: RdProject = {
      id: `manual-${slugify(companyName)}-${Date.now()}`,
      companyName: companyName.trim(),
      application: application.trim(),
      projectStatus: projectStatus.trim(),
      tier,
      lastUpdated: lastUpdated || null,
      nreStatus: '',
      notes: [],
      source: 'manual',
    }
    onAdd(project)
  }

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-silq-dark">Add Project</h2>
            <button onClick={onClose} className="text-silq-dark/40 hover:text-silq-dark transition-colors p-1" aria-label="Close">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-slate-400 -mt-3 mb-4">{TIER_TITLE[tier]}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-silq-dark mb-1">Company Name *</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-silq-dark/20 focus:border-silq-blue focus:ring-1 focus:ring-silq-blue/20 outline-none text-sm"
                placeholder="e.g. Acme Corp"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-silq-dark mb-1">Application</label>
              <input
                type="text"
                value={application}
                onChange={e => setApplication(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-silq-dark/20 focus:border-silq-blue focus:ring-1 focus:ring-silq-blue/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-silq-dark mb-1">Project Status</label>
              <input
                type="text"
                value={projectStatus}
                onChange={e => setProjectStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-silq-dark/20 focus:border-silq-blue focus:ring-1 focus:ring-silq-blue/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-silq-dark mb-1">Last Updated</label>
              <input
                type="date"
                value={lastUpdated}
                onChange={e => setLastUpdated(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-silq-dark/20 focus:border-silq-blue focus:ring-1 focus:ring-silq-blue/20 outline-none text-sm"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-lg border border-silq-dark/20 text-silq-dark text-sm font-medium hover:bg-silq-cream transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-silq-blue text-white text-sm font-semibold hover:bg-silq-blue/90 transition-colors"
              >
                Add Project
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
