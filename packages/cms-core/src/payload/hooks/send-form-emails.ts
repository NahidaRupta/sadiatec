import type { CollectionAfterChangeHook } from 'payload'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EmailConfig {
  contactRecipient: string
  jobApplicationRecipient: string
  seminarRecipient: string
  fromEmail: string
}

type FormType = 'contact' | 'job-apply' | 'seminar' | 'download'

interface FormPayload {
  name?: string
  email?: string
  company?: string
  inquiryType?: string
  jobSlug?: string
  seminarSlug?: string
  resourceSlug?: string
  message?: string
}

// ---------------------------------------------------------------------------
// Email dispatch (non-blocking; failures are swallowed intentionally)
// ---------------------------------------------------------------------------

async function dispatch(to: string, subject: string, html: string, fromEmail: string): Promise<void> {
  const apiKey = process.env['RESEND_API_KEY']
  if (!apiKey) return

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from: fromEmail, to, subject, html }),
    })
  } catch {
    // non-blocking
  }
}

// ---------------------------------------------------------------------------
// Email builders
// ---------------------------------------------------------------------------

function staffHtml(formType: FormType, p: FormPayload): string {
  const rows = [
    p.name ? `<p><strong>Name:</strong> ${p.name}</p>` : '',
    p.email ? `<p><strong>Email:</strong> ${p.email}</p>` : '',
    p.company ? `<p><strong>Company:</strong> ${p.company}</p>` : '',
    p.inquiryType ? `<p><strong>Inquiry type:</strong> ${p.inquiryType}</p>` : '',
    p.jobSlug ? `<p><strong>Job:</strong> ${p.jobSlug}</p>` : '',
    p.seminarSlug ? `<p><strong>Seminar:</strong> ${p.seminarSlug}</p>` : '',
    p.resourceSlug ? `<p><strong>Resource:</strong> ${p.resourceSlug}</p>` : '',
    p.message ? `<p><strong>Message:</strong></p><p>${p.message.replace(/\n/g, '<br>')}</p>` : '',
  ]
  return `<h2>New ${formType} submission</h2>${rows.filter(Boolean).join('')}`
}

function confirmationHtml(formType: FormType, name: string): string {
  const copy: Record<FormType, string> = {
    contact: 'We have received your enquiry and will be in touch within 1–2 business days.',
    'job-apply': 'Thank you for applying. Our recruitment team will review your application shortly.',
    seminar: 'Your seminar registration is confirmed. We will send joining details closer to the date.',
    download: 'Your download request has been received. A link will be emailed to you shortly.',
  }
  return `<p>Hi ${name},</p><p>${copy[formType]}</p><p>— Saidatech Team</p>`
}

function staffSubject(formType: FormType, p: FormPayload): string {
  const targets: Record<FormType, string> = {
    contact: `New contact inquiry from ${p.name ?? 'Unknown'}`,
    'job-apply': `New job application from ${p.name ?? 'Unknown'} — ${p.jobSlug ?? ''}`,
    seminar: `New seminar registration from ${p.name ?? 'Unknown'} — ${p.seminarSlug ?? ''}`,
    download: `Download gate submission from ${p.name ?? 'Unknown'} — ${p.resourceSlug ?? ''}`,
  }
  return targets[formType]
}

function confirmationSubject(formType: FormType): string {
  const subjects: Record<FormType, string> = {
    contact: 'We received your enquiry — Saidatech',
    'job-apply': 'Application received — Saidatech',
    seminar: 'Seminar registration confirmed — Saidatech',
    download: 'Your download request — Saidatech',
  }
  return subjects[formType]
}

function resolveStaffRecipient(formType: FormType, config: EmailConfig): string {
  if (formType === 'job-apply') return config.jobApplicationRecipient
  if (formType === 'seminar') return config.seminarRecipient
  return config.contactRecipient
}

// ---------------------------------------------------------------------------
// Hook factory
// ---------------------------------------------------------------------------

export function makeSendFormEmailsHook(emailConfig: EmailConfig): CollectionAfterChangeHook {
  return async ({ doc, operation }) => {
    // Idempotency guard: only fire on initial creation
    if (operation !== 'create') return doc

    const formType = doc['formType'] as FormType | undefined
    if (!formType) return doc

    const payload = (doc['payload'] ?? {}) as FormPayload
    const userEmail = typeof payload.email === 'string' ? payload.email : (doc['email'] as string | undefined)
    const userName = typeof payload.name === 'string' ? payload.name : 'there'

    if (!userEmail) return doc

    const staffTo = resolveStaffRecipient(formType, emailConfig)

    void dispatch(
      staffTo,
      staffSubject(formType, payload),
      staffHtml(formType, payload),
      emailConfig.fromEmail,
    )

    void dispatch(
      userEmail,
      confirmationSubject(formType),
      confirmationHtml(formType, userName),
      emailConfig.fromEmail,
    )

    return doc
  }
}
