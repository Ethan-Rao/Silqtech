'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

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

interface FacilitiesTableProps {
  facilities: Facility[]
  onFacilitySelect?: (facility: Facility) => void
  selectedFacilityId?: string | null
  compact?: boolean
}

type SortKey = 'name' | 'city' | 'catheterDays' | 'sir' | 'priority' | 'physicianCount'
type SortOrder = 'asc' | 'desc'

const priorityOrder = { HIGH_CAUTI: 0, HIGH_VOLUME: 1, VA: 2, STANDARD: 3 }
const hacOrder = { HAC_PENALIZED: 0, HAC_AT_RISK: 1 }
const priorityColors = {
  HIGH_CAUTI: 'bg-red-500',
  HIGH_VOLUME: 'bg-blue-500',
  VA: 'bg-orange-500',
  STANDARD: 'bg-green-500',
}
const hacColors = {
  HAC_PENALIZED: 'bg-amber-500',
  HAC_AT_RISK: 'bg-yellow-400',
}
const priorityLabels = {
  HIGH_CAUTI: 'High CAUTI',
  HIGH_VOLUME: 'High Volume',
  VA: 'VA',
  STANDARD: 'Standard',
}
const hacLabels = {
  HAC_PENALIZED: 'HAC Penalized',
  HAC_AT_RISK: 'HAC At Risk',
}

