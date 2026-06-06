'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SectionEyebrow } from '../../components/ui'
import { staggerContainer, fadeInUp } from '../../lib/motion'
import type { TimelineBlockProps, JobOpening, ProcessStep } from './types'

function JobCard({ job }: { job: JobOpening }) {
  const isUrgent = job.tag?.toLowerCase() === 'urgent'

  return (
    <motion.article
      variants={fadeInUp}
      className="flex flex-col justify-between rounded-2xl border border-neutral-200/60 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.06)] text-left"
    >
      <div>
        {/* Urgent / Standard Pill tags */}
        {job.tag && (
          <span
            className={[
              'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
              isUrgent 
                ? 'bg-rose-50 text-rose-500' 
                : 'bg-slate-100 text-slate-500'
            ].join(' ')}
          >
            {job.tag}
          </span>
        )}

        <h3 className="mt-3.5 text-lg font-bold tracking-tight text-slate-900">
          {job.title}
        </h3>

        {/* Info Rows */}
        <div className="mt-4 space-y-1 text-sm text-slate-500 font-medium">
          <p><span className="font-bold text-slate-400">Company:</span> {job.company}</p>
          <p><span className="font-bold text-slate-400">Location:</span> {job.location}</p>
          <p><span className="font-bold text-slate-400">Salary:</span> {job.salary}</p>
        </div>
      </div>

      {/* Footer Details Row */}
      <div className="mt-7 flex items-center justify-between border-t border-neutral-100 pt-4">
        <span className="text-xs font-medium text-slate-400 tabular-nums">
          Posted: {job.postedDate}
        </span>
        {/* ── 🎯 REFINED DEEP TONED CTA BUTTON ── */}
        <Link
          href={job.applyHref}
          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors duration-200 hover:bg-slate-800 focus:outline-none shadow-sm"
        >
          Apply Now
        </Link>
      </div>
    </motion.article>
  )
}

function ProcessStepColumn({ step, isLast }: { step: ProcessStep; isLast: boolean }) {
  return (
    <motion.div variants={fadeInUp} className="relative flex-1 group">
      {/* Step Circle & Layout connector bar */}
      <div className="flex items-center w-full mb-5">
        <div 
          style={{ backgroundColor: 'var(--color-primary)' }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-mono font-bold text-white transition-transform duration-300 group-hover:scale-105"
        >
          {step.number}
        </div>
        {!isLast && (
          <div className="hidden md:block h-0.5 w-full bg-slate-900 mx-4 opacity-90 rounded-full" />
        )}
      </div>

      {/* Description Info */}
      <div className="text-left space-y-2 pr-2">
        <h4 className="text-base font-bold tracking-tight text-slate-900">
          {step.title}
        </h4>
        <p className="text-xs md:text-sm leading-relaxed text-slate-500 font-normal">
          {step.description}
        </p>
      </div>
    </motion.div>
  )
}

export function OpeningsProcessBlock({
  eyebrow,
  heading = 'Our Latest Opening',
  openings = [],
  processEyebrow = 'Recruitement Process',
  processSteps = [],
}: TimelineBlockProps) {
  return (
    <section className="py-20 md:py-26 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ── SECTION 1: Job Openings Grid layout ── */}
        {openings.length > 0 && (
          <div className="mb-20 md:mb-24">
            <div className="mb-8 text-left space-y-1">
              {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
              <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                {heading}
              </h2>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {openings.map((job, idx) => (
                <JobCard key={idx} job={job} />
              ))}
            </motion.div>
          </div>
        )}

        {/* ── SECTION 2: Process Horizontal Layout Timeline ── */}
        {processSteps.length > 0 && (
          <div className="border-t border-neutral-100 pt-16 md:pt-20">
            
            {/* Custom Puzzle/List Icon Accent Badge */}
            <div className="mb-10 flex justify-start">
              <div 
                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                className="inline-flex items-center gap-2 rounded-full border bg-white py-1.5 pl-2 pr-4 text-xs font-semibold"
              >
                <div 
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                >
                  <svg className="h-3.5 w-3.5 fill-none stroke-[2.5]" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.748V12m0 0v2.25m0-2.25h2.25m-2.25 0H12m0-6.748H4.5A2.25 2.25 0 002.25 7.5v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 19.5v-7.5a2.25 2.25 0 00-2.25-2.25h-5.25z" />
                  </svg>
                </div>
                <span>{processEyebrow}</span>
              </div>
            </div>

            {/* Stepper Track Matrix */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-4"
            >
              {processSteps.map((step, idx) => (
                <ProcessStepColumn
                  key={idx}
                  step={step}
                  isLast={idx === processSteps.length - 1}
                />
              ))}
            </motion.div>
          </div>
        )}

      </div>
    </section>
  )
}