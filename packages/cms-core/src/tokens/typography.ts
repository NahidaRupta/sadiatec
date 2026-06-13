/**
 * TYPOGRAPHY TOKENS — SINGLE SOURCE OF TRUTH
 * ───────────────────────────────────────────
 * To rebrand for a new client:
 * 1. Change fontFamily values
 * 2. Adjust scale and tracking as needed
 * 3. Propagates via globals.css and buildCssVariables()
 *
 * Current client: Sadiatec (sadiatec.com)
 * Reference font: g-gates.com — extracted via CSS inspection
 * g-gates stack: Lato, "Noto Sans JP", "ヒラギノ角ゴ ProN", ... sans-serif
 */

// ─── FONT FAMILIES ──────────────────────────────────────────────────────────
export const fontFamilies = {
  // Latin/English — matches g-gates.com primary font (loaded via next/font/google)
  latin: 'Lato',
  // Japanese — matches g-gates.com secondary font
  jp: '"Noto Sans JP", "ヒラギノ角ゴ ProN", "Hiragino Kaku Gothic ProN", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic"',
  // Bengali
  bn: '"Noto Sans Bengali"',
  // Monospace (code)
  mono: '"JetBrains Mono", "Fira Code", ui-monospace',
} as const

// ─── FONT WEIGHTS ────────────────────────────────────────────────────────────
export const fontWeights = {
  light:  '300',
  normal: '400',
  medium: '600',
  bold:   '700',
} as const

// ─── TYPE SCALE (matches g-gates.com heading sizes) ──────────────────────────
export const typeScale = {
  xs:    '0.75rem',   // 12px
  sm:    '0.875rem',  // 14px
  base:  '1rem',      // 16px — body
  lg:    '1.125rem',  // 18px — h6
  xl:    '1.25rem',   // 20px
  '2xl': '1.5rem',    // 24px — h3
  '3xl': '1.75rem',   // 28px — h2 (g-gates: 1.75rem)
  '4xl': '2rem',      // 32px — h1 (g-gates: 2rem)
  '5xl': '2.25rem',   // 36px
  '6xl': '3rem',      // 48px
} as const

// ─── LETTER SPACING (from g-gates CSS inspection) ────────────────────────────
export const letterSpacing = {
  // headings: default (g-gates sets no explicit tracking on h1-h6)
  normal:  '0em',
  // body text: g-gates uses 0.03em globally
  body:    '0.03em',
  // eyebrow / section labels: g-gates uses 2px ≈ 0.125em at 16px base
  eyebrow: '0.125em',
  // wide: for all-caps utility labels
  wide:    '0.1em',
} as const

// ─── LINE HEIGHTS (from g-gates --vk-line-height-low and body defaults) ──────
export const lineHeights = {
  // headings — g-gates uses 1.5em for all h1–h6
  heading: '1.5',
  // snug
  snug:    '1.375',
  // body — standard comfortable reading
  body:    '1.75',
  // Japanese body — g-gates :lang(ja) effectively gets ~1.6
  jp:      '1.6',
} as const

// ─── LOCALE LINE HEIGHTS (per-locale overrides applied in globals.css) ────────
export const localeLineHeights: Record<string, string> = {
  bn: '1.7',
  ja: lineHeights.jp,
  en: lineHeights.body,
}

export const localeFontFeatureSettings: Record<string, string> = {
  ja: '"palt"',
}

export function getLocaleTypographyVars(locale: string): Record<string, string> {
  const vars: Record<string, string> = {}
  const lineHeight = localeLineHeights[locale]
  if (lineHeight !== undefined) vars['--locale-line-height'] = lineHeight
  const fontFeatures = localeFontFeatureSettings[locale]
  if (fontFeatures !== undefined) vars['--locale-font-feature-settings'] = fontFeatures
  return vars
}
