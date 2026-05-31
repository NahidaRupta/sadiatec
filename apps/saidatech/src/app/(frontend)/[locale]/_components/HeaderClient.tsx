'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/routing'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileMenu } from './MobileMenu'
import type { ResolvedNavItem, ResolvedMegaColumn } from './Header'

interface HeaderClientProps {
  navItems: ResolvedNavItem[]
  ctaLabel: string
  ctaHref: string
  locales: string[]
  localeLabels: Record<string, string>
  locale: string
}

function Logo({ dark }: { dark: boolean }) {
  return (
    <span className="text-2xl tracking-wide select-none">
      <span className={`font-light transition-colors duration-300 ${dark ? 'text-gray-900' : 'text-white'}`}>
        Sadia
      </span>
      <span className="font-extrabold text-amber-500 italic ml-0.5">Tec</span>
    </span>
  )
}

// 🛠️ Updated to take the entire item object so it can display the featured layout elements
function MegaMenuPanel({ item }: { item: ResolvedNavItem }) {
  const columns = item.megaColumns ?? []

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[1100px] max-w-[95vw]
        bg-white rounded-2xl shadow-2xl border border-neutral-100 p-8 z-50
        opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible
        transition-all duration-200 origin-top pointer-events-none group-hover/item:pointer-events-auto
        grid grid-cols-12 gap-8 text-left"
    >
      {/* 🖼️ Left Featured Image Slot (Spans 3 of 12 columns for a clean portrait look) */}
      <div className="col-span-3 relative rounded-2xl overflow-hidden min-h-[380px] bg-neutral-50">
        {item.featuredImageUrl ? (
          <img
            src={item.featuredImageUrl}
            alt={item.featuredImageAlt || 'Featured Service'}
            className="object-cover w-full h-full absolute inset-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 italic bg-neutral-50/50">
            No Image Selected
          </div>
        )}
      </div>

      {/* 📊 Dynamic Columns Container (Spans 9 of 12 columns) */}
      <div 
        className="col-span-9 grid grid-cols-3 gap-8"
      >
        {columns.map((col, ci) => {
          // Check if this column is the "MORE SERVICES" sidebar panel
          const isSidebar = col.heading?.toLowerCase().includes('more')

          if (isSidebar) {
            return (
              <div key={ci} className="flex flex-col bg-slate-50/50 border-l border-neutral-100 pl-8 -my-8 py-8 rounded-r-2xl">
                {col.heading && (
                  <p className="mb-5 text-[11px] font-bold uppercase tracking-wider text-amber-600">
                    {col.heading}
                  </p>
                )}
                <ul className="space-y-2.5">
                  {(col.items ?? []).map((subItem) => (
                    <li key={subItem.href}>
                      <Link
                        href={subItem.href}
                        className="group flex items-center gap-3 rounded-xl bg-white border border-neutral-100/80 
                          px-4 py-3 text-sm font-semibold text-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.02)]
                          hover:text-amber-600 hover:border-amber-200 hover:shadow-md transition-all duration-200"
                      >
                        {/* Elegant Top-Left/North-East Arrow Icon matching image_b3c3c1.jpg */}
                        <svg 
                          className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-500 transition-colors shrink-0" 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                        <span className="leading-tight truncate">{subItem.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }

          // Main Services Grid Columns (Columns 1 and 2)
          return (
            <div key={ci} className="flex flex-col space-y-6">
              {col.heading && (
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                  {col.heading}
                </p>
              )}
              <ul className="space-y-6">
                {(col.items ?? []).map((subItem) => (
                  <li key={subItem.href}>
                    <Link
                      href={subItem.href}
                      className="group block text-left navigation-item-wrapper focus:outline-none"
                    >
                      <span className="block text-[15px] font-bold text-gray-900 group-hover:text-amber-600 transition-colors leading-snug">
                        {subItem.label}
                      </span>
                      {subItem.description && (
                        <p className="mt-1 text-xs text-gray-500 font-normal leading-relaxed group-hover:text-gray-600 transition-colors">
                          {subItem.description}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
function DropdownPanel({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul
      className="absolute top-full left-0 mt-0 min-w-[220px] rounded-b-xl bg-white
        shadow-xl border border-neutral-100 py-2 z-50
        opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible
        transition-all duration-200 origin-top-left pointer-events-none group-hover/item:pointer-events-auto"
    >
      {items.map((child) => (
        <li key={child.href}>
          <Link
            href={child.href}
            className="block px-5 py-2.5 text-sm text-gray-700 hover:text-amber-600
              hover:bg-amber-50 transition-colors"
          >
            {child.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function HeaderClient({
  navItems,
  ctaLabel,
  ctaHref,
  locales,
  localeLabels,
  locale,
}: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navTextClass = scrolled ? 'text-gray-700 hover:text-amber-600' : 'text-white/90 hover:text-white'
  const chevronClass = scrolled ? 'text-gray-400' : 'text-white/60'

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            aria-label="Sadia Tec Home"
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
          >
            <Logo dark={scrolled} />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) => {
                const hasMega = item.megaMenu && (item.megaColumns ?? []).length > 0
                const hasDropdown = !hasMega && (item.children ?? []).length > 0

                return (
                  <li key={item.href} className="relative group/item">
                    <Link
                      href={item.href}
                      className={[
                        'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold',
                        'transition-colors duration-200 min-h-[44px]',
                        navTextClass,
                      ].join(' ')}
                    >
                      {item.label}
                      {(hasMega || hasDropdown) && (
                        <svg
                          className={`h-3.5 w-3.5 transition-transform duration-200 group-hover/item:rotate-180 ${chevronClass}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>

                    {hasMega && <MegaMenuPanel item={item} />}
                    {hasDropdown && <DropdownPanel items={item.children!} />}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Right: locale switcher + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcher locales={locales} localeLabels={localeLabels} />

            {ctaLabel && (
              <Link href={ctaHref}>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-amber-500
                    px-6 py-2.5 text-sm font-bold text-white shadow-md
                    transition-all duration-200 hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {ctaLabel}
                </button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <MobileMenu
              navItems={navItems}
              ctaLabel={ctaLabel}
              ctaHref={ctaHref}
              locales={locales}
              localeLabels={localeLabels}
              scrolled={scrolled}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