export function FacilitiesTable({ 
  facilities, 
  onFacilitySelect,
  selectedFacilityId,
  compact = false
}: FacilitiesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('priority')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFacilityId, setExpandedFacilityId] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string[]>([])
  const [hacFilter, setHacFilter] = useState<string[]>([])

  // Filter and sort facilities
  const filteredAndSorted = useMemo(() => {
    let result = [...facilities]

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(f => 
        f.name.toLowerCase().includes(term) ||
        f.city.toLowerCase().includes(term) ||
        f.state.toLowerCase().includes(term)
      )
    }

    // Filter by priority
    if (priorityFilter.length > 0) {
      result = result.filter(f => priorityFilter.includes(f.priority))
    }

    // Filter by HAC status
    if (hacFilter.length > 0) {
      result = result.filter(f => f.hacStatus && hacFilter.includes(f.hacStatus))
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      
      switch (sortKey) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'city':
          comparison = a.city.localeCompare(b.city)
          break
        case 'catheterDays':
          comparison = a.catheterDays - b.catheterDays
          break
        case 'sir':
          comparison = (a.sir || 0) - (b.sir || 0)
          break
        case 'physicianCount':
          comparison = a.physicianCount - b.physicianCount
          break
        case 'priority':
        default: {
          // HAC-flagged facilities sort to the top
          const aHac = a.hacStatus ? hacOrder[a.hacStatus] : 2
          const bHac = b.hacStatus ? hacOrder[b.hacStatus] : 2
          comparison = aHac - bHac
          if (comparison === 0) {
            comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          }
          if (comparison === 0) {
            comparison = b.catheterDays - a.catheterDays
          }
          break
        }
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })

    return result
  }, [facilities, searchTerm, priorityFilter, hacFilter, sortKey, sortOrder])

  // Toggle sort
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  // Toggle priority filter
  const togglePriorityFilter = (priority: string) => {
    setPriorityFilter(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    )
  }

  // Toggle HAC filter
  const toggleHacFilter = (status: string) => {
    setHacFilter(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const SortIcon = ({ active, order }: { active: boolean; order: SortOrder }) => (
    <span className={cn('ml-1 transition-opacity', active ? 'opacity-100' : 'opacity-30')}>
      {order === 'asc' ? '↑' : '↓'}
    </span>
  )

  return (
    <div className={cn('space-y-4', compact && 'space-y-3')}>
      {/* Filter Controls */}
      <div className={cn(
        'flex flex-wrap gap-4 items-center',
        compact ? 'gap-2' : 'justify-between'
      )}>
        {/* Search */}
        <div className={cn(
          'relative flex-1',
          compact ? 'min-w-[150px]' : 'min-w-[200px] max-w-md'
        )}>
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              'w-full rounded-xl border border-silq-dark/10 focus:border-silq-blue focus:ring-2 focus:ring-silq-blue/20 outline-none transition-all',
              compact ? 'px-3 py-1.5 pl-8 text-sm' : 'px-4 py-2 pl-10'
            )}
          />
          <svg className={cn(
            'absolute top-1/2 -translate-y-1/2 text-silq-dark/40',
            compact ? 'left-2.5 w-4 h-4' : 'left-3 w-5 h-5'
          )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Priority & HAC Filters */}
        <div className={cn('flex flex-wrap', compact ? 'gap-1' : 'gap-2')}>
          {(['HAC_PENALIZED', 'HAC_AT_RISK'] as const).map(status => (
            <button
              key={status}
              onClick={() => toggleHacFilter(status)}
              className={cn(
                'flex items-center gap-1.5 rounded-full font-medium transition-all',
                compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm gap-2',
                hacFilter.includes(status)
                  ? 'bg-amber-500 text-white'
                  : 'bg-silq-dark/5 text-silq-dark/70 hover:bg-silq-dark/10'
              )}
            >
              <span className={cn('rounded-full', hacColors[status], compact ? 'w-2 h-2' : 'w-2.5 h-2.5')} />
              {hacLabels[status]}
            </button>
          ))}
          {(['HIGH_CAUTI', 'HIGH_VOLUME', 'VA', 'STANDARD'] as const).map(priority => (
            <button
              key={priority}
              onClick={() => togglePriorityFilter(priority)}
              className={cn(
                'flex items-center gap-1.5 rounded-full font-medium transition-all',
                compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm gap-2',
                priorityFilter.includes(priority)
                  ? 'bg-silq-blue text-white'
                  : 'bg-silq-dark/5 text-silq-dark/70 hover:bg-silq-dark/10'
              )}
            >
              <span className={cn('rounded-full', priorityColors[priority], compact ? 'w-2 h-2' : 'w-2.5 h-2.5')} />
              {priorityLabels[priority]}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className={cn('text-silq-dark/60', compact ? 'text-xs' : 'text-sm')}>
        Showing {filteredAndSorted.length} of {facilities.length} facilities
      </p>

      {/* Table */}
      <div className={cn(
        'overflow-x-auto border border-silq-dark/10',
        compact ? 'rounded-xl shadow' : 'rounded-2xl shadow-lg'
      )}>
        <table className="w-full">
          <thead className="bg-silq-blue text-white">
            <tr>
              <th className={cn('text-left font-semibold', compact ? 'px-2 py-2 text-xs' : 'px-4 py-3')}>
                <button 
                  onClick={() => handleSort('priority')} 
                  className="flex items-center hover:text-white/80 transition-colors"
                >
                  {compact ? '' : 'Status'}
                  <SortIcon active={sortKey === 'priority'} order={sortOrder} />
                </button>
              </th>
              <th className={cn('text-left font-semibold', compact ? 'px-2 py-2 text-xs' : 'px-4 py-3')}>
                <button 
                  onClick={() => handleSort('name')} 
                  className="flex items-center hover:text-white/80 transition-colors"
                >
                  Facility
                  <SortIcon active={sortKey === 'name'} order={sortOrder} />
                </button>
              </th>
              {!compact && (
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">
                  <button 
                    onClick={() => handleSort('city')} 
                    className="flex items-center hover:text-white/80 transition-colors"
                  >
                    City
                    <SortIcon active={sortKey === 'city'} order={sortOrder} />
                  </button>
                </th>
              )}
              <th className={cn('text-right font-semibold', compact ? 'px-2 py-2 text-xs' : 'px-4 py-3')}>
                <button 
                  onClick={() => handleSort('catheterDays')} 
                  className="flex items-center justify-end w-full hover:text-white/80 transition-colors"
                >
                  Cath Days
                  <SortIcon active={sortKey === 'catheterDays'} order={sortOrder} />
                </button>
              </th>
              {!compact && (
                <th className="px-4 py-3 text-right font-semibold hidden lg:table-cell">
                  <button 
                    onClick={() => handleSort('sir')} 
                    className="flex items-center justify-end w-full hover:text-white/80 transition-colors"
                  >
                    SIR
                    <SortIcon active={sortKey === 'sir'} order={sortOrder} />
                  </button>
                </th>
              )}
              <th className={cn('text-center font-semibold', compact ? 'px-2 py-2 text-xs' : 'px-4 py-3')}>
                <button 
                  onClick={() => handleSort('physicianCount')} 
                  className="flex items-center justify-center w-full hover:text-white/80 transition-colors"
                >
                  Physicians
                  <SortIcon active={sortKey === 'physicianCount'} order={sortOrder} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((facility, index) => (
              <>
                <tr 
                  key={facility.id}
                  onClick={() => setExpandedFacilityId(expandedFacilityId === facility.id ? null : facility.id)}
                  className={cn(
                    'border-b border-silq-dark/5 cursor-pointer transition-colors',
                    index % 2 === 0 ? 'bg-white' : 'bg-silq-cream/30',
                    expandedFacilityId === facility.id && 'bg-silq-blue/10',
                    'hover:bg-silq-blue/5'
                  )}
                >
                  <td className={cn(compact ? 'px-2 py-2' : 'px-4 py-3')}>
                    <div className="flex items-center gap-1.5">
                      <span className={cn('rounded-full', priorityColors[facility.priority], compact ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
                      {facility.hacStatus && (
                        <span className={cn(
                          'rounded-full ring-1 ring-white',
                          facility.hacStatus === 'HAC_PENALIZED' ? hacColors.HAC_PENALIZED : hacColors.HAC_AT_RISK,
                          compact ? 'w-2.5 h-2.5' : 'w-3 h-3'
                        )} />
                      )}
                      {!compact && (
                        <span className="text-xs font-medium text-silq-dark/60 hidden sm:inline">
                          {priorityLabels[facility.priority]}
                          {facility.hacStatus && (
                            <span className={facility.hacStatus === 'HAC_PENALIZED' ? ' text-amber-600' : ' text-yellow-500'}>
                              {' · '}{hacLabels[facility.hacStatus]}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={cn(compact ? 'px-2 py-2' : 'px-4 py-3')}>
                    <div className={cn('font-medium text-silq-dark', compact ? 'text-xs line-clamp-2' : '')}>
                      {facility.name}
                    </div>
                    <div className={cn('text-silq-dark/50', compact ? 'text-xs' : 'text-xs md:hidden')}>
                      {facility.city}, {facility.state}
                    </div>
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-silq-dark/70 hidden md:table-cell">
                      {facility.city}, {facility.state}
                    </td>
                  )}
                  <td className={cn('text-right font-medium text-silq-dark', compact ? 'px-2 py-2 text-xs' : 'px-4 py-3')}>
                    {compact 
                      ? (facility.catheterDays / 1000).toFixed(1) + 'k'
                      : facility.catheterDays.toLocaleString()
                    }
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <span className={cn(
                        'font-medium',
                        facility.cautiStatus === 'Worse than the National Benchmark' ? 'text-red-600' :
                        facility.cautiStatus === 'Better than the National Benchmark' ? 'text-green-600' :
                        'text-silq-dark/70'
                      )}>
                        {facility.sir ? facility.sir.toFixed(2) : 'N/A'}
                      </span>
                    </td>
                  )}
                  <td className={cn('text-center font-medium text-silq-dark', compact ? 'px-2 py-2 text-xs' : 'px-4 py-3')}>
                    <span className="inline-flex items-center gap-1">
                      <span className={cn(
                        'inline-block w-4 text-silq-blue transition-transform',
                        expandedFacilityId === facility.id && 'rotate-90'
                      )}>▶</span>
                      {facility.physicianCount}
                    </span>
                  </td>
                </tr>
                
                {/* Expanded facility detail row */}
                <AnimatePresence>
                  {expandedFacilityId === facility.id && (
                    <tr key={`${facility.id}-expanded`}>
                      <td colSpan={compact ? 4 : 6} className="bg-silq-cream/50 px-3 py-3">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-white rounded-xl shadow-inner p-4">
                            {/* Status badges row */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className={cn('w-3 h-3 rounded-full', priorityColors[facility.priority])} />
                              <span className="text-sm font-medium text-silq-dark/60">
                                {priorityLabels[facility.priority]}
                              </span>
                              {facility.hacStatus && (
                                <span className={cn(
                                  'px-2 py-0.5 text-xs font-semibold rounded-full',
                                  facility.hacStatus === 'HAC_PENALIZED'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                )}>
                                  {hacLabels[facility.hacStatus]}
                                </span>
                              )}
                              <a
                                href={`tel:${facility.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="ml-auto text-silq-blue hover:underline flex items-center gap-1 text-sm"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {facility.phone}
                              </a>
                            </div>

                            {/* Stats cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                              <div className="bg-silq-cream rounded-lg p-2.5 text-center">
                                <p className="text-xl font-bold text-silq-dark">{facility.catheterDays.toLocaleString()}</p>
                                <p className="text-xs text-silq-dark/60">Catheter Days</p>
                              </div>
                              <div className="bg-silq-cream rounded-lg p-2.5 text-center">
                                <p className={cn(
                                  'text-xl font-bold',
                                  facility.cautiStatus === 'Worse than the National Benchmark' ? 'text-red-600' :
                                  facility.cautiStatus === 'Better than the National Benchmark' ? 'text-green-600' :
                                  'text-silq-dark'
                                )}>
                                  {facility.sir ? facility.sir.toFixed(2) : 'N/A'}
                                </p>
                                <p className="text-xs text-silq-dark/60">SIR Score</p>
                              </div>
                              <div className="bg-silq-cream rounded-lg p-2.5 text-center">
                                <p className="text-xl font-bold text-silq-dark">{facility.physicianCount}</p>
                                <p className="text-xs text-silq-dark/60">Physicians</p>
                              </div>
                              <div className="bg-silq-cream rounded-lg p-2.5 text-center">
                                <p className="text-sm font-medium text-silq-dark">{facility.city}, {facility.state} {facility.zipCode}</p>
                                <p className="text-xs text-silq-dark/60">Location</p>
                              </div>
                            </div>

                            {/* Facility details */}
                            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm mb-4 pb-4 border-b border-silq-dark/10">
                              <div>
                                <span className="text-silq-dark/60">Address:</span>
                                <span className="ml-1 text-silq-dark">{facility.address}</span>
                              </div>
                              <div>
                                <span className="text-silq-dark/60">Type:</span>
                                <span className="ml-1 text-silq-dark">{facility.hospitalType}</span>
                              </div>
                              {facility.gpo && (
                                <div>
                                  <span className="text-silq-dark/60">GPO:</span>
                                  <span className="ml-1 text-silq-dark">{facility.gpo.split(',')[0]}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-silq-dark/60">CAUTI:</span>
                                <span className={cn(
                                  'ml-1',
                                  facility.cautiStatus === 'Worse than the National Benchmark' ? 'text-red-600' :
                                  facility.cautiStatus === 'Better than the National Benchmark' ? 'text-green-600' :
                                  'text-silq-dark'
                                )}>
                                  {facility.cautiStatus}
                                </span>
                              </div>
                            </div>

                            {/* Physicians list */}
                            <h4 className="text-sm font-semibold text-silq-dark mb-2">
                              Physicians ({facility.physicianCount})
                            </h4>
                            {facility.physicians.length > 0 ? (
                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1.5 max-h-[250px] overflow-y-auto">
                                {facility.physicians.map((physician, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2 p-1.5 rounded-lg bg-silq-cream/50"
                                  >
                                    <span className={cn(
                                      'w-2 h-2 rounded-full flex-shrink-0',
                                      physician.specialty === 'Urology' ? 'bg-silq-blue' :
                                      physician.specialty === 'Infectious Disease' ? 'bg-red-400' :
                                      'bg-silq-teal'
                                    )} />
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium text-silq-dark truncate">{physician.name}</p>
                                      <p className="text-[10px] text-silq-dark/50">{physician.specialty}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-silq-dark/60 italic">No physician data available</p>
                            )}
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </>
            ))}
          </tbody>
        </table>
        
        {filteredAndSorted.length === 0 && (
          <div className="p-8 text-center text-silq-dark/60">
            No facilities match your search criteria
          </div>
        )}
      </div>
    </div>
  )
}
