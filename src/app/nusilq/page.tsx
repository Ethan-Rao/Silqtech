import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import { join } from 'path'
import { NusilqPasswordGate } from '@/components/ui/NusilqPasswordGate'
import { NusilqDashboard } from '@/components/nusilq/NusilqDashboard'
import type { ProjectsData } from '@/components/nusilq/types'

export const metadata: Metadata = {
  title: 'NuSilq Dashboard',
  robots: {
    index: false,
    follow: false,
  },
}

function getProjectsData(): ProjectsData {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'nusilq', 'projects.json')
    const raw = readFileSync(filePath, 'utf8')
    return JSON.parse(raw) as ProjectsData
  } catch {
    return { generated: new Date().toISOString(), ongoing: [], targets: [], stalled: [] }
  }
}

export default function NusilqPage() {
  const data = getProjectsData()

  return (
    <NusilqPasswordGate>
      <NusilqDashboard baseData={data} />
    </NusilqPasswordGate>
  )
}
