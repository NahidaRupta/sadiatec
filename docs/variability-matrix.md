# Variability Matrix

Every client-customizable variable in the template. All three example columns must
reflect a realistic, coherent configuration for that vertical — not placeholders.

**Home column key:**
- `site.config` — TypeScript value in `apps/<client>/site.config.ts`
- `seed` — Payload admin content set by `apps/<client>/seed/`
- `/public/brand` — Static file asset in `apps/<client>/public/brand/`
- `env-var` — Environment variable set in Vercel project settings

---

## 1. Brand Identity

| # | Variable | Home | Type | Saidatech default | Clinic example | School example | Code dependencies |
|---|---------|------|------|-------------------|----------------|----------------|-------------------|
| 1 | `site.name` | site.config | `string` | `"Saidatech"` | `"Sakura Dental Clinic"` | `"Sakura International School"` | `<title>`, OG tags, footer copyright |
| 2 | `site.tagline` | site.config | `Record<string,string>` | `{ en: "Your Career, Our Mission", ja: "あなたのキャリア、私たちの使命", bn: "আপনার ক্যারিয়ার, আমাদের মিশন" }` | `{ en: "Gentle Care, Healthy Smiles", ja: "優しいケア、健康な笑顔" }` | `{ en: "Growing Together", ja: "共に成長する" }` | Hero block, metadata description fallback |
| 3 | `site.domain` | site.config | `string` | `"sadiatec.com"` | `"sakura-dental.jp"` | `"sakura-school.jp"` | Canonical URLs, sitemap baseUrl, OG URL |
| 4 | `brand.logoFile` | /public/brand | `string` (filename) | `"logo.svg"` | `"logo.svg"` | `"logo.svg"` | `<Header>`, `<Footer>`, OG image fallback |
| 5 | `brand.faviconFile` | /public/brand | `string` (filename) | `"favicon.ico"` | `"favicon.ico"` | `"favicon.ico"` | `app/layout.tsx` metadata icons |
| 6 | `brand.ogImageFile` | /public/brand | `string` (filename) | `"og-image.jpg"` | `"og-image.jpg"` | `"og-image.jpg"` | Default OG image when page has no hero |
| 7 | `brand.brandMark` | /public/brand | `string \| undefined` | `undefined` | `"brandmark.svg"` | `undefined` | Optional standalone icon used in favicon-32 slot |

---

## 2. Colors

All color values are CSS custom property values (hex or oklch). Injected into `:root`
via a generated CSS file at build time. Components reference `--color-primary` etc. —
never hardcoded hex values.

| # | Variable | Home | Type | Saidatech default | Clinic example | School example | Code dependencies |
|---|---------|------|------|-------------------|----------------|----------------|-------------------|
| 8 | `brand.colors.primary` | site.config | `string` (CSS color) | `"#1a56db"` | `"#0f7d6e"` | `"#d97706"` | Buttons, links, active nav, focus rings |
| 9 | `brand.colors.secondary` | site.config | `string` | `"#1e40af"` | `"#065f50"` | `"#b45309"` | Secondary buttons, badges |
| 10 | `brand.colors.accent` | site.config | `string` | `"#f59e0b"` | `"#f0a500"` | `"#10b981"` | Highlights, tags, callout borders |
| 11 | `brand.colors.background` | site.config | `string` | `"#ffffff"` | `"#f8fffe"` | `"#fffbf0"` | Page background |
| 12 | `brand.colors.surface` | site.config | `string` | `"#f1f5f9"` | `"#e6f7f5"` | `"#fef3c7"` | Card backgrounds, sidebar panels |
| 13 | `brand.colors.text` | site.config | `string` | `"#0f172a"` | `"#0d2b2a"` | `"#1c1917"` | Body text |
| 14 | `brand.colors.muted` | site.config | `string` | `"#64748b"` | `"#4b7a76"` | `"#78716c"` | Secondary text, placeholders, captions |
| 15 | `brand.colors.error` | site.config | `string` | `"#dc2626"` | `"#b91c1c"` | `"#dc2626"` | Form validation errors, alert banners |
| 16 | `brand.colors.success` | site.config | `string` | `"#16a34a"` | `"#15803d"` | `"#16a34a"` | Form success states, confirmation banners |
| 17 | `brand.colors.warning` | site.config | `string` | `"#d97706"` | `"#b45309"` | `"#ca8a04"` | Warning banners, non-critical alerts |

