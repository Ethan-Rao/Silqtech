import type { Metadata } from 'next'
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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
      <body className="font-sans">
        <Header />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
