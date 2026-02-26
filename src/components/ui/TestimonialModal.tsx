'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface TestimonialModalProps {
  isOpen: boolean
  onClose: () => void
  testimonial: {
    fullContent?: string
    author: string
    role: string
  }
}

export function TestimonialModal({ isOpen, onClose, testimonial }: TestimonialModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-silq-dark">{testimonial.author}</h3>
                <p className="text-silq-dark/60">{testimonial.role}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6 text-silq-dark/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="text-silq-teal/30 text-5xl font-serif leading-none mb-4">&ldquo;</div>
              <div className="prose prose-lg max-w-none text-silq-dark/80 whitespace-pre-line">
                {testimonial.fullContent}
              </div>
              <div className="text-silq-teal/30 text-5xl font-serif leading-none text-right mt-4">&rdquo;</div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={onClose}
                className="w-full py-3 bg-silq-blue text-white rounded-lg font-medium hover:bg-silq-blue/90 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
