import type { ReactNode } from 'react'

import { HeroBlock } from './hero/component'
import { adaptHeroBlock } from './hero/adapter'
import { StatsBlock } from './stats/component'
import { adaptStatsBlock } from './stats/adapter'
import { ServicesGridBlock } from './services-grid/component'
import { adaptServicesGridBlock } from './services-grid/adapter'
import { BentoGridBlock } from './bento-grid/component'
import { adaptBentoGridBlock } from './bento-grid/adapter'
import { CaseStudyCarouselBlock } from './case-study-carousel/component'
import { adaptCaseStudyCarouselBlock } from './case-study-carousel/adapter'
import { TimelineBlock } from './timeline/component'
import { adaptTimelineBlock } from './timeline/adapter'
import { LogoCloudBlock } from './logo-cloud/component'
import { adaptLogoCloudBlock } from './logo-cloud/adapter'
import { CTABannerBlock } from './cta-banner/component'
import { adaptCTABannerBlock } from './cta-banner/adapter'
import { RichTextBlock } from './rich-text/component'
import { adaptRichTextBlock } from './rich-text/adapter'
import { FAQBlock } from './faq/component'
import { adaptFAQBlock } from './faq/adapter'
import { ContactFormBlock } from './contact-form/component'
import { adaptContactFormBlock } from './contact-form/adapter'
import { TeamGridBlock } from './team-grid/component'
import { adaptTeamGridBlock } from './team-grid/adapter'
import { EventListBlock } from './event-list/component'
import { adaptEventListBlock } from './event-list/adapter'
import { GalleryBlock } from './gallery/component'
import { adaptGalleryBlock } from './gallery/adapter'
import { HoursLocationBlock } from './hours-location/component'
import { adaptHoursLocationBlock } from './hours-location/adapter'

export type BlockRenderer = (raw: unknown) => ReactNode

export const blockRegistry: Record<string, BlockRenderer> = {
  'hero':                (raw) => <HeroBlock               {...adaptHeroBlock(raw)} />,
  'stats':               (raw) => <StatsBlock              {...adaptStatsBlock(raw)} />,
  'services-grid':       (raw) => <ServicesGridBlock       {...adaptServicesGridBlock(raw)} />,
  'bento-grid':          (raw) => <BentoGridBlock          {...adaptBentoGridBlock(raw)} />,
  'case-study-carousel': (raw) => <CaseStudyCarouselBlock  {...adaptCaseStudyCarouselBlock(raw)} />,
  'timeline':            (raw) => <TimelineBlock           {...adaptTimelineBlock(raw)} />,
  'logo-cloud':          (raw) => <LogoCloudBlock          {...adaptLogoCloudBlock(raw)} />,
  'cta-banner':          (raw) => <CTABannerBlock          {...adaptCTABannerBlock(raw)} />,
  'rich-text':           (raw) => <RichTextBlock           {...adaptRichTextBlock(raw)} />,
  'faq':                 (raw) => <FAQBlock                {...adaptFAQBlock(raw)} />,
  'contact-form':        (raw) => <ContactFormBlock        {...adaptContactFormBlock(raw)} />,
  'team-grid':           (raw) => <TeamGridBlock           {...adaptTeamGridBlock(raw)} />,
  'event-list':          (raw) => <EventListBlock          {...adaptEventListBlock(raw)} />,
  'gallery':             (raw) => <GalleryBlock            {...adaptGalleryBlock(raw)} />,
  'hours-location':      (raw) => <HoursLocationBlock      {...adaptHoursLocationBlock(raw)} />,
}
