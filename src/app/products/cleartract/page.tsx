import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CTABanner } from '@/components/sections/CTABanner'
import { Button } from '@/components/ui/Button'
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel'

export const metadata: Metadata = {
  title: 'ClearTract® Foley Catheters',
  description: 'FDA-cleared urinary catheters with drug-free zwitterionic surface treatment to reduce infection, encrustation, and improve comfort.',
}

const testimonials = [
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
  {
    quote: "Placeholder testimonial - content pending team review.",
    author: "Placeholder Name",
    role: "Title, Organization",
    initials: "PN",
  },
  {
    quote: "Placeholder testimonial - content pending team review.",
    author: "Placeholder Name",
    role: "Title, Organization",
    initials: "PN",
  },
  {
    quote: "Placeholder testimonial - content pending team review.",
    author: "Placeholder Name",
    role: "Title, Organization",
    initials: "PN",
  },
]

export default function ClearTractPage() {

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-white">
        <div className="container-silq">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
                FDA 510(k) Cleared
              </span>
              <h1 className="text-hero-sm md:text-hero font-bold text-silq-dark">
                ClearTract® Foley Catheters
              </h1>
              <p className="mt-4 text-lg text-silq-dark/70">
                Drug-free surface treatment designed to reduce infection, encrustation, and improve patient comfort.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button variant="primary" size="lg">Request Samples</Button>
                </Link>
                <Link href="/technology">
                  <Button variant="secondary" size="lg">Learn the Science</Button>
                </Link>
                <Link href="/contact?inquiry=ordering">
                  <Button variant="teal" size="lg">
                    Ordering Information
                  </Button>
                </Link>
              </div>
            </div>
            
            <Image
              src="/images/products/boxnew.jpeg"
              alt="ClearTract"
              width={600}
              height={600}
              className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Product Specs + Compact Testimonials (Combined Dark Section) */}
      <section className="py-10 bg-gradient-to-br from-silq-blue-900 via-silq-dark to-silq-blue-800 text-white">
        <div className="container-silq">
          {/* Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-base font-semibold text-silq-teal">Medical Grade Silicone</p>
              <p className="text-sm text-white/60">Latex, BPA, DEHP-free</p>
            </div>
            <div>
              <p className="text-base font-semibold text-silq-teal">FDA Cleared</p>
              <p className="text-sm text-white/60">510(k) regulatory approval</p>
            </div>
            <div>
              <p className="text-base font-semibold text-silq-teal">Drug-Free</p>
              <p className="text-sm text-white/60">No antibiotics or antimicrobials</p>
            </div>
            <div>
              <p className="text-base font-semibold text-silq-teal">Low Endotoxin</p>
              <p className="text-sm text-white/60">Safe for suprapubic insertions</p>
            </div>
          </div>
          
          {/* Divider */}
          <div className="w-20 h-px bg-white/15 mx-auto my-8" />
          
          {/* Testimonials Carousel */}
          <h2 className="text-xl font-bold text-center mb-5">What People Are Saying</h2>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-silq-cream">
        <div className="container-silq">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-silq-dark">
              Clinical Benefits
            </h2>
          </div>

          {/* Row 1: Bacteria Panel - Full Width */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-4xl mx-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold text-silq-blue mb-2">Resisting Bacterial Adhesion</h3>
                <p className="text-silq-dark/70 text-sm">
                  Permanent zwitterionic bond repels bacteria without antibiotics.
                </p>
              </div>
              <Image 
                src="/images/science/Bacteria%20Panel.png"
                alt="Bacterial adhesion comparison"
                width={1200}
                height={400}
                className="w-full object-contain"
              />
            </div>
          </div>
          
          {/* Row 2: Encrustation + Drug-Free + Comfort + FDA cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Reduced Encrustation - Text-only card */}
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-silq-teal/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
              </div>
              <h4 className="font-semibold text-silq-blue mb-2">Reduced Encrustation</h4>
              <p className="text-sm text-silq-dark/60">Zwitterionic surfaces reduce mineral buildup for longer catheter life and fewer replacements.</p>
            </div>

            {/* Drug-Free */}
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-silq-blue/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-silq-blue mb-2">Drug-Free</h4>
              <p className="text-sm text-silq-dark/60">No antibiotics or antimicrobial agents that contribute to resistance</p>
            </div>
            
            {/* Designed for Comfort */}
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-silq-blue/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h4 className="font-semibold text-silq-blue mb-2">Designed for Comfort</h4>
              <p className="text-sm text-silq-dark/60">Enhanced lubricity alleviating patient discomfort during insertion and removal</p>
            </div>
            
            {/* FDA Cleared */}
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-silq-blue/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className="font-semibold text-silq-blue mb-2">FDA Cleared</h4>
              <p className="text-sm text-silq-dark/60">510(k) cleared for urethral, suprapubic, and nephrostomy use</p>
            </div>
          </div>

          {/* Data on file footnote */}
          <p className="text-center text-xs text-silq-dark/40 mt-10">
            *Data on file available by request
          </p>
        </div>
      </section>

      {/* Ordering CTA Section */}
      <section className="py-12 bg-white">
        <div className="container-silq">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-silq-dark mb-4">Ready to Order?</h2>
            <p className="text-silq-dark/70 mb-6">
              Contact our team to discuss ordering options and availability.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="primary" size="lg">Request Samples</Button>
              </Link>
              <Link href="/contact?inquiry=ordering">
                <Button variant="teal" size="lg">Ordering Information</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        title="Learn About Our Technology"
        cta={{ text: 'View Technology', href: '/technology' }}
        secondaryCta={{ text: 'Contact Us', href: '/contact' }}
        variant="gradient"
      />
    </>
  )
}
