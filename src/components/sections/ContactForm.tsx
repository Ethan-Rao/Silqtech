'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
  title?: string
  subtitle?: string
  className?: string
}

export function ContactForm({ title, subtitle, className }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit form')
      }
      
      // Push event to dataLayer for Google Ads conversion tracking
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'form_submission_success',
          form_type: 'contact',
          form_location: window.location.pathname
        });
      }
      
      setIsSubmitted(true)
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your message. Please try again or email us directly at info@silq.tech')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={cn('section-padding bg-white', className)}>
      <div className="container-silq max-w-2xl">
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

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 bg-green-50 rounded-2xl"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-800">Thank you!</h3>
            <p className="mt-2 text-green-700">
              We&apos;ve received your message. A Silq team member will reach out within 48 hours.
            </p>
            <Button
              variant="secondary"
              className="mt-6"
              onClick={() => setIsSubmitted(false)}
            >
              Send another message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                className={cn('form-input', errors.name && 'border-red-500')}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="form-error">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={cn('form-input', errors.email && 'border-red-500')}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="form-label">
                How can we help you?
              </label>
              <textarea
                {...register('message')}
                id="message"
                rows={5}
                className={cn('form-input resize-none', errors.message && 'border-red-500')}
                placeholder="Tell us about your needs..."
              />
              {errors.message && (
                <p className="form-error">{errors.message.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </Button>
          </motion.form>
        )}
      </div>
    </section>
  )
}
