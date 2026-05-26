export * from './colors'
export * from './typography'
export * from './spacing'
export * from './breakpoints'
export * from './radii'

import type { CSSProperties } from 'react'
import type { SiteConfig } from '../schema/site-config'

export function buildCssVariables(siteConfig: SiteConfig): CSSProperties {
  const { colors } = siteConfig.brand
  const { typography } = siteConfig.brand

  return {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-background': colors.background,
    '--color-surface': colors.surface,
    '--color-text': colors.text,
    '--color-muted': colors.muted,
    '--color-error': colors.error,
    '--color-success': colors.success,
    '--color-warning': colors.warning,
    '--font-sans': `${typography.fontSans}, system-ui, sans-serif`,
    '--font-serif': `${typography.fontSerif ?? 'Georgia'}, serif`,
    '--font-mono': `${typography.fontMono ?? 'ui-monospace'}, monospace`,
    '--font-size-base': typography.fontSizeBase,
    '--font-weight-heading': typography.fontWeightHeading,
    '--font-weight-body': typography.fontWeightBody,
  } as CSSProperties
}

export function buildLocaleFont(
  locale: string,
  siteConfig: SiteConfig,
): { fontSans?: string | undefined; fontSerif?: string | undefined } | undefined {
  return siteConfig.brand.typography.perLocale?.[locale]
}
