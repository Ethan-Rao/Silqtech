import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-silq-cream via-white to-silq-cream relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-silq-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-silq-teal/5 rounded-full blur-3xl" />
      </div>
      
      {/* Subtle Monogram Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <Image
          src="/images/logos/silq-monogram.png"
          alt=""
          width={600}
          height={600}
          className="w-[600px] h-auto"
        />
      </div>

      <div className="container-silq text-center relative">
        <div className="max-w-lg mx-auto">
          {/* Animated 404 */}
          <div className="relative mb-6">
            <h1 className="text-[140px] md:text-[180px] font-bold leading-none bg-gradient-to-br from-silq-blue/30 via-silq-teal/20 to-silq-blue/10 bg-clip-text text-transparent">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white shadow-xl flex items-center justify-center">
                <svg className="w-10 h-10 md:w-12 md:h-12 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-silq-dark">
            Page Not Found
          </h2>
          <p className="mt-4 text-lg text-silq-dark/60">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been 
            moved or doesn&apos;t exist.
          </p>
          
          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button variant="primary" size="lg">
                Go Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
          
          {/* Helpful Links */}
          <div className="mt-10 pt-8 border-t border-silq-dark/10">
            <p className="text-sm text-silq-dark/50 mb-4">Try these:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/products/cleartract" className="text-silq-blue hover:underline">
                ClearTract SPT® Catheters
              </Link>
              <Link href="/technology" className="text-silq-blue hover:underline">
                Our Technology
              </Link>
              <Link href="/about/team" className="text-silq-blue hover:underline">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
