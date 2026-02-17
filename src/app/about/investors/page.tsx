import { Metadata } from 'next'
import Image from 'next/image'
import { InvestorForm } from '@/components/sections/InvestorForm'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'

export const metadata: Metadata = {
  title: 'Investor Opportunities',
  description: 'Learn about investment opportunities with Silq Technologies. Fill out our form to speak with a member of our team.',
}

export default function InvestorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-silq-cream">
        <div className="container-silq text-center">
          <h1 className="text-hero-sm md:text-hero font-bold text-silq-blue">
            Invest in Silq
          </h1>
          
          <p className="mt-6 text-lg text-silq-dark/70 max-w-2xl mx-auto">
            Fill out the form below to speak to a member of our team about investment 
            opportunities with Silq Technologies.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-white">
        <div className="container-silq">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-silq-dark mb-8">
                Investor Inquiry
              </h2>
              <InvestorForm />
            </div>

            {/* Why Invest */}
            <div className="lg:pl-8">
              <div className="sticky top-32">
                <h2 className="text-2xl font-bold text-silq-dark mb-8">
                  Why Invest in Silq?
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      title: 'FDA-Cleared Product',
                      description: 'FDA-cleared product in market.',
                    },
                    {
                      title: 'Platform Technology',
                      description: 'Platform technology for multiple device categories.',
                    },
                    {
                      title: 'Strong IP Portfolio',
                      description: 'Numerous patents established in the US and abroad.',
                    },
                    {
                      title: 'Large Market Opportunity',
                      description: '$1B+ addressable market.',
                    },
                    {
                      title: 'Experienced Team',
                      description: 'Experienced leadership team.',
                    },
                    {
                      title: 'Clinical Validation',
                      description: 'Clinical evidence of efficacy.',
                    },
                    {
                      title: 'Highly Scalable',
                      description: 'Manufacturing process scales to commercial volumes.',
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-silq-teal/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-silq-teal" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-silq-dark">{item.title}</h3>
                        <p className="mt-1 text-sm text-silq-dark/60">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="mt-10 p-6 bg-silq-blue/5 rounded-xl border border-silq-blue/10">
                  <h3 className="font-semibold text-silq-dark">
                    Prefer to reach out directly?
                  </h3>
                  <p className="mt-2 text-sm text-silq-dark/60">
                    Contact our team at{' '}
                    <a href="mailto:info@silq.tech" className="text-silq-blue hover:underline">
                      info@silq.tech
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Capability */}
      <section className="section-padding bg-silq-dark text-white">
        <div className="container-silq">
          <div className="text-center mb-12">
            <h2 className="text-display-sm md:text-display font-bold">
              Scalable Technology Platform
            </h2>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto">
              Our patented surface treatment process is designed for commercial-scale production 
              through qualified contract manufacturing partners.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden">
              {/* TODO: Replace with actual manufacturing facility photo */}
              <ImagePlaceholder 
                label="Manufacturing Facility" 
                icon="building" 
                variant="dark"
                className="w-full h-64 rounded-t-2xl" 
              />
              <div className="p-6 bg-white/10">
                <h3 className="font-semibold text-white mb-2">Contract Manufacturing</h3>
                <p className="text-white/70 text-sm">
                  Qualified contract manufacturing partners with established processes
                  ensuring consistent quality in every device produced.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              {/* TODO: Replace with actual manufacturing scale photo */}
              <ImagePlaceholder 
                label="Manufacturing Facility" 
                icon="building" 
                variant="dark"
                className="w-full h-64 rounded-t-2xl" 
              />
              <div className="p-6 bg-white/10">
                <h3 className="font-semibold text-white mb-2">Production Scale</h3>
                <p className="text-white/70 text-sm">
                  Established manufacturing processes ready to meet growing demand, with 
                  capacity to scale as market adoption increases.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '3', label: '510(k) Clearances' },
              { value: '1', label: 'FDA Master File' },
              { value: 'US', label: 'Based Company' },
              { value: '∞', label: 'Scalable Production' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-silq-teal">{stat.value}</div>
                <div className="text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-silq-cream">
        <div className="container-silq">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center items-center gap-8">
              <Image
                src="/images/trust/ucla.jpg"
                alt="UCLA"
                width={120}
                height={60}
                className="h-12 w-auto grayscale hover:grayscale-0 transition-all"
              />
              <Image
                src="/images/trust/fda.png"
                alt="FDA Cleared"
                width={100}
                height={50}
                className="h-10 w-auto grayscale hover:grayscale-0 transition-all"
              />
              <Image
                src="/images/trust/verizon-award.png"
                alt="Verizon Award"
                width={120}
                height={60}
                className="h-12 w-auto grayscale hover:grayscale-0 transition-all"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
