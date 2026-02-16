'use client'

import { useMemo, useCallback, useState, useEffect } from 'react'

// US State coordinates for centering maps
const stateCoordinates: Record<string, { lat: number; lon: number }> = {
  AL: { lat: 32.806671, lon: -86.791130 },
  AK: { lat: 61.370716, lon: -152.404419 },
  AZ: { lat: 33.729759, lon: -111.431221 },
  AR: { lat: 34.969704, lon: -92.373123 },
  CA: { lat: 36.116203, lon: -119.681564 },
  CO: { lat: 39.059811, lon: -105.311104 },
  CT: { lat: 41.597782, lon: -72.755371 },
  DC: { lat: 38.897438, lon: -77.026817 },
  DE: { lat: 39.318523, lon: -75.507141 },
  FL: { lat: 27.766279, lon: -81.686783 },
  GA: { lat: 33.040619, lon: -83.643074 },
  HI: { lat: 21.094318, lon: -157.498337 },
  ID: { lat: 44.240459, lon: -114.478828 },
  IL: { lat: 40.349457, lon: -88.986137 },
  IN: { lat: 39.849426, lon: -86.258278 },
  IA: { lat: 42.011539, lon: -93.210526 },
  KS: { lat: 38.526600, lon: -96.726486 },
  KY: { lat: 37.668140, lon: -84.670067 },
  LA: { lat: 31.169546, lon: -91.867805 },
  ME: { lat: 44.693947, lon: -69.381927 },
  MD: { lat: 39.063946, lon: -76.802101 },
  MA: { lat: 42.230171, lon: -71.530106 },
  MI: { lat: 43.326618, lon: -84.536095 },
  MN: { lat: 45.694454, lon: -93.900192 },
  MS: { lat: 32.741646, lon: -89.678696 },
  MO: { lat: 38.456085, lon: -92.288368 },
  MT: { lat: 46.921925, lon: -110.454353 },
  NE: { lat: 41.125370, lon: -98.268082 },
  NV: { lat: 38.313515, lon: -117.055374 },
  NH: { lat: 43.452492, lon: -71.563896 },
  NJ: { lat: 40.298904, lon: -74.521011 },
  NM: { lat: 34.840515, lon: -106.248482 },
  NY: { lat: 42.165726, lon: -74.948051 },
  NC: { lat: 35.630066, lon: -79.806419 },
  ND: { lat: 47.528912, lon: -99.784012 },
  OH: { lat: 40.388783, lon: -82.764915 },
  OK: { lat: 35.565342, lon: -96.928917 },
  OR: { lat: 44.572021, lon: -122.070938 },
  PA: { lat: 40.590752, lon: -77.209755 },
  RI: { lat: 41.680893, lon: -71.511780 },
  SC: { lat: 33.856892, lon: -80.945007 },
  SD: { lat: 44.299782, lon: -99.438828 },
  TN: { lat: 35.747845, lon: -86.692345 },
  TX: { lat: 31.054487, lon: -97.563461 },
  UT: { lat: 40.150032, lon: -111.862434 },
  VT: { lat: 44.045876, lon: -72.710686 },
  VA: { lat: 37.769337, lon: -78.169968 },
  WA: { lat: 47.400902, lon: -121.490494 },
  WV: { lat: 38.491226, lon: -80.954453 },
  WI: { lat: 44.268543, lon: -89.616508 },
  WY: { lat: 42.755966, lon: -107.302490 },
}

