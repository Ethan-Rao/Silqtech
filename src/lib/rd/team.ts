import type { RdProject, RdProjectsData } from '@/components/rd/types'

export interface RdTeamMember {
  name: string
  email: string
}

export const RD_TEAM: RdTeamMember[] = [
  { name: 'Ethan', email: 'ethanr@silq.tech' },
  { name: 'Brian', email: 'brianm@silq.tech' },
  { name: 'Na', email: 'nah@silq.tech' },
  { name: 'Min', email: 'andrewminlee@g.ucla.edu' },
  { name: 'Audrey', email: 'ayjohn@g.ucla.edu' },
]

export function memberByEmail(email: string): RdTeamMember | undefined {
  const needle = email.trim().toLowerCase()
  return RD_TEAM.find(member => member.email === needle)
}

export function projectOwnedBy(project: Pick<RdProject, 'owners'>, name: string): boolean {
  const needle = name.trim().toLowerCase()
  return (project.owners ?? []).some(owner => owner.trim().toLowerCase() === needle)
}

export function prioritiesFor(projects: RdProjectsData, name: string): RdProject[] {
  return [...(projects.tier1 ?? []), ...(projects.tier2 ?? [])].filter(project => projectOwnedBy(project, name))
}
