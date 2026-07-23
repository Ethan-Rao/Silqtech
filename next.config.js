/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
    ],
  },
  
  async headers() {
    return [
      {
        source: '/nusilq',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
    ]
  },

  async rewrites() {
    return [
      // ROOT LEVEL REP PAGES
      { source: '/activize', destination: '/rep/activize' },
      { source: '/proactive', destination: '/rep/proactive' },
      { source: '/healthcare-cellutions', destination: '/rep/healthcare-cellutions' },
      { source: '/franklin-mountain-group', destination: '/rep/franklin-mountain-group' },
      { source: '/expert-medical-sales', destination: '/rep/expert-medical-sales' },
      { source: '/southern-surgical', destination: '/rep/southern-surgical' },
      { source: '/a3-biomedical', destination: '/rep/a3-biomedical' },
      { source: '/tplconsulting', destination: '/rep/tplconsulting' },
      { source: '/zenecare', destination: '/rep/zenecare' },
      { source: '/signature-medical', destination: '/rep/signature-medical' },
      { source: '/uromobile', destination: '/rep/uromobile' },
      { source: '/streamline', destination: '/rep/streamline' },
      { source: '/tbmedical', destination: '/rep/tbmedical' },
      { source: '/meinnovations', destination: '/rep/meinnovations' },
      { source: '/sandia', destination: '/rep/sandia' },
      { source: '/greatdane', destination: '/rep/greatdane' },
      { source: '/emina-taylor', destination: '/rep/emina-taylor' },
      { source: '/noreaster', destination: '/rep/noreaster' },
      { source: '/intuitek', destination: '/rep/intuitek' },
      { source: '/stengel', destination: '/rep/stengel' },
      { source: '/genesis', destination: '/rep/genesis' },
      { source: '/klea', destination: '/rep/klea' },
      // /kleamedical is handled via redirect below (→ /klea)
      { source: '/lifesource', destination: '/rep/lifesource' },
      { source: '/gptsurgical', destination: '/rep/gptsurgical' },
      { source: '/parkingangels', destination: '/rep/parkingangels' },
      { source: '/sciotex', destination: '/rep/sciotex' },
      // ACME (CSV uses mixed-case path; support both for links and redirects)
      { source: '/Acme', destination: '/rep/acme' },
      { source: '/acme', destination: '/rep/acme' },

      // WASATCH REP PAGES
      { source: '/wasatch/chowning', destination: '/rep/chowning' },
      { source: '/wasatch/gerrard', destination: '/rep/gerrard' },
      { source: '/wasatch/ghanem', destination: '/rep/ghanem' },
      { source: '/wasatch/grosjean', destination: '/rep/grosjean' },
      { source: '/wasatch/jimmerson', destination: '/rep/jimmerson' },
      { source: '/wasatch/Jimmerson', destination: '/rep/jimmerson' },
      { source: '/wasatch/ju', destination: '/rep/ju' },
      { source: '/wasatch/lamitina', destination: '/rep/lamitina' },
      { source: '/wasatch/lucier', destination: '/rep/lucier' },
      { source: '/wasatch/martinez', destination: '/rep/martinez' },
      { source: '/wasatch/pierro', destination: '/rep/pierro' },
      { source: '/wasatch/richards', destination: '/rep/richards' },
      { source: '/wasatch/salmons', destination: '/rep/salmons' },
      { source: '/wasatch/steimel', destination: '/rep/steimel' },
      { source: '/wasatch/streit', destination: '/rep/streit' },
      { source: '/wasatch/whisner', destination: '/rep/whisner' },
      { source: '/wasatch/whittiker', destination: '/rep/whittiker' },
      { source: '/wasatch/wood', destination: '/rep/wood' },
      { source: '/wasatch/sisco', destination: '/rep/sisco' },

      // COMEDICAL REP PAGES
      { source: '/comedical/dowdy', destination: '/rep/dowdy' },
      { source: '/comedical/dennehy', destination: '/rep/dennehy' },
      { source: '/comedical/murray', destination: '/rep/murray' },
      { source: '/comedical/hagarty', destination: '/rep/hagarty' },
      { source: '/comedical/collins', destination: '/rep/collins' },
    ]
  },

  async redirects() {
    return [
      { source: '/nusil', destination: '/nusilq', permanent: false },

      // QR code short-link safety net: if qrco.de routes to /bgshcA instead of /customercontact
      { source: '/bgshcA', destination: '/customercontact', permanent: false },
      { source: '/bqshcA', destination: '/customercontact', permanent: false },

      // /kleamedical → /klea (two URLs were issued; consolidate to one)
      { source: '/kleamedical', destination: '/klea', permanent: true },
      { source: '/rep/kleamedical', destination: '/klea', permanent: true },

      // Redirects from old verbose /rep/old-slug to clean vanity URLs
      { source: '/rep/healthcare-cellutions-of-texas', destination: '/healthcare-cellutions', permanent: true },
      { source: '/rep/jordan-distribution-company-llc', destination: '/rep', permanent: true },
      { source: '/rep/gollar-medical-llc', destination: '/rep', permanent: true },
      { source: '/rep/franklin-mountain-group-corp', destination: '/franklin-mountain-group', permanent: true },
      { source: '/rep/expert-medical-sales', destination: '/expert-medical-sales', permanent: true },
      { source: '/rep/southern-surgical-medical-device-llc', destination: '/southern-surgical', permanent: true },
      { source: '/rep/fladmo-llc', destination: '/rep', permanent: true },
      { source: '/rep/a3biomedical-llc', destination: '/a3-biomedical', permanent: true },
      { source: '/rep/mjf-health-inc', destination: '/rep', permanent: true },
      { source: '/rep/tpl-consulting-llc', destination: '/tplconsulting', permanent: true },
      { source: '/rep/hubgroup-llc', destination: '/rep', permanent: true },
      { source: '/rep/zenecare-llc', destination: '/zenecare', permanent: true },
      { source: '/rep/signature-medical-products-and-services-llc', destination: '/signature-medical', permanent: true },
      { source: '/rep/uromobile-llc', destination: '/uromobile', permanent: true },
      { source: '/rep/streamline-savings-llc', destination: '/streamline', permanent: true },
      { source: '/rep/onpoint-medcillory-solutions', destination: '/rep', permanent: true },
      { source: '/rep/tb-medical-sales-consulting', destination: '/tbmedical', permanent: true },
      { source: '/rep/medical-equipment-innovations-llc', destination: '/meinnovations', permanent: true },
      { source: '/rep/sandia-medical-resources', destination: '/sandia', permanent: true },
      { source: '/rep/great-dane-medical-solutions', destination: '/greatdane', permanent: true },
      { source: '/rep/noreaster-medical-llc', destination: '/noreaster', permanent: true },
      { source: '/rep/emina-taylor', destination: '/emina-taylor', permanent: true },
      { source: '/rep/proactive', destination: '/proactive', permanent: true },
      { source: '/proactive-representation', destination: '/proactive', permanent: true },

      // Removed rep redirects (point to rep directory)
      { source: '/rep/activize-inc', destination: '/activize', permanent: true },
      { source: '/rep/samu-sales-llc', destination: '/rep', permanent: true },
      { source: '/samu-sales', destination: '/rep', permanent: true },
      { source: '/rep/mark-klinkacek', destination: '/rep', permanent: true },
      { source: '/mark-klinkacek', destination: '/rep', permanent: true },
      { source: '/rep/jh-medical', destination: '/rep', permanent: true },
      { source: '/jh-medical', destination: '/rep', permanent: true },
      { source: '/rep/patriot-medical-distribution-llc', destination: '/rep', permanent: true },
      { source: '/patriot-medical', destination: '/rep', permanent: true },
      { source: '/rep/dwb-medical-inc', destination: '/rep', permanent: true },
      { source: '/dwb', destination: '/rep', permanent: true },
      // July 2026 removed reps → /rep directory
      { source: '/jordan-distribution', destination: '/rep', permanent: true },
      { source: '/gollar-medical', destination: '/rep', permanent: true },
      { source: '/fladmo', destination: '/rep', permanent: true },
      { source: '/mjfhealth', destination: '/rep', permanent: true },
      { source: '/hubgroup', destination: '/rep', permanent: true },
      { source: '/onpoint', destination: '/rep', permanent: true },
      // Removed wasatch reps
      { source: '/wasatch/jackson', destination: '/rep', permanent: true },
      { source: '/wasatch/mahoney', destination: '/rep', permanent: true },
      { source: '/wasatch/padilla', destination: '/rep', permanent: true },
      { source: '/wasatch/ralenkotter', destination: '/rep', permanent: true },
      { source: '/wasatch/towns', destination: '/rep', permanent: true },
      { source: '/wasatch/virgo', destination: '/rep', permanent: true },

      // Wasatch redirects (old /rep/name → /wasatch/name)
      { source: '/rep/chowning', destination: '/wasatch/chowning', permanent: true },
      { source: '/rep/gerrard', destination: '/wasatch/gerrard', permanent: true },
      { source: '/rep/ghanem', destination: '/wasatch/ghanem', permanent: true },
      { source: '/rep/grosjean', destination: '/wasatch/grosjean', permanent: true },
      { source: '/rep/jimmerson', destination: '/wasatch/jimmerson', permanent: true },
      { source: '/rep/ju', destination: '/wasatch/ju', permanent: true },
      { source: '/rep/lamitina', destination: '/wasatch/lamitina', permanent: true },
      { source: '/rep/lucier', destination: '/wasatch/lucier', permanent: true },
      { source: '/rep/martinez', destination: '/wasatch/martinez', permanent: true },
      { source: '/rep/pierro', destination: '/wasatch/pierro', permanent: true },
      { source: '/rep/richards', destination: '/wasatch/richards', permanent: true },
      { source: '/rep/salmons', destination: '/wasatch/salmons', permanent: true },
      { source: '/rep/steimel', destination: '/wasatch/steimel', permanent: true },
      { source: '/rep/streit', destination: '/wasatch/streit', permanent: true },
      { source: '/rep/whisner', destination: '/wasatch/whisner', permanent: true },
      { source: '/rep/whittiker', destination: '/wasatch/whittiker', permanent: true },
      { source: '/rep/wood', destination: '/wasatch/wood', permanent: true },
      { source: '/rep/sisco', destination: '/wasatch/sisco', permanent: true },
      // Old removed wasatch reps with /rep/ prefix
      { source: '/rep/jackson', destination: '/rep', permanent: true },
      { source: '/rep/mahoney', destination: '/rep', permanent: true },
      { source: '/rep/padilla', destination: '/rep', permanent: true },
      { source: '/rep/ralenkotter', destination: '/rep', permanent: true },
      { source: '/rep/towns', destination: '/rep', permanent: true },
      { source: '/rep/virgo', destination: '/rep', permanent: true },

      // Comedical redirects (old /rep/name → /comedical/name)
      { source: '/rep/marti-dowdy', destination: '/comedical/dowdy', permanent: true },
      { source: '/rep/molly-dennehy', destination: '/comedical/dennehy', permanent: true },
      { source: '/rep/ryan-murray', destination: '/comedical/murray', permanent: true },
      { source: '/rep/nick-hagarty', destination: '/comedical/hagarty', permanent: true },
      { source: '/rep/erin-collins', destination: '/comedical/collins', permanent: true },
      { source: '/rep/dowdy', destination: '/comedical/dowdy', permanent: true },
      { source: '/rep/dennehy', destination: '/comedical/dennehy', permanent: true },
      { source: '/rep/murray', destination: '/comedical/murray', permanent: true },
      { source: '/rep/hagarty', destination: '/comedical/hagarty', permanent: true },
      { source: '/rep/collins', destination: '/comedical/collins', permanent: true },

      // ACME: keep branded path from 1099 URLs (before /rep/:slug catch-all)
      { source: '/rep/acme', destination: '/Acme', permanent: true },
      { source: '/rep/acme-medical-products', destination: '/Acme', permanent: true },

      // Catch-all: any remaining /rep/slug → /slug (must be LAST)
      { source: '/rep/:slug', destination: '/:slug', permanent: true },
    ]
  },
}

module.exports = nextConfig