// ZIP code prefix to approximate coordinates (first 3 digits)
function getZipCoordinates(zipCode: string): { lat: number; lon: number } | null {
  // Simplified ZIP code to coordinates mapping
  const zipPrefix = zipCode?.substring(0, 3)
  if (!zipPrefix) return null
  
  // This is a simplified mapping - in production, use a proper ZIP centroid database
  const zipMap: Record<string, { lat: number; lon: number }> = {
    // NY
    '100': { lat: 40.7128, lon: -74.0060 },  // Manhattan
    '101': { lat: 40.7128, lon: -74.0060 },
    '102': { lat: 40.7128, lon: -74.0060 },
    '103': { lat: 40.5795, lon: -74.1502 },  // Staten Island
    '104': { lat: 40.8448, lon: -73.8648 },  // Bronx
    '110': { lat: 40.6892, lon: -73.9862 },  // Brooklyn
    '111': { lat: 40.6892, lon: -73.9862 },
    '112': { lat: 40.6892, lon: -73.9862 },
    '113': { lat: 40.7282, lon: -73.7949 },  // Queens
    '114': { lat: 40.7282, lon: -73.7949 },
    '115': { lat: 40.7282, lon: -73.7949 },
    '116': { lat: 40.7579, lon: -73.6678 },  // Long Island
    '117': { lat: 40.7135, lon: -73.3578 },
    '118': { lat: 40.8682, lon: -73.4257 },
    '119': { lat: 40.9298, lon: -73.0983 },
    '120': { lat: 42.6526, lon: -73.7562 },  // Albany
    '121': { lat: 42.8142, lon: -73.9396 },
    '122': { lat: 42.3601, lon: -74.2379 },
    '123': { lat: 42.4451, lon: -73.2616 },
    '124': { lat: 41.7004, lon: -73.9210 },
    '125': { lat: 41.4901, lon: -73.9690 },
    '126': { lat: 41.0534, lon: -73.5387 },
    '127': { lat: 41.9018, lon: -74.3718 },
    '128': { lat: 44.6995, lon: -73.4529 },  // Plattsburgh
    '129': { lat: 44.4949, lon: -73.8622 },
    '130': { lat: 43.0481, lon: -76.1474 },  // Syracuse
    '131': { lat: 43.0962, lon: -75.2327 },
    '132': { lat: 43.2128, lon: -75.4557 },
    '133': { lat: 43.0962, lon: -75.2327 },
    '134': { lat: 43.4254, lon: -76.5105 },
    '135': { lat: 44.9375, lon: -74.8454 },
    '136': { lat: 44.5910, lon: -75.1680 },
    '137': { lat: 42.4440, lon: -76.5019 },  // Ithaca
    '138': { lat: 42.4440, lon: -76.5019 },
    '140': { lat: 42.8864, lon: -78.8784 },  // Buffalo
    '141': { lat: 42.8864, lon: -78.8784 },
    '142': { lat: 42.8864, lon: -78.8784 },
    '143': { lat: 42.1083, lon: -79.2351 },  // Jamestown
    '144': { lat: 43.1566, lon: -77.6088 },  // Rochester
    '145': { lat: 43.1566, lon: -77.6088 },
    '146': { lat: 43.1566, lon: -77.6088 },
    '147': { lat: 42.4299, lon: -79.0000 },
    '148': { lat: 42.0987, lon: -75.9180 },  // Binghamton
    '149': { lat: 42.4399, lon: -76.1766 },
  }
  
  if (zipMap[zipPrefix]) {
    return zipMap[zipPrefix]
  }
  
  // Fallback: use first digit for region
  const firstDigit = zipPrefix[0]
  const regionCoords: Record<string, { lat: number; lon: number }> = {
    '0': { lat: 42.3601, lon: -71.0589 },  // New England
    '1': { lat: 40.7128, lon: -74.0060 },  // NY/NJ/PA
    '2': { lat: 38.9072, lon: -77.0369 },  // DC/MD/VA
    '3': { lat: 33.7490, lon: -84.3880 },  // Southeast
    '4': { lat: 39.7684, lon: -86.1581 },  // Midwest
    '5': { lat: 44.9778, lon: -93.2650 },  // Upper Midwest
    '6': { lat: 38.6270, lon: -90.1994 },  // Central
    '7': { lat: 29.7604, lon: -95.3698 },  // Texas/South
    '8': { lat: 39.7392, lon: -104.9903 }, // Mountain
    '9': { lat: 34.0522, lon: -118.2437 }, // West Coast
  }
  
  return regionCoords[firstDigit] || { lat: 39.8283, lon: -98.5795 }  // US center
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
  physicians: Array<{
    name: string
    npi: string
    specialty: string
  }>
  physicianCount: number
}

interface RepMapProps {
  facilities: Facility[]
  territory: string[]
  priorityColors?: Record<string, string>
  onFacilitySelect?: (facility: Facility) => void
  selectedFacilityId?: string | null
  showLegend?: boolean
}

const defaultPriorityColors = {
  HIGH_CAUTI: '#e41a1c',
  HIGH_VOLUME: '#377eb8',
  VA: '#ff7f00',
  STANDARD: '#4daf4a',
}

