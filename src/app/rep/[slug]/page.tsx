'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RepMap } from '@/components/ui/RepMap'
import { FacilitiesTable } from '@/components/ui/FacilitiesTable'
import { VideoEmbed } from '@/components/ui/VideoEmbed'

interface Physician {
  name: string
  npi: string
  specialty: string
}

interface Facility {
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
  sir: number
  cautiStatus: string
  priority: 'HIGH_CAUTI' | 'HIGH_VOLUME' | 'VA' | 'STANDARD'
  hacStatus: 'HAC_PENALIZED' | 'HAC_AT_RISK' | null
  physicians: Physician[]
  physicianCount: number
}

interface RepData {
  meta: {
    slug: string
    company: string
    name: string
    email: string
    territory: string[]
    generated: string
    dataVersion: string
  }
  stats: {
    facilityCount: number
    totalCatheterDays: number
    highCautiCount: number
    highVolumeCount: number
    hacPenalizedCount: number
    hacAtRiskCount: number
    physicianCount: number
  }
  facilities: Facility[]
  mapConfig?: {
    priorityColors: Record<string, string>
    facilityTypes: string[]
  }
}

// PDF Downloads Data
const pricingSheets = [
  { name: 'Premier Facility Pricing Sheet', path: '/pdfs/pricing/premier-pricing.pdf' },
  { name: 'Vizient Facility Pricing Sheet', path: '/pdfs/pricing/vizient-pricing.pdf' },
  { name: 'VA Facility Pricing Sheet', path: '/pdfs/pricing/va-pricing.pdf' },
]

const infoMaterials = [
  { name: 'ClearTract IFU', path: '/pdfs/cleartract-ifu.pdf' },
  { name: 'ClearTract Bi-Fold PDF', path: '/pdfs/cleartract-bifold.pdf' },
  { name: 'Sales & Marketing Slides', path: '/pdfs/sales-marketing-slides.pdf' },
  { name: 'Technology Overview', path: '/pdfs/technology-overview.pdf' },
  { name: 'Physician & Patient Testimonial', path: '/pdfs/testimonials.pdf' },
]

const defaultPriorityColors = {
  HIGH_CAUTI: '#e41a1c',
  HIGH_VOLUME: '#377eb8',
  VA: '#ff7f00',
  STANDARD: '#4daf4a',
}

