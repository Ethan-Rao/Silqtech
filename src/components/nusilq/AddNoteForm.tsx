'use client'

import { useState } from 'react'

interface AddNoteFormProps {
  onSubmit: (author: string, text: string) => void
}

export function AddNoteForm({ onSubmit }: AddNoteFormProps) {
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [errors, setErrors] = useState<{ author?: string; text?: string }>({})

  const validate = () => {
    const e: { author?: string; text?: string } = {}
    if (!author.trim()) e.author = 'Author is required'
    if (text.trim().length < 5) e.text = 'Note must be at least 5 characters'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    onSubmit(author.trim(), text.trim())
    setAuthor('')
    setText('')
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 bg-silq-cream rounded-xl p-4">
      <p className="text-xs font-semibold text-silq-dark/50 uppercase tracking-wider">Add Note</p>
      <div>
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-silq-dark/15 focus:border-silq-blue focus:ring-1 focus:ring-silq-blue/20 outline-none text-sm text-silq-dark bg-white transition-all"
        />
        {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
      </div>
      <div>
        <textarea
          placeholder="Write a note…"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-silq-dark/15 focus:border-silq-blue focus:ring-1 focus:ring-silq-blue/20 outline-none text-sm text-silq-dark bg-white transition-all resize-none"
        />
        {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text}</p>}
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-silq-blue text-white text-sm font-semibold rounded-lg hover:bg-silq-blue/90 transition-colors"
      >
        Save Note
      </button>
    </form>
  )
}
