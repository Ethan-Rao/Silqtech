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
const priorityColors = {
  HIGH_CAUTI: 'bg-red-500',
  HIGH_VOLUME: 'bg-blue-500',
  VA: 'bg-orange-500',
  STANDARD: 'bg-green-500',
}
const priorityLabels = {
  HIGH_CAUTI: 'High CAUTI',
  HIGH_VOLUME: 'High Volume',
  VA: 'VA',
  STANDARD: 'Standard',
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
        default:
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          // Secondary sort by catheter days
          if (comparison === 0) {
            comparison = b.catheterDays - a.catheterDays
          }
          break
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })

    return result
  }, [facilities, searchTerm, priorityFilter, sortKey, sortOrder])

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

        {/* Priority Filters */}
        <div className={cn('flex flex-wrap', compact ? 'gap-1' : 'gap-2')}>
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
              {compact ? (
                priority === 'HIGH_CAUTI' ? 'CAUTI' :
                priority === 'HIGH_VOLUME' ? 'Vol.' :
                priority === 'VA' ? 'VA' : 'Std'
              ) : priorityLabels[priority]}
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
                  {compact ? 'Cath' : 'Cath Days'}
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
                  {compact ? 'Docs' : 'Physicians'}
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
                  onClick={() => onFacilitySelect?.(facility)}
                  className={cn(
                    'border-b border-silq-dark/5 cursor-pointer transition-colors',
                    index % 2 === 0 ? 'bg-white' : 'bg-silq-cream/30',
                    selectedFacilityId === facility.id && 'bg-silq-blue/10',
                    'hover:bg-silq-blue/5'
                  )}
                >
                  <td className={cn(compact ? 'px-2 py-2' : 'px-4 py-3')}>
                    <div className="flex items-center gap-2">
                      <span className={cn('rounded-full', priorityColors[facility.priority], compact ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
                      {!compact && (
                        <span className="text-xs font-medium text-silq-dark/60 hidden sm:inline">
                          {priorityLabels[facility.priority]}
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
                  <td className={cn('text-center', compact ? 'px-2 py-2' : 'px-4 py-3')}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedFacilityId(expandedFacilityId === facility.id ? null : facility.id)
                      }}
                      className={cn(
                        'bg-gradient-to-r from-silq-blue to-silq-blue-700 text-white rounded-lg font-medium hover:shadow-lg transition-all',
                        compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
                      )}
                    >
                      {expandedFacilityId === facility.id ? '−' : '+'} {facility.physicianCount}
                    </button>
                  </td>
                </tr>
                
                {/* Expanded physicians row */}
                <AnimatePresence>
                  {expandedFacilityId === facility.id && (
                    <tr key={`${facility.id}-expanded`}>
                      <td colSpan={compact ? 4 : 6} className={cn('bg-silq-cream/50', compact ? 'px-2 py-2' : 'px-4 py-4')}>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={cn('bg-white rounded-xl shadow-inner', compact ? 'p-2' : 'p-4')}>
                            <div className={cn('flex items-center justify-between', compact ? 'mb-2' : 'mb-4')}>
                              <h4 className={cn('font-semibold text-silq-dark', compact && 'text-xs')}>
                                {compact ? 'Physicians' : `Physicians at ${facility.name}`}
                              </h4>
                              <a 
                                href={`tel:${facility.phone}`}
                                className={cn('text-silq-blue hover:underline flex items-center gap-1', compact ? 'text-xs' : 'text-sm')}
                              >
                                <svg className={cn(compact ? 'w-3 h-3' : 'w-4 h-4')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {facility.phone}
                              </a>
                            </div>
                            
                            {facility.physicians.length > 0 ? (
                              <div className={cn(
                                'grid gap-2',
                                compact ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'
                              )}>
                                {facility.physicians.slice(0, compact ? 5 : undefined).map((physician, i) => (
                                  <div 
                                    key={i}
                                    className={cn('flex items-center gap-2 rounded-lg bg-silq-cream/50', compact ? 'p-1.5' : 'p-2')}
                                  >
                                    <span className={cn(
                                      'w-2 h-2 rounded-full',
                                      physician.specialty === 'Urology' ? 'bg-silq-blue' : 'bg-silq-teal'
                                    )} />
                                    <div>
                                      <p className={cn('font-medium text-silq-dark', compact ? 'text-xs' : 'text-sm')}>{physician.name}</p>
                                      {!compact && <p className="text-xs text-silq-dark/60">{physician.specialty}</p>}
                                    </div>
                                  </div>
                                ))}
                                {compact && facility.physicians.length > 5 && (
                                  <p className="text-xs text-silq-dark/50 italic">+{facility.physicians.length - 5} more</p>
                                )}
                              </div>
                            ) : (
                              <p className={cn('text-silq-dark/60 italic', compact ? 'text-xs' : 'text-sm')}>No physicians data available</p>
                            )}

                            {/* Additional facility info - hide in compact mode */}
                            {!compact && (
                              <div className="mt-4 pt-4 border-t border-silq-dark/10 grid sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-silq-dark/60">Address:</span>
                                  <span className="ml-2 text-silq-dark">{facility.address}, {facility.city}, {facility.state} {facility.zipCode}</span>
                                </div>
                                {facility.gpo && (
                                  <div>
                                    <span className="text-silq-dark/60">GPO:</span>
                                    <span className="ml-2 text-silq-dark">{facility.gpo.split(',')[0]}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-silq-dark/60">Type:</span>
                                  <span className="ml-2 text-silq-dark">{facility.hospitalType}</span>
                                </div>
                                <div>
                                  <span className="text-silq-dark/60">CAUTI Status:</span>
                                  <span className={cn(
                                    'ml-2',
                                    facility.cautiStatus === 'Worse than the National Benchmark' ? 'text-red-600' :
                                    facility.cautiStatus === 'Better than the National Benchmark' ? 'text-green-600' :
                                    'text-silq-dark'
                                  )}>
                                    {facility.cautiStatus}
                                  </span>
                                </div>
                              </div>
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
