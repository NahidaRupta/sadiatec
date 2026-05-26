# Component Inventory — Saidatech Template

Non-block shared components. These are structural and presentational components that wrap or
support the block system. They are not configurable via Payload CMS.

All components are brand-agnostic — they read from CSS custom properties (injected by
`ThemeProvider`) or from `site.config`, never from hardcoded hex values or English strings.

---

## Layout shell

### `Header`

Sticky top navigation bar. Renders on every page except `/admin`.

**Reads:** `brand.logoFile`, primary nav items from `Globals → Navigation` (Payload seed),
current locale from next-intl, `locales.enabled`.

**Slots:** Logo (left) · Primary nav links (desktop) · `LanguageSwitcher` · Mobile hamburger button.

**Behaviour:** On homepage with `transparentHeader: true` in HeroBlock, the header renders
with a transparent background that transitions to opaque on scroll. On all other pages, always opaque.

---

### `Footer`

Bottom section on every public page.

**Slots:**
- Logo + tagline (`site.config.site.tagline`)
- Secondary nav links (`Globals → Navigation` footer section from seed)
- Legal links row (`site.config.nav.legalLinks`)
- Social icons row (`site.config.nav.socialLinks`)
- Copyright line (current year + `site.config.site.name`)

---

### `LocaleLayout`

Wraps `app/[locale]/layout.tsx`. Sets `<html lang={locale} dir={direction}>`.
Loads per-locale font via `<link rel="preload">` when `brand.typography.perLocale` has an entry
for the active locale (e.g. Noto Sans Bengali for `/bn/` on Saidatech).
Provides `NextIntlClientProvider`.

---

### `ThemeProvider`

Server component. Generates a `<style>` tag injecting CSS custom properties from
`site.config.brand.colors` and `brand.typography` into `:root`. Runs at layout level — no client JS.

```css
/* Example output for Saidatech */
:root {
  --color-primary: #1a56db;
  --color-secondary: #1e40af;
  --color-accent: #f59e0b;
  --color-background: #ffffff;
  --color-surface: #f1f5f9;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --font-sans: "Noto Sans JP", sans-serif;
  --font-size-base: 16px;
  --font-weight-heading: 700;
}
```

---

### `SeoMeta`

Generates Next.js `metadata` export for each page route. Injects:
- `title` using `seo.titleTemplate` (e.g. `"About | Saidatech"`)
- `description` from page excerpt or `seo.defaultDescription` fallback
- `openGraph.images` — page-specific upload or `/public/brand/{brand.ogImageFile}`
- `alternates.canonical` for the current locale URL
- `alternates.languages` — hreflang map for all `locales.enabled` locales
- `robots` when `seo.robotsTxt` is defined

---

## Navigation

### `LanguageSwitcher`

Renders one toggle button per locale in `locales.enabled`.
Uses next-intl `useRouter().replace` with the current pathname to switch locale.
Label is the locale code in uppercase (`JA`, `EN`, `BN`).
Renders nothing when only one locale is enabled.

---

### `MobileMenuDrawer`

Full-screen slide-in overlay triggered by Header hamburger. Uses `DrawerSlideIn` Framer Motion
pattern (see `06-animation-inventory.md`).

Contents: primary nav links · `LanguageSwitcher` · contact CTA button.

Closes on: route change (via `usePathname` effect) · Escape key · backdrop click.
Locks body scroll (`overflow: hidden` on `<body>`) while open.

---

### `Breadcrumb`

Renders breadcrumb trail from the current route segments.

Outputs:
- Visible breadcrumb links with `aria-label="Breadcrumb"`
- `<script type="application/ld+json">` with `BreadcrumbList` schema.org markup

Home label reads from translation key `nav.home`. Dynamic segment labels read from page title.

---

### `Pagination`

Numbered page links for `NewsIndex`, `JobsIndex`, `Gallery` page templates.

Props: `currentPage`, `totalPages`, `basePath`.
Emits accessible `aria-current="page"` on active item and `aria-label` on prev/next.
Renders nothing when `totalPages <= 1`.

---

## Cards

All cards are presentational. They receive typed props from page templates or block adapters.
They never fetch data.

### `NewsCard`

Props: `title`, `excerpt`, `featuredImage?`, `publishedAt`, `category?`, `slug`, `locale`.
Links to `/{locale}/news/{slug}`.

### `ServiceCard`

