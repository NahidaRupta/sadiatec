/**
 * Example site.config.ts for a Japanese dental/medical clinic vertical
 *
 * This file documents what apps/clinic-template/site.config.ts will look like in Phase 1.
 * It uses the same SiteConfig interface as saidatech.config.example.ts and
 * school.config.example.ts — no schema modifications were required.
 *
 * Key differentiators for this vertical:
 * - features.bookingWidget: true  (appointment booking is the primary CTA)
 * - features.locations: true      (clinic hours/address are critical for patients)
 * - features.gallery: true        (before/after, facilities)
 * - contact.phone required        (patients call to confirm appointments)
 * - contact.businessHours required
 * - forms.appointmentRecipient required
 * - integrations.bookingProviderUrl required
 * - brand uses a calm, trust-first green palette
 * - fontSerif: Noto Serif JP for headings (authoritative, professional feel)
 * - Two locales only: en + ja (no Bengali for this vertical)
 *
 * The SiteConfig interface is defined inline here for Phase 0.
 * In Phase 1 it is imported from: packages/cms-core/src/schema/site-config.ts
 */

// ---------------------------------------------------------------------------
// Shared types (Phase 1: imported from 'cms-core/schema')
// ---------------------------------------------------------------------------

interface NavItem {
  labelKey: string
  href: string
  children?: NavItem[]
}

type SocialPlatform =
  | 'twitter'
  | 'facebook'
  | 'linkedin'
  | 'instagram'
  | 'line'
  | 'youtube'

interface SocialLink {
  platform: SocialPlatform
  url: string
}

interface SiteConfig {
  site: {
    name: string
    tagline: Record<string, string>
    domain: string
  }
  brand: {
    logoFile: string
    faviconFile: string
    ogImageFile: string
    brandMark?: string
    colors: {
      primary: string
      secondary: string
      accent: string
      background: string
      surface: string
      text: string
      muted: string
      error: string
      success: string
      warning: string
    }
    typography: {
      fontSans: string
      fontSerif?: string
      fontMono?: string
      fontSizeBase: string
      fontWeightHeading: string
      fontWeightBody: string
      perLocale?: Record<string, { fontSans?: string; fontSerif?: string }>
    }
  }
  locales: {
    enabled: string[]
    default: string
    direction: Record<string, 'ltr' | 'rtl'>
  }
  features: {
    aiAgent: boolean
    bookingWidget: boolean
    jobListings: boolean
    events: boolean
    gallery: boolean
    testimonials: boolean
    downloads: boolean
    news: boolean
    team: boolean
    locations: boolean
  }
  nav: {
    legalLinks: Array<{ slug: string; labelKey: string }>
    socialLinks: SocialLink[]
  }
  contact: {
    email: string
    phone?: string
    address?: Record<string, string>
    mapEmbedUrl?: string
    businessHours?: Record<string, string>
  }
  forms: {
    contactRecipient: string
    jobApplicationRecipient?: string
    appointmentRecipient?: string
  }
  legal: {
    privacyPolicySlug: string
    termsSlug?: string
    cookiePolicySlug?: string
  }
  seo: {
    titleTemplate: string
    defaultDescription: Record<string, string>
    robotsTxt?: string
    sitemapIncludeCollections: string[]
  }
  integrations: {
    googleAnalyticsId?: string
    turnstileSiteKey: string
    resendFromEmail: string
    bookingProviderUrl?: string
    mapsApiKey?: string
  }
}

// ---------------------------------------------------------------------------
// Clinic configuration
// ---------------------------------------------------------------------------

const clinicConfig: SiteConfig = {
  site: {
    name: 'Sakura Dental Clinic',
    tagline: {
      en: 'Gentle Care, Healthy Smiles',
      ja: '優しいケア、健康な笑顔',
    },
    domain: 'sakura-dental.jp',
  },

  brand: {
    logoFile: 'logo.svg',
    faviconFile: 'favicon.ico',
    ogImageFile: 'og-image.jpg',
    brandMark: 'brandmark.svg',

    colors: {
      primary: '#0f7d6e',
      secondary: '#065f50',
      accent: '#f0a500',
      background: '#f8fffe',
      surface: '#e6f7f5',
      text: '#0d2b2a',
      muted: '#4b7a76',
      error: '#b91c1c',
      success: '#15803d',
      warning: '#b45309',
    },

    typography: {
      fontSans: 'Noto Sans JP',
      // Serif for headings: authoritative, professional feel appropriate for medical
      fontSerif: 'Noto Serif JP',
      fontMono: undefined,
      fontSizeBase: '16px',
      fontWeightHeading: '600',
      fontWeightBody: '400',
      perLocale: undefined,
    },
  },

  locales: {
    enabled: ['en', 'ja'],
    default: 'ja',
    direction: { en: 'ltr', ja: 'ltr' },
  },

  features: {
    aiAgent: false,
    bookingWidget: true,
    jobListings: false,
    events: false,
    gallery: true,
    testimonials: true,
    downloads: true,
    news: true,
    team: true,
    locations: true,
  },

  nav: {
    legalLinks: [
      { slug: '/privacy', labelKey: 'nav.privacy' },
      { slug: '/terms', labelKey: 'nav.terms' },
      { slug: '/cookie-policy', labelKey: 'nav.cookiePolicy' },
    ],
    socialLinks: [
      { platform: 'line', url: 'https://line.me/R/ti/p/@sakura-dental-example' },
      { platform: 'facebook', url: 'https://facebook.com/sakura-dental-example' },
    ],
  },

  contact: {
    email: 'info@sakura-dental.jp',
    phone: '+81-3-0000-0000',
    address: {
      en: '1-1 Chiyoda, Chiyoda-ku, Tokyo 100-0001',
      ja: '〒100-0001 東京都千代田区千代田1-1',
    },
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=EXAMPLE_CLINIC_EMBED_ID',
    businessHours: {
      en: 'Mon–Sat 9:00–18:00 (closed Sun and national holidays)',
      ja: '月〜土 9:00〜18:00（日曜・祝日定休）',
    },
  },

  forms: {
    contactRecipient: 'reception@sakura-dental.jp',
    jobApplicationRecipient: undefined,
    appointmentRecipient: 'appointments@sakura-dental.jp',
  },

  legal: {
    privacyPolicySlug: '/privacy',
    termsSlug: '/terms',
    cookiePolicySlug: '/cookie-policy',
  },

  seo: {
    titleTemplate: '%s | Sakura Dental Clinic',
    defaultDescription: {
      en: 'Gentle dental care in central Tokyo. New patients welcome. Book your appointment online.',
      ja: '東京都内で丁寧な歯科診療を提供しています。新患受付中。オンライン予約可能です。',
    },
    robotsTxt: 'User-agent: *\nDisallow: /admin\nAllow: /',
    sitemapIncludeCollections: ['pages', 'news', 'services', 'faqs', 'team', 'gallery'],
  },

  integrations: {
    googleAnalyticsId: 'G-XXXXXXXXXX',
    turnstileSiteKey: process.env['TURNSTILE_SITE_KEY'] ?? '',
    resendFromEmail: 'no-reply@sakura-dental.jp',
    bookingProviderUrl: 'https://booking.example.jp/sakura-dental',
    mapsApiKey: process.env['GOOGLE_MAPS_API_KEY'] ?? undefined,
  },
}

export default clinicConfig
export type { SiteConfig, NavItem, SocialLink, SocialPlatform }
