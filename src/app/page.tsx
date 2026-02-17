'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Hero } from '@/components/sections/Hero'
import { Button } from '@/components/ui/Button'
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel'

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Infection Resistance',
    description: 'Biofilm reduction without antibiotics or antimicrobials.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
      </svg>
    ),
    title: 'Reduced Encrustation',
    description: 'Fewer blockages, fewer replacements, reduced trauma.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Cost Efficiency',
    description: 'Decrease complication-related expenses.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'Enhanced Comfort',
    description: 'Superior lubricity for patient wellbeing.',
  },
]

const newsItems = [
  {
    source: 'PR Newswire',
    title: 'Silq Technologies Awarded Group Purchasing Agreement for ClearTract® Catheters with Premier, Inc.',
    url: 'https://www.prnewswire.com/news-releases/silq-technologies-awarded-group-purchasing-agreement-for-cleartract-catheters-with-premier-inc-301234567.html',
    logo: '/images/news/prnewswire.svg',
  },
  {
    source: 'Business Wire',
    title: 'Silq Technologies and NuSil Announce Collaboration Agreement to Drive Broad-based Adoption',
    url: 'https://www.businesswire.com/',
    logo: '/images/news/businesswire.svg',
  },
  {
    source: 'Business Wire',
    title: 'Silq Technologies Receives Innovative Technology Contract From Vizient for ClearTract® Foley Catheter',
    url: 'https://www.businesswire.com/',
    logo: '/images/news/businesswire.svg',
  },
  {
    source: 'UCLA Newsroom',
    title: 'Scientists Devise Method to Prevent Deadly Hospital Infections without Antibiotics',
    url: 'https://newsroom.ucla.edu/',
    logo: '/images/trust/ucla.jpg',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Section 1: Hero */}
      <Hero
        title="Transforming Surfaces Through"
        highlightedText="Advanced Material Science"
        description="Surface technology for better, safer medical implants. FDA Cleared, Antibiotic-free."
        primaryCta={{ text: 'Our Technology', href: '/technology' }}
        secondaryCta={{ text: 'ClearTract® Foley Catheters', href: '/products/cleartract' }}
        variant="default"
        size="large"
        backgroundMedia={{
          type: 'gif',
          src: '/images/hero/banner.gif'
        }}
      />

      {/* Section 2: Innovation That Matters + How It Works Video */}
      <section className="py-20 bg-white">
        <div className="container-silq">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Left: Text + Cards */}
            <div className="flex flex-col">
              <h2 className="text-3xl md:text-4xl font-bold text-silq-dark mb-4">
                Innovation That Matters
              </h2>
              <p className="text-silq-dark/70 mb-8">
                Zwitterionic molecules create a hydration barrier that repels proteins and bacteria.
              </p>
              {/* 2x2 Feature Cards - Fill remaining space */}
              <div className="grid grid-cols-2 gap-4 flex-1">
                {features.map((feature, index) => (
                  <motion.div 
                    key={feature.title} 
                    className="p-5 bg-silq-cream rounded-xl hover:shadow-xl transition-all duration-300 min-h-[140px] flex flex-col group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-silq-blue/10 flex items-center justify-center text-silq-blue mb-3 group-hover:bg-silq-blue group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-silq-dark text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-silq-dark/60">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Right: Video - Match height of left column */}
            <div className="flex flex-col h-full">
              <motion.div 
                className="rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <video 
                  src="/videos/silq-technology-demo.mp4" 
                  poster="/images/textures/tech-overview.gif"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover flex-1"
                />
                <div className="p-3 bg-gradient-to-r from-silq-blue to-silq-teal text-white text-center">
                  <p className="text-sm font-medium">Surface Treatment in Action</p>
                </div>
              </motion.div>
              <div className="mt-4 text-center">
                <Link href="/technology" className="text-sm text-silq-blue hover:underline font-medium">
                  Learn how it works →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-silq-dark/10 to-transparent" />

      {/* Section 3: ClearTract + Testimonials + Images (Combined Dark Section) */}
      <section className="py-20 bg-gradient-to-b from-silq-dark to-[#1a3a52] text-white">
        <div className="container-silq">
          {/* Title */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              ClearTract® Foley Catheters
            </h2>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto">
              Drug-free surface treatment designed to reduce infection, encrustation, and improve patient comfort.
            </p>
          </motion.div>

          {/* Buttons - IMMEDIATELY after title */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link
              href="/products/cleartract"
              className="px-8 py-3 bg-silq-blue hover:bg-silq-blue/90 text-white rounded-lg font-semibold transition-colors"
            >
              Learn More
            </Link>
            <Link
              href="/technology"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              Learn the Science
            </Link>
            <Link
              href="/contact?inquiry=ordering"
              className="px-8 py-3 bg-silq-teal hover:bg-silq-teal/90 text-white rounded-lg font-semibold transition-colors"
            >
              Ordering Information
            </Link>
          </motion.div>

          {/* Testimonials Carousel */}
          <TestimonialCarousel
            testimonials={[
              {
                quote: "ClearTract catheters have made a significant difference in reducing catheter-associated infections in my practice.",
                author: "Evgeniy Kreydin, M.D.",
                role: "Urologist, Cedars-Sinai",
                initials: "EK",
              },
              {
                quote: "I would not go back to other catheters ever again. The comfort has been life-changing for my daily routine.",
                author: "Ana Garcia",
                role: "Long-term Catheter Patient",
                initials: "AG",
              },
              {
                quote: "Her UTIs have completely subsided, no more blockages or emergency room visits. My mom is completely satisfied.",
                author: "Stephen Newhouse",
                role: "Caregiver",
                initials: "SN",
              },
            ]}
            className="mb-12"
          />

          {/* Images Row - Box and Publication side by side */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            {/* Left: Product Box */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="/images/products/boxnew.jpeg"
                alt="ClearTract Foley Catheter"
                width={400}
                height={500}
                className="rounded-2xl shadow-2xl object-contain"
              />
            </motion.div>

            {/* Right: Publication */}
            <motion.div
              className="flex flex-col items-center h-full justify-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <a 
                href="https://onlinelibrary.wiley.com/doi/10.1002/adma.202200254"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow bg-white"
              >
                <Image 
                  src="/images/publications/advanced-materials-cover.jpg"
                  alt="Advanced Materials Journal Cover"
                  width={350}
                  height={450}
                  className="object-contain"
                />
              </a>
              <div className="mt-4 text-center max-w-sm">
                <p className="text-white/80 text-sm">
                  <span className="font-semibold text-white">Published in Advanced Materials (2022)</span>
                  <br />
                  &ldquo;A Readily Scalable, Clinically Demonstrated, Antibiofouling Zwitterionic Surface Treatment&rdquo;
                </p>
                <a 
                  href="https://onlinelibrary.wiley.com/doi/10.1002/adma.202200254"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-silq-teal hover:text-white text-sm font-medium transition-colors"
                >
                  Read the full paper →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Surface Treatment Services Teaser */}
      <section className="py-20 bg-silq-cream relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1E4A6D 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="container-silq relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
                B2B Partnerships
              </span>
              <h2 className="text-display-sm font-bold text-silq-dark mb-4">
                Surface Treatment Services
              </h2>
              <p className="text-silq-dark/70 mb-6">
                Bring our proven antibiofouling technology to your medical devices. We offer contract surface treatment services with customizable properties for various substrates.
              </p>
              
              {/* Key capabilities grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: (
                    <svg className="w-5 h-5 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  ), label: 'Custom Formulations' },
                  { icon: (
                    <svg className="w-5 h-5 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  ), label: 'Multi-Substrate' },
                  { icon: (
                    <svg className="w-5 h-5 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  ), label: 'Scalable Production' },
                  { icon: (
                    <svg className="w-5 h-5 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ), label: 'FDA Platform' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-silq-dark/80">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/products/surface-treatment">
                  <Button variant="primary" size="lg">Explore Partnership</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary" size="lg">Contact Us</Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl bg-white">
                <Image 
                  src="/images/science/silq-machine.gif"
                  alt="Silq surface treatment process"
                  width={500}
                  height={400}
                  className="w-full object-cover"
                  unoptimized
                />
                <div className="p-4 bg-gradient-to-r from-silq-blue to-silq-teal text-white">
                  <p className="text-sm font-medium">Scalable Treatment Process</p>
                  <p className="text-xs text-white/70">In-house manufacturing capability</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-silq-dark/10 to-transparent" />

      {/* Section 5: News */}
      <section className="py-12 bg-white">
        <div className="container-silq">
          <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue text-center mb-8">
            In The News
          </p>
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {newsItems.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] bg-silq-cream rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-silq-dark/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Image 
                    src={item.logo} 
                    alt={item.source} 
                    width={80} 
                    height={24} 
                    className="h-5 w-auto object-contain opacity-60"
                  />
                  <span className="text-xs text-silq-dark/40">{item.source}</span>
                </div>
                <h4 className="text-sm font-semibold text-silq-dark leading-snug line-clamp-3">
                  {item.title}
                </h4>
                <p className="text-xs text-silq-blue mt-3 flex items-center gap-1">
                  Read article 
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Trust Logos */}
      <section className="py-14 bg-white border-t border-silq-dark/5">
        <div className="container-silq">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
            <Image src="/images/trust/fda.png" alt="FDA Cleared" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            <Image src="/images/trust/ucla.jpg" alt="UCLA" width={90} height={45} className="h-10 w-auto object-contain" />
            <Image src="/images/trust/premier-logo.svg" alt="Premier" width={60} height={30} className="h-7 w-auto object-contain" />
            <Image src="/images/trust/vizient-logo.svg" alt="Vizient" width={60} height={30} className="h-7 w-auto object-contain" />
          </div>
        </div>
      </section>

      {/* Section 7: CTA with Promotional Video */}
      <section className="py-20 bg-gradient-to-br from-silq-dark to-silq-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-silq-teal blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-silq-blue blur-3xl" />
        </div>
        <div className="container-silq relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Learn More?
            </motion.h2>
            
            {/* Promotional video */}
            <motion.div 
              className="mb-8 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative aspect-video">
                <iframe
                  src="https://player.vimeo.com/video/710986413?h=&title=0&byline=0&portrait=0"
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Silq Technology Overview"
                />
              </div>
              <div className="p-3 bg-gradient-to-r from-silq-blue to-silq-teal text-white text-center">
                <p className="text-sm font-medium">Silq Technology Overview</p>
              </div>
            </motion.div>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button variant="primary" size="lg">Contact Us</Button>
              </Link>
              <Link href="/products/cleartract">
                <Button variant="secondary" size="lg" className="text-white border-white/20 hover:bg-white/10">
                  ClearTract® Catheters
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
