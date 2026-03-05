'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Password for /rep directory page only
const DIRECTORY_PASSWORD = 'Silq@2026!'

interface PasswordGateProps {
  children: React.ReactNode
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Check if already authenticated in this session
  useEffect(() => {
    const auth = sessionStorage.getItem('rep-directory-auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === DIRECTORY_PASSWORD) {
      sessionStorage.setItem('rep-directory-auth', 'true')
      setIsAuthenticated(true)
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="min-h-screen bg-silq-cream flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-silq-blue/20 border-t-silq-blue animate-spin" />
      </div>
    )
  }

  // If authenticated, show the protected content
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Password entry screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-silq-blue-900 via-silq-dark to-silq-blue-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-silq-blue/10 rounded-full mb-4">
              <svg className="w-8 h-8 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-silq-dark">Rep Directory</h1>
            <p className="text-silq-dark/60 mt-2">Enter password to access</p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-silq-dark mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-silq-dark/20 focus:border-silq-blue focus:ring-2 focus:ring-silq-blue/20 outline-none transition-all"
                placeholder="Enter password"
                autoFocus
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mb-4"
              >
                {error}
              </motion.p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-silq-blue to-silq-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-silq-blue/25 transition-all duration-300"
            >
              Access Directory
            </button>
          </form>

          {/* Footer Note */}
          <p className="text-center text-xs text-silq-dark/40 mt-6">
            Authorized personnel only
          </p>
        </div>
      </motion.div>
    </div>
  )
}