---

## 3. Typography

Font names must be valid Google Fonts slugs or system font stack strings. Used to
construct `<link>` preload tags in `app/layout.tsx`.

| # | Variable | Home | Type | Saidatech default | Clinic example | School example | Code dependencies |
|---|---------|------|------|-------------------|----------------|----------------|-------------------|
| 18 | `brand.typography.fontSans` | site.config | `string` | `"Noto Sans JP"` | `"Noto Sans JP"` | `"Nunito"` | Body text, UI labels, nav items |
| 19 | `brand.typography.fontSerif` | site.config | `string \| undefined` | `undefined` | `"Noto Serif JP"` | `undefined` | Headings when serif feel desired |
| 20 | `brand.typography.fontMono` | site.config | `string \| undefined` | `undefined` | `undefined` | `undefined` | Code blocks (rarely used in marketing sites) |
| 21 | `brand.typography.fontSizeBase` | site.config | `string` | `"16px"` | `"16px"` | `"17px"` | CSS `font-size` on `<html>`; all rem values derive from this |
| 22 | `brand.typography.fontWeightHeading` | site.config | `string` | `"700"` | `"600"` | `"800"` | `font-weight` for `h1`–`h4` |
| 23 | `brand.typography.fontWeightBody` | site.config | `string` | `"400"` | `"400"` | `"400"` | `font-weight` for `<p>` and `<li>` |
| 24 | `brand.typography.perLocale` | site.config | `Record<string,{fontSans?:string;fontSerif?:string}> \| undefined` | `{ bn: { fontSans: "Noto Sans Bengali" } }` | `undefined` | `undefined` | Locale-gated `<link>` preload; only loads when that locale is active |

---

## 4. Locales

| # | Variable | Home | Type | Saidatech default | Clinic example | School example | Code dependencies |
|---|---------|------|------|-------------------|----------------|----------------|-------------------|
| 25 | `locales.enabled` | site.config | `string[]` | `["en", "ja", "bn"]` | `["en", "ja"]` | `["en", "ja"]` | Payload `localization.locales`, next-intl `defineRouting`, font preload |
| 26 | `locales.default` | site.config | `string` | `"ja"` | `"ja"` | `"ja"` | Payload `defaultLocale`, next-intl `defaultLocale`, OG locale meta |
| 27 | `locales.direction` | site.config | `Record<string,"ltr"\|"rtl">` | `{ en: "ltr", ja: "ltr", bn: "ltr" }` | `{ en: "ltr", ja: "ltr" }` | `{ en: "ltr", ja: "ltr" }` | `<html dir="">` attribute in layout |
| 28 | Per-locale typography override | site.config | (see row 24) | `{ bn: { fontSans: "Noto Sans Bengali" } }` | `undefined` | `undefined` | Cross-references row 24; listed here to show locale relationship |

---

## 5. Feature Flags

Feature flags gate both Payload collection registration and frontend routes/components.
A `false` flag means: collection not registered, nav item absent, route returns 404.

| # | Variable | Home | Type | Saidatech default | Clinic example | School example | Code dependencies |
|---|---------|------|------|-------------------|----------------|----------------|-------------------|
| 29 | `features.aiAgent` | site.config | `boolean` | `false` | `false` | `false` | `/api/ai/corpus`, `/api/ai/query` stub handlers (ADR-003) |
| 30 | `features.bookingWidget` | site.config | `boolean` | `false` | `true` | `false` | Booking CTA in hero, contact page booking section, `integrations.bookingProviderUrl` required |
| 31 | `features.jobListings` | site.config | `boolean` | `true` | `false` | `false` | Jobs collection, `/jobs` route, jobs nav item |
| 32 | `features.events` | site.config | `boolean` | `false` | `false` | `true` | Events collection, `/events` route, events nav item, calendar block |
| 33 | `features.gallery` | site.config | `boolean` | `false` | `true` | `true` | Gallery collection, `/gallery` route, gallery block |
| 34 | `features.testimonials` | site.config | `boolean` | `true` | `true` | `false` | Testimonials collection, testimonials block on homepage |
| 35 | `features.downloads` | site.config | `boolean` | `false` | `true` | `true` | Downloads collection, `/downloads` route, downloads block |
| 36 | `features.news` | site.config | `boolean` | `true` | `true` | `true` | News collection, `/news` route, news block, RSS feed |
| 37 | `features.team` | site.config | `boolean` | `true` | `true` | `true` | Team collection, `/team` route, team block |
| 38 | `features.locations` | site.config | `boolean` | `false` | `true` | `false` | Locations collection, `/locations` route, hours block, map embed |
| 38a | `features.seminars` | site.config | `boolean` | `true` | `false` | `false` | Seminars collection, `/seminars` route, seminars nav item (Phase 2 addition — HR/placement agencies) |

