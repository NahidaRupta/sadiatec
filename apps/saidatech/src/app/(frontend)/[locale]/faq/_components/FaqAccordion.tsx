'use client'

import { useState } from 'react'

type FaqItem = {
  id: string
  question: string
  answerHtml: string
}

type FaqAccordionProps = {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <ul role="list" className="divide-y divide-neutral-200 border border-neutral-200 rounded-lg overflow-hidden">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors focus-visible:outline-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="text-base font-medium leading-snug">{item.question}</span>
              <span
                aria-hidden="true"
                className={`shrink-0 text-[var(--color-primary)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <div
              id={`faq-answer-${item.id}`}
              role="region"
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 200ms ease',
              }}
            >
              <div className="overflow-hidden">
                <div
                  className="px-6 py-4 text-sm text-[var(--color-muted)] leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.answerHtml }}
                />
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
