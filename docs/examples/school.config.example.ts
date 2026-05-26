/**
 * Example site.config.ts for a Japanese school/daycare/international school vertical
 *
 * This file documents what apps/school-template/site.config.ts will look like in Phase 1.
 * It uses the same SiteConfig interface as saidatech.config.example.ts and
 * clinic.config.example.ts — no schema modifications were required.
 *
 * Key differentiators for this vertical:
 * - features.events: true     (school calendar is the #1 parent resource)
 * - features.gallery: true    (school life photos build enrolment trust)
 * - features.downloads: true  (application forms, curriculum guides, term calendars)
 * - features.news: true       (announcements, newsletter archive)
 * - features.team: true       (teacher profiles)
 * - features.bookingWidget: false  (school tours booked via contact form, not widget)
 * - features.jobListings: false
 * - contact.phone required    (parents call the office)
 * - contact.businessHours required
 * - brand uses a warm, energetic amber/green palette
 * - fontSans: Nunito (friendly, rounded — appropriate for child-focused institution)
 * - Two locales: en + ja (multilingual parent audience; no Bengali for this vertical)
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
// School configuration
// ---------------------------------------------------------------------------

const schoolConfig: SiteConfig = {
  site: {
    name: 'Sakura International School',
    tagline: {
      en: 'Growing Together',
      ja: '共に成長する',
    },
    domain: 'sakura-school.jp',
  },

  brand: {
    logoFile: 'logo.svg',
    faviconFile: 'favicon.ico',
    ogImageFile: 'og-image.jpg',
    brandMark: undefined,

    colors: {
      primary: '#d97706',
      secondary: '#b45309',
      accent: '#10b981',
      background: '#fffbf0',
      surface: '#fef3c7',
      text: '#1c1917',
      muted: '#78716c',
      error: '#dc2626',
      success: '#16a34a',
      warning: '#ca8a04',
    },

    typography: {
      // Nunito: rounded, friendly — appropriate for a child-focused institution
      fontSans: 'Nunito',
      fontSerif: undefined,
      fontMono: undefined,
      fontSizeBase: '17px',
      fontWeightHeading: '800',
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
    bookingWidget: false,
    jobListings: false,
    events: true,
    gallery: true,
    testimonials: false,
    downloads: true,
    news: true,
    team: true,
    locations: false,
  },

  nav: {
    legalLinks: [
      { slug: '/privacy', labelKey: 'nav.privacy' },
    ],
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/sakura-school-example' },
      { platform: 'line', url: 'https://line.me/R/ti/p/@sakura-school-example' },
      { platform: 'facebook', url: 'https://facebook.com/sakura-school-example' },
    ],
  },

  contact: {
    email: 'info@sakura-school.jp',
    phone: '+81-3-0000-0001',
    address: {
      en: '2-2 Minato, Minato-ku, Tokyo 105-0001',
      ja: '〒105-0001 東京都港区港2-2',
    },
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=EXAMPLE_SCHOOL_EMBED_ID',
    businessHours: {
      en: 'Mon–Fri 8:30–16:30 (office closed Sat, Sun and national holidays)',
      ja: '月〜金 8:30〜16:30（土日・祝日は事務局休業）',
    },
  },

  forms: {
    contactRecipient: 'office@sakura-school.jp',
    jobApplicationRecipient: undefined,
    appointmentRecipient: undefined,
  },

  legal: {
    privacyPolicySlug: '/privacy',
    termsSlug: undefined,
    cookiePolicySlug: undefined,
  },

  seo: {
    titleTemplate: '%s | Sakura International School',
    defaultDescription: {
      en: 'A nurturing international school in Tokyo. Bilingual education for children ages 3–12.',
      ja: '東京都内のインターナショナルスクール。3〜12歳対象のバイリンガル教育を提供しています。',
    },
    robotsTxt: undefined,
    sitemapIncludeCollections: ['pages', 'news', 'events', 'faqs', 'team', 'gallery'],
  },

  integrations: {
    googleAnalyticsId: 'G-YYYYYYYYYY',
    turnstileSiteKey: process.env['TURNSTILE_SITE_KEY'] ?? '',
    resendFromEmail: 'no-reply@sakura-school.jp',
    bookingProviderUrl: undefined,
    mapsApiKey: undefined,
  },
}

export default schoolConfig
export type { SiteConfig, NavItem, SocialLink, SocialPlatform }
