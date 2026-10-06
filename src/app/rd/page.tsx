import type { Metadata } from 'next'
import { Suspense } from 'react'
import { RdPasswordGate } from '@/components/ui/RdPasswordGate'
import { RdDashboard } from '@/components/rd/RdDashboard'
import projectsData from '../../../public/data/rd/projects.json'
import filesData from '../../../public/data/rd/files.json'
import type { RdProjectsData, RdFilesManifest } from '@/components/rd/types'

export const metadata: Metadata = {
  title: { absolute: 'R&D Dashboard | Silq Technologies' },
  robots: { index: false, follow: false },
}

export default function RdPage() {
  return (
    <RdPasswordGate>
      <Suspense>
        <RdDashboard
          baseData={projectsData as RdProjectsData}
          filesManifest={filesData as RdFilesManifest}
        />
      </Suspense>
    </RdPasswordGate>
  )
}
