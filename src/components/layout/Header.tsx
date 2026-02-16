'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Technology', href: '/technology' },
  { name: 'ClearTract®', href: '/products/cleartract' },
  { name: 'Surface Treatment Services', href: '/products/surface-treatment' },
  {
    name: 'About',
    href: '/about',
    children: [
      { name: 'Our Team', href: '/about/team' },
      { name: 'Investors', href: '/about/investors' },
    ],
  },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        'bg-white border-b border-silq-dark/5 backdrop-blur-lg',
        isScrolled && 'shadow-lg shadow-silq-dark/5'
      )}
    >
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav className="container-silq">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex-shrink-0">
            <Image
              src="/images/logos/logo-main.png"
              alt="Silq Technologies"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200',
                    'hover:text-silq-blue',
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'text-silq-blue'
                      : 'text-silq-dark'
                  )}
                >
                  <span className="flex items-center gap-1">
                    {item.name}
                    {item.children && (
                      <svg
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          openDropdown === item.name && 'rotate-180'
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </span>
                </Link>

                {/* Dropdown */}
                {item.children && (
                  <div
                    className={cn(
                      'absolute top-full left-0 pt-2 transition-all duration-200',
                      openDropdown === item.name
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    )}
                  >
                    <div className="bg-white rounded-xl shadow-xl shadow-silq-dark/10 border border-silq-dark/5 py-2 min-w-[220px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            'block px-4 py-2.5 text-sm transition-colors duration-150',
                            'hover:bg-silq-blue/5 hover:text-silq-blue',
                            pathname === child.href ? 'text-silq-blue bg-silq-blue/5' : 'text-silq-dark/80'
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link href="/contact">
              <Button variant="primary" size="md">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden relative z-10 p-2 -mr-2 text-silq-dark"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Open menu</span>
            <div className="w-6 h-6 flex flex-col items-center justify-center gap-1.5">
              <span
                className={cn(
                  'w-6 h-0.5 bg-current transition-all duration-300',
                  mobileMenuOpen && 'rotate-45 translate-y-2'
                )}
              />
              <span
                className={cn(
                  'w-6 h-0.5 bg-current transition-all duration-300',
                  mobileMenuOpen && 'opacity-0'
                )}
              />
              <span
                className={cn(
                  'w-6 h-0.5 bg-current transition-all duration-300',
                  mobileMenuOpen && '-rotate-45 -translate-y-2'
                )}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 top-20 bg-white z-40 transition-all duration-300',
          mobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        )}
      >
        <div className="container-silq py-6 space-y-4">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'block py-4 px-2 text-lg font-medium border-b border-silq-dark/10 transition-colors',
                  pathname === item.href ? 'text-silq-blue' : 'text-silq-dark hover:text-silq-blue'
                )}
              >
                {item.name}
              </Link>
              {item.children && (
                <div className="pl-4 py-2 space-y-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={cn(
                        'block py-2 text-base',
                        pathname === child.href ? 'text-silq-blue' : 'text-silq-dark/70'
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-4">
            <Link href="/contact" className="block">
              <Button variant="primary" size="lg" className="w-full">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
