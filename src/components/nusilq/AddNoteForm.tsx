'use client'

import { useState } from 'react'

interface AddNoteFormProps {
  onSubmit: (author: string, text: string) => void
}

export function AddNoteForm({ onSubmit }: AddNoteFormProps) {
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [errors, setErrors] = useState<{ author?: string; text?: string }>({})
  const [open, setOpen] = useState(false)

  const validate = () => {
    const e: { author?: string; text?: string } = {}
    if (!author.trim()) e.author = 'Required'
    if (text.trim().length < 5) e.text = 'Minimum 5 characters'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit(author.trim(), text.trim())
    setAuthor('')
    setText('')
    setErrors({})
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-silq-blue transition-colors"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        Add note
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-3">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">New Note</p>
      <div>
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          autoFocus
          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-silq-blue focus:ring-2 focus:ring-silq-blue/10 outline-none text-sm text-slate-800 bg-white"
        />
        {errors.author && <p className="text-red-400 text-[10px] mt-1">{errors.author}</p>}
      </div>
      <div>
        <textarea
          placeholder="Write a note…"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-silq-blue focus:ring-2 focus:ring-silq-blue/10 outline-none text-sm text-slate-800 bg-white resize-none"
        />
        {errors.text && <p className="text-red-400 text-[10px] mt-1">{errors.text}</p>}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-silq-blue text-white text-xs font-semibold rounded-lg hover:bg-silq-blue/90 transition-colors"
        >
          Save note
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setErrors({}) }}
          className="px-4 py-2 border border-slate-200 text-slate-500 text-xs rounded-lg hover:bg-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
