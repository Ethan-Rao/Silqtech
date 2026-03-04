import type { Metadata } from 'next'
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Google Tag Manager ID
const GTM_ID = 'GTM-WW5WDN4T'

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
    'Silq Technologies is a medical device company developing advanced biomaterials technology born from UCLA research. Our ClearTract® Foley Catheter uses patented zwitterionic surface treatment to resist biofouling.',
  keywords: [
    'medical devices',
    'biomaterials',
    'zwitterionic',
    'catheter',
    'ClearTract',
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
      </body>
    </html>
  )
}
