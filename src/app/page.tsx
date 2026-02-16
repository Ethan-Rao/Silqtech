'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Hero } from '@/components/sections/Hero'
import { CTABanner } from '@/components/sections/CTABanner'
import { Button } from '@/components/ui/Button'

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

const placeholderTestimonials = [
  {
    quote: "Placeholder testimonial text. This will be replaced with actual content.",
    author: "Placeholder Name",
    role: "Title, Organization",
  },
  {
    quote: "Placeholder testimonial text. This will be replaced with actual content.",
    author: "Placeholder Name",
    role: "Title, Organization",
  },
  {
    quote: "Placeholder testimonial text. This will be replaced with actual content.",
    author: "Placeholder Name",
    role: "Title, Organization",
  },
  {
    quote: "Placeholder testimonial text. This will be replaced with actual content.",
    author: "Placeholder Name",
    role: "Title, Organization",
  },
  {
    quote: "Placeholder testimonial text. This will be replaced with actual content.",
    author: "Placeholder Name",
    role: "Title, Organization",
  },
  {
    quote: "Placeholder testimonial text. This will be replaced with actual content.",
    author: "Placeholder Name",
    role: "Title, Organization",
  },
]

export default function HomePage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const maxIndex = Math.max(0, placeholderTestimonials.length - 2)

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
      <section className="section-padding bg-white">
        <div className="container-silq">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Feature Cards + How It Works */}
            <div>
              <h2 className="text-display-sm font-bold text-silq-dark mb-4">
                Innovation That Matters
              </h2>
              <p className="text-silq-dark/70 mb-8">
                Zwitterionic molecules create a hydration barrier that resists protein and bacterial adhesion—mimicking natural cell membranes.
              </p>
              <div className="grid grid-cols-2 gap-4">
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
            
            {/* Right: How It Works Video - Centered Vertically */}
            <div className="flex flex-col items-center justify-center">
              <motion.div 
                className="rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
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
              </motion.div>
              <div className="mt-6 text-center max-w-md mx-auto">
                <p className="text-sm text-silq-dark/50 mb-3">
                  Surface treatment in action
                </p>
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

      {/* Section 3: ClearTract + Scrollable Testimonials (Combined Dark Section) */}
      <section className="section-padding bg-gradient-to-br from-silq-blue-900 via-silq-dark to-silq-blue-800 text-white">
        <div className="container-silq">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Product + Encrustation Image */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="/images/products/boxnew.jpg"
                alt="ClearTract Foley Catheter"
                width={500}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
              {/* Encrustation comparison */}
              <div className="mt-6 rounded-xl overflow-hidden">
                <div className="h-48 md:h-56 overflow-hidden">
                  <Image 
                    src="/images/science/encrustation-comparison.png"
                    alt="Encrustation comparison - standard catheter vs ClearTract"
                    width={500}
                    height={250}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <p className="text-xs text-white/60 mt-2 text-center">
                  Visible difference in mineral buildup after extended use
                </p>
              </div>
            </motion.div>
            
            {/* Right: Copy + CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-teal bg-silq-teal/20 rounded-full">
                FDA 510(k) Cleared
              </span>
              <h2 className="text-display-sm font-bold mb-4">
                ClearTract® Foley Catheters
              </h2>
              <p className="text-white/80 mb-6">
                Drug-free infection resistance. Reduced encrustation. Superior patient comfort.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/products/cleartract">
                  <Button variant="primary" size="lg">Learn More</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary" size="lg" className="text-white border-white/30 hover:bg-white/10">
                    Request Samples
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Scrollable Testimonials */}
          <div className="mt-16">
            <h3 className="text-lg font-semibold text-white/90 mb-6 text-center">What People Are Saying</h3>
            <div className="relative max-w-4xl mx-auto">
              {/* Carousel */}
              <div className="overflow-hidden rounded-xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${testimonialIndex * (100 / 2)}%)` }}
                >
                  {placeholderTestimonials.map((t, i) => (
                    <div key={i} className="w-1/2 flex-shrink-0 px-2">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 h-full">
                        <svg className="w-6 h-6 text-silq-teal/40 mb-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                        </svg>
                        <blockquote className="text-white/85 text-sm leading-relaxed mb-4">
                          &ldquo;{t.quote}&rdquo;
                        </blockquote>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-silq-teal/30 flex items-center justify-center text-xs font-bold text-white">
                            {t.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-white text-xs">{t.author}</p>
                            <p className="text-white/50 text-xs">{t.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setTestimonialIndex(Math.max(0, testimonialIndex - 1))}
                  disabled={testimonialIndex === 0}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  aria-label="Previous testimonials"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* Dots */}
                <div className="flex gap-1.5">
                  {Array.from({ length: maxIndex + 1 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === testimonialIndex ? 'bg-silq-teal' : 'bg-white/30'}`}
                      aria-label={`Go to testimonial group ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setTestimonialIndex(Math.min(maxIndex, testimonialIndex + 1))}
                  disabled={testimonialIndex === maxIndex}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  aria-label="Next testimonials"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Surface Treatment Services Teaser */}
      <section className="section-padding bg-silq-cream relative overflow-hidden">
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
                  { icon: '🔬', label: 'Custom Formulations' },
                  { icon: '📏', label: 'Multi-Substrate' },
                  { icon: '🏭', label: 'Scalable Production' },
                  { icon: '✓', label: 'FDA Platform' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-silq-dark/80">
                    <span className="text-lg">{item.icon}</span>
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
            <div className="h-14 flex items-center">
              <Image src="/images/trust/fda.png" alt="FDA Cleared" width={50} height={50} className="object-contain" />
            </div>
            <div className="h-14 flex items-center">
              <Image src="/images/trust/ucla.jpg" alt="UCLA" width={90} height={45} className="h-10 w-auto object-contain" />
            </div>
            <div className="flex flex-col items-center">
              <div className="h-14 flex items-center justify-center gap-3">
                <Image src="/images/trust/premier-logo.svg" alt="Premier" width={50} height={35} className="h-7 w-auto object-contain" />
                <Image src="/images/trust/vizient-logo.svg" alt="Vizient" width={50} height={35} className="h-7 w-auto object-contain" />
              </div>
              <p className="text-xs text-silq-dark/40 mt-1">GPO Approved</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-14 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-silq-blue/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-silq-dark/40 mt-1">Made in USA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: CTA */}
      <CTABanner
        title="Ready to Learn More?"
        description="Connect with our team."
        cta={{ text: 'Contact Us', href: '/contact' }}
        variant="gradient"
      />
    </>
  )
}
