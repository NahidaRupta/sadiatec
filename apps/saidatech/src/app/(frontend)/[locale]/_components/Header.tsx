// SERVER COMPONENT — do not add 'use client'
import { getCachedPayload } from '@/lib/payload'
import { getTranslations } from 'next-intl/server'
import { Container, Button } from '@saidatech/cms-core/components/ui'
import siteConfig from '../../../../../site.config'
import { Link } from '@/i18n/routing'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileMenu } from './MobileMenu'

interface NavChild {
  labelKey: string
  href: string
}

interface NavItem {
  labelKey: string
  href: string
  children?: NavChild[]
}

interface HeaderGlobalData {
  navItems?: NavItem[]
  ctaButton?: { label?: string; href?: string }
}

interface HeaderProps {
  locale: string
}

export async function Header({ locale }: HeaderProps) {
  const payload = await getCachedPayload()
  const t = await getTranslations({ locale, namespace: 'nav' })

  let headerData: HeaderGlobalData = {}
  try {
    const raw = await payload.findGlobal({
      slug: 'header',
      locale: locale as 'en' | 'ja' | 'bn',
    })
    headerData = raw as HeaderGlobalData
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.warn('[Header] CMS unavailable:', err)
  }

  const navItems = headerData.navItems ?? []
  const ctaButton = headerData.ctaButton

  const localeLabels: Record<string, string> = { en: 'EN', ja: '日本語', bn: 'বাংলা' }

  const navT = (key: string) => {
    const stripped = key.startsWith('nav.') ? key.slice(4) : key
    return t(stripped as Parameters<typeof t>[0])
  }

  const desktopNavLinks = (
    <ul role="list" className="flex items-center gap-1">
      {navItems.map((item) => (
        <li key={item.href} className="relative group">
          <Link
            href={item.href}
            className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium
              text-[var(--color-text)] hover:bg-neutral-100 hover:text-[var(--color-primary)]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
              transition-colors min-h-[44px]"
          >
            {navT(item.labelKey)}
          </Link>
        </li>
      ))}
    </ul>
  )

  const mobileNavLinks = (
    <ul role="list" className="flex flex-col gap-1">
      {navItems.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="flex items-center px-3 py-3 text-base font-medium text-[var(--color-text)]
              rounded-md hover:bg-neutral-100 hover:text-[var(--color-primary)]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
              transition-colors min-h-[44px]"
          >
            {navT(item.labelKey)}
          </Link>
          {(item.children ?? []).length > 0 && (
            <ul className="ml-4 mt-1 flex flex-col gap-1">
              {item.children!.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="flex items-center px-3 py-2 text-sm text-[var(--color-muted)]
                      rounded-md hover:bg-neutral-100 hover:text-[var(--color-primary)]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                      transition-colors min-h-[44px]"
                  >
                    {navT(child.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-background)]/95 backdrop-blur-sm border-b border-neutral-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" aria-label={siteConfig.site.name} className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/brand/${siteConfig.brand.logoFile}`}
              alt={siteConfig.site.name}
              height={40}
              width={120}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop: nav + locale + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <nav aria-label="Main navigation">
              {desktopNavLinks}
            </nav>
            <LocaleSwitcher
              locales={siteConfig.locales.enabled}
              localeLabels={localeLabels}
            />
            {ctaButton?.label && ctaButton.href && (
              <Link href={ctaButton.href}>
                <Button variant="primary" size="sm">
                  {ctaButton.label}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: locale + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <MobileMenu
              navLinks={mobileNavLinks}
              localeSwitcher={
                <LocaleSwitcher
                  locales={siteConfig.locales.enabled}
                  localeLabels={localeLabels}
                />
              }
            />
          </div>
        </div>
      </Container>
    </header>
  )
}
