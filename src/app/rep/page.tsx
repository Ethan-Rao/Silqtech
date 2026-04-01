'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { USCoverageMap } from '@/components/ui/USCoverageMap'
import { PasswordGate } from '@/components/ui/PasswordGate'

interface RepEntry {
  slug: string
  urlPath: string
  primaryState: string
  company: string
  name: string
  email: string
  territory: string[]
  facilityCount: number
  physicianCount: number
  highCautiCount: number
  highVolumeCount: number
  hacPenalizedCount: number
  hacAtRiskCount: number
}

interface RepManifest {
  generated: string
  dataVersion: string
  totalReps: number
  reps: RepEntry[]
}

export default function RepDirectoryPage() {
  const [manifest, setManifest] = useState<RepManifest | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stateFilter, setStateFilter] = useState<string>('')

  useEffect(() => {
    async function loadManifest() {
      try {
        const response = await fetch('/data/rep-manifest.json')
        const data = await response.json()
        setManifest(data)
      } catch (err) {
        console.error('Error loading rep manifest:', err)
      } finally {
        setLoading(false)
      }
    }
    loadManifest()
  }, [])

  // Get unique states from all reps
  const allStates = manifest?.reps
    .flatMap(r => r.territory)
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort() || []

  // Filter reps, then sort primary-state reps first when filtering by state
  const filteredReps = (manifest?.reps.filter(rep => {
    const matchesSearch = !searchTerm || 
      rep.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesState = !stateFilter || rep.territory.includes(stateFilter)
    
    return matchesSearch && matchesState
  }) || []).sort((a, b) => {
    if (!stateFilter) return 0
    const aIsPrimary = a.primaryState === stateFilter ? 0 : 1
    const bIsPrimary = b.primaryState === stateFilter ? 0 : 1
    return aIsPrimary - bIsPrimary
  })

  if (loading) {
    return (
      <PasswordGate>
        <div className="min-h-screen bg-silq-cream flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-silq-blue/20 border-t-silq-blue animate-spin" />
            <p className="text-silq-dark/60 font-medium">Loading rep directory...</p>
          </div>
        </div>
      </PasswordGate>
    )
  }

  return (
    <PasswordGate>
    <div className="min-h-screen bg-silq-cream">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-silq-blue-900 via-silq-dark to-silq-blue-800 text-white">
        <div className="container-silq">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Rep Directory
              </h1>
            </motion.div>
          </div>

          {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-12 max-w-2xl mx-auto grid grid-cols-2 gap-4"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold">{filteredReps.length}</p>
                  <p className="text-sm text-white/60">Total Reps</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold">{allStates.length}</p>
                  <p className="text-sm text-white/60">States</p>
                </div>
              </motion.div>
        </div>
      </section>

      {/* Coverage Map Section */}
      <section className="py-12 bg-silq-cream">
        <div className="container-silq">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <USCoverageMap reps={manifest?.reps || []} />
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b border-silq-dark/10 sticky top-16 z-40">
        <div className="container-silq">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <input
                type="text"
                placeholder="Search by company or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-xl border border-silq-dark/10 focus:border-silq-blue focus:ring-2 focus:ring-silq-blue/20 outline-none transition-all"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silq-dark/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* State Filter */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-silq-dark/10 focus:border-silq-blue focus:ring-2 focus:ring-silq-blue/20 outline-none transition-all bg-white"
            >
              <option value="">All States</option>
              {allStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Rep Cards */}
      <section className="section-padding">
        <div className="container-silq">
          <p className="text-sm text-silq-dark/60 mb-6">
            Showing {filteredReps.length} reps
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReps.map((rep, index) => (
              <motion.div
                key={`${rep.slug}-${rep.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.03, 1) }}
              >
                <Link 
                  href={rep.urlPath || `/${rep.slug}`}
                  className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-silq-dark/5 hover:border-silq-blue/20 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-silq-dark group-hover:text-silq-blue transition-colors">
                          {rep.company}
                        </h3>
                        {stateFilter && (
                          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                            rep.primaryState === stateFilter
                              ? 'bg-silq-blue/10 text-silq-blue'
                              : 'bg-silq-dark/5 text-silq-dark/40'
                          }`}>
                            {rep.primaryState === stateFilter ? 'Primary' : 'Secondary'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-silq-dark/60">{rep.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-silq-blue group-hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium">View</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {rep.territory.map(state => (
                      <span 
                        key={state}
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          state === rep.primaryState
                            ? 'bg-silq-blue text-white'
                            : 'bg-silq-blue/10 text-silq-blue'
                        }`}
                      >
                        {state}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-center border-t border-silq-dark/5 pt-4">
                    <div>
                      <p className="text-lg font-bold text-silq-dark">{rep.facilityCount}</p>
                      <p className="text-xs text-silq-dark/50">Facilities</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-amber-500">{rep.hacPenalizedCount}</p>
                      <p className="text-xs text-silq-dark/50">HAC Pen.</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-500">{rep.highCautiCount}</p>
                      <p className="text-xs text-silq-dark/50">High CAUTI</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-500">{rep.highVolumeCount}</p>
                      <p className="text-xs text-silq-dark/50">High Vol</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-silq-dark">{rep.physicianCount}</p>
                      <p className="text-xs text-silq-dark/50">Physicians</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredReps.length === 0 && (
            <div className="text-center py-12">
              <p className="text-silq-dark/60">No reps match your search criteria.</p>
            </div>
          )}
        </div>
      </section>

          {/* Footer Note */}
          <section className="py-6 bg-silq-dark text-white/50 text-center text-xs">
            <div className="container-silq">
              <p>
                Internal use only. Last updated: {manifest?.generated ? new Date(manifest.generated).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </section>
    </div>
    </PasswordGate>
  )
}
