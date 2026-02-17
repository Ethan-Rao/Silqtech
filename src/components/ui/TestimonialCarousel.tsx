'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Testimonial {
  quote: string
  author: string
  role: string
  initials: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  autoAdvanceMs?: number
  className?: string
}

export function TestimonialCarousel({
  testimonials,
  autoAdvanceMs = 6000,
  className = '',
}: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0)

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  useEffect(() => {
    const timer = setInterval(goNext, autoAdvanceMs)
    return () => clearInterval(timer)
  }, [goNext, autoAdvanceMs])

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Card */}
      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            {/* Quote Icon */}
            <div className="text-silq-teal/30 text-4xl font-serif leading-none mb-2">&ldquo;</div>

            {/* Quote Text */}
            <blockquote className="text-white/90 text-lg leading-relaxed mb-6">
              {testimonials[current].quote}
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-silq-teal/20 flex items-center justify-center">
                <span className="text-silq-teal text-sm font-semibold">
                  {testimonials[current].initials}
                </span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">
                  {testimonials[current].author}
                </p>
                <p className="text-white/50 text-xs">
                  {testimonials[current].role}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-silq-teal w-6'
                : 'bg-white/30 hover:bg-white/50 w-2'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={goPrev}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Previous testimonial"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goNext}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Next testimonial"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
