import type { MetadataRoute } from 'next'

const BASE = 'https://www.silq.tech'

/** Same seven public URLs as the former `public/sitemap.xml` (home shell only; no rep routes). */
const ENTRIES: {
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency']
}[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/technology', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/products/cleartract', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/products/surface-treatment', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/about/team', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/about/investors', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.95, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return ENTRIES.map(({ path: p, priority, changeFrequency }) => ({
    url: p === '/' ? `${BASE}/` : `${BASE}${p}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