export default function RepPage({ params }: { params: { slug: string } }) {
  const [repData, setRepData] = useState<RepData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load rep data from JSON
  useEffect(() => {
    async function loadRepData() {
      try {
        const response = await fetch(`/data/reps/${params.slug}.json`)
        if (!response.ok) {
          throw new Error('Rep data not found')
        }
        const data = await response.json()
        setRepData(data)
      } catch (err) {
        setError('Unable to load territory data. Please check the URL or contact support.')
        console.error('Error loading rep data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadRepData()
  }, [params.slug])

  // CSV Export Handler
  const handleExportFacilities = useCallback(() => {
    if (!repData) return
    
    const { meta, facilities } = repData
    
    // Define CSV columns
    const headers = [
      'Facility Name',
      'Address',
      'City',
      'State',
      'ZIP Code',
      'Phone',
      'Priority',
      'HAC Status',
      'Catheter Days',
      'SIR Score',
      'CAUTI Status',
      'GPO',
      'Physician Count'
    ]
    
    // Build CSV rows
    const rows = facilities.map(f => [
      `"${f.name.replace(/"/g, '""')}"`,
      `"${f.address.replace(/"/g, '""')}"`,
      `"${f.city}"`,
      f.state,
      f.zipCode,
      f.phone,
      f.priority,
      f.hacStatus || '',
      f.catheterDays,
      f.sir || 'N/A',
      `"${f.cautiStatus}"`,
      `"${(f.gpo || '').replace(/"/g, '""')}"`,
      f.physicianCount
    ])
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${meta.company.replace(/\s+/g, '_')}_facilities_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [repData])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-silq-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-silq-blue/20 border-t-silq-blue animate-spin" />
          <p className="text-silq-dark/60 font-medium">Loading territory data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !repData) {
    return (
      <div className="min-h-screen bg-silq-cream flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-silq-dark mb-2">Territory Not Found</h1>
          <p className="text-silq-dark/60 mb-6">{error}</p>
          <a 
            href="/contact"
            className="inline-flex px-6 py-3 bg-silq-blue text-white rounded-xl font-medium hover:bg-silq-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    )
  }

  const { meta, stats, facilities } = repData
  const priorityColors = repData.mapConfig?.priorityColors || defaultPriorityColors

  return (
    <div className="min-h-screen bg-silq-cream">
      {/* Hero Section - Two Column: Rep Info (Left) + Downloads (Right) */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-gradient-to-br from-silq-blue-900 via-silq-dark to-silq-blue-800 text-white">
        <div className="container-silq">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Rep Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-teal bg-silq-teal/20 rounded-full">
                Sales Representative Portal
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {meta.company}
              </h1>
              <p className="text-xl text-white/70 mb-2">
                {meta.name}
              </p>
              <p className="text-lg text-white/50 mb-4">
                Territory: {meta.territory.join(', ')}
              </p>
              <p className="text-silq-teal">
                Please email <a href="mailto:chuckg@silq.tech" className="hover:underline font-medium">chuckg@silq.tech</a> for any sample requests
              </p>
            </motion.div>

            {/* Right Column: PDF Downloads */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-white mb-6">
                Sales Resources & Downloads
              </h3>
              
              {/* Two-column grid for download categories */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Pricing Sheets Column */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                  <h4 className="text-sm font-semibold text-silq-teal mb-3">Pricing Sheets</h4>
                  <div className="space-y-2">
                    {pricingSheets.map(pdf => (
                      <a 
                        key={pdf.name}
                        href={pdf.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-silq-blue/20 flex items-center justify-center text-silq-blue group-hover:bg-silq-blue group-hover:text-white transition-colors flex-shrink-0">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8ZM13,9V3.5L18.5,9Z"/>
                          </svg>
                        </div>
                        <span className="text-white/90 text-xs font-medium group-hover:text-white">
                          {pdf.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
                
                {/* Informational Materials Column */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                  <h4 className="text-sm font-semibold text-silq-teal mb-3">Informational Materials</h4>
                  <div className="space-y-2">
                    {infoMaterials.map(pdf => (
                      <a 
                        key={pdf.name}
                        href={pdf.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-silq-teal/20 flex items-center justify-center text-silq-teal group-hover:bg-silq-teal group-hover:text-white transition-colors flex-shrink-0">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8ZM13,9V3.5L18.5,9Z"/>
                          </svg>
                        </div>
                        <span className="text-white/90 text-xs font-medium group-hover:text-white">
                          {pdf.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Facilities & Interactive Map Section */}
      <section className="section-padding bg-silq-cream">
        <div className="container-silq">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
              Territory Coverage
            </p>
            <h2 className="text-display-sm md:text-display font-bold text-silq-dark">
              Facilities & Interactive Map
            </h2>
            <p className="mt-4 text-silq-dark/70 max-w-2xl mx-auto">
              Click any facility row to expand and view full details, stats, and physicians.
            </p>
          </div>

          {/* Stats Cards - Below Section Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
          >
            <div className="bg-white rounded-xl p-4 text-center shadow-md border border-silq-dark/5">
              <p className="text-3xl font-bold text-silq-dark">{stats.facilityCount}</p>
              <p className="text-sm text-silq-dark/60">Facilities</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md border border-silq-dark/5">
              <p className="text-3xl font-bold text-amber-500">{stats.hacPenalizedCount}</p>
              <p className="text-sm text-silq-dark/60">HAC Penalized</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md border border-silq-dark/5">
              <p className="text-3xl font-bold text-yellow-500">{stats.hacAtRiskCount}</p>
              <p className="text-sm text-silq-dark/60">HAC At Risk</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md border border-silq-dark/5">
              <p className="text-3xl font-bold text-red-500">{stats.highCautiCount}</p>
              <p className="text-sm text-silq-dark/60">High CAUTI</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md border border-silq-dark/5">
              <p className="text-3xl font-bold text-blue-500">{stats.highVolumeCount}</p>
              <p className="text-sm text-silq-dark/60">High Volume</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md border border-silq-dark/5">
              <p className="text-3xl font-bold text-silq-dark">{(stats.totalCatheterDays / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-silq-dark/60">Cath Days</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md border border-silq-dark/5 col-span-2 md:col-span-1">
              <p className="text-3xl font-bold text-silq-dark">{stats.physicianCount.toLocaleString()}</p>
              <p className="text-sm text-silq-dark/60">Physicians</p>
            </div>
          </motion.div>
          
          {/* Interactive Map - Full width, inline with stats */}
          <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-silq-dark">Interactive Map</h3>
              <button
                onClick={handleExportFacilities}
                className="flex items-center gap-2 px-4 py-2 bg-silq-blue text-white rounded-xl text-sm font-medium hover:bg-silq-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export All ({repData?.facilities.length || 0})
              </button>
            </div>
            <RepMap 
              facilities={facilities}
              territory={meta.territory}
              priorityColors={priorityColors}
              showLegend={true}
            />
          </div>

          {/* Facilities Table - Full width on its own line */}
          <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 max-h-[800px] overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold text-silq-dark mb-4">Facilities List</h3>
            <div className="flex-1 overflow-auto">
              <FacilitiesTable 
                facilities={facilities}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section - Larger with Thumbnails */}
      <section className="section-padding bg-white">
        <div className="container-silq">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
              Product Demonstrations
            </p>
            <h2 className="text-display-sm md:text-display font-bold text-silq-dark">
              Video Resources
            </h2>
            <p className="mt-4 text-silq-dark/70 max-w-2xl mx-auto">
              Watch demonstrations of ClearTract® technology and hear from physicians and patients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Overview Video */}
            <div className="bg-silq-cream rounded-2xl overflow-hidden shadow-xl">
              <VideoEmbed 
                vimeoId="869354523"
                title="Silq Technologies Overview"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-silq-dark">Silq Technologies Overview</h3>
                <p className="text-silq-dark/60 mt-2">See how our zwitterionic coating transforms medical device surfaces.</p>
              </div>
            </div>
            
            {/* Treatment Effect Demonstration */}
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <video 
                src="/videos/silq-technology-demo.mp4" 
                poster="/images/textures/tech-overview.gif"
                autoPlay 
                loop
                muted 
                playsInline
                className="w-full aspect-video object-cover"
              />
              <div className="p-3 bg-gradient-to-r from-silq-blue to-silq-teal text-white text-center">
                <p className="text-sm font-medium">Treatment Effect Demonstration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-8 bg-silq-dark text-white/60 text-center text-sm">
        <div className="container-silq">
          <p>
            This page is for authorized Silq Technologies sales representatives only.
            <br />
            Data version: {meta.dataVersion} | Generated: {new Date(meta.generated).toLocaleDateString()}
            <br />
            For questions, contact <a href="mailto:support@silq.tech" className="text-silq-teal hover:underline">support@silq.tech</a>
          </p>
        </div>
      </section>
    </div>
  )
}
