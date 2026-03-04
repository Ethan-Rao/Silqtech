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
  
  async rewrites() {
    return [
      // ============================================
      // ROOT LEVEL REP PAGES (no /rep/ prefix)
      // ============================================
      { source: '/proactive-representation', destination: '/rep/proactive' },
      { source: '/mark-klinkacek', destination: '/rep/mark-klinkacek' },
      { source: '/healthcare-cellutions', destination: '/rep/healthcare-cellutions-of-texas' },
      { source: '/jordan-distribution', destination: '/rep/jordan-distribution-company-llc' },
      { source: '/gollar-medical', destination: '/rep/gollar-medical-llc' },
      { source: '/franklin-mountain-group', destination: '/rep/franklin-mountain-group-corp' },
      { source: '/jh-medical', destination: '/rep/jh-medical' },
      { source: '/patriot-medical', destination: '/rep/patriot-medical-distribution-llc' },
      { source: '/expert-medical-sales', destination: '/rep/expert-medical-sales' },
      { source: '/activize', destination: '/rep/activize-inc' },
      { source: '/southern-surgical', destination: '/rep/southern-surgical-medical-device-llc' },
      { source: '/samu-sales', destination: '/rep/samu-sales-llc' },
      { source: '/fladmo', destination: '/rep/fladmo-llc' },
      { source: '/a3-biomedical', destination: '/rep/a3biomedical-llc' },
      { source: '/mjfhealth', destination: '/rep/mjf-health-inc' },
      { source: '/tplconsulting', destination: '/rep/tpl-consulting-llc' },
      { source: '/hubgroup', destination: '/rep/hubgroup-llc' },
      { source: '/zenecare', destination: '/rep/zenecare-llc' },
      { source: '/signature-medical', destination: '/rep/signature-medical-products-and-services-llc' },
      { source: '/uromobile', destination: '/rep/uromobile-llc' },
      { source: '/streamline', destination: '/rep/streamline-savings-llc' },
      { source: '/onpoint', destination: '/rep/onpoint-medcillory-solutions' },
      { source: '/tbmedical', destination: '/rep/tb-medical-sales-consulting' },
      { source: '/meinnovations', destination: '/rep/medical-equipment-innovations-llc' },
      { source: '/sandia', destination: '/rep/sandia-medical-resources' },
      { source: '/greatdane', destination: '/rep/great-dane-medical-solutions' },
      { source: '/dwb', destination: '/rep/dwb-medical-inc' },
      { source: '/noreaster', destination: '/rep/noreaster-medical-llc' },
      
      // ============================================
      // WASATCH REP PAGES (/wasatch/[name])
      // ============================================
      { source: '/wasatch/chowning', destination: '/rep/chowning' },
      { source: '/wasatch/gerrard', destination: '/rep/gerrard' },
      { source: '/wasatch/ghanem', destination: '/rep/ghanem' },
      { source: '/wasatch/grosjean', destination: '/rep/grosjean' },
      { source: '/wasatch/jackson', destination: '/rep/jackson' },
      { source: '/wasatch/lamitina', destination: '/rep/lamitina' },
      { source: '/wasatch/lucier', destination: '/rep/lucier' },
      { source: '/wasatch/mahoney', destination: '/rep/mahoney' },
      { source: '/wasatch/martinez', destination: '/rep/martinez' },
      { source: '/wasatch/padilla', destination: '/rep/padilla' },
      { source: '/wasatch/pierro', destination: '/rep/pierro' },
      { source: '/wasatch/ralenkotter', destination: '/rep/ralenkotter' },
      { source: '/wasatch/richards', destination: '/rep/richards' },
      { source: '/wasatch/salmons', destination: '/rep/salmons' },
      { source: '/wasatch/steimel', destination: '/rep/steimel' },
      { source: '/wasatch/streit', destination: '/rep/streit' },
      { source: '/wasatch/towns', destination: '/rep/towns' },
      { source: '/wasatch/virgo', destination: '/rep/virgo' },
      { source: '/wasatch/whisner', destination: '/rep/whisner' },
      { source: '/wasatch/whittiker', destination: '/rep/whittiker' },
      { source: '/wasatch/wood', destination: '/rep/wood' },
      { source: '/wasatch/sisco', destination: '/rep/sisco' },
      
      // ============================================
      // COMEDICAL REP PAGES (/comedical/[name])
      // ============================================
      { source: '/comedical/dowdy', destination: '/rep/marti-dowdy' },
      { source: '/comedical/dennehy', destination: '/rep/molly-dennehy' },
      { source: '/comedical/murray', destination: '/rep/ryan-murray' },
      { source: '/comedical/hagarty', destination: '/rep/nick-hagarty' },
      { source: '/comedical/collins', destination: '/rep/erin-collins' },
    ]
  },

  async redirects() {
    return [
      // ============================================
      // REDIRECT OLD URLs TO NEW URLs (for SEO)
      // ============================================
      { source: '/rep/proactive', destination: '/proactive-representation', permanent: true },
      { source: '/rep/mark-klinkacek', destination: '/mark-klinkacek', permanent: true },
      { source: '/rep/healthcare-cellutions-of-texas', destination: '/healthcare-cellutions', permanent: true },
      { source: '/rep/jordan-distribution-company-llc', destination: '/jordan-distribution', permanent: true },
      { source: '/rep/gollar-medical-llc', destination: '/gollar-medical', permanent: true },
      { source: '/rep/franklin-mountain-group-corp', destination: '/franklin-mountain-group', permanent: true },
      { source: '/rep/jh-medical', destination: '/jh-medical', permanent: true },
      { source: '/rep/patriot-medical-distribution-llc', destination: '/patriot-medical', permanent: true },
      { source: '/rep/expert-medical-sales', destination: '/expert-medical-sales', permanent: true },
      { source: '/rep/activize-inc', destination: '/activize', permanent: true },
      { source: '/rep/southern-surgical-medical-device-llc', destination: '/southern-surgical', permanent: true },
      { source: '/rep/samu-sales-llc', destination: '/samu-sales', permanent: true },
      { source: '/rep/fladmo-llc', destination: '/fladmo', permanent: true },
      { source: '/rep/a3biomedical-llc', destination: '/a3-biomedical', permanent: true },
      { source: '/rep/mjf-health-inc', destination: '/mjfhealth', permanent: true },
      { source: '/rep/tpl-consulting-llc', destination: '/tplconsulting', permanent: true },
      { source: '/rep/hubgroup-llc', destination: '/hubgroup', permanent: true },
      { source: '/rep/zenecare-llc', destination: '/zenecare', permanent: true },
      { source: '/rep/signature-medical-products-and-services-llc', destination: '/signature-medical', permanent: true },
      { source: '/rep/uromobile-llc', destination: '/uromobile', permanent: true },
      { source: '/rep/streamline-savings-llc', destination: '/streamline', permanent: true },
      { source: '/rep/onpoint-medcillory-solutions', destination: '/onpoint', permanent: true },
      { source: '/rep/tb-medical-sales-consulting', destination: '/tbmedical', permanent: true },
      { source: '/rep/medical-equipment-innovations-llc', destination: '/meinnovations', permanent: true },
      { source: '/rep/sandia-medical-resources', destination: '/sandia', permanent: true },
      { source: '/rep/great-dane-medical-solutions', destination: '/greatdane', permanent: true },
      { source: '/rep/dwb-medical-inc', destination: '/dwb', permanent: true },
      { source: '/rep/noreaster-medical-llc', destination: '/noreaster', permanent: true },
      // Wasatch redirects
      { source: '/rep/chowning', destination: '/wasatch/chowning', permanent: true },
      { source: '/rep/gerrard', destination: '/wasatch/gerrard', permanent: true },
      { source: '/rep/ghanem', destination: '/wasatch/ghanem', permanent: true },
      { source: '/rep/grosjean', destination: '/wasatch/grosjean', permanent: true },
      { source: '/rep/jackson', destination: '/wasatch/jackson', permanent: true },
      { source: '/rep/lamitina', destination: '/wasatch/lamitina', permanent: true },
      { source: '/rep/lucier', destination: '/wasatch/lucier', permanent: true },
      { source: '/rep/mahoney', destination: '/wasatch/mahoney', permanent: true },
      { source: '/rep/martinez', destination: '/wasatch/martinez', permanent: true },
      { source: '/rep/padilla', destination: '/wasatch/padilla', permanent: true },
      { source: '/rep/pierro', destination: '/wasatch/pierro', permanent: true },
      { source: '/rep/ralenkotter', destination: '/wasatch/ralenkotter', permanent: true },
      { source: '/rep/richards', destination: '/wasatch/richards', permanent: true },
      { source: '/rep/salmons', destination: '/wasatch/salmons', permanent: true },
      { source: '/rep/steimel', destination: '/wasatch/steimel', permanent: true },
      { source: '/rep/streit', destination: '/wasatch/streit', permanent: true },
      { source: '/rep/towns', destination: '/wasatch/towns', permanent: true },
      { source: '/rep/virgo', destination: '/wasatch/virgo', permanent: true },
      { source: '/rep/whisner', destination: '/wasatch/whisner', permanent: true },
      { source: '/rep/whittiker', destination: '/wasatch/whittiker', permanent: true },
      { source: '/rep/wood', destination: '/wasatch/wood', permanent: true },
      { source: '/rep/sisco', destination: '/wasatch/sisco', permanent: true },
      // Comedical redirects
      { source: '/rep/marti-dowdy', destination: '/comedical/dowdy', permanent: true },
      { source: '/rep/molly-dennehy', destination: '/comedical/dennehy', permanent: true },
      { source: '/rep/ryan-murray', destination: '/comedical/murray', permanent: true },
      { source: '/rep/nick-hagarty', destination: '/comedical/hagarty', permanent: true },
      { source: '/rep/erin-collins', destination: '/comedical/collins', permanent: true },
    ]
  },
}

module.exports = nextConfig
