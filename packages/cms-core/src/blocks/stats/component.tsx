'use client'
// Client boundary: counter-up animation on viewport entry (useInView + rAF)

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { SectionEyebrow } from '../../components/ui'
import type { StatsBlockProps, StatItem } from './types'

interface StatCounterProps {
  item: StatItem
  reducedMotion: boolean
}

function StatCounter({ item, reducedMotion }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(reducedMotion ? item.value : 0)

  useEffect(() => {
    // Skip animation: reduced motion or already at target
    if (reducedMotion || item.value === 0) {
      setCount(item.value)
      return
    }
    if (!isInView) return

    const duration = 2000
    let startTime: number | null = null

    function tick(timestamp: number) {
      if (startTime === null) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      // cubic easeOut
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * item.value))
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    let rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isInView, item.value, reducedMotion])

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <span className="text-4xl font-bold tracking-tight text-(--color-primary) md:text-5xl lg:text-6xl">
        {count.toLocaleString()}
        <span className="text-3xl md:text-4xl">{item.suffix ?? '+'}</span>
      </span>
      <span className="mt-3 text-sm font-medium uppercase tracking-wider text-(--color-muted)">
        {item.label}
      </span>
    </div>
  )
}

export function StatsBlock({ eyebrow, sectionHeading, items }: StatsBlockProps) {
  const reducedMotion = useReducedMotion() ?? false

  if (items.length === 0) return null

  return (
    <section className="bg-(--color-surface) py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(eyebrow || sectionHeading) && (
          <div className="mb-12 text-center">
            {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
            {sectionHeading && (
              <p className="mx-auto mt-3 max-w-2xl text-3xl font-bold text-(--color-text) md:text-4xl">
                {sectionHeading}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {items.map((item, i) => (
            <StatCounter key={i} item={item} reducedMotion={reducedMotion} />
          ))}
        </div>
      </div>
    </section>
  )
}
