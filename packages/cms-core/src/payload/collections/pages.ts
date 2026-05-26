import { safeRevalidateTag as revalidateTag } from '../lib/revalidate'
import type { Block, CollectionConfig } from 'payload'
import type { SiteConfig } from '../../schema/site-config'
import { aiVisibleField } from '../fields/ai-visible'
import { slugField } from '../fields/slug'
import { HeroBlockConfig } from '../../blocks/hero/config'
import { StatsBlockConfig } from '../../blocks/stats/config'
import { ServicesGridBlockConfig } from '../../blocks/services-grid/config'
import { BentoGridBlockConfig } from '../../blocks/bento-grid/config'
import { CaseStudyCarouselBlockConfig } from '../../blocks/case-study-carousel/config'
import { TimelineBlockConfig } from '../../blocks/timeline/config'
import { LogoCloudBlockConfig } from '../../blocks/logo-cloud/config'
import { CTABannerBlockConfig } from '../../blocks/cta-banner/config'
import { RichTextBlockConfig } from '../../blocks/rich-text/config'
import { FAQBlockConfig } from '../../blocks/faq/config'
import { ContactFormBlockConfig } from '../../blocks/contact-form/config'
import { TeamGridBlockConfig } from '../../blocks/team-grid/config'
import { EventListBlockConfig } from '../../blocks/event-list/config'
import { GalleryBlockConfig } from '../../blocks/gallery/config'
import { HoursLocationBlockConfig } from '../../blocks/hours-location/config'

function buildAvailableBlocks(siteConfig: SiteConfig): Block[] {
  return [
    HeroBlockConfig,
    StatsBlockConfig,
    ServicesGridBlockConfig,
    BentoGridBlockConfig,
    ...(siteConfig.features.testimonials ? [CaseStudyCarouselBlockConfig] : []),
    TimelineBlockConfig,
    LogoCloudBlockConfig,
    CTABannerBlockConfig,
    RichTextBlockConfig,
    FAQBlockConfig,
    ContactFormBlockConfig,
    ...(siteConfig.features.team ? [TeamGridBlockConfig] : []),
    ...(siteConfig.features.events ? [EventListBlockConfig] : []),
    ...(siteConfig.features.gallery ? [GalleryBlockConfig] : []),
    ...(siteConfig.features.locations ? [HoursLocationBlockConfig] : []),
  ]
}

export function PagesCollection(siteConfig: SiteConfig): CollectionConfig {
  return {
    slug: 'pages',
    labels: { singular: 'Page', plural: 'Pages' },
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'slug', 'updatedAt'],
      preview: (doc) => {
        const base = process.env['NEXT_PUBLIC_SERVER_URL'] ?? 'http://localhost:3000'
        return `${base}/${String(doc['slug'] ?? '')}`
      },
    },
    hooks: { afterChange: [() => { revalidateTag('pages') }] },
    fields: [
      { name: 'title', type: 'text', localized: true, required: true },
      slugField,
      {
        name: 'layout',
        type: 'blocks',
        blocks: buildAvailableBlocks(siteConfig),
      },
      {
        name: 'meta',
        type: 'group',
        label: 'SEO',
        fields: [
          { name: 'title', type: 'text', localized: true },
          { name: 'description', type: 'textarea', localized: true },
          { name: 'image', type: 'upload', relationTo: 'media' },
        ],
      },
      aiVisibleField,
    ],
  }
}
