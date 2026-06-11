import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import siteConfig from '../../../../../site.config'
import { PageHeroBlock, CTABannerBlock } from '@saidatech/cms-core/blocks'
import type { PageHeroBlockProps, CTABannerBlockProps } from '@saidatech/cms-core/blocks'
import { Container, Section, Heading, Text } from '@saidatech/cms-core/components/ui'
import { ContactForm } from './_components/ContactForm'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

const LOCALES = ['en', 'ja', 'bn'] as const
type Locale = (typeof LOCALES)[number]

function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s)
}

type Props = { params: Promise<{ locale: string }> }

export async function generateStaticParams() {
  return siteConfig.locales.enabled.map((locale) => ({ locale }))
}

// ---------------------------------------------------------------------------
// Types for form labels
// ---------------------------------------------------------------------------

type FormLabels = {
  name: string
  email: string
  company: string
  inquiryType: string
  message: string
  submit: string
  submitting: string
  success: string
  error: string
  required: string
  inquiryOptions: {
    general: string
    visa: string
    recruitment: string
    other: string
  }
}

const formLabels: Record<Locale, FormLabels> = {
  en: {
    name: 'Full Name',
    email: 'Email Address',
    company: 'Company (optional)',
    inquiryType: 'Enquiry Type',
    message: 'Message',
    submit: 'Send Message',
    submitting: 'Sending…',
    success: 'Thank you! Your message has been sent. We will be in touch within one business day.',
    error: 'Something went wrong. Please try again.',
    required: 'Required',
    inquiryOptions: {
      general: 'General Enquiry',
      visa: 'Visa & Immigration',
      recruitment: 'Recruitment & Hiring',
      other: 'Other',
    },
  },
  ja: {
    name: 'お名前',
    email: 'メールアドレス',
    company: '会社名（任意）',
    inquiryType: 'お問い合わせ種別',
    message: 'メッセージ',
    submit: '送信する',
    submitting: '送信中…',
    success: 'ありがとうございます！メッセージを受け付けました。1営業日以内にご返信いたします。',
    error: 'エラーが発生しました。もう一度お試しください。',
    required: '必須',
    inquiryOptions: {
      general: '一般的なお問い合わせ',
      visa: 'ビザ・在留資格',
      recruitment: '採用・人材紹介',
      other: 'その他',
    },
  },
  bn: {
    name: 'পূর্ণ নাম',
    email: 'ইমেইল ঠিকানা',
    company: 'কোম্পানি (ঐচ্ছিক)',
    inquiryType: 'জিজ্ঞাসার ধরন',
    message: 'বার্তা',
    submit: 'বার্তা পাঠান',
    submitting: 'পাঠানো হচ্ছে…',
    success: 'ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে। আমরা একটি কার্যদিবসের মধ্যে যোগাযোগ করব।',
    error: 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।',
    required: 'আবশ্যক',
    inquiryOptions: {
      general: 'সাধারণ জিজ্ঞাসা',
      visa: 'ভিসা ও অভিবাসন',
      recruitment: 'নিয়োগ ও নিয়োগ প্রক্রিয়া',
      other: 'অন্যান্য',
    },
  },
} as const

// ---------------------------------------------------------------------------
// Static labels
// ---------------------------------------------------------------------------

const titles: Record<Locale, string> = {
  en: 'Contact Us',
  ja: 'お問い合わせ',
  bn: 'যোগাযোগ করুন',
}

const descriptions: Record<Locale, string> = {
  en: 'Get in touch with our team for visa support, recruitment enquiries, or general questions.',
  ja: 'ビザ支援・採用に関するご相談・一般的なお問い合わせはこちらからどうぞ。',
  bn: 'ভিসা সহায়তা, নিয়োগ সম্পর্কিত জিজ্ঞাসা বা সাধারণ প্রশ্নের জন্য আমাদের টিমের সাথে যোগাযোগ করুন।',
}

const heroSubheadings: Record<Locale, string> = {
  en: "We'd love to hear from you. Reach out and we'll respond within one business day.",
  ja: 'お気軽にご連絡ください。1営業日以内にご返信いたします。',
  bn: 'আমরা আপনার কথা শুনতে আগ্রহী। যোগাযোগ করুন, আমরা একটি কার্যদিবসের মধ্যে সাড়া দেব।',
}

const homeLabels: Record<Locale, string> = {
  en: 'Home',
  ja: 'ホーム',
  bn: 'হোম',
}

const formSectionLabels: Record<Locale, string> = {
  en: 'Send a Message',
  ja: 'メッセージを送る',
  bn: 'メッセージを送る',
}

const ctaHeadings: Record<Locale, string> = {
  en: 'Looking for answers before reaching out?',
  ja: 'お問い合わせ前によくある質問をご覧ください。',
  bn: 'যোগাযোগ করার আগে উত্তর খুঁজছেন?',
}

