import type { Metadata } from 'next'
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Google Tag Manager ID
const GTM_ID = 'GTM-WW5WDN4T'
// Google Ads Tag ID
const GADS_ID = 'AW-16744648389'
// Milly AI chat (site-wide floating widget)
const MILLY_STORE_ID = '9b9e5263-b3a3-4fb6-a67e-2c93f3fb4097'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Silq Technologies | Advanced Biomaterials & Medical Devices',
    template: '%s | Silq Technologies',
  },
  description:
    'Silq Technologies is a medical device company developing advanced biomaterials technology born from UCLA research. Our ClearTract SPT® Foley Catheter uses patented zwitterionic surface treatment to resist biofouling.',
  keywords: [
    'medical devices',
    'biomaterials',
    'zwitterionic',
    'catheter',
    'ClearTract SPT',
    'Foley catheter',
    'antibiofouling',
    'UCLA research',
    'FDA cleared',
    'surface treatment',
  ],
  authors: [{ name: 'Silq Technologies' }],
  creator: 'Silq Technologies',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://silq.tech',
    title: 'Silq Technologies | Advanced Biomaterials & Medical Devices',
    description:
      'Transforming surfaces through advanced material science. Born from UCLA research.',
    siteName: 'Silq Technologies',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silq Technologies | Advanced Biomaterials & Medical Devices',
    description:
      'Transforming surfaces through advanced material science. Born from UCLA research.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
        {/* Google Ads Tag */}
        <Script
          id="gads-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
        />
        <Script
          id="gads-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GADS_ID}');
            `,
          }}
        />
        {/* Schema.org Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": "Silq Technologies",
              "url": "https://silq.tech",
              "logo": "https://silq.tech/images/logos/silq-logo.png",
              "description": "Medical device company developing advanced biomaterials technology for safer medical implants. FDA-cleared ClearTract SPT® Foley Catheters with zwitterionic surface treatment.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "323 Sunny Isles Blvd., 7th Floor",
                "addressLocality": "Sunny Isles Beach",
                "addressRegion": "FL",
                "postalCode": "33160",
                "addressCountry": "US"
              },
              "telephone": "+1-424-309-8523",
              "email": "info@silq.tech"
            })
          }}
        />
      </head>
      <body className="font-sans">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Header />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
        {/* Milly chat — loads after page is interactive; floating bubble unless inline containers exist */}
        <Script
          id="milly-chat"
          src="https://cdn.millysoftware.com/widget.js"
          strategy="afterInteractive"
          data-store-id={MILLY_STORE_ID}
        />
      </body>
    </html>
  )
}
