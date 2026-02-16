'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AccordionItem {
  title: string
  content: string | React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  title?: string
  subtitle?: string
  className?: string
  allowMultiple?: boolean
}

export function Accordion({
  items,
  title,
  subtitle,
  className,
  allowMultiple = false,
}: AccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([])

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      )
    } else {
      setOpenIndices((prev) =>
        prev.includes(index) ? [] : [index]
      )
    }
  }

  return (
    <section className={cn('section-padding bg-white', className)}>
      <div className="container-silq max-w-3xl">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
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
          </motion.div>
        )}

        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndices.includes(index)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="border border-silq-dark/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-silq-cream/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-silq-dark pr-4">
                    {item.title}
                  </span>
                  <span
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full bg-silq-blue/10 flex items-center justify-center transition-transform duration-300',
                      isOpen && 'rotate-180'
                    )}
                  >
                    <svg
                      className="w-4 h-4 text-silq-blue"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-silq-dark/70 leading-relaxed">
                        {typeof item.content === 'string' ? (
                          <p>{item.content}</p>
                        ) : (
                          item.content
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
