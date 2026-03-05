'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from 'react-simple-maps'

// TopoJSON for US states
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

// State name mapping
const stateNames: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'DC': 'District of Columbia', 'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii',
  'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine',
  'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota',
  'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska',
  'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico',
  'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island',
  'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas',
  'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington',
  'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
}

// FIPS code to state abbreviation mapping
const fipsToState: Record<string, string> = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO',
  '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI',
  '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY',
  '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN',
  '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH',
  '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD',
  '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA',
  '54': 'WV', '55': 'WI', '56': 'WY'
}

// State centroids for labels (approximate lon, lat)
const stateCentroids: Record<string, [number, number]> = {
  'AL': [-86.9, 32.8], 'AK': [-153.5, 64.3], 'AZ': [-111.7, 34.3], 'AR': [-92.4, 34.9],
  'CA': [-119.4, 37.2], 'CO': [-105.5, 39.0], 'CT': [-72.7, 41.6], 'DE': [-75.5, 39.0],
  'DC': [-77.0, 38.9], 'FL': [-81.7, 28.7], 'GA': [-83.4, 32.6], 'HI': [-155.5, 20.0],
  'ID': [-114.5, 44.4], 'IL': [-89.2, 40.0], 'IN': [-86.1, 39.9], 'IA': [-93.5, 42.0],
  'KS': [-98.4, 38.5], 'KY': [-85.3, 37.8], 'LA': [-91.9, 31.0], 'ME': [-69.2, 45.4],
  'MD': [-76.6, 39.0], 'MA': [-71.8, 42.2], 'MI': [-84.7, 44.3], 'MN': [-94.3, 46.3],
  'MS': [-89.7, 32.7], 'MO': [-92.5, 38.4], 'MT': [-110.4, 47.0], 'NE': [-99.8, 41.5],
  'NV': [-116.6, 39.3], 'NH': [-71.6, 43.7], 'NJ': [-74.7, 40.2], 'NM': [-106.0, 34.4],
  'NY': [-75.5, 42.9], 'NC': [-79.4, 35.5], 'ND': [-100.5, 47.4], 'OH': [-82.8, 40.3],
  'OK': [-97.5, 35.6], 'OR': [-120.5, 44.0], 'PA': [-77.8, 40.9], 'RI': [-71.5, 41.7],
  'SC': [-80.9, 33.9], 'SD': [-100.2, 44.4], 'TN': [-86.3, 35.8], 'TX': [-99.3, 31.5],
  'UT': [-111.7, 39.3], 'VT': [-72.7, 44.0], 'VA': [-78.8, 37.5], 'WA': [-120.5, 47.4],
  'WV': [-80.6, 38.9], 'WI': [-89.6, 44.6], 'WY': [-107.5, 43.0]
}

