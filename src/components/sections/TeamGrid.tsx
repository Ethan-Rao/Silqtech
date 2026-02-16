'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface TeamMember {
  name: string
  title: string
  credentials?: string
  image: string
  href?: string
}

interface TeamGridProps {
  title?: string
  subtitle?: string
  description?: string
  members: TeamMember[]
  className?: string
}

function TeamMemberImage({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false)

  if (imgError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-silq-blue/20 to-silq-teal/10 flex items-center justify-center">
        <span className="text-5xl font-bold text-silq-blue/30">
          {member.name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={member.image}
      alt={member.name}
      fill
      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
      onError={() => setImgError(true)}
    />
  )
}

export function TeamGrid({
  title,
  subtitle,
  description,
  members,
  className,
}: TeamGridProps) {
  return (
    <section className={cn('section-padding bg-white', className)}>
      <div className="container-silq">
        {(title || subtitle || description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            {subtitle && (
              <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue mb-2">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-display-sm md:text-display font-bold text-silq-dark">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-silq-dark/70">{description}</p>
            )}
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => {
            const CardWrapper = member.href ? Link : 'div'
            const cardProps = member.href ? { href: member.href } : {}

            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CardWrapper
                  {...(cardProps as any)}
                  className={cn(
                    'block group',
                    member.href && 'cursor-pointer'
                  )}
                >
                  <div className="bg-silq-cream rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <TeamMemberImage member={member} />
                      <div className="absolute inset-0 bg-gradient-to-t from-silq-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-silq-dark group-hover:text-silq-blue transition-colors">
                        {member.name}
                        {member.credentials && (
                          <span className="font-normal text-silq-dark/50">
                            , {member.credentials}
                          </span>
                        )}
                      </h3>
                      <p className="text-silq-dark/60 mt-1">{member.title}</p>
                    </div>
                  </div>
                </CardWrapper>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
