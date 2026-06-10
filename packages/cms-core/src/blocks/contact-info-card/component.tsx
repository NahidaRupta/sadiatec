'use client'
// Client boundary: scroll-triggered fade-up animation

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Printer, Mail, Clock } from 'lucide-react'
import { fadeInUp } from '../../lib/motion'
import type { ContactInfoCardBlockProps } from './types'

function Row({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export function ContactInfoCardBlock({
  heading,
  subheading,
  address,
  tel,
  fax,
  phone,
  email,
  officeHours,
}: ContactInfoCardBlockProps) {
  const hasContent = heading || subheading || address || tel || fax || phone || email || officeHours
  if (!hasContent) return null

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="rounded-2xl border border-(--color-neutral-200) bg-white p-8 shadow-md md:p-10"
        >
          {heading && (
            <h2 className="mb-1 text-2xl font-bold text-(--color-primary) md:text-3xl">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="mb-6 text-base text-(--color-muted)">{subheading}</p>
          )}

          <dl className="mt-4 space-y-5">
            {address && (
              <Row
                icon={
                  <MapPin
                    className="h-5 w-5 text-(--color-primary)"
                    aria-hidden="true"
                  />
                }
              >
                <span className="whitespace-pre-line text-sm leading-relaxed text-(--color-text)">
                  {address}
                </span>
              </Row>
            )}
            {tel && (
              <Row
                icon={
                  <Phone
                    className="h-5 w-5 text-(--color-primary)"
                    aria-hidden="true"
                  />
                }
              >
                <span className="text-sm text-(--color-text)">{tel}</span>
              </Row>
            )}
            {phone && (
              <Row
                icon={
                  <Phone
                    className="h-5 w-5 text-(--color-primary)"
                    aria-hidden="true"
                  />
                }
              >
                <span className="text-sm text-(--color-text)">{phone}</span>
              </Row>
            )}
            {fax && (
              <Row
                icon={
                  <Printer
                    className="h-5 w-5 text-(--color-primary)"
                    aria-hidden="true"
                  />
                }
              >
                <span className="text-sm text-(--color-text)">{fax}</span>
              </Row>
            )}
            {email && (
              <Row
                icon={
                  <Mail
                    className="h-5 w-5 text-(--color-primary)"
                    aria-hidden="true"
                  />
                }
              >
                <a
                  href={`mailto:${email}`}
                  className="text-sm font-medium text-(--color-primary) hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
                >
                  {email}
                </a>
              </Row>
            )}
            {officeHours && (
              <Row
                icon={
                  <Clock
                    className="h-5 w-5 text-(--color-primary)"
                    aria-hidden="true"
                  />
                }
              >
                <span className="whitespace-pre-line text-sm leading-relaxed text-(--color-text)">
                  {officeHours}
                </span>
              </Row>
            )}
          </dl>
        </motion.div>
      </div>
    </section>
  )
}
