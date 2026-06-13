import type { CSSProperties, ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { Lato, Noto_Sans_JP, Noto_Sans_Bengali } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { buildCssVariables } from '@saidatech/cms-core/tokens'
import siteConfig from '../../../../site.config'
import { Header } from './_components/Header'
import { Footer } from './_components/Footer'
import { HtmlLangSetter } from './_components/HtmlLangSetter'

const latoFont = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-latin',
  display: 'swap',
  preload: false,
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ja',
  display: 'swap',
  preload: false,
})

const notoSansBN = Noto_Sans_Bengali({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-bn',
  display: 'swap',
  preload: false,
})

const skipLabel: Record<string, string> = {
  en: 'Skip to main content',
  ja: 'メインコンテンツへスキップ',
  bn: 'মূল বিষয়বস্তুতে যান',
}

const localeFontConfig: Record<string, { variableClass: string; cssVar: string }> = {
  en: { variableClass: latoFont.variable, cssVar: '--font-latin' },
  ja: { variableClass: notoSansJP.variable, cssVar: '--font-ja' },
  bn: { variableClass: notoSansBN.variable, cssVar: '--font-bn' },
}

export function generateStaticParams() {
  return siteConfig.locales.enabled.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!siteConfig.locales.enabled.includes(locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  const dir = (siteConfig.locales.direction[locale] ?? 'ltr') as 'ltr' | 'rtl'

  const brandVars = buildCssVariables(siteConfig)

  const activeFontConfig = localeFontConfig[locale]
  const activeFontVar = activeFontConfig
    ? `var(${activeFontConfig.cssVar})`
    : `var(--font-ja)`

  const wrapperStyle: CSSProperties = {
    ...brandVars,
    '--font-sans': `${activeFontVar}, system-ui, sans-serif`,
    fontFamily: 'var(--font-sans)',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-background)',
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
  } as CSSProperties

  const fontClasses = [
    latoFont.variable,
    notoSansJP.variable,
    notoSansBN.variable,
  ].join(' ')

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlLangSetter locale={locale} dir={dir} />
      <div className={fontClasses} style={wrapperStyle}>
        <a
          href="#main-content"
          className="absolute -top-full left-4 z-50 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-all focus:top-4"
        >
          {skipLabel[locale] ?? skipLabel['en']}
        </a>
        <Header locale={locale} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} />
      </div>
    </NextIntlClientProvider>
  )
}