export function RepMap({ 
  facilities, 
  territory,
  priorityColors = defaultPriorityColors,
  onFacilitySelect,
  selectedFacilityId,
  showLegend = true
}: RepMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [Plot, setPlot] = useState<any>(null)

  // Load Plotly only on client
  useEffect(() => {
    setIsClient(true)
    import('react-plotly.js').then(mod => {
      setPlot(() => mod.default)
    }).catch(err => {
      console.error('Failed to load Plotly:', err)
    })
  }, [])

  // Calculate map center from territory states
  const mapCenter = useMemo(() => {
    if (territory.length === 0) return { lat: 39.8283, lon: -98.5795 }
    
    const coords = territory
      .map(state => stateCoordinates[state])
      .filter(Boolean)
    
    if (coords.length === 0) return { lat: 39.8283, lon: -98.5795 }
    
    const avgLat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length
    const avgLon = coords.reduce((sum, c) => sum + c.lon, 0) / coords.length
    
    return { lat: avgLat, lon: avgLon }
  }, [territory])

  // Calculate zoom level based on territory size
  const mapZoom = useMemo(() => {
    if (territory.length <= 1) return 6
    if (territory.length <= 3) return 5
    if (territory.length <= 6) return 4.5
    return 4
  }, [territory])

  // Add coordinates to facilities
  const facilitiesWithCoords = useMemo(() => {
    return facilities.map(f => {
      const coords = getZipCoordinates(f.zipCode) || stateCoordinates[f.state] || { lat: 39.8283, lon: -98.5795 }
      // Add small random offset to prevent overlapping markers
      const jitter = 0.02
      return {
        ...f,
        lat: coords.lat + (Math.random() - 0.5) * jitter,
        lon: coords.lon + (Math.random() - 0.5) * jitter,
      }
    })
  }, [facilities])

  // Plotly data
  const plotData = useMemo(() => {
    if (!isClient) return []

    // Group by priority for layering (HIGH_CAUTI on top)
    const priorities: ('STANDARD' | 'VA' | 'HIGH_VOLUME' | 'HIGH_CAUTI')[] = ['STANDARD', 'VA', 'HIGH_VOLUME', 'HIGH_CAUTI']
    
    return priorities.map(priority => {
      const filtered = facilitiesWithCoords.filter(f => f.priority === priority)
      return {
        type: 'scattermapbox' as const,
        name: priority === 'HIGH_CAUTI' ? 'High CAUTI' :
              priority === 'HIGH_VOLUME' ? 'High Volume' :
              priority === 'VA' ? 'VA' : 'Standard',
        lat: filtered.map(f => f.lat),
        lon: filtered.map(f => f.lon),
        mode: 'markers' as const,
        marker: {
          size: priority === 'HIGH_CAUTI' ? 16 : priority === 'HIGH_VOLUME' ? 14 : 12,
          color: priorityColors[priority] || '#4daf4a',
          opacity: 0.85,
        },
        customdata: filtered,
        hoverinfo: 'text' as const,
        hovertext: filtered.map(f => 
          `<b>${f.name}</b><br>` +
          `${f.city}, ${f.state}<br>` +
          `Catheter Days: ${f.catheterDays.toLocaleString()}<br>` +
          `Priority: ${f.priority.replace('_', ' ')}`
        ),
        hoverlabel: {
          bgcolor: 'white',
          font: { color: 'black', size: 12 }
        }
      }
    })
  }, [facilitiesWithCoords, priorityColors, isClient])

  // Plotly layout
  const plotLayout = useMemo(() => ({
    mapbox: {
      style: 'carto-positron',
      center: mapCenter,
      zoom: mapZoom,
    },
    margin: { l: 0, r: 0, t: 0, b: 0 },
    autosize: true,
    showlegend: showLegend,
    legend: showLegend ? {
      x: 0.01,
      y: 0.99,
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: 'rgba(0,0,0,0.1)',
      borderwidth: 1,
      font: { size: 11 }
    } : undefined,
    dragmode: 'pan' as const,
  }), [mapCenter, mapZoom, showLegend])

  // Handle click
  const handleClick = useCallback((event: any) => {
    if (event.points?.[0]?.customdata && onFacilitySelect) {
      onFacilitySelect(event.points[0].customdata)
    }
  }, [onFacilitySelect])

  // Loading state
  if (!isClient || !Plot) {
    return (
      <div className="w-full h-[500px] rounded-2xl bg-gradient-to-br from-silq-blue/5 to-silq-teal/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-silq-blue/20 border-t-silq-blue animate-spin" />
          <p className="text-silq-dark/60 font-medium">Loading interactive map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg border border-silq-dark/10">
      <Plot
        data={plotData}
        layout={plotLayout}
        config={{ 
          scrollZoom: true, 
          displayModeBar: true,
          modeBarButtonsToRemove: ['lasso2d', 'select2d', 'toImage'],
          displaylogo: false,
        }}
        style={{ width: '100%', height: '100%' }}
        onClick={handleClick}
        useResizeHandler
      />
    </div>
  )
}
