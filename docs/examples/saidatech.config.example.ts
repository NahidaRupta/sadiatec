/**
 * Example site.config.ts for Saidatech — HR/staffing/visa vertical
 *
 * This file documents what apps/saidatech/site.config.ts will look like in Phase 1.
 * All three example configs (saidatech, clinic, school) satisfy the same SiteConfig
 * interface without modification.
 *
 * The SiteConfig interface is defined inline here for Phase 0.
 * In Phase 1 it moves to: packages/cms-core/src/schema/site-config.ts
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
// Saidatech configuration
// ---------------------------------------------------------------------------

const saidatecConfig: SiteConfig = {
  site: {
    name: 'Saidatech',
    tagline: {
      en: 'Your Career, Our Mission',
      ja: 'あなたのキャリア、私たちの使命',
      bn: 'আপনার ক্যারিয়ার, আমাদের মিশন',
    },
    domain: 'sadiatec.com',
  },

  brand: {
    logoFile: 'logo.svg',
    faviconFile: 'favicon.ico',
    ogImageFile: 'og-image.jpg',
    brandMark: undefined,

    colors: {
      primary: '#1a56db',
      secondary: '#1e40af',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f1f5f9',
      text: '#0f172a',
      muted: '#64748b',
      error: '#dc2626',
      success: '#16a34a',
      warning: '#d97706',
    },

    typography: {
      fontSans: 'Noto Sans JP',
      fontSerif: undefined,
      fontMono: undefined,
      fontSizeBase: '16px',
      fontWeightHeading: '700',
      fontWeightBody: '400',
      // Bengali font only loaded when 'bn' locale is active — protects Lighthouse score
      perLocale: {
        bn: { fontSans: 'Noto Sans Bengali' },
      },
    },
  },

  locales: {
    enabled: ['en', 'ja', 'bn'],
    default: 'ja',
    direction: { en: 'ltr', ja: 'ltr', bn: 'ltr' },
  },

  features: {
    aiAgent: false,
    bookingWidget: false,
    jobListings: true,
    events: false,
    gallery: false,
    testimonials: true,
    downloads: false,
    news: true,
    team: true,
    locations: false,
  },

  nav: {
    legalLinks: [
      { slug: '/privacy', labelKey: 'nav.privacy' },
      { slug: '/terms', labelKey: 'nav.terms' },
    ],
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/company/saidatech' },
    ],
  },

  contact: {
    email: 'info@sadiatec.com',
    phone: undefined,
    address: undefined,
    mapEmbedUrl: undefined,
    businessHours: undefined,
  },

  forms: {
    contactRecipient: 'contact@sadiatec.com',
    jobApplicationRecipient: 'recruit@sadiatec.com',
    appointmentRecipient: undefined,
  },

  legal: {
    privacyPolicySlug: '/privacy',
    termsSlug: '/terms',
    cookiePolicySlug: undefined,
  },

  seo: {
    titleTemplate: '%s | Saidatech',
    defaultDescription: {
      en: 'Saidatech supports foreign workers with career placement and visa services in Japan.',
      ja: 'サイダテックは外国人労働者のキャリア・ビザ支援を提供します。',
      bn: 'সাইদাটেক জাপানে বিদেশী কর্মীদের ক্যারিয়ার ও ভিসা সেবা প্রদান করে।',
    },
    robotsTxt: undefined,
    sitemapIncludeCollections: ['pages', 'news', 'services', 'faqs', 'jobs', 'team'],
  },

  integrations: {
    googleAnalyticsId: undefined,
    turnstileSiteKey: process.env['TURNSTILE_SITE_KEY'] ?? '',
    resendFromEmail: 'no-reply@sadiatec.com',
    bookingProviderUrl: undefined,
    mapsApiKey: undefined,
  },
}

export default saidatecConfig
export type { SiteConfig, NavItem, SocialLink, SocialPlatform }
