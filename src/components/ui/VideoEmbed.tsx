'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface VideoEmbedProps {
  vimeoId: string
  title?: string
  className?: string
}

export function VideoEmbed({ vimeoId, title = 'Video', className }: VideoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className={cn('relative aspect-video rounded-2xl overflow-hidden bg-silq-dark/5', className)}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-silq-blue flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?h=5a9c8c8a8a&title=0&byline=0&portrait=0`}
        title={title}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}
