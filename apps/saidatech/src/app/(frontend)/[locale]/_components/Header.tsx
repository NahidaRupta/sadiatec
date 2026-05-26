// SERVER COMPONENT — do not add 'use client'
import { getCachedPayload } from '@/lib/payload'
import { getTranslations } from 'next-intl/server'
import { Container } from '@saidatech/cms-core/components/ui'
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
  ctaButton?: { label?: string | Record<string, string>; href?: string }
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

  // Safe JSON parsing configuration to handle raw stringified JSON objects
  const getLocalizedValue = (value: string | Record<string, string> | undefined, currentLocale: string): string => {
    if (!value) return ''
    
    if (typeof value === 'string') {
      if (value.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(value)
          return parsed[currentLocale] || parsed['en'] || ''
        } catch (e) {
          try {
            const formattedJson = value.replace(/'/g, '"')
            const parsedFallback = JSON.parse(formattedJson)
            return parsedFallback[currentLocale] || parsedFallback['en'] || ''
          } catch (err) {
            return value
          }
        }
      }
      return value
    }
    
    return value[currentLocale] || value['en'] || ''
  }

  const ctaLabel = getLocalizedValue(ctaButton?.label, locale)
  const localeLabels: Record<string, string> = { en: 'EN', ja: '日本語', bn: 'বাংলা' }

  const navT = (key: string) => {
    const stripped = key.startsWith('nav.') ? key.slice(4) : key
    return t(stripped as Parameters<typeof t>[0])
  }

  // Safely check for the logo configuration
  const logoFile = siteConfig?.brand?.logoFile

  // FIX: Explicitly declared static state fallback for server context compilation
  const scrolled = false

  const desktopNavLinks = (
    <ul role="list" className="flex items-center gap-1">
      {navItems.map((item) => {
        const hasChildren = (item.children ?? []).length > 0
        return (
          <li key={item.href} className="relative group/item">
            <Link
              href={item.href}
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold
                text-white/90 hover:text-white transition-colors min-h-[44px]"
            >
              {navT(item.labelKey)}
              {hasChildren && (
                <svg className="w-4 h-4 opacity-70 transition-transform duration-200 group-hover/item:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </Link>

            {/* Dropdown Menu Layer */}
            {hasChildren && (
              <ul className="absolute top-full left-0 mt-1 min-w-[200px] rounded-lg bg-[#112240] p-2 shadow-xl 
                opacity-0 invisible scale-95 origin-top-left transition-all duration-200 
                group-hover/item:opacity-100 group-hover/item:visible group-hover/item:scale-100 z-50 border border-white/10">
                {item.children!.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className="block px-4 py-2.5 text-sm font-medium text-white/80 rounded-md
                        hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {navT(child.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )

  const mobileNavLinks = (
    <ul role="list" className="flex flex-col gap-1">
      {navItems.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="flex items-center px-3 py-3 text-base font-semibold text-white
              rounded-md hover:bg-white/10 transition-colors min-h-[44px]"
          >
            {navT(item.labelKey)}
          </Link>
          {(item.children ?? []).length > 0 && (
            <ul className="ml-4 mt-1 flex flex-col gap-1 border-l border-white/10 pl-2">
              {item.children!.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="flex items-center px-3 py-2 text-sm text-white/70
                      rounded-md hover:bg-white/10 hover:text-white transition-colors min-h-[44px]"
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
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent transition-all duration-200">
      <Container>
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity / Custom Typography Text Logo Link */}
          <Link
            href="/"
            className="shrink-0 mr-6 xl:mr-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
            aria-label="MakeCareer Home"
          >
            {/* Safe lookup prevents broken image placeholder blocks from intercepting rendering */}
            {logoFile && logoFile !== 'logo.svg' && /\.(jpg|jpeg|png|svg|webp|gif)$/i.test(logoFile) ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`/brand/${logoFile}`}
                alt={siteConfig.site.name}
                height={40}
                width={120}
                className="h-10 w-auto"
              />
            ) : (
              /* High-fidelity custom text layout design */
              <span
                className={`text-2xl tracking-wide transition-colors duration-300 select-none ${
                  scrolled ? "text-navy-950" : "text-white"
                }`}
              >
                <span className="font-light">Sadia</span>
                <span className="font-extrabold text-amber-500 tracking-normal italic ml-0.5">
                  Tec
                </span>
              </span>
            )}
          </Link>

          {/* Desktop Navigation Group */}
          <div className="hidden md:flex items-center gap-6">
            <nav aria-label="Main navigation">
              {desktopNavLinks}
            </nav>
            
            <div className="h-4 w-px bg-white/20" />
            
            <LocaleSwitcher
              locales={siteConfig.locales.enabled}
              localeLabels={localeLabels}
            />
            
            {ctaLabel && ctaButton?.href && (
              <Link href={ctaButton.href}>
                <button className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-amber-600 hover:-translate-y-0.5">
                  {ctaLabel}
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
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