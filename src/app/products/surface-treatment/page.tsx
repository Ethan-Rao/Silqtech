import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CTABanner } from '@/components/sections/CTABanner'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Surface Treatment Services',
  description: 'Turn-key coating solutions with customizable surfaces providing microbial resistance, anti-thrombogenicity, and enhanced lubricity.',
}

export default function SurfaceTreatmentPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-silq-dark via-silq-blue-900 to-silq-dark text-white relative overflow-hidden">
        <div className="container-silq text-center relative">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-teal bg-silq-teal/20 rounded-full">
            For Device Manufacturers
          </span>
          <h1 className="text-hero-sm md:text-hero font-bold">
            External Coating <span className="text-silq-teal">Solutions</span>
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            A scalable manufacturing system delivering turn-key coating solutions to customers worldwide.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Request Partnership Information
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Scalability Section with Silq Machine GIF */}
      <section className="section-padding bg-white">
        <div className="container-silq">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Left: Machine GIF */}
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-hidden">
                <Image 
                  src="/images/science/silq-machine.gif"
                  alt="Silq Manufacturing System"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            </div>
            
            {/* Right: Copy */}
            <div>
              <h2 className="text-display-sm font-bold text-silq-dark mb-6">
                Scalable Manufacturing
              </h2>
              <p className="text-silq-dark/70 mb-4">
                Silq&apos;s proprietary surface treatment can be utilized in numerous applications across medicine and industry. Our business model includes offering a turn-key coating solution to customers worldwide.
              </p>
              <p className="text-silq-dark/70 mb-4">
                Our deposition process is rapid, performed under ambient conditions, and does not require exotic reaction conditions or toxic chemicals. This results in:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-silq-teal/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span className="text-silq-dark/70">Scalability up to commercial quantities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-silq-teal/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span className="text-silq-dark/70">Environmentally friendly operations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-silq-teal/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span className="text-silq-dark/70">Competitive economics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Customizable Surface Properties - WITH Videos */}
      <section className="section-padding bg-silq-cream">
        <div className="container-silq">
          <div className="text-center mb-12">
            <h2 className="text-display-sm font-bold text-silq-dark">
              Customizable Outcomes
            </h2>
            <p className="text-silq-dark/60 mt-2 max-w-2xl mx-auto">
              The resulting surface can be customized to deliver a unique combination of properties.
            </p>
          </div>
          
          {/* 2x2 Grid: Images + Videos */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Microbial Resistance - Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 md:h-56 overflow-hidden">
                <Image 
                  src="/images/science/bacteria-panel.png"
                  alt="Bacterial adhesion reduction data"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-silq-dark text-lg mb-2">Microbial Resistance</h3>
                <p className="text-silq-dark/70 text-sm">
                  Resists bacterial adhesion and biofilm formation.
                </p>
              </div>
            </div>
            
            {/* Anti-Thrombogenicity - Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 md:h-56 overflow-hidden">
                <Image 
                  src="/images/science/blood-loop.webp"
                  alt="Blood loop thrombosis comparison"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-silq-dark text-lg mb-2">Anti-Thrombogenicity</h3>
                <p className="text-silq-dark/70 text-sm">
                  50% reduction in surface thrombus coverage.*
                </p>
              </div>
            </div>
            
            {/* Enhanced Lubricity - Video */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 md:h-56 overflow-hidden">
                <video 
                  src="/videos/frictionless-silicone.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-silq-dark text-lg mb-2">Enhanced Lubricity</h3>
                <p className="text-silq-dark/70 text-sm">
                  Dramatically improved surface lubricity.
                </p>
              </div>
            </div>
            
            {/* Hydrophilicity - Video */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 md:h-56 overflow-hidden">
                <video 
                  src="/videos/contact-lens-drying.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-silq-dark text-lg mb-2">Hydrophilicity</h3>
                <p className="text-silq-dark/70 text-sm">
                  Enhanced wettability and moisture retention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Benefits - Dark Section */}
      <section className="section-padding bg-silq-dark text-white">
        <div className="container-silq">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-display-sm font-bold mb-3">
              Why Partner with Silq?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              A proven platform backed by world-class research and regulatory clearance.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-white/10 hover:bg-white/15 transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-silq-teal/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-silq-teal mb-2">FDA-Cleared</h3>
                <p className="text-white/70 text-sm">Technology validated with 510(k) clearance</p>
              </div>
              <div className="p-6 rounded-xl bg-white/10 hover:bg-white/15 transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-silq-teal/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                  </svg>
                </div>
                <h3 className="font-semibold text-silq-teal mb-2">UCLA Research</h3>
                <p className="text-white/70 text-sm">World-class material science foundation</p>
              </div>
              <div className="p-6 rounded-xl bg-white/10 hover:bg-white/15 transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-silq-teal/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-silq-teal mb-2">Scalable Process</h3>
                <p className="text-white/70 text-sm">Integrates with existing manufacturing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        title="Explore Partnership?"
        description="Let's discuss how Silq can enhance your products."
        cta={{ text: 'Contact Us', href: '/contact' }}
        secondaryCta={{ text: 'Learn About Technology', href: '/technology' }}
        variant="gradient"
      />
    </>
  )
}