Props: `title`, `excerpt`, `thumbnail?`, `icon?`, `slug`, `locale`.
Links to `/{locale}/services/{slug}`.

### `TeamCard`

Props: `name`, `title`, `photo?`, `bio?` (short form), `slug?`, `locale`.
Links to `/{locale}/team/{slug}` when `slug` is defined.
On pages where linking is not wanted (e.g. TeamGridBlock on About), `slug` is omitted.

### `EventCard`

Props: `title`, `startDate`, `location?`, `thumbnail?`, `category?`, `slug`, `locale`.
Links to `/{locale}/events/{slug}`.

### `GalleryCard`

Props: `image`, `alt`, `caption?`, `lightboxId`.
Triggers `GalleryLightbox` animation on click (shared `layoutId` with lightbox image).

### `JobCard`

Props: `title`, `location`, `jobType`, `category?`, `closingDate?`, `slug`, `locale`.
Links to `/{locale}/jobs/{slug}`.

### `DownloadCard`

Props: `title`, `description?`, `fileUrl`, `fileSize?`, `fileType` (extension string), `category?`.
Renders a direct download `<a href>` link. No internal routing.

---

## Forms and interactions

### `TurnstileWidget`

Client-only component (`"use client"`). Renders Cloudflare Turnstile via script embed.
Site key read from `integrations.turnstileSiteKey` (passed as prop from `ContactFormBlock`).
Calls `onSuccess(token: string)` callback on verification.
Resets automatically after failed form submission.

---

### `CookieConsentBanner`

Rendered in `LocaleLayout`. Conditionally present when `legal.cookiePolicySlug` is defined.
Checks `localStorage` for `"cookie-consent"` key. Shows banner if not set.
Buttons: "Accept" (sets key + hides) · "Learn more" (links to `legal.cookiePolicySlug`).
Renders nothing on the server (SSR) — client-only to avoid hydration mismatch.

---

### `SearchBar`

Debounced text input (300ms). Emits `onSearch(query: string)` callback.
Used on `NewsIndex` and `JobsIndex` as a client component.
Updates URL query param `q` on search — allows shareable filtered URLs.

---

## Utility

### `BlockRenderer`

Maps the Payload `blocks` array on a `Pages` document to React block components.
Accepts `blocks: Block[]` (discriminated union of all 15 block types by `blockType` field).
Unknown `blockType` values are silently skipped in production; logged as warnings in development.

---

### `RichTextRenderer`

Serializes Payload Lexical JSON to React elements. Handles:
- Headings (h2–h4), paragraphs, lists (ul/ol), blockquotes
- Inline marks: bold, italic, underline, strikethrough, code
- Links: internal (no `target`) and external (`target="_blank" rel="noopener noreferrer"`)
- Inline images via Payload upload node
- Horizontal rules

Output is React elements via recursive serializer — no `dangerouslySetInnerHTML`.

---

### `ImageWithFallback`

Wraps Next.js `<Image>`. On `onError`, replaces `src` with
`/public/brand/{brand.ogImageFile}` (passed as `fallbackSrc` prop).
Accepts all standard Next.js Image props.

---

### `BackToTop`

Fixed-position button (`position: fixed; bottom: 1.5rem; right: 1.5rem`).
Becomes visible after 400px scroll (via `useScroll` + `useMotionValue`).
Smooth-scrolls to `window.scrollTo({ top: 0, behavior: "smooth" })` on click.
Hidden at viewport widths below 640px.

---

### `SkipToContent`

Visually hidden `<a href="#main-content">` as the first focusable element in `<body>`.
Becomes visible on keyboard focus (`focus:not-sr-only`).
Target: `<main id="main-content">` in each page template.
Required for WCAG 2.2 AA — Success Criterion 2.4.1 (Bypass Blocks).

---

### `ErrorBoundary`

React class component. Wraps the `BlockRenderer` output per page.
Renders a branded fallback on uncaught render errors: heading ("Something went wrong"),
body, and a "Reload page" button (`window.location.reload()`).
Does not expose error details or stack traces in production.

---

### `EmptyState`

Generic "nothing here yet" component for collection pages with no published content.

Props: `heading: string`, `body?: string`, `cta?: { label: string; href: string }`.

Used on: News index (no articles) · Jobs index (no open positions) · Gallery (no images) ·
Events index (no upcoming events) · Downloads (no files).

All string props receive localized values from the calling page template — `EmptyState`
itself contains no hardcoded English.
