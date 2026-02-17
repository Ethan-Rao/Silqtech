import { Metadata } from 'next'
import Image from 'next/image'
import { Hero } from '@/components/sections/Hero'
import { TeamGrid } from '@/components/sections/TeamGrid'
import { CTABanner } from '@/components/sections/CTABanner'

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the leadership team behind Silq Technologies, bringing together expertise in medical devices, material science, and business development.',
}

const teamMembers = [
  {
    name: 'Verne Sharma',
    credentials: 'MBA',
    title: 'CEO, Board of Directors',
    image: '/images/team/verne-sharma.jpg',
  },
  {
    name: 'Jack Kavanaugh',
    credentials: 'MD, MBA',
    title: 'Chairman of the Board',
    image: '/images/team/jack-kavanaugh.jpg',
  },
  {
    name: 'Richard Kaner',
    credentials: 'PhD',
    title: 'Chief Scientific Advisor, Board of Directors',
    image: '/images/team/richard-kaner.jpg',
  },
  {
    name: 'Brian McVerry',
    credentials: 'PhD',
    title: 'CTO, Board of Directors',
    image: '/images/team/brian-mcverry.jpg',
  },
  {
    name: 'Mahi De Silva',
    title: 'Board of Directors',
    image: '/images/team/mahi-desilva.jpg',
  },
  {
    name: 'Robert Snukal',
    title: 'Board of Directors',
    image: '/images/team/robert-snukal.jpg',
  },
]

export default function TeamPage() {
  return (
    <>
      {/* Hero with enhanced visuals */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-silq-cream via-white to-silq-blue/5 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-silq-teal/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-silq-blue/5 rounded-full blur-3xl" />
        </div>
        
        {/* Watermark */}
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-[0.03] pointer-events-none">
          <Image
            src="/images/logos/silq-monogram.png"
            alt=""
            width={600}
            height={600}
          />
        </div>
        
        <div className="container-silq text-center relative">
              <h1 className="text-hero-sm md:text-hero font-bold text-silq-dark">
            Leadership
          </h1>
          <p className="mt-6 text-lg text-silq-dark/70 max-w-2xl mx-auto">
            Silq Technologies brings together world-class experts in material science, medical devices, and business development to transform surface technology.
          </p>
        </div>
      </section>

      {/* Company Overview with enhanced design */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1E4A6D 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="container-silq relative">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
              <div className="text-center p-6 rounded-2xl bg-silq-cream/50">
                <div className="text-3xl font-bold text-silq-blue mb-2">UCLA</div>
                <div className="text-sm text-silq-dark/60">Research Origins</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-silq-cream/50">
                <div className="text-3xl font-bold text-silq-blue mb-2">FDA</div>
                <div className="text-sm text-silq-dark/60">510(k) Cleared</div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg text-silq-dark/70 leading-relaxed">
                Silq Technologies is a leader in advanced biomaterials, developing innovative 
                surface modification technologies for medical devices, implants, microfluidics, 
                lithium-ion batteries, and water treatment applications. Our mission is to 
                provide life-changing clinical benefits for patients and address the widespread 
                need for antibiofouling solutions across industries worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
            <TeamGrid
              subtitle=""
              title="Meet Our Team"
              members={teamMembers}
              className="bg-silq-cream"
            />

          {/* CTA */}
      <CTABanner
        title="Join Our Mission"
        description="Interested in partnership opportunities or joining our team?"
        cta={{ text: 'Contact Us', href: '/contact' }}
        secondaryCta={{ text: 'Investor Information', href: '/about/investors' }}
        variant="gradient"
      />
    </>
  )
}
