'use client'

import Image from 'next/image'
import { useRef } from 'react'

type NewsItem = {
  source: string
  title: string
  url: string
  logo: string | null
}

interface NewsCarouselProps {
  items: NewsItem[]
}

export function NewsCarousel({ items }: NewsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    trackRef.current?.scrollBy({ left: dir === 'right' ? 240 : -240, behavior: 'smooth' })
  }

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 items-center justify-center rounded-full bg-white border border-silq-dark/10 shadow-md hover:bg-silq-cream transition-colors"
        aria-label="Scroll left"
      >
        <svg className="w-4 h-4 text-silq-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {items.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none w-56 flex flex-col bg-silq-cream rounded-xl p-5 border border-silq-dark/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              {item.logo ? (
                <Image
                  src={item.logo}
                  alt={item.source}
                  width={80}
                  height={24}
                  className="h-5 w-auto object-contain opacity-60"
                />
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide text-silq-blue bg-silq-blue/10">
                  RSC
                </span>
              )}
              <span className="text-xs text-silq-dark/40">{item.source}</span>
            </div>
            <h4 className="flex-1 text-sm font-semibold text-silq-dark leading-snug line-clamp-3">
              {item.title}
            </h4>
            <p className="text-xs text-silq-blue mt-3 flex items-center gap-1">
              Read article
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </p>
          </a>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 items-center justify-center rounded-full bg-white border border-silq-dark/10 shadow-md hover:bg-silq-cream transition-colors"
        aria-label="Scroll right"
      >
        <svg className="w-4 h-4 text-silq-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
