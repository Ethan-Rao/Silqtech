'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const isEmailOrPhone = (val: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^[\+\d\s\-\(\)]{7,}$/.test(val)

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  contactInfo: z
    .string()
    .min(1, 'Email or phone is required')
    .refine(isEmailOrPhone, 'Please enter a valid email address or phone number'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof schema>

export function CustomerContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/customercontact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to submit form')
      setIsSubmitted(true)
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your message. Please try again or contact us directly at ethanr@silq.tech')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-10 bg-silq-teal/5 rounded-2xl border border-silq-teal/20"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-silq-teal/15 flex items-center justify-center">
          <svg className="w-8 h-8 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-silq-dark">Message received!</h3>
        <p className="mt-2 text-silq-dark/60">
          A member of the ClearTract support team will be in touch with you shortly.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => setIsSubmitted(false)}>
          Send another message
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Name */}
      <div>
        <label htmlFor="cc-name" className="form-label">
          Name
        </label>
        <input
          {...register('name')}
          type="text"
          id="cc-name"
          className={cn('form-input', errors.name && 'border-red-500')}
          placeholder="Your full name"
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      {/* Email or Phone */}
      <div>
        <label htmlFor="cc-contact" className="form-label">
          Email or Phone
        </label>
        <input
          {...register('contactInfo')}
          type="text"
          id="cc-contact"
          className={cn('form-input', errors.contactInfo && 'border-red-500')}
          placeholder="you@example.com or (555) 000-0000"
          autoComplete="email tel"
        />
        {errors.contactInfo && <p className="form-error">{errors.contactInfo.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cc-message" className="form-label">
          How can we help you?
        </label>
        <textarea
          {...register('message')}
          id="cc-message"
          rows={5}
          className={cn('form-input resize-none', errors.message && 'border-red-500')}
          placeholder="Describe your question, product issue, or order request…"
        />
        {errors.message && <p className="form-error">{errors.message.message}</p>}
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
            Sending…
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </motion.form>
  )
}