---

## 6. Optional Collections

Each row maps a feature flag to its Payload collection registration. Separate from
Section 5 because "Home" and "Code dependencies" differ — collection registration is
Payload config, not frontend routing.

| # | Collection | Home | Type | Saidatech | Clinic | School | Code dependencies |
|---|-----------|------|------|-----------|--------|--------|-------------------|
| 39 | Testimonials | site.config (`features.testimonials`) | `boolean` | `true` | `true` | `false` | Registered in `buildCmsConfig` only when `true`; controls Payload admin sidebar |
| 40 | Events | site.config (`features.events`) | `boolean` | `false` | `false` | `true` | Events collection + calendar block registered when `true` |
| 41 | Gallery | site.config (`features.gallery`) | `boolean` | `false` | `true` | `true` | Gallery collection + gallery block registered when `true` |
| 42 | Downloads | site.config (`features.downloads`) | `boolean` | `false` | `true` | `true` | Downloads collection registered when `true` |
| 43 | Jobs | site.config (`features.jobListings`) | `boolean` | `true` | `false` | `false` | Jobs collection + `/jobs` API route registered when `true` |
| 44 | FAQs | always on | always on | always on | always on | always on | Always registered; primary AI corpus source (ADR-003) |
| 44a | Seminars | site.config (`features.seminars`) | `boolean` | `true` | `false` | `false` | Seminars collection + `/seminars` route registered when `true` (Phase 2 addition) |

---

## 7. Navigation

Navigation structure is seed data authored in Payload admin. The slugs in seed must
match the routes generated by the frontend.

| # | Variable | Home | Type | Saidatech default | Clinic example | School example | Code dependencies |
|---|---------|------|------|-------------------|----------------|----------------|-------------------|
| 45 | Primary nav items | seed | `NavItem[]` | Services, Jobs, About, News, Contact | Services, Treatments, About, Gallery, Book Now | About, Programs, Events, Gallery, Contact | `<Header>` component, mobile menu drawer |
| 46 | Footer nav items | seed | `NavItem[]` | Services, Jobs, FAQ, Privacy, Terms | Services, Treatments, FAQ, Privacy | Programs, Events, FAQ, Privacy | `<Footer>` component |
| 47 | `nav.legalLinks` | site.config | `Array<{slug:string;labelKey:string}>` | `[{slug:"/privacy",labelKey:"nav.privacy"},{slug:"/terms",labelKey:"nav.terms"}]` | `[{slug:"/privacy",labelKey:"nav.privacy"},{slug:"/terms",labelKey:"nav.terms"}]` | `[{slug:"/privacy",labelKey:"nav.privacy"}]` | Footer legal links row |
| 48 | `nav.socialLinks` | site.config | `SocialLink[]` | `[{platform:"linkedin",url:"https://linkedin.com/company/saidatech"}]` | `[{platform:"line",url:"https://line.me/R/ti/p/@clinic-example"}]` | `[{platform:"instagram",url:"https://instagram.com/school-example"}]` | Footer social icons, schema.org sameAs |

---

## 8. Contact

