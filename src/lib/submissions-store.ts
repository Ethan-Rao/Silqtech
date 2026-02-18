// In-memory store for form submissions
// Note: This resets when the server restarts. For persistent storage, use a database.

export interface FormSubmission {
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

// In-memory storage (persists during server runtime)
const submissions: FormSubmission[] = []

// Default recipients - can be overridden by environment variable
const DEFAULT_RECIPIENTS = ['ethanr@silq.tech', 'brianm@silq.tech', 'chuckg@silq.tech']

export function getRecipients(): string[] {
  const envRecipients = process.env.CONTACT_EMAIL_RECIPIENTS
  if (envRecipients) {
    return envRecipients.split(',').map(email => email.trim().toLowerCase())
  }
  return DEFAULT_RECIPIENTS
}

export function addSubmission(submission: Omit<FormSubmission, 'id' | 'timestamp'>): FormSubmission {
  const newSubmission: FormSubmission = {
    ...submission,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  }
  submissions.unshift(newSubmission) // Add to beginning (newest first)
  
  // Keep only last 1000 submissions in memory
  if (submissions.length > 1000) {
    submissions.pop()
  }
  
  return newSubmission
}

export function getSubmissions(limit = 100, offset = 0): FormSubmission[] {
  return submissions.slice(offset, offset + limit)
}

export function getSubmissionById(id: string): FormSubmission | undefined {
  return submissions.find(s => s.id === id)
}

export function getSubmissionCount(): number {
  return submissions.length
}

export function clearSubmissions(): void {
  submissions.length = 0
}
