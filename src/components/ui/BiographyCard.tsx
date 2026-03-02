'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface BiographyCardProps {
  name: string
  title: string
  credentials?: string
  image: string
  bio: string
  shortBio?: string
  linkedIn?: string
  email?: string
}

export function BiographyCard({
  name,
  title,
  credentials,
  image,
  bio,
  shortBio,
  linkedIn,
  email,
}: BiographyCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      layout
    >
      {/* Image */}
      <div className="h-56 relative overflow-hidden group">
        {imgError ? (
          <div className="w-full h-full bg-gradient-to-br from-silq-blue/20 to-silq-teal/10 flex items-center justify-center">
            <span className="text-5xl font-bold text-silq-blue/30">
              {name.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
        ) : (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-silq-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-silq-dark">
          {name}
          {credentials && (
            <span className="font-normal text-silq-dark/50">, {credentials}</span>
          )}
        </h3>
        <p className="text-silq-blue font-medium text-sm mt-1">{title}</p>

        {/* Biography */}
        {bio && (
          <div className="mt-4">
            <AnimatePresence mode="wait">
              {expanded ? (
                <motion.div
                  key="full"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-silq-dark/70 text-sm leading-relaxed overflow-hidden"
                >
                  {bio}
                </motion.div>
              ) : (
                <motion.p
                  key="short"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-silq-dark/70 text-sm line-clamp-3"
                >
                  {shortBio || bio}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-silq-blue hover:text-silq-teal text-sm font-medium transition-colors"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          </div>
        )}

        {/* Social Links */}
        {(linkedIn || email) && (
          <div className="mt-4 flex gap-3">
            {linkedIn && (
              <a
                href={linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-silq-dark/40 hover:text-silq-blue transition-colors"
                aria-label={`${name}'s LinkedIn`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-silq-dark/40 hover:text-silq-blue transition-colors"
                aria-label={`Email ${name}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
