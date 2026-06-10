import type { Block } from 'payload'

import { HeroBlockConfig } from './hero/config'
import { StatsBlockConfig } from './stats/config'
import { ServicesGridBlockConfig } from './services-grid/config'
import { BentoGridBlockConfig } from './bento-grid/config'
import { CaseStudyCarouselBlockConfig } from './case-study-carousel/config'
import { TimelineBlockConfig } from './timeline/config'
import { LogoCloudBlockConfig } from './logo-cloud/config'
import { CTABannerBlockConfig } from './cta-banner/config'
import { RichTextBlockConfig } from './rich-text/config'
import { FAQBlockConfig } from './faq/config'
import { ContactFormBlockConfig } from './contact-form/config'
import { TeamGridBlockConfig } from './team-grid/config'
import { EventListBlockConfig } from './event-list/config'
import { GalleryBlockConfig } from './gallery/config'
import { HoursLocationBlockConfig } from './hours-location/config'
import { CaseStudiesGridBlockConfig } from './case-studies-grid/config'
import { CompanyProfileBlockConfig } from './company-profile/config'
import { ComplianceGridBlockConfig } from './compliance-grid/config'
import { DownloadsGridBlockConfig } from './downloads-grid/config'
import { BlogTeaserBlockConfig } from './blog-teaser/config'
import { NewsListBlockConfig } from './news-list/config'
import { PageHeroBlockConfig } from './page-hero/config'
import { ImageTextSplitBlockConfig } from './image-text-split/config'
import { StatsBarBlockConfig } from './stats-bar/config'
import { CEOMessageBlockConfig } from './ceo-message/config'
import { AffiliatesBlockConfig } from './affiliates/config'
import { BusinessLineListBlockConfig } from './business-line-list/config'
import { GalleryGridBlockConfig } from './gallery-grid/config'
import { HistoryBlockConfig } from './history/config'
import { PlacementStatisticsBlockConfig } from './placement-statistics/config'
import { ContactInfoCardBlockConfig } from './contact-info-card/config'

export const allBlockConfigs: Block[] = [
  HeroBlockConfig,
  StatsBlockConfig,
  ServicesGridBlockConfig,
  BentoGridBlockConfig,
  CaseStudyCarouselBlockConfig,
  TimelineBlockConfig,
  LogoCloudBlockConfig,
  CTABannerBlockConfig,
  RichTextBlockConfig,
  FAQBlockConfig,
  ContactFormBlockConfig,
  TeamGridBlockConfig,
  EventListBlockConfig,
  GalleryBlockConfig,
  HoursLocationBlockConfig,
  CaseStudiesGridBlockConfig,
  CompanyProfileBlockConfig,
  ComplianceGridBlockConfig,
  DownloadsGridBlockConfig,
  BlogTeaserBlockConfig,
  NewsListBlockConfig,
  PageHeroBlockConfig,
  ImageTextSplitBlockConfig,
  StatsBarBlockConfig,
  CEOMessageBlockConfig,
  AffiliatesBlockConfig,
  BusinessLineListBlockConfig,
  GalleryGridBlockConfig,
  HistoryBlockConfig,
  PlacementStatisticsBlockConfig,
  ContactInfoCardBlockConfig,
]

export type { HeroBlockProps, HeroInlineStat, HeroKeywordPill, HeroCta } from './hero/types'
export type { StatsBlockProps, StatItem } from './stats/types'
export type { ServicesGridBlockProps, ServiceItem, ServiceCta, ServicesLayout } from './services-grid/types'
export type { BentoGridBlockProps, BentoGridItem, BentoLayout } from './bento-grid/types'
export type { CaseStudyCarouselBlockProps } from './case-study-carousel/types'
export type { TimelineBlockProps } from './timeline/types'
export type { LogoCloudBlockProps, LogoItem, ScrollSpeed } from './logo-cloud/types'
export type { CTABannerBlockProps, CTABannerCta, CTABannerVariant, CTABannerBackgroundStyle, CTABannerButtonVariant, CTABannerLayout } from './cta-banner/types'
export type { RichTextBlockProps } from './rich-text/types'
export type { FAQBlockProps } from './faq/types'
export type { ContactFormBlockProps } from './contact-form/types'
export type { TeamGridBlockProps } from './team-grid/types'
export type { EventListBlockProps } from './event-list/types'
export type { GalleryBlockProps } from './gallery/types'
export type { HoursLocationBlockProps } from './hours-location/types'
export type { CaseStudiesGridBlockProps, CaseStudyCardItem, CaseStudiesLayout } from './case-studies-grid/types'
export type { CompanyProfileBlockProps, CompanyProfileRow, CompanyProfileCta } from './company-profile/types'
export type { ComplianceGridBlockProps, LicenseCard, ComplianceIcon } from './compliance-grid/types'
export type { DownloadsGridBlockProps, DownloadItem } from './downloads-grid/types'
export type { BlogTeaserBlockProps, BlogPostTeaser } from './blog-teaser/types'
export type { NewsListBlockProps, NewsItem } from './news-list/types'
export type { PageHeroBlockProps, PageHeroBreadcrumbItem, PageHeroProfileCard, PageHeroProfileCardRow } from './page-hero/types'
export type { ImageTextSplitBlockProps } from './image-text-split/types'
export type { StatsBarBlockProps, StatsBarItem } from './stats-bar/types'
export type { CEOMessageBlockProps } from './ceo-message/types'
export type { AffiliatesBlockProps, AffiliateItem } from './affiliates/types'
export type { BusinessLineListBlockProps, BusinessLineItem, BusinessLineFeature } from './business-line-list/types'
export type { GalleryGridBlockProps, GalleryCategory, GalleryImageItem } from './gallery-grid/types'
export type { HistoryBlockProps, HistoryEntry } from './history/types'
export type { PlacementStatisticsBlockProps, IndustrySlice, RegionBar } from './placement-statistics/types'
export type { ContactInfoCardBlockProps } from './contact-info-card/types'

export { HeroBlock } from './hero/component'
export { RichTextBlock } from './rich-text/component'
export { StatsBlock } from './stats/component'
export { CTABannerBlock } from './cta-banner/component'
export { PageHeroBlock } from './page-hero/component'
export { ImageTextSplitBlock } from './image-text-split/component'
export { StatsBarBlock } from './stats-bar/component'
export { CEOMessageBlock } from './ceo-message/component'
export { AffiliatesBlock } from './affiliates/component'
export { BusinessLineListBlock } from './business-line-list/component'
export { GalleryGridBlock } from './gallery-grid/component'
export { HistoryBlock } from './history/component'
export { PlacementStatisticsBlock } from './placement-statistics/component'
export { ContactInfoCardBlock } from './contact-info-card/component'

export { blockRegistry } from './registry'
export type { BlockRenderer } from './registry'