interface RepEntry {
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

interface StateData {
  count: number
  reps: RepEntry[]
}

interface USCoverageMapProps {
  reps: RepEntry[]
}

export function USCoverageMap({ reps }: USCoverageMapProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [hoveredState, setHoveredState] = useState<string | null>(null)

  // Calculate reps per state
  const repsByState = useMemo(() => {
    const stateData: Record<string, StateData> = {}
    
    reps.forEach(rep => {
      rep.territory.forEach(state => {
        if (!stateData[state]) {
          stateData[state] = { count: 0, reps: [] }
        }
        // Avoid duplicate reps (same email)
        if (!stateData[state].reps.find(r => r.email === rep.email)) {
          stateData[state].count++
          stateData[state].reps.push(rep)
        }
      })
    })
    
    return stateData
  }, [reps])

  // Get color based on rep count
  const getStateColor = (stateCode: string) => {
    const count = repsByState[stateCode]?.count || 0
    if (count === 0) return '#e5e7eb'  // gray-200
    if (count <= 2) return '#bfdbfe'   // blue-200
    if (count <= 5) return '#60a5fa'   // blue-400
    return '#1e40af'                    // blue-800
  }

  // Get text color based on background
  const getTextColor = (stateCode: string) => {
    const count = repsByState[stateCode]?.count || 0
    if (count > 5) return '#ffffff'
    return '#1f2937'  // gray-800
  }

  const selectedStateData = selectedState ? repsByState[selectedState] : null

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-silq-dark">Coverage Map</h3>
          <p className="text-sm text-silq-dark/60">Click on a state to see representatives</p>
        </div>

        {/* Map */}
        <div className="relative">
          <ComposableMap
            projection="geoAlbersUsa"
            projectionConfig={{
              scale: 1000,
            }}
            style={{ width: '100%', height: 'auto' }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const fips = geo.id
                  const stateCode = fipsToState[fips]
                  const isSelected = selectedState === stateCode
                  const isHovered = hoveredState === stateCode
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getStateColor(stateCode)}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 2 : 0.5}
                      style={{
                        default: {
                          outline: 'none',
                          transition: 'all 0.2s',
                        },
                        hover: {
                          fill: isSelected ? getStateColor(stateCode) : '#93c5fd',
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: {
                          outline: 'none',
                        },
                      }}
                      onClick={() => setSelectedState(stateCode === selectedState ? null : stateCode)}
                      onMouseEnter={() => setHoveredState(stateCode)}
                      onMouseLeave={() => setHoveredState(null)}
                    />
                  )
                })
              }
            </Geographies>

            {/* State Labels with Rep Count */}
            {Object.entries(stateCentroids).map(([stateCode, coords]) => {
              const count = repsByState[stateCode]?.count || 0
              // Skip states with no coverage and small states that would be hard to label
              if (count === 0) return null
              const smallStates = ['CT', 'DE', 'DC', 'MA', 'MD', 'NH', 'NJ', 'RI', 'VT']
              if (smallStates.includes(stateCode)) return null
              
              return (
                <Marker key={stateCode} coordinates={coords}>
                  <text
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    style={{
                      fontFamily: 'system-ui',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      fill: getTextColor(stateCode),
                      pointerEvents: 'none',
                    }}
                  >
                    {count}
                  </text>
                </Marker>
              )
            })}
          </ComposableMap>

          {/* Hover Tooltip */}
          <AnimatePresence>
            {hoveredState && !selectedState && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-silq-dark/10 pointer-events-none z-10"
              >
                <p className="font-semibold text-silq-dark">{stateNames[hoveredState] || hoveredState}</p>
                <p className="text-sm text-silq-dark/60">
                  {repsByState[hoveredState]?.count || 0} representative{(repsByState[hoveredState]?.count || 0) !== 1 ? 's' : ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#e5e7eb' }} />
            <span className="text-xs text-silq-dark/60">0</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#bfdbfe' }} />
            <span className="text-xs text-silq-dark/60">1-2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#60a5fa' }} />
            <span className="text-xs text-silq-dark/60">3-5</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1e40af' }} />
            <span className="text-xs text-silq-dark/60">6+</span>
          </div>
        </div>
      </div>

      {/* Selected State Panel */}
      <AnimatePresence>
        {selectedState && selectedStateData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 bg-white rounded-2xl shadow-lg border border-silq-dark/10 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-silq-blue to-silq-blue-700 text-white p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold">{stateNames[selectedState] || selectedState}</h4>
                <p className="text-white/80 text-sm">
                  {selectedStateData.count} representative{selectedStateData.count !== 1 ? 's' : ''} cover{selectedStateData.count === 1 ? 's' : ''} this state
                </p>
              </div>
              <button
                onClick={() => setSelectedState(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Rep Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-silq-cream/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-silq-dark">Name</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-silq-dark">Company</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-silq-dark">Email</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-silq-dark">Territory</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStateData.reps.map((rep, index) => (
                    <tr 
                      key={rep.email + index}
                      className="border-t border-silq-dark/5 hover:bg-silq-cream/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-silq-dark">{rep.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-silq-dark/70">{rep.company}</span>
                      </td>
                      <td className="px-4 py-3">
                        <a 
                          href={`mailto:${rep.email}`}
                          className="text-silq-blue hover:underline text-sm"
                        >
                          {rep.email}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {rep.territory.map(state => (
                            <span
                              key={state}
                              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                state === selectedState
                                  ? 'bg-silq-blue text-white'
                                  : 'bg-silq-blue/10 text-silq-blue'
                              }`}
                            >
                              {state}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
