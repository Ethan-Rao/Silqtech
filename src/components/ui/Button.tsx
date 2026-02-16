'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'teal' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-full',
          'transition-all duration-300 ease-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            // Variants
            'bg-silq-blue text-white hover:bg-silq-blue-600 hover:scale-105 focus-visible:ring-silq-blue':
              variant === 'primary',
            'bg-transparent text-silq-blue border-2 border-silq-blue hover:bg-silq-blue hover:text-white focus-visible:ring-silq-blue':
              variant === 'secondary',
            'bg-silq-teal text-white hover:bg-silq-teal-600 hover:scale-105 focus-visible:ring-silq-teal':
              variant === 'teal',
            'bg-transparent text-silq-dark hover:bg-silq-dark/5 focus-visible:ring-silq-dark':
              variant === 'ghost',
            // Sizes
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-sm': size === 'md',
            'px-8 py-4 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
