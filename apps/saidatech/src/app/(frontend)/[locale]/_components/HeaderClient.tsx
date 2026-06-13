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
  cmsLogoUrl?: string | null
}

function Logo({ dark, imageUrl }: { dark: boolean; imageUrl?: string | null | undefined }) {
  if (!imageUrl) {
    return (
      <span className="text-2xl tracking-wide select-none">
        <span className={`font-light transition-colors duration-300 ${dark ? 'text-brand-accent' : 'text-white'}`}>
          Sadiatec
        </span>
      </span>
    )
  }

  return (
    <div className="relative flex items-center h-14 w-48 transition-all duration-300">
      <Image
        src={imageUrl}
        alt="Sadia Tec Logo"
        fill
        priority
        className="object-contain object-left"
        sizes="250px"
      />
    </div>
  )
}

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
                    <p className="mb-5 text-[11px] font-bold uppercase tracking-wider text-brand-accent">
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
                            hover:text-brand-accent hover:border-brand-accent/20 hover:shadow-md transition-all duration-200"
                        >
                          <svg
                            className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-accent transition-colors shrink-0"
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
                        <span className="block text-[15px] font-bold text-gray-900 group-hover:text-brand-accent transition-colors leading-snug">
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
              className="block px-5 py-2.5 text-sm text-text-secondary hover:text-brand-accent
                hover:bg-brand-accent/5 transition-colors"
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
  cmsLogoUrl,
}: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false)
  const [, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const strippedPath = pathname.replace(/^\/(en|ja|bn)(?=\/|$)/, '') || '/'

  function isActive(item: ResolvedNavItem): boolean {
    const hasChildren =
      (item.children?.length ?? 0) > 0 ||
      (item.megaMenu && (item.megaColumns?.length ?? 0) > 0)
    return hasChildren
      ? strippedPath.startsWith(item.href)
      : strippedPath === item.href
  }

  return (
    <header
      className={[
        'sticky top-0 left-0 right-0 z-50 bg-white border-b border-border-default transition-shadow duration-300',
        scrolled ? 'shadow-sm' : 'shadow-none',
      ].join(' ')}
    >
      <div className="flex h-16 items-center justify-between w-full px-6 lg:px-20">

          {/* Logo */}
          <Link
            href="/"
            aria-label="Sadia Tec Home"
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-sm"
          >
            <Logo dark={true} imageUrl={cmsLogoUrl} />
          </Link>

          {/* Desktop nav — hidden below lg breakpoint */}
          <nav aria-label="Main navigation" className="hidden lg:block">
            <ul className="flex items-center">
              {navItems.map((item) => {
                const hasMega = item.megaMenu && (item.megaColumns ?? []).length > 0
                const hasDropdown = !hasMega && (item.children ?? []).length > 0
                const active = isActive(item)
                const isLeaf = !hasMega && !hasDropdown

                return (
                  <li key={item.href} className="relative group/item">
                    <Link
                      href={item.href}
                      aria-current={active && isLeaf ? 'page' : undefined}
                      className={[
                        'inline-flex items-center gap-1 px-3 py-2 text-sm font-medium min-h-[44px]',
                        'border-b-2 transition-colors duration-200',
                        active
                          ? 'text-brand-primary border-brand-primary'
                          : 'text-text-primary border-transparent hover:text-brand-primary hover:border-brand-primary',
                      ].join(' ')}
                    >
                      {item.label}
                      {(hasMega || hasDropdown) && (
                        <svg
                          className="h-3.5 w-3.5 text-text-muted transition-transform duration-200 group-hover/item:rotate-180"
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

          {/* Right controls — hidden below lg breakpoint */}
          <div className="hidden lg:flex items-center gap-4">

            {/* Language switcher */}
            <div className="relative group/lang py-2">
              <button
                type="button"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium
                  text-text-primary hover:bg-bg-secondary border border-border-default
                  transition-colors duration-200"
                aria-label="Language selection dropdown"
              >
                <span className="text-xl select-none leading-none">
                  {localeLabels[locale] || locale}
                </span>
                <span className="text-xs uppercase tracking-wider">{locale}</span>
                <svg
                  className="h-3 w-3 text-text-muted transition-transform duration-200 group-hover/lang:rotate-180"
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
                <ul className="rounded-xl bg-white shadow-xl border border-border-default py-1.5 overflow-hidden">
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
                              ? 'text-brand-primary bg-brand-primary/5 font-bold'
                              : 'text-text-secondary hover:text-brand-primary hover:bg-bg-secondary',
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

            <div className="h-5 w-px bg-border-default" />

            {ctaLabel && (
              <Link href={ctaHref}>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-sm bg-brand-accent
                    px-5 py-2 text-sm font-medium text-white
                    transition-colors duration-200 hover:bg-brand-accent-hover"
                >
                  {ctaLabel}
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu trigger — visible below lg breakpoint */}
          <div className="flex lg:hidden">
            <MobileMenu
              navItems={navItems}
              ctaLabel={ctaLabel}
              ctaHref={ctaHref}
              locales={locales}
              localeLabels={localeLabels}
              scrolled={true}
              onOpenChange={setIsMobileMenuOpen}
            />
          </div>
      </div>
    </header>
  )
}