const ctaButtons: Record<Locale, string> = {
  en: 'View FAQ',
  ja: 'よくある質問を見る',
  bn: 'সাধারণ জিজ্ঞাসা দেখুন',
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const canonicalPath = locale === defaultLocale ? '/contact' : `/${locale}/contact`

  const languages: Record<string, string> = { 'x-default': `${base}/contact` }
  for (const loc of siteConfig.locales.enabled) {
    languages[loc] = loc === defaultLocale ? `${base}/contact` : `${base}/${loc}/contact`
  }

  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${base}${canonicalPath}`,
      siteName: siteConfig.site.name,
      locale,
      type: 'website',
    },
    alternates: {
      canonical: `${base}${canonicalPath}`,
      languages,
    },
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ContactPage({ params }: Props) {
  if (!siteConfig.features.contact) notFound()

  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const homeUrl = locale === defaultLocale ? base : `${base}/${locale}`
  const pageUrl = locale === defaultLocale ? `${base}/contact` : `${base}/${locale}/contact`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabels[locale], item: homeUrl },
      { '@type': 'ListItem', position: 2, name: titles[locale], item: pageUrl },
    ],
  }

  // Fetch Company Information (depth: 1 に変更して、配列や詳細データを安全に読み込み)
  const payload = await getPayloadHMR({ config: await configPromise })
  const companyInfo = await payload.findGlobal({
    slug: 'company-info',
    locale,
    depth: 1,
  })

  const heroProps: PageHeroBlockProps = {
    heading: titles[locale],
    body: heroSubheadings[locale],
    primaryButton: { label: 'Get to Know Us', href: '/about' },
    overlayOpacity: 40,
  }

  const ctaProps: CTABannerBlockProps = {
    heading: ctaHeadings[locale],
    primaryButton: { label: ctaButtons[locale], href: '/faq' },
    variant: 'outlined',
  }

  const apiPath = '/api/forms/contact'
  const offices = Array.isArray(companyInfo?.offices) ? companyInfo.offices : []

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PageHeroBlock {...heroProps} />

      <Section>
        <Container>
          {/* Row 1: Centered Contact Form */}
          <div className="max-w-2xl mx-auto mb-24">
            <Heading level={2} className="text-3xl font-semibold text-center mb-8">
              {formSectionLabels[locale]}
            </Heading>
            <ContactForm
              locale={locale}
              labels={formLabels[locale]}
              apiPath={apiPath}
            />
          </div>

          {/* Row 2: Multiple Offices Grid Stacker */}
{offices.length > 0 && (
  <div className="space-y-24 border-t border-neutral-100 pt-16">
    {offices.map((office: any, idx: number) => (
      <div 
        key={office.id || idx} 
        className="space-y-4"
      >
        {/* 1. Office Country Heading — Kept full-width so left & right columns align beneath it */}
        <Heading level={3} className="text-2xl font-bold tracking-tight text-slate-900 text-left">
          {office.country}
        </Heading>

        {/* 2. Grid Content Box — Columns now share a clean horizontal baseline directly beneath the heading */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN - Map Component */}
          <div className="w-full">
            {office.googleMapsEmbedUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-neutral-200 shadow-xs bg-slate-50">
                <iframe
                  src={office.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="aspect-video bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 text-sm italic">
                No Map Available
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Office Meta Details & Nearest Stations */}
          <div className="space-y-4 text-left">
            
            {/* Office Address Card */}
            <div className="space-y-1.5">
              {office.legalName && (
                <p className="text-base font-bold text-slate-950 leading-snug">{office.legalName}</p>
              )}
              <p className="text-[15px] text-slate-600 whitespace-pre-line leading-relaxed">
                {office.address}
              </p>
              
              {/* Contact Items grouped side-by-side */}
              <div className="pt-1 text-sm font-medium text-slate-500 flex flex-wrap gap-x-5 gap-y-1.5 items-center">
                {office.phone && (
                  <span className="inline-flex items-center">
                    <span className="font-bold text-slate-700 mr-1.5">TEL:</span>{office.phone}
                  </span>
                )}
                {office.fax && (
                  <span className="inline-flex items-center">
                    <span className="font-bold text-slate-700 mr-1.5">FAX:</span>{office.fax}
                  </span>
                )}
                {office.mobile && (
                  <span className="inline-flex items-center">
                    <span className="font-bold text-slate-700 mr-1.5">MOB:</span>{office.mobile}
                  </span>
                )}
                {office.email && (
                  <span className="inline-flex items-center">
                    <span className="font-bold text-slate-700 mr-1.5">EMAIL:</span>
                    <a href={`mailto:${office.email}`} className="hover:underline text-slate-600">
                      {office.email}
                    </a>
                  </span>
                )}
              </div>
            </div>

            {/* Nearest Stations Blocks */}
            {office.nearestStations && office.nearestStations.length > 0 && (
              <div className="border-t border-slate-100 pt-3">
                <Text className="text-[11px] font-bold uppercase tracking-wider text-(--color-primary) mb-2 block">
                  NEAREST STATIONS
                </Text>
                <ul className="space-y-1.5">
                  {office.nearestStations.map((station: any, stationIdx: number) => (
                    <li key={station.id || stationIdx} className="flex gap-2.5 text-[15px] items-start">
                      <span className="text-base shrink-0 select-none mt-0.5">🚉</span>
                      <div className="leading-tight">
                        <span className="font-semibold text-slate-800">{station.stationName}</span>
                        {station.description && (
                          <span className="text-sm text-slate-500 ml-2 font-normal">
                            — {station.description}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>
      </div>
    ))}
  </div>
)}
        </Container>
      </Section>
      
      {siteConfig.features.faq && <CTABannerBlock {...ctaProps} />}
    </>
  )
}