| # | Variable | Home | Type | Saidatech default | Clinic example | School example | Code dependencies |
|---|---------|------|------|-------------------|----------------|----------------|-------------------|
| 49 | `contact.email` | site.config | `string` | `"info@sadiatec.com"` | `"info@sakura-dental.jp"` | `"info@sakura-school.jp"` | Contact page, footer, mailto links, form Reply-To |
| 50 | `contact.phone` | site.config | `string \| undefined` | `undefined` | `"+81-3-0000-0000"` | `"+81-3-0000-0001"` | Contact page, footer, click-to-call link |
| 51 | `contact.address` | site.config | `Record<string,string> \| undefined` | `undefined` | `{ en: "1-1 Chiyoda, Tokyo 100-0001", ja: "〒100-0001 東京都千代田区千代田1-1" }` | `{ en: "2-2 Minato, Tokyo 105-0001", ja: "〒105-0001 東京都港区港2-2" }` | Contact page address, footer, schema.org LocalBusiness |
| 52 | `contact.mapEmbedUrl` | site.config | `string \| undefined` | `undefined` | `"https://www.google.com/maps/embed?pb=EXAMPLE_CLINIC"` | `"https://www.google.com/maps/embed?pb=EXAMPLE_SCHOOL"` | Contact page map iframe |
| 53 | `contact.businessHours` | site.config | `Record<string,string> \| undefined` | `undefined` | `{ en: "Mon–Sat 9:00–18:00, closed Sun", ja: "月〜土 9:00〜18:00、日曜定休" }` | `{ en: "Mon–Fri 8:30–16:30", ja: "月〜金 8:30〜16:30" }` | Contact page hours section, locations block |

---

## 9. Form Recipients

| # | Variable | Home | Type | Saidatech default | Clinic example | School example | Code dependencies |
|---|---------|------|------|-------------------|----------------|----------------|-------------------|
| 54 | `forms.contactRecipient` | site.config | `string` | `"contact@sadiatec.com"` | `"reception@sakura-dental.jp"` | `"office@sakura-school.jp"` | Resend `to:` for contact form submissions |
| 55 | `forms.jobApplicationRecipient` | site.config | `string \| undefined` | `"recruit@sadiatec.com"` | `undefined` | `undefined` | Resend `to:` for job application form; required when `features.jobListings: true` |
| 56 | `forms.appointmentRecipient` | site.config | `string \| undefined` | `undefined` | `"appointments@sakura-dental.jp"` | `undefined` | Resend `to:` for appointment form; required when `features.bookingWidget: true` |

---

## 10. Legal Pages

Legal page slugs reference Payload Pages documents authored in seed. The `site.config`
values tell the template which slug to use in footer links and cookie banners.

| # | Variable | Home | Type | Saidatech default | Clinic example | School example | Code dependencies |
|---|---------|------|------|-------------------|----------------|----------------|-------------------|
| 57 | `legal.privacyPolicySlug` | site.config | `string` | `"/privacy"` | `"/privacy"` | `"/privacy"` | Footer legal link, cookie consent banner "Privacy Policy" link |
| 58 | `legal.termsSlug` | site.config | `string \| undefined` | `"/terms"` | `"/terms"` | `undefined` | Footer legal link; omitted from nav when `undefined` |
| 59 | `legal.cookiePolicySlug` | site.config | `string \| undefined` | `undefined` | `"/cookie-policy"` | `undefined` | Cookie consent banner "Learn more" link |

---

## 11. SEO Defaults

| # | Variable | Home | Type | Saidatech default | Clinic example | School example | Code dependencies |
|---|---------|------|------|-------------------|----------------|----------------|-------------------|
| 60 | `seo.titleTemplate` | site.config | `string` | `"%s \| Saidatech"` | `"%s \| Sakura Dental Clinic"` | `"%s \| Sakura International School"` | Next.js metadata `title.template` |
| 61 | `seo.defaultDescription` | site.config | `Record<string,string>` | `{ en: "Saidatech supports foreign workers with career and visa services in Japan.", ja: "サイダテックは外国人労働者のキャリア・ビザ支援を提供します。", bn: "সাইদাটেক জাপানে বিদেশী কর্মীদের ক্যারিয়ার ও ভিসা সেবা প্রদান করে।" }` | `{ en: "Gentle dental care in central Tokyo.", ja: "東京都内で丁寧な歯科診療を提供しています。" }` | `{ en: "A nurturing international school.", ja: "国際的な教育環境を提供する学校です。" }` | Default `<meta name="description">` when page has no excerpt |
| 62 | `seo.robotsTxt` | site.config | `string \| undefined` | `undefined` | `"User-agent: *\nDisallow: /admin\nAllow: /"` | `undefined` | `app/robots.ts`; when defined overrides Next.js default |
| 63 | `seo.sitemapIncludeCollections` | site.config | `string[]` | `["pages","news","services","faqs","jobs","team"]` | `["pages","news","services","faqs","team","gallery"]` | `["pages","news","events","faqs","team","gallery"]` | `app/sitemap.ts` — controls which collections generate sitemap entries |

