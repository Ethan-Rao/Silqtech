import { NextResponse } from 'next/server'

/** Explicit GET /sitemap.xml — some hosts omit metadata `sitemap.ts` from the route table. */
const BODY = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.silq.tech/</loc>
    <changefreq>weekly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://www.silq.tech/technology</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.silq.tech/products/cleartract</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.silq.tech/products/surface-treatment</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.silq.tech/about/team</loc>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>https://www.silq.tech/about/investors</loc>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>https://www.silq.tech/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.95</priority>
  </url>
</urlset>
`

export function GET() {
  return new NextResponse(BODY, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
