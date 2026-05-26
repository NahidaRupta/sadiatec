"use client"

import { useState, useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAnimationVariants } from '@saidatech/cms-core/lib/motion'
import type { ReactNode } from 'react'

interface MobileMenuProps {
  navLinks: ReactNode
  localeSwitcher: ReactNode
}

export function MobileMenu({ navLinks, localeSwitcher }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const drawerId = useId()
  const { drawerVariants, backdropVariants } = useAnimationVariants()

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls={drawerId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="md:hidden inline-flex items-center justify-center rounded-md p-2
          text-[var(--color-text)] hover:bg-neutral-100 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] min-h-[44px] min-w-[44px]"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black"
              aria-hidden="true"
            />
            <motion.aside
              id={drawerId}
              key="drawer"
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed right-0 top-0 z-50 h-full w-72 bg-[var(--color-background)]
                border-l border-neutral-200 shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200">
                <span className="text-sm font-semibold text-[var(--color-muted)]">Menu</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-2 text-[var(--color-text)] hover:bg-neutral-100
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                    min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile navigation">
                {navLinks}
              </nav>
              <div className="px-4 py-4 border-t border-neutral-200">
                {localeSwitcher}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
