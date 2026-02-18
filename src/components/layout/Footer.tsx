import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-silq-dark text-white">
      <div className="container-silq py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logos/logo-main.png"
                alt="Silq Technologies"
                width={140}
                height={45}
                className="h-11 w-auto"
              />
            </Link>
            <p className="text-white/60 text-sm font-light tracking-wide mb-2">
              Surface Science Perfected
            </p>
            <p className="text-white/40 text-xs">
              Los Angeles, California
            </p>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Products</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <Link href="/products/cleartract" className="hover:text-white transition-colors">
                  ClearTract® Catheters
                </Link>
              </li>
              <li>
                <Link href="/products/surface-treatment" className="hover:text-white transition-colors">
                  Surface Treatment
                </Link>
              </li>
              <li>
                <Link href="/technology" className="hover:text-white transition-colors">
                  Technology
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <Link href="/about/team" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about/investors" className="hover:text-white transition-colors">
                  Investors
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <a 
                  href="https://www.termsfeed.com/live/64033d10-28a1-4790-8c14-dcc8b36bc800"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="https://www.termsfeed.com/live/d6ba54e4-a9be-410a-80b2-5037841021b5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a 
                  href="https://www.termsfeed.com/live/1252cec2-0fa4-4014-bf4a-2494a8d7eb29"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Silq Technologies Corp. All rights reserved.
            </p>
            <a
              href="https://linkedin.com/company/silq-technologies"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
