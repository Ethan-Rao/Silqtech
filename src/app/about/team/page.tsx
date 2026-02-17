'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { CTABanner } from '@/components/sections/CTABanner'
import { BiographyCard } from '@/components/ui/BiographyCard'

const teamMembers = [
  {
    name: 'Verne Sharma',
    credentials: 'MBA',
    title: 'CEO, Board of Directors',
    image: '/images/team/verne-sharma.jpg',
    bio: 'Placeholder biography — content pending team review. Full biography will include education, career highlights, and role at Silq Technologies.',
    shortBio: 'Placeholder short bio — pending team review.',
    email: 'info@silq.tech',
  },
  {
    name: 'Jack Kavanaugh',
    credentials: 'MD, MBA',
    title: 'Chairman of the Board',
    image: '/images/team/jack-kavanaugh.jpg',
    bio: 'Placeholder biography — content pending team review. Full biography will include education, career highlights, and role at Silq Technologies.',
    shortBio: 'Placeholder short bio — pending team review.',
  },
  {
    name: 'Richard Kaner',
    credentials: 'PhD',
    title: 'Chief Scientific Advisor, Board of Directors',
    image: '/images/team/richard-kaner.jpg',
    bio: 'Placeholder biography — content pending team review. Full biography will include education, career highlights, and role at Silq Technologies.',
    shortBio: 'Placeholder short bio — pending team review.',
  },
  {
    name: 'Brian McVerry',
    credentials: 'PhD',
    title: 'CTO, Board of Directors',
    image: '/images/team/brian-mcverry.jpg',
    bio: 'Placeholder biography — content pending team review. Full biography will include education, career highlights, and role at Silq Technologies.',
    shortBio: 'Placeholder short bio — pending team review.',
    email: 'brianm@silq.tech',
  },
  {
    name: 'Mahi De Silva',
    title: 'Board of Directors',
    image: '/images/team/mahi-desilva.jpg',
    bio: 'Placeholder biography — content pending team review. Full biography will include education, career highlights, and role at Silq Technologies.',
    shortBio: 'Placeholder short bio — pending team review.',
  },
  {
    name: 'Robert Snukal',
    title: 'Board of Directors',
    image: '/images/team/robert-snukal.jpg',
    bio: 'Placeholder biography — content pending team review. Full biography will include education, career highlights, and role at Silq Technologies.',
    shortBio: 'Placeholder short bio — pending team review.',
  },
]

export default function TeamPage() {
  return (
    <>
      {/* Hero */}
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

      {/* Company Overview */}
      <section className="py-16 bg-white relative overflow-hidden">
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

      {/* Team Grid with Biography Cards */}
      <section className="py-20 bg-silq-cream">
        <div className="container-silq">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-silq-dark">
              Meet Our Team
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BiographyCard {...member} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
