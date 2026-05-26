'use client'

import { useState, type FormEvent } from 'react'
import { z } from 'zod'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type InquiryType = 'general' | 'visa' | 'recruitment' | 'other'

type FormLabels = {
  name: string
  email: string
  company: string
  inquiryType: string
  message: string
  submit: string
  submitting: string
  success: string
  error: string
  inquiryOptions: Record<InquiryType, string>
  required: string
}

type ContactFormProps = {
  locale: string
  labels: FormLabels
  apiPath: string
}

type FieldErrors = Partial<Record<string, string[]>>

// ---------------------------------------------------------------------------
// Client-side schema (mirrors server schema)
// ---------------------------------------------------------------------------

const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  inquiryType: z.enum(['general', 'visa', 'recruitment', 'other']),
  message: z.string().min(10),
})

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ContactForm({ locale, labels, apiPath }: ContactFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [inquiryType, setInquiryType] = useState<InquiryType>('general')
  const [message, setMessage] = useState('')

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [serverMessage, setServerMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setServerMessage(null)

    const values = { name, email, company: company || undefined, inquiryType, message }

    // Client-side Zod validation
    const parsed = clientSchema.safeParse(values)
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors as FieldErrors)
      return
    }

    setStatus('submitting')

    // Collect Turnstile token if widget is present
    let turnstileToken: string | undefined
    if (typeof window !== 'undefined' && 'turnstile' in window) {
      try {
        turnstileToken = (window.turnstile as { getResponse: () => string }).getResponse() || undefined
      } catch {
        // no widget present
      }
    }

    try {
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed.data, locale, ...(turnstileToken ? { turnstileToken } : {}) }),
      })

      const json = (await res.json()) as {
        success: boolean
        message?: string
        fieldErrors?: FieldErrors
      }

      if (json.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setServerMessage(json.message ?? labels.error)
        if (json.fieldErrors) setFieldErrors(json.fieldErrors)
      }
    } catch {
      setStatus('error')
      setServerMessage(labels.error)
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-lg border border-green-200 bg-green-50 p-6 text-center text-sm text-green-800"
      >
        {labels.success}
      </div>
    )
  }

  const fieldClass =
    'w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-neutral-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-colors'
  const errorClass = 'mt-1 text-xs text-red-600'
  const labelClass = 'block text-sm font-medium text-[var(--color-text)] mb-1'

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={status === 'submitting'} className="space-y-5">
      {/* Screen-reader announcement for async state changes */}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {status === 'submitting' ? labels.submitting : ''}
      </p>

      {/* Name */}
      <div>
        <label htmlFor="cf-name" className={labelClass}>
          {labels.name} <span aria-label={labels.required} className="text-red-500">*</span>
        </label>
        <input
          id="cf-name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(fieldErrors['name'])}
          aria-describedby={fieldErrors['name'] ? 'cf-name-error' : undefined}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
        />
        {fieldErrors['name'] && (
          <p id="cf-name-error" className={errorClass}>{fieldErrors['name']?.[0]}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="cf-email" className={labelClass}>
          {labels.email} <span aria-label={labels.required} className="text-red-500">*</span>
        </label>
        <input
          id="cf-email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(fieldErrors['email'])}
          aria-describedby={fieldErrors['email'] ? 'cf-email-error' : undefined}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />
        {fieldErrors['email'] && (
          <p id="cf-email-error" className={errorClass}>{fieldErrors['email']?.[0]}</p>
        )}
      </div>

      {/* Company */}
      <div>
        <label htmlFor="cf-company" className={labelClass}>
          {labels.company}
        </label>
        <input
          id="cf-company"
          type="text"
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={fieldClass}
        />
      </div>

      {/* Inquiry type */}
      <div>
        <label htmlFor="cf-inquiry" className={labelClass}>
          {labels.inquiryType} <span aria-label={labels.required} className="text-red-500">*</span>
        </label>
        <select
          id="cf-inquiry"
          required
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value as InquiryType)}
          className={fieldClass}
        >
          {(Object.entries(labels.inquiryOptions) as [InquiryType, string][]).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cf-message" className={labelClass}>
          {labels.message} <span aria-label={labels.required} className="text-red-500">*</span>
        </label>
        <textarea
          id="cf-message"
          required
          rows={5}
          aria-invalid={Boolean(fieldErrors['message'])}
          aria-describedby={fieldErrors['message'] ? 'cf-message-error' : undefined}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${fieldClass} resize-y min-h-[120px]`}
        />
        {fieldErrors['message'] && (
          <p id="cf-message-error" className={errorClass}>{fieldErrors['message']?.[0]}</p>
        )}
      </div>

      {/* Server error */}
      {status === 'error' && serverMessage && (
        <div role="alert" aria-live="assertive" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        {status === 'submitting' ? labels.submitting : labels.submit}
      </button>
    </form>
  )
}
