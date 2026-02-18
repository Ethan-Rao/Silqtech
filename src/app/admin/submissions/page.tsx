'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface FormSubmission {
  id: string
  type: 'contact' | 'investor'
  timestamp: string
  data: {
    name: string
    email: string
    company?: string
    organization?: string
    phone?: string
    message: string
    inquiryType?: string
  }
  emailSent: boolean
  emailError?: string
}

interface SubmissionsResponse {
  submissions: FormSubmission[]
  total: number
  recipients: string[]
  hasMore: boolean
}

export default function AdminSubmissionsPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [recipients, setRecipients] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'contact' | 'investor'>('all')

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/submissions', {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      })
      
      if (res.status === 401) {
        setIsAuthenticated(false)
        setError('Invalid password')
        return
      }
      
      if (!res.ok) {
        throw new Error('Failed to fetch submissions')
      }
      
      const data: SubmissionsResponse = await res.json()
      setSubmissions(data.submissions)
      setRecipients(data.recipients)
      setTotal(data.total)
      setIsAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [password])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetchSubmissions()
  }

  // Auto-refresh every 30 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(fetchSubmissions, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated, fetchSubmissions])

  const filteredSubmissions = filterType === 'all' 
    ? submissions 
    : submissions.filter(s => s.type === filterType)

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-silq-dark via-silq-blue to-silq-dark flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              src="/images/logos/logo-main.png"
              alt="Silq Technologies"
              width={150}
              height={50}
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-silq-dark">Admin Access</h1>
            <p className="text-silq-dark/60 mt-2">Form Submissions Dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-silq-dark mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-silq-dark/20 rounded-lg focus:ring-2 focus:ring-silq-blue focus:border-silq-blue outline-none"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-silq-blue text-white py-3 rounded-lg font-semibold hover:bg-silq-blue/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>
          
          <p className="mt-6 text-center text-xs text-silq-dark/40">
            This page is not linked from the main website.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/images/logos/logo-main.png"
                alt="Silq Technologies"
                width={120}
                height={40}
              />
              <div className="h-8 w-px bg-gray-200" />
              <h1 className="text-xl font-semibold text-silq-dark">Form Submissions</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchSubmissions}
                disabled={loading}
                className="px-4 py-2 text-sm bg-silq-blue/10 text-silq-blue rounded-lg hover:bg-silq-blue/20 transition-colors disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={() => {
                  setIsAuthenticated(false)
                  setPassword('')
                  setSubmissions([])
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats & Recipients */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Submissions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Submissions</div>
            <div className="text-3xl font-bold text-silq-dark">{total}</div>
            <div className="text-xs text-gray-400 mt-1">In current session</div>
          </div>
          
          {/* Contact Forms */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500 mb-1">Contact Forms</div>
            <div className="text-3xl font-bold text-silq-blue">
              {submissions.filter(s => s.type === 'contact').length}
            </div>
            <div className="text-xs text-gray-400 mt-1">General inquiries</div>
          </div>
          
          {/* Investor Inquiries */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500 mb-1">Investor Inquiries</div>
            <div className="text-3xl font-bold text-silq-teal">
              {submissions.filter(s => s.type === 'investor').length}
            </div>
            <div className="text-xs text-gray-400 mt-1">Investment interest</div>
          </div>
        </div>

        {/* Email Recipients */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-silq-dark mb-4">Email Recipients</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {recipients.map((email, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1.5 bg-silq-blue/10 text-silq-blue rounded-full text-sm"
              >
                {email}
              </span>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>To modify recipients:</strong> Update the <code className="bg-amber-100 px-1.5 py-0.5 rounded">CONTACT_EMAIL_RECIPIENTS</code> environment variable in Digital Ocean. 
              Format: comma-separated emails (e.g., <code className="bg-amber-100 px-1.5 py-0.5 rounded">email1@silq.tech,email2@silq.tech</code>)
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Filter:</span>
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
            {(['all', 'contact', 'investor'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  filterType === type
                    ? 'bg-silq-blue text-white'
                    : 'text-gray-600 hover:text-silq-blue'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-400 ml-auto">
            Showing {filteredSubmissions.length} of {total}
          </span>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500">No submissions yet</p>
              <p className="text-sm text-gray-400 mt-1">Form submissions will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          submission.type === 'investor'
                            ? 'bg-silq-teal/10 text-silq-teal'
                            : 'bg-silq-blue/10 text-silq-blue'
                        }`}>
                          {submission.type === 'investor' ? 'Investor' : 'Contact'}
                        </span>
                        {submission.emailSent ? (
                          <span className="inline-flex items-center text-xs text-green-600">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Email sent
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs text-amber-600">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Not sent
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-silq-dark truncate">{submission.data.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{submission.data.email}</p>
                      {(submission.data.company || submission.data.organization) && (
                        <p className="text-sm text-gray-400 truncate">
                          {submission.data.company || submission.data.organization}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-400">{formatDate(submission.timestamp)}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{submission.data.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note about persistence */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Submissions are stored in server memory and will be cleared when the server restarts. 
            For permanent storage, consider setting up a database. All submissions are also logged to the Digital Ocean console.
          </p>
        </div>
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedSubmission.type === 'investor'
                      ? 'bg-silq-teal/10 text-silq-teal'
                      : 'bg-silq-blue/10 text-silq-blue'
                  }`}>
                    {selectedSubmission.type === 'investor' ? 'Investor Inquiry' : 'Contact Form'}
                  </span>
                  {selectedSubmission.emailSent ? (
                    <span className="text-sm text-green-600">✓ Email sent</span>
                  ) : (
                    <span className="text-sm text-amber-600">⚠ Email not sent</span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Submitted</label>
                <p className="text-silq-dark">{formatDate(selectedSubmission.timestamp)}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                <p className="text-silq-dark font-semibold">{selectedSubmission.data.name}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                <p>
                  <a href={`mailto:${selectedSubmission.data.email}`} className="text-silq-blue hover:underline">
                    {selectedSubmission.data.email}
                  </a>
                </p>
              </div>
              
              {(selectedSubmission.data.company || selectedSubmission.data.organization) && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {selectedSubmission.type === 'investor' ? 'Organization' : 'Company'}
                  </label>
                  <p className="text-silq-dark">{selectedSubmission.data.company || selectedSubmission.data.organization}</p>
                </div>
              )}
              
              {selectedSubmission.data.phone && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                  <p>
                    <a href={`tel:${selectedSubmission.data.phone}`} className="text-silq-blue hover:underline">
                      {selectedSubmission.data.phone}
                    </a>
                  </p>
                </div>
              )}
              
              {selectedSubmission.data.inquiryType && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Inquiry Type</label>
                  <p className="text-silq-dark">{selectedSubmission.data.inquiryType}</p>
                </div>
              )}
              
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Message</label>
                <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                  <p className="text-silq-dark whitespace-pre-wrap">{selectedSubmission.data.message}</p>
                </div>
              </div>
              
              {selectedSubmission.emailError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <label className="text-xs font-medium text-red-600 uppercase tracking-wide">Email Error</label>
                  <p className="text-red-700 text-sm mt-1">{selectedSubmission.emailError}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <a
                href={`mailto:${selectedSubmission.data.email}`}
                className="flex-1 bg-silq-blue text-white py-3 rounded-lg font-semibold text-center hover:bg-silq-blue/90 transition-colors"
              >
                Reply via Email
              </a>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
