'use client'

import { useState, useId, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { LocaleSwitcher } from './LocaleSwitcher'
import type { ResolvedNavItem } from './Header'

interface MobileMenuProps {
  navItems: ResolvedNavItem[]
  ctaLabel: string
  ctaHref: string
  locales: string[]
  localeLabels: Record<string, string>
  scrolled: boolean
  onOpenChange?: (isOpen: boolean) => void
}

const leftDrawerNormal = {
  closed: { x: '-100%', transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] as const } },
  open:   { x: '0%',   transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] as const } },
}

const leftDrawerReduced = {
  closed: { x: '-100%', transition: { duration: 0.01 } },
  open:   { x: '0%',   transition: { duration: 0.01 } },
}

const backdropNormal = {
  closed: { opacity: 0 },
  open:   { opacity: 1, transition: { duration: 0.25 } },
}

const backdropReduced = {
  closed: { opacity: 0 },
  open:   { opacity: 1, transition: { duration: 0.01 } },
}

const accordionNormal = {
  open:   { height: 'auto', opacity: 1, transition: { duration: 0.25, ease: 'easeInOut' as const } },
  closed: { height: 0,      opacity: 0, transition: { duration: 0.25, ease: 'easeInOut' as const } },
}

const accordionReduced = {
  open:   { height: 'auto', opacity: 1, transition: { duration: 0.01 } },
  closed: { height: 0,      opacity: 0, transition: { duration: 0.01 } },
}

export function MobileMenu({
  navItems,
  ctaLabel,
  ctaHref,
  locales,
  localeLabels,
  scrolled,
  onOpenChange,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const drawerId = useId()
  const reduced = useReducedMotion() ?? false

  const drawerVariants = reduced ? leftDrawerReduced : leftDrawerNormal
  const backdropVariants = reduced ? backdropReduced : backdropNormal
  const accordion = reduced ? accordionReduced : accordionNormal

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (onOpenChange) onOpenChange(isOpen)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, onOpenChange])

  const close = () => { setIsOpen(false); setOpenItem(null) }

  const toggleItem = (href: string) =>
    setOpenItem((prev) => (prev === href ? null : href))

  const portalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-start pointer-events-none">
          {/* Backdrop (Dark mask + blur) */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={close}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
          />

          {/* Sliding Drawer Body Container */}
          <motion.aside
            id={drawerId}
            key="drawer"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="relative h-full w-80 max-w-[85vw] bg-white shadow-2xl 
              flex flex-col overflow-hidden text-left pointer-events-auto z-10"
          >
            {/* Dedicated Top Drawer Header (Matching your site style guide) */}
            <div className="flex h-20 items-center justify-between px-5 border-b border-neutral-100 shrink-0 bg-white">
              <Link href="/" onClick={close} aria-label="Sadia Tec Home">
                <span className="text-2xl tracking-wide select-none">
                  <span className="font-light text-amber-500">Sadiatec</span>
                </span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="flex items-center justify-center rounded-md p-2 text-gray-500
                  hover:bg-neutral-100 focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-amber-400 min-h-[44px] min-w-[44px]"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav items body list */}
            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
              <ul role="list" className="space-y-1">
                {navItems.map((item) => {
                  const hasChildren =
                    (item.children ?? []).length > 0 ||
                    (item.megaMenu && (item.megaColumns ?? []).length > 0)
                  const isExpanded = openItem === item.href

                  const allChildren: { label: string; href: string }[] = item.megaMenu
                    ? (item.megaColumns ?? []).flatMap((col) => col.items ?? [])
                    : (item.children ?? [])

                  return (
                    <li key={item.href}>
                      {hasChildren ? (
                        <button
                          type="button"
                          onClick={() => toggleItem(item.href)}
                          aria-expanded={isExpanded}
                          className="flex w-full items-center justify-between rounded-xl px-4 py-3
                            text-base font-semibold text-gray-900 hover:bg-neutral-50
                            transition-colors min-h-[48px]"
                        >
                          <span>{item.label}</span>
                          <svg
                            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={close}
                          className="flex items-center rounded-xl px-4 py-3 text-base
                            font-semibold text-gray-900 hover:bg-neutral-50
                            transition-colors min-h-[48px]"
                        >
                          {item.label}
                        </Link>
                      )}

                      {hasChildren && (
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.ul
                              key="sub"
                              variants={accordion}
                              initial="closed"
                              animate="open"
                              exit="closed"
                              className="overflow-hidden"
                              role="list"
                            >
                              <li className="pl-4 pr-2 pb-2">
                                <div className="border-l-2 border-amber-200 pl-3 space-y-1">
                                  {allChildren.map((child) => (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={close}
                                      className="flex items-center gap-2 rounded-lg px-3 py-2.5
                                        text-sm text-gray-600 hover:text-amber-600 hover:bg-amber-50/60
                                        transition-colors min-h-[40px]"
                                    >
                                      <span className="h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                                      {child.label}
                                    </Link>
                                  ))}
                                </div>
                              </li>
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Bottom Menu Panel Action Switchers */}
            <div className="border-t border-neutral-100 p-4 space-y-4 bg-gray-50/80 shrink-0">
              <LocaleSwitcher locales={locales} localeLabels={localeLabels} />
              {ctaLabel && (
                <Link href={ctaHref} onClick={close} className="block">
                  <button
                    type="button"
                    className="w-full rounded-full bg-amber-500 py-3 text-sm font-bold
                      text-white shadow-md transition-all duration-200 hover:bg-amber-600"
                  >
                    {ctaLabel}
                  </button>
                </Link>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* Trigger Button inside the header flow */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setIsOpen(true)}
        className={[
          'inline-flex items-center justify-center rounded-md p-2 transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 min-h-[44px] min-w-[44px]',
          scrolled ? 'text-gray-700 hover:bg-neutral-100' : 'text-white hover:bg-white/10',
        ].join(' ')}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {mounted && createPortal(portalContent, document.body)}
    </>
  )
}