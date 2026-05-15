import { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import { ContactForm } from '@/components/sections/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Silq Technologies. We have samples available and are ready to discuss how our technology can help you.',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-silq-blue/10 via-silq-blue/5 to-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-silq-teal/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-silq-blue/10 rounded-full blur-3xl" />
        </div>
        
        {/* Subtle monogram */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-[0.04] pointer-events-none">
          <Image
            src="/images/logos/silq-monogram.png"
            alt=""
            width={500}
            height={500}
          />
        </div>
        
        <div className="container-silq text-center relative">
              <h1 className="text-hero-sm md:text-hero font-bold text-silq-dark">
            Let&apos;s Talk.
          </h1>
          <p className="mt-6 text-lg text-silq-dark/70 max-w-2xl mx-auto">
            We have samples available. Whether you&apos;re a catheter patient, healthcare professional, potential partner, or interested investor, we&apos;d love to hear from you.
          </p>
          
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gradient-to-b from-white to-silq-cream/40 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1E4A6D 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container-silq relative">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <Suspense
                fallback={
                  <div
                    className="section-padding bg-white min-h-[28rem] rounded-2xl border border-silq-dark/5 animate-pulse"
                    aria-busy="true"
                    aria-label="Loading contact form"
                  />
                }
              >
                <ContactForm />
              </Suspense>
            </div>

            {/* Contact Info */}
            <div className="lg:pl-8">
              <div className="sticky top-32">
                <h2 className="text-2xl font-bold text-silq-dark mb-8">
                    Contact
                </h2>

                <div className="space-y-8">
                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-silq-blue/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-silq-dark">Email</h3>
                      <a
                        href="mailto:info@silq.tech"
                        className="text-silq-blue hover:underline"
                      >
                        info@silq.tech
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-silq-blue/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-silq-dark">Phone</h3>
                      <a
                        href="tel:4243098523"
                        className="text-silq-blue hover:underline"
                        data-track="phone-click"
                      >
                        (424) 309-8523
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-silq-blue/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                {/* Map placeholder */}
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

                {/* Investor CTA */}
                <div className="mt-10 p-6 bg-silq-blue/5 rounded-xl border border-silq-blue/10">
                  <h3 className="font-semibold text-silq-dark">
                    Looking to invest?
                  </h3>
                  <p className="mt-2 text-sm text-silq-dark/60">
                    Visit our investor page for dedicated inquiry forms and information.
                  </p>
                  <a
                    href="/about/investors"
                    className="mt-4 inline-flex items-center text-sm font-semibold text-silq-blue hover:underline"
                  >
                    Investor Information
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
