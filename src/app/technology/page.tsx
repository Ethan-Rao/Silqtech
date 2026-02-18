import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CTABanner } from '@/components/sections/CTABanner'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Platform Technology',
  description: 'Learn about Silq\'s patented zwitterionic surface treatment technology, born from UCLA research.',
}

export default function TechnologyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-silq-dark via-silq-blue-900 to-silq-dark text-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-silq-teal blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-silq-blue blur-3xl" />
        </div>
        <div className="container-silq text-center relative z-10">
          <h1 className="text-hero-sm md:text-hero font-bold">
            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-silq-teal to-silq-teal/80">Technology</span>
          </h1>
          <p className="mt-4 text-lg text-white/60 max-w-xl mx-auto">
            Bio-inspired zwitterionic chemistry that resists fouling on any surface.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Angle + Manufacturing - Two Column */}
      <section className="py-20 bg-white">
        <div className="container-silq">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left: Contact Angle Data */}
            <div>
              <h2 className="text-display-sm font-bold text-silq-dark mb-4">
                Multi-Substrate Compatibility
              </h2>
              <p className="text-silq-dark/70 mb-8">
                Our treatment demonstrates consistent performance across multiple polymer substrates.
              </p>
              
              {/* Material & Contact Angle Table */}
              <div className="bg-gradient-to-br from-silq-cream to-white rounded-2xl p-6 border border-silq-dark/5 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-silq-dark/50 border-b border-silq-dark/10">
                      <th className="pb-3 font-medium text-xs uppercase tracking-wider">Material</th>
                      <th className="pb-3 font-medium text-right text-xs uppercase tracking-wider">Untreated</th>
                      <th className="pb-3 font-medium text-right text-xs uppercase tracking-wider">Treated</th>
                    </tr>
                  </thead>
                  <tbody className="text-silq-dark">
                    {[
                      { material: 'Silicone', untreated: '108°', treated: '32°' },
                      { material: 'Polyurethane', untreated: '85°', treated: '28°' },
                      { material: 'PTFE', untreated: '120°', treated: '35°' },
                      { material: 'Polycarbonate', untreated: '82°', treated: '24°' },
                    ].map((row, i, arr) => (
                      <tr key={row.material} className={`${i < arr.length - 1 ? 'border-b border-silq-dark/5' : ''} hover:bg-silq-blue/[0.02] transition-colors`}>
                        <td className="py-3 font-medium">{row.material}</td>
                        <td className="py-3 text-right text-silq-dark/50">{row.untreated}</td>
                        <td className="py-3 text-right">
                          <span className="inline-flex items-center gap-1.5 text-silq-teal font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-silq-teal" />
                            {row.treated}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-silq-dark/40 mt-4 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Lower contact angle = more hydrophilic surface
                </p>
              </div>
            </div>
            
            {/* Right: Manufacturing GIF */}
            <div>
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-silq-dark/5 mb-5">
                <Image 
                  src="/images/science/silq-machine.gif"
                  alt="Silq Manufacturing System"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  unoptimized
                />
              </div>
              <div className="bg-silq-cream rounded-xl p-5 border border-silq-dark/5">
                <h3 className="text-base font-bold text-silq-dark mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-silq-blue/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  Scalable Manufacturing
                </h3>
                <p className="text-sm text-silq-dark/60 mb-3">
                  Rapid deposition process under ambient conditions. No exotic chemicals. Commercial-scale capacity.
                </p>
                <Link href="/products/surface-treatment" className="text-sm text-silq-blue hover:text-silq-blue/80 font-medium inline-flex items-center gap-1 transition-colors">
                  Learn about partnerships
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-silq-dark/10 to-transparent" />

      {/* How It Works - Compact with Video */}
      <section className="py-20 bg-gradient-to-b from-silq-cream to-white">
        <div className="container-silq">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-display-sm font-bold text-silq-dark mb-4">
                How It Works
              </h2>
              <p className="text-silq-dark/70 mb-6">
                Zwitterionic molecules create a hydration barrier that resists 
                protein and bacterial adhesion—mimicking natural cell membranes.
              </p>
              <ul className="space-y-4 text-sm text-silq-dark/70">
                {[
                  { label: 'Covalent bond to substrate', desc: 'Permanent surface transformation' },
                  { label: 'Bio-inspired hydration barrier', desc: 'Mimics natural cell membranes to resist fouling' },
                  { label: 'Sterilization compatible', desc: 'Compatible with Ethylene Oxide (EtO) and Gamma irradiation' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <span className="w-6 h-6 rounded-full bg-silq-teal/15 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-silq-teal/25 transition-colors">
                      <svg className="w-3.5 h-3.5 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <div>
                      <p className="font-medium text-silq-dark">{item.label}</p>
                      <p className="text-xs text-silq-dark/50 mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-silq-dark/5">
              <div className="bg-gradient-to-br from-silq-blue/5 to-silq-teal/5 relative">
                <video 
                  src="/videos/silq-technology-demo.mp4" 
                  poster="/images/textures/tech-overview.gif"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full aspect-video object-cover relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-silq-dark/10 to-transparent" />

      {/* Surface Properties - Bacteria Panel + 3 Cards */}
      <section className="py-20 bg-white">
        <div className="container-silq">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-silq-dark">
              Surface Properties
            </h2>
            <p className="text-silq-dark/60 mt-3 max-w-xl mx-auto">
              Tunable performance characteristics for diverse application requirements.
            </p>
          </div>
          
          {/* Row 1: Bacteria Panel - Full Width */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-4xl mx-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold text-silq-blue mb-2">Microbial Resistance</h3>
                <p className="text-silq-dark/70 text-sm">
                  Significant reduction in bacterial adhesion across multiple pathogenic species.
                </p>
              </div>
              <Image 
                src="/images/science/Bacteria%20Panel.png"
                alt="Bacterial adhesion reduction data"
                width={1200}
                height={400}
                className="w-full object-contain"
              />
            </div>
          </div>
          
          {/* Row 2: Other 3 Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Anti-Thrombogenicity - Stacked Images */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-5">
                <h3 className="text-lg font-bold text-silq-blue">Anti-Thrombogenicity</h3>
                <p className="text-silq-dark/70 text-sm mt-1">Reduced blood clot formation.</p>
              </div>
              <div className="flex flex-col gap-1 px-2 pb-2">
                <div className="rounded-lg overflow-hidden">
                  <Image 
                    src="/images/science/blood-loop-treated.jpg"
                    alt="Blood loop - treated surface"
                    width={400}
                    height={150}
                    className="w-full h-32 object-contain bg-white"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <Image 
                    src="/images/science/blood-loop-untreated.jpg"
                    alt="Blood loop - control surface"
                    width={400}
                    height={150}
                    className="w-full h-32 object-contain bg-white"
                  />
                </div>
              </div>
            </div>
            
            {/* Enhanced Lubricity - Video */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-5">
                <h3 className="text-lg font-bold text-silq-blue">Enhanced Lubricity</h3>
                <p className="text-silq-dark/70 text-sm mt-1">Improved patient comfort.</p>
              </div>
              <div className="px-2 pb-2">
                <div className="rounded-lg overflow-hidden bg-gradient-to-br from-silq-blue/5 to-silq-teal/5">
                  <video 
                    src="/videos/frictionless-silicone.mp4" 
                    autoPlay loop muted playsInline
                    className="w-full aspect-video object-contain"
                  />
                </div>
              </div>
            </div>
            
            {/* Hydrophilicity - Video */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-5">
                <h3 className="text-lg font-bold text-silq-blue">Enhanced Hydrophilicity</h3>
                <p className="text-silq-dark/70 text-sm mt-1">Water-attracting surface prevents fouling.</p>
              </div>
              <div className="px-2 pb-2">
                <div className="rounded-lg overflow-hidden bg-gradient-to-br from-silq-blue/5 to-silq-teal/5">
                  <video 
                    src="/videos/contact-lens-drying.mp4" 
                    autoPlay loop muted playsInline
                    className="w-full aspect-video object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Availability Note */}
      <section className="py-6 bg-white">
        <div className="container-silq">
          <div className="text-center">
            <p className="text-sm text-silq-dark/60">
              Data available{' '}
              <a 
                href="https://onlinelibrary.wiley.com/doi/10.1002/adma.202200254"
                target="_blank"
                rel="noopener noreferrer"
                className="text-silq-blue hover:underline"
              >
                here
              </a>
              {' '}and by request.
            </p>
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="relative py-20 bg-gradient-to-br from-silq-dark via-silq-blue-900 to-silq-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-silq-teal blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-silq-blue blur-3xl" />
        </div>
        <div className="container-silq relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-display-sm font-bold mb-4">
              License Our Technology
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Bring antibiofouling technology to your devices.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/products/surface-treatment">
                <Button variant="primary" size="lg">
                  Surface Treatment Services →
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="text-white border-white/20 hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        title="Explore Our Product"
        cta={{ text: 'ClearTract® Catheters', href: '/products/cleartract' }}
        secondaryCta={{ text: 'Contact Us', href: '/contact' }}
        variant="gradient"
      />
    </>
  )
}
