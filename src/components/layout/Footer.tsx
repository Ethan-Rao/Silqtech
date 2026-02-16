import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  products: [
    { name: 'ClearTract®', href: '/products/cleartract' },
    { name: 'Surface Treatment Services', href: '/products/surface-treatment' },
    { name: 'Technology', href: '/technology' },
  ],
  company: [
    { name: 'Our Team', href: '/about/team' },
    { name: 'Investors', href: '/about/investors' },
    { name: 'Technology', href: '/technology' },
  ],
  legal: [
    { name: 'Privacy Policy', href: 'https://www.termsfeed.com/live/silq-privacy', external: true },
    { name: 'Terms & Conditions', href: 'https://www.termsfeed.com/live/silq-terms', external: true },
    { name: 'Cookies Policy', href: 'https://www.termsfeed.com/live/silq-cookies', external: true },
  ],
}

const contactInfo = {
  email: 'info@silq.tech',
  phone: '(424) 309-8523',
  address: '323 Sunny Isles Blvd., 7th Floor',
  city: 'Sunny Isles Beach, FL 33160',
}

export function Footer() {
  return (
    <footer className="bg-silq-dark text-white">
      <div className="container-silq py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Image
                src="/images/logos/logo-oneline.png"
                alt="Silq Technologies"
                width={160}
                height={45}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-6 text-white/60 text-sm leading-relaxed max-w-sm">
              Transforming surfaces through advanced material science. Born from UCLA research, 
              our zwitterionic surface treatment technology is revolutionizing medical devices.
            </p>
            
            {/* Trust Badges */}
            <div className="flex items-center gap-4 mt-6">
              <Image
                src="/images/trust/fda.png"
                alt="FDA Cleared"
                width={60}
                height={30}
                className="h-8 w-auto opacity-70"
              />
              <Image
                src="/images/trust/ucla.jpg"
                alt="UCLA Research"
                width={60}
                height={30}
                className="h-8 w-auto opacity-70"
              />
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
              Products
            </h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4 mt-8">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contactInfo.phone.replace(/[^0-9]/g, '')}`}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="text-white/60">
                {contactInfo.address}
                <br />
                {contactInfo.city}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Silq Technologies. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com/company/silq-technologies"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
