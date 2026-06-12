'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NUSILQ_PASSWORD = 'Nusil!Silq2026'
const SESSION_KEY = 'nusilq-auth'

interface NusilqPasswordGateProps {
  children: React.ReactNode
}

export function NusilqPasswordGate({ children }: NusilqPasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const auth = sessionStorage.getItem(SESSION_KEY)
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password === NUSILQ_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setIsAuthenticated(true)
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-silq-cream flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-silq-blue/20 border-t-silq-blue animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-silq-blue-900 via-silq-dark to-silq-blue-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-silq-blue/10 rounded-full mb-4">
              <svg className="w-8 h-8 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-silq-dark">NuSilq Dashboard</h1>
            <p className="text-silq-dark/60 mt-2">Authorized team members only</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="nusilq-password" className="block text-sm font-medium text-silq-dark mb-2">
                Password
              </label>
              <input
                type="password"
                id="nusilq-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-silq-dark/20 focus:border-silq-blue focus:ring-2 focus:ring-silq-blue/20 outline-none transition-all"
                placeholder="Enter password"
                autoFocus
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mb-4"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-silq-blue to-silq-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-silq-blue/25 transition-all duration-300"
            >
              Access Dashboard
            </button>
          </form>

          <p className="text-center text-xs text-silq-dark/40 mt-6">
            Authorized team members only
          </p>
        </div>
      </motion.div>
    </div>
  )
}
