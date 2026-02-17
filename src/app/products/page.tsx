import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CTABanner } from '@/components/sections/CTABanner'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Explore Silq Technologies products including ClearTract® Foley Catheters and surface treatment services for B2B partners.',
}

const products = [
  {
    title: 'ClearTract® Foley Catheters',
    description: 'FDA-cleared urinary catheters featuring our patented zwitterionic surface treatment to reduce catheter-associated infections without antibiotics.',
    image: '/images/products/boxnew.jpeg',
    href: '/products/cleartract',
    badge: 'Flagship Product',
    highlights: ['FDA 510(k) Cleared', '100% Silicone', 'Drug-Free'],
  },
  {
    title: 'Surface Treatment Services',
    description: 'B2B surface treatment services bringing our antibiofouling and lubricity-enhancing technology to third-party medical devices and industrial applications.',
    image: null,
    href: '/products/surface-treatment',
    badge: 'B2B Partnership',
    highlights: ['Custom Formulations', 'Multi-Substrate', 'Scalable Process'],
  },
]

export default function ProductsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-silq-cream via-white to-silq-teal/5 relative overflow-hidden">
        <div className="container-silq text-center relative">
              <h1 className="text-hero-sm md:text-hero font-bold text-silq-dark">
            Technology That <span className="bg-gradient-to-r from-silq-blue to-silq-teal bg-clip-text text-transparent">Transforms</span>
          </h1>
          <p className="mt-6 text-lg text-silq-dark/70 max-w-2xl mx-auto">
            From our flagship ClearTract® catheters to custom surface treatment solutions, 
            we&apos;re bringing zwitterionic technology to healthcare and industry.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="container-silq">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
              <Card key={product.title} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-[4/3] relative bg-gradient-to-br from-silq-cream to-silq-blue/5 overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src="/images/science/silq-machine.gif"
                      alt="Surface Treatment Process"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold text-white bg-silq-blue rounded-full shadow-lg">
                    {product.badge}
                  </span>
                </div>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-silq-dark">
                    {product.title}
                  </h2>
                  <p className="mt-3 text-silq-dark/60 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.highlights.map((highlight) => (
                      <span key={highlight} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-silq-teal bg-silq-teal/10 rounded">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {highlight}
                      </span>
                    ))}
                  </div>
                  
                  <Link href={product.href} className="mt-6 inline-block">
                    <Button variant="primary">
                      Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-silq-cream">
        <div className="container-silq">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="text-center">
              <Image src="/images/trust/fda.png" alt="FDA Cleared" width={60} height={60} className="mx-auto grayscale hover:grayscale-0 transition-all" />
              <p className="mt-2 text-xs text-silq-dark/50">510(k) Cleared</p>
            </div>
            <div className="text-center">
              <Image src="/images/trust/ucla.jpg" alt="UCLA Research" width={80} height={40} className="mx-auto grayscale hover:grayscale-0 transition-all" />
                  <p className="mt-2 text-xs text-silq-dark/50">UCLA Research</p>
            </div>
            <div className="text-center">
              <Image src="/images/trust/verizon-award.png" alt="Verizon Award" width={80} height={40} className="mx-auto grayscale hover:grayscale-0 transition-all" />
                  <p className="mt-2 text-xs text-silq-dark/50">&nbsp;</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        title="Questions About Our Products?"
        description="Our team is ready to help you find the right solution for your needs."
        cta={{ text: 'Contact Us', href: '/contact' }}
        secondaryCta={{ text: 'Request Samples', href: '/contact' }}
        variant="gradient"
      />
    </>
  )
}
