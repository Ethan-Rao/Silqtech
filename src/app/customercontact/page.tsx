import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CustomerContactForm } from '@/components/sections/CustomerContactForm'

export const metadata: Metadata = {
  title: 'ClearTract Customer Contact',
  description: 'Contact the ClearTract support team with questions, product issues, or ordering requests.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CustomerContactPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden bg-gradient-to-br from-silq-teal/20 via-silq-teal/8 to-white">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-silq-teal/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-silq-blue/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-silq-teal/5 rounded-full blur-3xl" />
        </div>

        {/* Accent bar at very top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-silq-teal via-silq-blue to-silq-teal" />

        <div className="container-silq text-center relative">
          {/* Product badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-silq-teal/10 border border-silq-teal/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-silq-teal animate-pulse" />
            <span className="text-sm font-semibold text-silq-teal tracking-wide uppercase">
              ClearTract SPT® Support
            </span>
          </div>

          <h1 className="text-hero-sm md:text-hero font-bold text-silq-dark">
            ClearTract Customer Contact
          </h1>

          <p className="mt-6 text-lg text-silq-dark/65 max-w-xl mx-auto leading-relaxed">
            Please complete the form below with any questions, product issues,
            or requests to order.
          </p>
        </div>
      </section>

      {/* ── Form section ── */}
      <section className="py-16 bg-gradient-to-b from-white to-silq-cream/40 relative">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #00ADEF 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="container-silq relative">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* ── Form ── */}
            <div className="bg-white rounded-2xl border border-silq-dark/5 p-8 shadow-sm">
              <Suspense
                fallback={
                  <div
                    className="min-h-[28rem] rounded-2xl animate-pulse bg-silq-cream"
                    aria-busy="true"
                    aria-label="Loading contact form"
                  />
                }
              >
                <CustomerContactForm />
              </Suspense>
            </div>

            {/* ── Contact info sidebar ── */}
            <div className="lg:pl-8">
              <div className="sticky top-32">
                <h2 className="text-2xl font-bold text-silq-dark mb-8">
                  Get in touch
                </h2>

                <div className="space-y-8">
                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-silq-teal/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-silq-dark">Email</h3>
                      <a href="mailto:ethanr@silq.tech" className="text-silq-teal hover:underline">
                        ethanr@silq.tech
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-silq-teal/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-silq-dark">Phone</h3>
                      <a href="tel:4243098523" className="text-silq-teal hover:underline">
                        (424) 309-8523
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-silq-teal/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-silq-dark">Address</h3>
                      <p className="text-silq-dark/70">
                        323 Sunny Isles Blvd., 7th Floor<br />
                        Sunny Isles Beach, FL 33160
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="mt-10 aspect-video rounded-xl bg-silq-cream overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3586.789!2d-80.123!3d25.940!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDU2JzI0LjAiTiA4MMKwMDcnMjIuOCJX!5e0!3m2!1sen!2sus!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Silq Technologies Office Location"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
