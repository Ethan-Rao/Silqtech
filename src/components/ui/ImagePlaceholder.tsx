import { cn } from '@/lib/utils'

interface ImagePlaceholderProps {
  label: string
  sublabel?: string
  className?: string
  variant?: 'light' | 'dark'
  icon?: 'image' | 'science' | 'building' | 'shield'
}

const icons = {
  image: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
  ),
  science: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A17.996 17.996 0 0112 21a17.996 17.996 0 01-6.365-1.397c-1.717-.293-2.3-2.379-1.067-3.61L12 15" />
  ),
  building: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  ),
  shield: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  ),
}

export function ImagePlaceholder({
  label,
  sublabel = 'Image will be provided',
  className,
  variant = 'light',
  icon = 'image',
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl',
        variant === 'light'
          ? 'bg-gradient-to-br from-silq-cream to-silq-blue/5 border border-silq-dark/5'
          : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10',
        className
      )}
    >
      <div className="text-center p-4">
        <svg
          className={cn(
            'w-10 h-10 mx-auto mb-2',
            variant === 'light' ? 'text-silq-blue/20' : 'text-white/20'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {icons[icon]}
        </svg>
        <p className={cn(
          'text-sm font-medium',
          variant === 'light' ? 'text-silq-dark/30' : 'text-white/30'
        )}>
          {label}
        </p>
        <p className={cn(
          'text-xs mt-1',
          variant === 'light' ? 'text-silq-dark/20' : 'text-white/20'
        )}>
          {sublabel}
        </p>
      </div>
    </div>
  )
}
