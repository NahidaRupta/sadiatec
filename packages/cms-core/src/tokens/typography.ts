export const typeScale = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
} as const

export const localeLineHeights: Record<string, string> = {
  bn: "1.7",
  ja: "1.6",
  en: "1.5",
}

export const localeFontFeatureSettings: Record<string, string> = {
  ja: '"palt"',
}

export function getLocaleTypographyVars(locale: string): Record<string, string> {
  const vars: Record<string, string> = {}
  const lineHeight = localeLineHeights[locale]
  if (lineHeight !== undefined) vars["--locale-line-height"] = lineHeight
  const fontFeatures = localeFontFeatureSettings[locale]
  if (fontFeatures !== undefined) vars["--locale-font-feature-settings"] = fontFeatures
  return vars
}
