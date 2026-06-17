import type { SiteConfig } from '@saidatech/cms-core/schema'

const siteConfig: SiteConfig = {
  site: {
    name: 'Saidatec',
    tagline: {
      en: 'Your Career, Our Mission',
      ja: 'あなたのキャリア、私たちの使命',
      bn: 'আপনার ক্যারিয়ার, আমাদের মিশন',
    },
    domain: 'sadiatec.com',
  },

  brand: {
    logoFile: 'Sadiatec_Logo-1-BG3rMlc7.png',
    faviconFile: 'favicon.ico',
    ogImageFile: 'og-image.jpg',
    colors: {
      primary: '#5FA9E6',
      secondary: '#4C87B8',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#F6F6F6',
      text: '#333333',
      muted: '#666666',
      error: '#dc2626',
      success: '#16a34a',
      warning: '#d97706',
    },
    typography: {
      fontSans: 'Lato',
      fontSizeBase: '16px',
      fontWeightHeading: '700',
      fontWeightBody: '400',
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
    seminars: true,
    gallery: false,
    testimonials: true,
    downloads: true,
    news: true,
    team: true,
    locations: false,
    services: true,
    caseStudies: true,
    blog: true,
    company: true,
    recruit: true,
    faq: true,
    contact: true,
    about: true,
  },

  nav: {
    legalLinks: [
      { slug: '/privacy', labelKey: 'nav.privacy' },
      { slug: '/terms', labelKey: 'nav.terms' },
    ],
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/company/saidatec' },
      { platform: 'facebook', url: 'https://facebook.com/company/saidatec' },
      { platform: 'instagram', url: 'https://instagram.com/company/saidatec' },
      { platform: 'youtube', url: 'https://www.youtube.com/@theSADIATEC/featured' },
      { platform: 'twitter', url: 'https://twitter.com/company/saidatec' },
    ],
  },

  contact: {
    email: 'info@sadiatec.com',
  },

  forms: {
    contactRecipient: 'nahida.rahaman37@gmail.com',
    jobApplicationRecipient: 'nahida.rahaman37@gmail.com',
  },

  legal: {
    privacyPolicySlug: '/privacy',
    termsSlug: '/terms',
  },

  seo: {
    titleTemplate: '%s | Saidatech',
    defaultDescription: {
      en: 'Saidatech supports foreign workers with career placement and visa services in Japan.',
      ja: 'サイダテックは外国人労働者のキャリア・ビザ支援を提供します。',
      bn: 'সাইদাটেক জাপানে বিদেশী কর্মীদের ক্যারিয়ার ও ভিসা সেবা প্রদান করে।',
    },
    sitemapIncludeCollections: ['pages', 'news', 'blog', 'services', 'case-studies', 'team', 'seminars', 'company', 'recruit', 'faq', 'contact'],
  },

  integrations: {
    resendFromEmail: 'onboarding@resend.dev',
  },
}

export default siteConfig
