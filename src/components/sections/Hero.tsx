'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface HeroProps {
  title: string
  highlightedText?: string
  subtitle?: string
  description?: string
  primaryCta?: {
    text: string
    href: string
  }
  secondaryCta?: {
    text: string
    href: string
  }
  backgroundImage?: string
  backgroundGif?: string
  backgroundMedia?: {
    type: 'image' | 'gif' | 'video'
    src: string
  }
  variant?: 'default' | 'dark' | 'gradient'
  size?: 'default' | 'large' | 'small'
  align?: 'left' | 'center'
  showParticles?: boolean
  gradientAnimation?: boolean
}

export function Hero({
  title,
  highlightedText,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  backgroundImage,
  backgroundGif,
  backgroundMedia,
  variant = 'default',
  size = 'default',
  align = 'center',
  showParticles = false,
  gradientAnimation = false,
}: HeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden',
        size === 'large' && 'min-h-screen flex items-center',
        size === 'default' && 'py-32 md:py-40 lg:py-48',
        size === 'small' && 'py-24 md:py-32',
        variant === 'dark' && 'bg-silq-dark text-white',
        variant === 'gradient' && 'bg-hero-gradient text-white',
        variant === 'default' && !backgroundMedia && 'bg-silq-cream',
        variant === 'default' && backgroundMedia && 'bg-silq-dark text-white'
      )}
    >
      {/* Background Media (gif/image/video) */}
      {backgroundMedia && (
        <div className="absolute inset-0 z-0">
          {backgroundMedia.type === 'video' ? (
            <video 
              src={backgroundMedia.src} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            />
          ) : (
            <Image 
              src={backgroundMedia.src} 
              alt="" 
              fill 
              className="object-cover"
              priority
              unoptimized={backgroundMedia.type === 'gif'}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-silq-dark/80 via-silq-dark/70 to-silq-dark/90" />
        </div>
      )}

      {/* Animated Gradient Background */}
      {variant === 'default' && !backgroundMedia && gradientAnimation && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-silq-cream via-white to-silq-cream" />
          <motion.div
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-silq-blue/5 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-silq-teal/5 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      )}

      {/* Background GIF Layer (subtle, blurred) */}
      {variant === 'default' && backgroundGif && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={backgroundGif}
            alt=""
            className="w-full h-full object-cover opacity-15"
            style={{ filter: 'blur(8px) saturate(0.5)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-silq-cream/85 via-silq-cream/90 to-silq-cream" />
        </div>
      )}

      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div
            className={cn(
              'absolute inset-0',
              variant === 'dark' && 'bg-silq-dark/80',
              variant === 'gradient' && 'bg-gradient-to-b from-silq-dark/90 via-silq-dark/70 to-silq-dark/90',
              variant === 'default' && 'bg-silq-cream/90'
            )}
          />
        </div>
      )}

      {/* Floating Particles Effect */}
      {showParticles && (
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                'absolute rounded-full',
                variant === 'default' ? 'bg-silq-blue/10' : 'bg-white/10'
              )}
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Decorative Gradient Orbs */}
      {variant === 'default' && !backgroundMedia && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-silq-teal/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-silq-blue/10 rounded-full blur-3xl" />
        </div>
      )}

      {/* Pattern Overlay */}
      {variant === 'default' && !backgroundMedia && <div className="absolute inset-0 hero-pattern z-[1]" />}

      <div className={cn('container-silq relative z-10', align === 'center' && 'text-center')}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={cn(align === 'center' && 'max-w-4xl mx-auto')}
        >
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={cn(
                'text-sm font-semibold uppercase tracking-wider mb-4',
                variant === 'default' && !backgroundMedia ? 'text-silq-blue' : 'text-silq-teal'
              )}
            >
              {subtitle}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-fluid-hero font-bold leading-tight tracking-tight"
          >
            {title}
            {highlightedText && (
              <>
                <br />
                <span
                  className={cn(
                    'relative inline-block',
                    variant === 'default' && !backgroundMedia ? 'text-silq-blue' : 'text-silq-teal'
                  )}
                >
                  {highlightedText}
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-4 text-silq-teal/30"
                    viewBox="0 0 200 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,8 Q50,0 100,8 T200,8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </>
            )}
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={cn(
                'mt-6 text-lg md:text-xl leading-relaxed',
                variant === 'default' && !backgroundMedia ? 'text-silq-dark/70' : 'text-white/70',
                align === 'center' && 'max-w-2xl mx-auto'
              )}
            >
              {description}
            </motion.p>
          )}

          {(primaryCta || secondaryCta) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={cn(
                'mt-10 flex flex-wrap gap-4',
                align === 'center' && 'justify-center'
              )}
            >
              {primaryCta && (
                <Link href={primaryCta.href}>
                  <Button
                    variant={variant === 'default' && !backgroundMedia ? 'primary' : 'teal'}
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {primaryCta.text}
                  </Button>
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href}>
                  <Button
                    variant={variant === 'default' && !backgroundMedia ? 'secondary' : 'teal'}
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {secondaryCta.text}
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      {variant === 'default' && !backgroundMedia && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      )}
    </section>
  )
}
