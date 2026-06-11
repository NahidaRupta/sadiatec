'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
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
  cmsLogoUrl?: string | null // 👈 Added the live dynamic CMS logo prop parameter
}
// 🛠️ EXPANDED LOGO COMPONENT DIMENSIONS
function Logo({ dark, imageUrl }: { dark: boolean; imageUrl?: string | null | undefined }) {
  // Fallback text if no image is available
  if (!imageUrl) {
    return (
      <span className="text-2xl tracking-wide select-none">
        <span className={`font-light transition-colors duration-300 ${dark ? 'text-green-500' : 'text-white'}`}>
          Sadiatec
        </span>
      </span>
    )
  }

  return (
    /* Changed from h-10 w-36 to h-14 w-48 to increase size */
    <div className="relative flex items-center h-14 w-48 transition-all duration-300">
      <Image
        src={imageUrl} 
        alt="Sadia Tec Logo"
        fill
        priority
        className="object-contain object-left" 
        sizes="250px" // 👈 Upgraded size budget to prevent Next.js from serving a lower-res image
      />
    </div>
  )
}

// 🛠️ MegaMenuPanel
function MegaMenuPanel({ item }: { item: ResolvedNavItem }) {
  const columns = item.megaColumns ?? []

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[1100px] max-w-[95vw] z-50
        opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible
        transition-all duration-200 origin-top pointer-events-none group-hover/item:pointer-events-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-100 p-8 grid grid-cols-12 gap-8 text-left">
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

        <div className="col-span-9 grid grid-cols-3 gap-8">
          {columns.map((col, ci) => {
            const isSidebar = ci === 2 || col.heading?.toLowerCase().includes('more')

            if (isSidebar) {
              return (
                <div key={ci} className="flex flex-col bg-slate-50/50 border-l border-neutral-100 pl-8 -my-8 py-8 rounded-r-2xl">
                  {col.heading && (
                    <p className="mb-5 text-[11px] font-bold uppercase tracking-wider text-green-600">
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
                            hover:text-green-600 hover:border-green-200 hover:shadow-md transition-all duration-200"
                        >
                          <svg 
                            className="h-3.5 w-3.5 text-slate-400 group-hover:text-green-500 transition-colors shrink-0" 
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
                        <span className="block text-[15px] font-bold text-gray-900 group-hover:text-green-600 transition-colors leading-snug">
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
    </div>
  )
}

// 🛠️ DropdownPanel
function DropdownPanel({ items }: { items: { label: string; href: string }[] }) {
  return (
    <div
      className="absolute top-full left-0 pt-3 min-w-[220px] z-50
        opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible
        transition-all duration-200 origin-top-left pointer-events-none group-hover/item:pointer-events-auto"
    >
      <ul className="rounded-xl bg-white shadow-xl border border-neutral-100 py-2.5 overflow-hidden">
        {items.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              className="block px-5 py-2.5 text-sm text-gray-700 hover:text-green-600
                hover:bg-green-50 transition-colors"
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function HeaderClient({
  navItems,
  ctaLabel,
  ctaHref,
  locales,
  localeLabels,
  locale,
  cmsLogoUrl, // Destructured safe content identifier variable
}: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const strippedPath = pathname.replace(/^\/(en|ja|bn)(?=\/|$)/, '') || '/'
  const isHomepage = strippedPath === '/'
  const shouldShowDarkHeader = scrolled || !isHomepage

  const navTextClass = shouldShowDarkHeader 
    ? 'text-gray-700 hover:text-green-600' 
    : 'text-white/90 hover:text-white'
    
  const chevronClass = shouldShowDarkHeader ? 'text-gray-400' : 'text-white/60'

  function isActive(item: ResolvedNavItem): boolean {
    const hasChildren = (item.children?.length ?? 0) > 0 || (item.megaMenu && (item.megaColumns?.length ?? 0) > 0)
    return hasChildren
      ? strippedPath.startsWith(item.href)
      : strippedPath === item.href
  }

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20',
        shouldShowDarkHeader
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            aria-label="Sadia Tec Home"
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 rounded-sm"
          >
            <Logo dark={shouldShowDarkHeader} imageUrl={cmsLogoUrl} />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) => {
                const hasMega = item.megaMenu && (item.megaColumns ?? []).length > 0
                const hasDropdown = !hasMega && (item.children ?? []).length > 0

                const active = isActive(item)
                const activeTextClass = shouldShowDarkHeader
                  ? 'text-green-600 font-bold'
                  : 'text-white font-bold'
                const isLeaf = !hasMega && !hasDropdown

                return (
                  <li key={item.href} className="relative group/item">
                    <Link
                      href={item.href}
                      aria-current={active && isLeaf ? 'page' : undefined}
                      className={[
                        'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold',
                        'transition-colors duration-200 min-h-[44px]',
                        active ? activeTextClass : navTextClass,
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

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-5">

            <div className="relative group/lang py-2">
              <button
                type="button"
                className={[
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-200',
                  shouldShowDarkHeader 
                    ? 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200' 
                    : 'text-white bg-white/10 hover:bg-white/20 border border-white/10'
                ].join(' ')}
                aria-label="Language selection dropdown"
              >
                <span className="text-xl select-none leading-none">
                  {localeLabels[locale] || locale}
                </span>
                <span className="text-xs uppercase tracking-wider opacity-90">{locale}</span>
                <svg
                  className="h-3 w-3 opacity-60 transition-transform duration-200 group-hover/lang:rotate-180"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className="absolute right-0 top-full pt-2 min-w-[140px] z-50
                  opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible
                  transition-all duration-150 origin-top-right pointer-events-none group-hover/lang:pointer-events-auto"
              >
                <ul className="rounded-xl bg-white shadow-xl border border-neutral-100 py-1.5 overflow-hidden">
                  {locales.map((loc) => {
                    const isCurrentLocale = locale === loc
                    const flagIcon = localeLabels[loc] || loc

                    return (
                      <li key={loc}>
                        <Link
                          href={strippedPath}
                          locale={loc}
                          className={[
                            'flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors text-left font-medium',
                            isCurrentLocale
                              ? 'text-green-600 bg-green-50/50 font-bold'
                              : 'text-gray-600 hover:text-green-600 hover:bg-neutral-50'
                          ].join(' ')}
                        >
                          <span className="text-xl select-none leading-none">{flagIcon}</span>
                          <span className="uppercase text-xs tracking-wider font-semibold">
                            {loc === 'en' ? 'English' : loc === 'ja' ? '日本語' : 'বাংলা'}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>

            <div className={`h-5 w-px ${shouldShowDarkHeader ? 'bg-gray-200' : 'bg-white/20'}`} />

            {ctaLabel && (
              <Link href={ctaHref}>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-green-800
                    px-6 py-2.5 text-sm font-bold text-white shadow-md
                    transition-all duration-200 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {ctaLabel}
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden">
            <MobileMenu
              navItems={navItems}
              ctaLabel={ctaLabel}
              ctaHref={ctaHref}
              locales={locales}
              localeLabels={localeLabels}
              scrolled={shouldShowDarkHeader}
              onOpenChange={setIsMobileMenuOpen}
            />
          </div>
        </div>
      </div>
    </header>
  )
}