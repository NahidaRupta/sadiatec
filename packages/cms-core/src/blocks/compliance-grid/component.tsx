'use client'
// Client boundary: scroll-triggered stagger animation via Framer Motion whileInView

import { motion } from 'framer-motion'
import { SectionEyebrow } from '../../components/ui'
import { staggerContainer, fadeInUp } from '../../lib/motion'
import type { ComplianceGridBlockProps, ComplianceIcon } from './types'

const ICON_PATHS: Record<ComplianceIcon, string> = {
  shield:
    'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  check:
    'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  certificate:
    'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
  badge:
    'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0',
}

function LicenseIcon({ icon }: { icon: ComplianceIcon }) {
  return (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0a1629] text-amber-500">
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[icon]} />
      </svg>
    </div>
  )
}

export function ComplianceGridBlock({
  eyebrow,
  heading,
  intro,
  licenses,
  commitmentsHeading,
  commitments,
}: ComplianceGridBlockProps) {
  if (licenses.length === 0 && commitments.length === 0) return null

  return (
    <section 
      aria-labelledby="compliance-heading" 
      className="bg-slate-50/50 py-20 md:py-28 text-center"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section header — perfectly centered */}
        <div className="mx-auto mb-16 max-w-3xl space-y-3">
          {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
          {heading && (
            <h2
              id="compliance-heading"
              className="text-3xl font-extrabold tracking-tight text-(--color-text) md:text-4xl"
            >
              {heading}
            </h2>
          )}
          {intro && (
            <p className="mx-auto max-w-2xl text-sm md:text-base leading-relaxed text-(--color-muted)">
              {intro}
            </p>
          )}
        </div>

        {/* 4-Column Card Grid based on image_9814c1.png */}
        {licenses.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {licenses.map((card, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200/70 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="space-y-4">
                  {card.icon && <LicenseIcon icon={card.icon} />}
                  <h3 className="text-sm font-bold tracking-tight text-(--color-text) px-2">
                    {card.title}
                  </h3>
                  {card.issuer && (
                    <p className="text-xs text-(--color-muted) font-medium leading-normal">
                      {card.issuer}
                    </p>
                  )}
                </div>
                {card.licenseNumber && (
                  <p className="mt-4 font-mono text-[10px] tracking-wider text-(--color-muted)/70 uppercase">
                    No. {card.licenseNumber}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Dark Commitments Container Box Panel */}
        {commitments.length > 0 && (
          <div className="mt-12 overflow-hidden rounded-2xl bg-[#0a1629] p-8 md:p-12 text-left shadow-xl">
            {commitmentsHeading && (
              <h3 className="mb-8 text-base font-bold tracking-wider text-white uppercase">
                {commitmentsHeading}
              </h3>
            )}
            <ul className="grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2" role="list">
              {commitments.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  {/* Subtle amber shield/check list decorator */}
                  <svg
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-500 stroke-[2.5]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" 
                    />
                  </svg>
                  <span className="text-xs md:text-sm leading-relaxed font-normal text-slate-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}