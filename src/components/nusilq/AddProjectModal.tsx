'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SectionKey, OngoingProject, ActiveTarget, StalledProject } from './types'

interface AddProjectModalProps {
  section: SectionKey
  onAdd: (project: OngoingProject | ActiveTarget | StalledProject) => void
  onClose: () => void
}

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function AddProjectModal({ section, onAdd, onClose }: AddProjectModalProps) {
  const [companyName, setCompanyName] = useState('')
  const [field1, setField1] = useState('')
  const [field2, setField2] = useState('')
  const [field3, setField3] = useState('')
  const [field4, setField4] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim()) {
      setError('Company name is required')
      return
    }
    const id = `manual-${slugify(companyName)}-${Date.now()}`

    if (section === 'ongoing') {
      const project: OngoingProject = {
        id,
        companyName: companyName.trim(),
        currentActionItem: field1,
        projectStatus: field2,
        tNDA: field3,
        lastUpdated: field4 || null,
        applicationDescription: '',
        notes: [],
        source: 'manual',
      }
      onAdd(project)
    } else if (section === 'targets') {
      const project: ActiveTarget = {
        id,
        companyName: companyName.trim(),
        application: field1,
        deviceDetails: field2,
        notes: [],
        source: 'manual',
      }
      onAdd(project)
    } else {
      const project: StalledProject = {
        id,
        companyName: companyName.trim(),
        projectStatus: field1,
        applicationDescription: field2,
        lastContact: field3 || null,
        notes: [],
        source: 'manual',
      }
      onAdd(project)
    }
  }

  const labels = {
    ongoing: ['Current Action Item', 'Project Status', 'tNDA', 'Last Updated (YYYY-MM-DD)'],
    targets: ['Application', 'Device Details'],
    stalled: ['Project Status', 'Application Description', 'Last Contact (YYYY-MM-DD)'],
  }

  const fields = [field1, field2, field3, field4]
  const setters = [setField1, setField2, setField3, setField4]
  const sectionLabels = labels[section]

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
            <h2 className="text-lg font-bold text-silq-dark">
              Add New {section === 'ongoing' ? 'Ongoing Project' : section === 'targets' ? 'Active Target' : 'Stalled Project'}
            </h2>
            <button onClick={onClose} className="text-silq-dark/40 hover:text-silq-dark transition-colors p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

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

            {sectionLabels.map((label, i) => (
              <div key={label}>
                <label className="block text-sm font-medium text-silq-dark mb-1">{label}</label>
                <input
                  type="text"
                  value={fields[i]}
                  onChange={e => setters[i](e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-silq-dark/20 focus:border-silq-blue focus:ring-1 focus:ring-silq-blue/20 outline-none text-sm"
                  placeholder={label}
                />
              </div>
            ))}

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