---

## 12. Integrations

| # | Variable | Home | Type | Saidatech default | Clinic example | School example | Code dependencies |
|---|---------|------|------|-------------------|----------------|----------------|-------------------|
| 64 | `integrations.googleAnalyticsId` | site.config | `string \| undefined` | `undefined` | `"G-XXXXXXXXXX"` | `"G-YYYYYYYYYY"` | `<GoogleAnalytics>` in layout; omitted when `undefined` |
| 65 | `integrations.turnstileSiteKey` | env-var | `string` | `process.env.TURNSTILE_SITE_KEY` | `process.env.TURNSTILE_SITE_KEY` | `process.env.TURNSTILE_SITE_KEY` | Contact form, job application form, appointment form |
| 66 | `integrations.resendFromEmail` | site.config | `string` | `"no-reply@sadiatec.com"` | `"no-reply@sakura-dental.jp"` | `"no-reply@sakura-school.jp"` | Resend `from:`; must be a verified Resend domain |
| 67 | `integrations.bookingProviderUrl` | site.config | `string \| undefined` | `undefined` | `"https://booking.example.jp/sakura-dental"` | `undefined` | Booking CTA href; required when `features.bookingWidget: true` |
| 68 | `integrations.mapsApiKey` | env-var | `string \| undefined` | `undefined` | `process.env.GOOGLE_MAPS_API_KEY` | `undefined` | Static map image fallback; optional when embed URL is used |

---

## 13. Social Links

Social links are in `site.config` because they affect schema.org `sameAs`, footer icons,
and OG tags — all code-driven, not content-driven.

| # | Variable | Home | Type | Saidatech default | Clinic example | School example | Code dependencies |
|---|---------|------|------|-------------------|----------------|----------------|-------------------|
| 69 | Twitter / X | site.config | `SocialLink \| undefined` | `undefined` | `undefined` | `undefined` | Footer icon, schema.org sameAs |
| 70 | Facebook | site.config | `SocialLink \| undefined` | `undefined` | `{ platform: "facebook", url: "https://facebook.com/sakura-dental-example" }` | `{ platform: "facebook", url: "https://facebook.com/sakura-school-example" }` | Footer icon, schema.org sameAs |
| 71 | LinkedIn | site.config | `SocialLink \| undefined` | `{ platform: "linkedin", url: "https://linkedin.com/company/saidatech" }` | `undefined` | `undefined` | Footer icon, schema.org sameAs |
| 72 | Instagram | site.config | `SocialLink \| undefined` | `undefined` | `undefined` | `{ platform: "instagram", url: "https://instagram.com/sakura-school-example" }` | Footer icon, schema.org sameAs |
| 73 | LINE | site.config | `SocialLink \| undefined` | `undefined` | `{ platform: "line", url: "https://line.me/R/ti/p/@sakura-dental-example" }` | `{ platform: "line", url: "https://line.me/R/ti/p/@sakura-school-example" }` | Footer icon; LINE is the primary messaging platform in Japan |

---

## Schema Reference

The canonical `SiteConfig` TypeScript interface lives in
`packages/cms-core/src/schema/site-config.ts` (Phase 1). For Phase 0, it is defined
inline in each example config file under `docs/examples/`.

The three example configs (`saidatech.config.example.ts`, `clinic.config.example.ts`,
`school.config.example.ts`) serve as both documentation and type-check targets.

---

## Row Count Summary

| Category | Rows |
|----------|------|
| Brand identity | 7 |
| Colors | 10 |
| Typography | 7 |
| Locales | 4 |
| Feature flags | 10 |
| Optional collections | 6 |
| Navigation | 4 |
| Contact | 5 |
| Form recipients | 3 |
| Legal pages | 3 |
| SEO defaults | 4 |
| Integrations | 5 |
| Social links | 5 |
| **Total** | **73** |
