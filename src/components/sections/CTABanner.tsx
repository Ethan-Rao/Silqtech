'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface CTABannerProps {
  title: string
  description?: string
  cta: {
    text: string
    href: string
    external?: boolean
  }
  secondaryCta?: {
    text: string
    href: string
  }
  variant?: 'gradient' | 'light' | 'dark'
  className?: string
}

export function CTABanner({
  title,
  description,
  cta,
  secondaryCta,
  variant = 'gradient',
  className,
}: CTABannerProps) {
  return (
    <section
      className={cn(
        'relative py-20 md:py-24',
        variant === 'gradient' && 'bg-silq-gradient text-white',
        variant === 'dark' && 'bg-silq-dark text-white',
        variant === 'light' && 'bg-silq-cream text-silq-dark',
        className
      )}
    >
      {/* Gradient accent border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-silq-blue via-silq-teal to-silq-blue" />
      <div className="container-silq text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-display-sm md:text-display font-bold">{title}</h2>
          {description && (
            <p
              className={cn(
                'mt-4 text-lg',
                variant === 'light' ? 'text-silq-dark/70' : 'text-white/80'
              )}
            >
              {description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {cta.external ? (
              <a href={cta.href} target="_blank" rel="noopener noreferrer">
                <Button
                  variant={variant === 'light' ? 'primary' : 'teal'}
                  size="lg"
                >
                  {cta.text}
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Button>
              </a>
            ) : (
              <Link href={cta.href}>
                <Button
                  variant={variant === 'light' ? 'primary' : 'teal'}
                  size="lg"
                >
                  {cta.text}
                </Button>
              </Link>
            )}

            {secondaryCta && (
              <Link href={secondaryCta.href}>
                <Button
                  variant="ghost"
                  size="lg"
                  className={
                    variant !== 'light'
                      ? 'text-white border border-white/30 hover:bg-white/10'
                      : ''
                  }
                >
                  {secondaryCta.text}
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
