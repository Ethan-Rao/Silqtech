import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ContactAngleChart } from '@/components/ui/ContactAngleChart'

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

      {/* Surface Properties - Bacteria Panel + Publication + 3 Cards */}
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
                src="/images/science/BacPanelV2.png"
                alt="Bacterial adhesion reduction data"
                width={1200}
                height={400}
                className="w-full object-contain"
                priority
              />
            </div>
          </div>

          {/* Publication Reference - Compact */}
          <div className="mb-8 flex justify-center">
            <a 
              href="https://onlinelibrary.wiley.com/doi/10.1002/adma.202200254"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-6 bg-silq-cream rounded-xl p-4 hover:shadow-lg transition-shadow max-w-2xl"
            >
              <Image 
                src="/images/publications/advanced-materials-cover.jpg"
                alt="Advanced Materials Journal Cover"
                width={80}
                height={104}
                className="rounded-lg shadow-md flex-shrink-0"
              />
              <div>
                <p className="text-xs text-silq-dark/50 uppercase tracking-wider mb-1">Published in Advanced Materials (2022)</p>
                <p className="text-sm font-medium text-silq-dark leading-snug">
                  &ldquo;A Readily Scalable, Clinically Demonstrated, Antibiofouling Zwitterionic Surface Treatment&rdquo;
                </p>
                <p className="text-xs text-silq-blue mt-2 font-medium">
                  Read the full paper →
                </p>
              </div>
            </a>
          </div>
          
          {/* Row 2: Other 3 Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Anti-Thrombogenicity - Stacked Images with Labels */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-5">
                <h3 className="text-lg font-bold text-silq-blue">Anti-Thrombogenicity</h3>
                <p className="text-silq-dark/70 text-sm mt-1">Reduced blood clot formation.</p>
              </div>
              <div className="flex flex-col gap-1 px-2 pb-2">
                <div className="rounded-lg overflow-hidden relative">
                  <Image 
                    src="/images/science/blood-loop-treated.jpg"
                    alt="Blood loop - Silq treated surface"
                    width={400}
                    height={150}
                    className="w-full h-32 object-contain bg-white"
                  />
                  <span className="absolute bottom-1 left-2 text-xs bg-silq-teal/90 text-white px-2 py-0.5 rounded">Silq Treated</span>
                </div>
                <div className="rounded-lg overflow-hidden relative">
                  <Image 
                    src="/images/science/blood-loop-untreated.jpg"
                    alt="Blood loop - untreated control"
                    width={400}
                    height={150}
                    className="w-full h-32 object-contain bg-white"
                  />
                  <span className="absolute bottom-1 left-2 text-xs bg-gray-500/90 text-white px-2 py-0.5 rounded">Control</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Lubricity - Video */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-5">
                <h3 className="text-lg font-bold text-silq-blue">Enhanced Lubricity</h3>
                <p className="text-silq-dark/70 text-sm mt-1">Easier insertions</p>
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
                <p className="text-silq-dark/70 text-sm mt-1">Extended wetting time</p>
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

      {/* Adopt Our Technology - Combined with Multi-Substrate */}
      <section className="relative py-20 bg-gradient-to-br from-silq-dark via-silq-blue-900 to-silq-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-silq-teal blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-silq-blue blur-3xl" />
        </div>
        <div className="container-silq relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-display-sm font-bold mb-4">
                Adopt Our Technology
              </h2>
              <p className="text-white/60 max-w-lg mx-auto">
                Bring antibiofouling technology to your devices.
              </p>
            </div>
            
            {/* Two Column: Multi-Substrate Chart + Manufacturing */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
              {/* Left: Multi-Substrate Compatibility */}
              <div>
                <h3 className="text-xl font-bold text-silq-teal mb-4">
                  Multi-Substrate Compatibility
                </h3>
                <p className="text-white/70 mb-6">
                  Our treatment demonstrates consistent performance across multiple polymer substrates.
                </p>
                <div className="bg-white/10 rounded-xl p-4">
                  <ContactAngleChart />
                </div>
              </div>
              
              {/* Right: Manufacturing */}
              <div>
                <div className="rounded-2xl overflow-hidden shadow-2xl mb-4">
                  <Image 
                    src="/images/science/silq-machine.gif"
                    alt="Silq Manufacturing System"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <h3 className="text-base font-bold text-silq-teal mb-2">Scalable Manufacturing</h3>
                  <p className="text-sm text-white/70">
                    Rapid deposition process under ambient conditions. No exotic chemicals. Commercial-scale capacity.
                  </p>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
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
    </>
  )
}
