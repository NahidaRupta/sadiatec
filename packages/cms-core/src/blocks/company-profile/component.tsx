"use client"; // 👈 Added client boundary for Framer Motion scroll hooks

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion' // 👈 Imported motion
import { SectionEyebrow } from '../../components/ui'
import { staggerContainer, fadeInUp } from '../../lib/motion' // 👈 Using your project's shared variants
import type { CompanyProfileBlockProps } from './types'

export function CompanyProfileBlock({
  eyebrow,
  heading,
  rows,
  photoUrl,
  photoAlt,
  photoFallbackText = 'Office photo coming soon',
  yearsBadge,
  viewFullPageCta,
}: CompanyProfileBlockProps) {
  if (rows.length === 0) return null

  return (
    <section
      aria-labelledby="company-profile-heading"
      className="bg-white py-20 md:py-28 text-left overflow-hidden"
    >
      <motion.div 
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Section header — left-aligned */}
        <motion.div className="mb-14" variants={fadeInUp}>
          {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
          {heading && (
            <h2
              id="company-profile-heading"
              className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl tracking-tight"
            >
              {heading}
            </h2>
          )}
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          
          {/* Left Side: Information Table */}
          <motion.div className="lg:col-span-7" variants={fadeInUp}>
            <dl className="border-t border-neutral-100 divide-y divide-neutral-100">
              {rows.map((row) => (
                <div key={row.label} className="flex gap-4 py-5 items-baseline">
                  <dt className="w-1/3 shrink-0 text-sm font-bold text-slate-900">
                    {row.label}
                  </dt>
                  <dd className="flex-1 text-sm text-slate-600 font-normal leading-relaxed">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Solid Navy CTA Button */}
            {viewFullPageCta && (
              <div className="mt-10">
                <Link
                  href={viewFullPageCta.href}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-slate-900 transition-colors"
                >
                  {viewFullPageCta.label}
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 stroke-[2.5]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Right Side: Photo with Floating Corner Badge */}
          <motion.div className="lg:col-span-5 relative" variants={fadeInUp}>
            <div className="relative overflow-hidden rounded-2xl border border-neutral-100 shadow-sm">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={photoAlt ?? heading ?? 'Company office'}
                  width={640}
                  height={480}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                /* 🖼️ Fallback Image replacement when photoUrl is missing */
                <Image
                  src="/images/company.png" // 👈 Replace this path with your asset's actual filename
                  alt={photoAlt ?? heading ?? photoFallbackText}
                  width={640}
                  height={480}
                  className="aspect-[4/3] w-full object-cover brightness-[0.98]"
                />
              )}
            </div>

            {/* Floating Experience Badge with subtle pop-in delays */}
            {yearsBadge && (
              <motion.div 
                className="absolute -bottom-6 left-6 rounded-2xl bg-amber-600 px-5 py-4 text-left text-white shadow-xl max-w-[160px]"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <p className="text-xs font-semibold opacity-90 leading-tight">
                  {yearsBadge.label}
                </p>
                <p className="text-2xl font-black mt-1 tracking-tight leading-none">
                  {yearsBadge.years}+ years
                </p>
              </motion.div>
            )}
          </motion.div>

        </div>
      </motion.div>
    </section>
  )
}