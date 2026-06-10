import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import siteConfig from '../../../../../site.config'
import { PageHeroBlock, CTABannerBlock } from '@saidatech/cms-core/blocks'
import type { PageHeroBlockProps, CTABannerBlockProps } from '@saidatech/cms-core/blocks'
import { Container, Section, Heading, Text } from '@saidatech/cms-core/components/ui'
import { ContactForm } from './_components/ContactForm'

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
// Static label maps
// ---------------------------------------------------------------------------

const titles: Record<Locale, string> = {
  en: 'Contact Us',
  ja: 'お問い合わせ',
  bn: 'যোগাযোগ করুন',
}
const button: Record<Locale, string> = {
  en: 'Get to Know Us',
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

const officeSectionLabels: Record<Locale, string> = {
  en: 'Office Information',
  ja: '会社情報',
  bn: 'অফিসের তথ্য',
}

const emailLabels: Record<Locale, string> = {
  en: 'Email',
  ja: 'メール',
  bn: 'ইমেইল',
}

const formSectionLabels: Record<Locale, string> = {
  en: 'Send a Message',
  ja: 'メッセージを送る',
  bn: 'একটি বার্তা পাঠান',
}

const formLabels = {
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

  const heroProps: PageHeroBlockProps = {
    heading: titles[locale],
    body: heroSubheadings[locale],
    primaryButton: { label: button[locale], href: '/about' },
    overlayOpacity: 40,
  }

  const ctaProps: CTABannerBlockProps = {
    heading: ctaHeadings[locale],
    primaryButton: { label: ctaButtons[locale], href: '/faq' },
    variant: 'outlined',
  }

  // API path — locale-prefixed only if not default locale (Next.js rewrites handle this)
  const apiPath = '/api/forms/contact'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PageHeroBlock {...heroProps} />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Form column */}
            <div>
              <Heading level={2} className="text-2xl font-semibold mb-6">
                {formSectionLabels[locale]}
              </Heading>
              <ContactForm
                locale={locale}
                labels={formLabels[locale]}
                apiPath={apiPath}
              />
            </div>

            {/* Office info column */}
            <div className="space-y-8">
              <Heading level={2} className="text-2xl font-semibold">
                {officeSectionLabels[locale]}
              </Heading>

              <div className="space-y-4">
                <div>
                  <Text className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-1">
                    {emailLabels[locale]}
                  </Text>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>

                {siteConfig.contact.phone && (
                  <div>
                    <Text className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-1">
                      {locale === 'ja' ? '電話' : locale === 'bn' ? 'ফোন' : 'Phone'}
                    </Text>
                    <a
                      href={`tel:${siteConfig.contact.phone}`}
                      className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                )}

                {siteConfig.contact.address && (
                  <div>
                    <Text className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-1">
                      {locale === 'ja' ? '住所' : locale === 'bn' ? 'ঠিকানা' : 'Address'}
                    </Text>
                    <Text className="text-sm text-[var(--color-text)] whitespace-pre-line">
                      {siteConfig.contact.address[locale] ?? siteConfig.contact.address['en'] ?? ''}
                    </Text>
                  </div>
                )}

                {siteConfig.contact.businessHours && (
                  <div>
                    <Text className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-1">
                      {locale === 'ja' ? '営業時間' : locale === 'bn' ? 'ব্যবসার সময়' : 'Business Hours'}
                    </Text>
                    <Text className="text-sm text-[var(--color-text)]">
                      {siteConfig.contact.businessHours[locale] ?? siteConfig.contact.businessHours['en'] ?? ''}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
      {siteConfig.features.faq && <CTABannerBlock {...ctaProps} />}
    </>
  )
}
