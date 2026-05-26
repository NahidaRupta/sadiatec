# Asset Inventory — Saidatech Template

Covers icons, illustrations, photography specifications, and the placeholder strategy
for unbranded clone deployments.

---

## Icons

**Library:** [Lucide React](https://lucide.dev) — MIT license, tree-shakeable via named imports.

```ts
import { Briefcase, GraduationCap, HeartPulse } from "lucide-react"
```

No icon sprite or global registration. Unused icons are excluded from the build by Next.js
tree-shaking. Default size: `size={20}` (1.25rem), overridden per context.

### Core UI icons across all verticals

| Context | Lucide icon |
|---------|------------|
| Navigation hamburger open | `Menu` |
| Navigation hamburger close | `X` |
| Language switcher | `Globe` |
| Breadcrumb separator | `ChevronRight` |
| Pagination previous | `ChevronLeft` |
| Pagination next | `ChevronRight` |
| Back to top | `ArrowUp` |
| External link indicator | `ExternalLink` |
| Download action | `Download` |
| File (generic) | `File` |
| File PDF | `FileText` |
| File spreadsheet | `FileSpreadsheet` |
| Email / contact | `Mail` |
| Phone | `Phone` |
| Map location pin | `MapPin` |
| Business hours clock | `Clock` |
| Calendar / date | `Calendar` |
| Search input | `Search` |
| Dismiss / close | `X` |
| FAQ accordion chevron | `ChevronDown` |
| Testimonial rating star | `Star` |
| Alert / warning | `AlertTriangle` |
| Success / confirmation | `CheckCircle` |
| Social: LinkedIn | `Linkedin` |
| Social: Facebook | `Facebook` |
| Social: Instagram | `Instagram` |
| Social: YouTube | `Youtube` |
| Social: Twitter / X | `Twitter` |

### LINE icon (custom)

Lucide does not include LINE. A custom SVG is placed at `/public/icons/social/line.svg`.
Dimensions: 24×24, `viewBox="0 0 24 24"`. The `Footer` and `MobileMenuDrawer` components
reference it via `<img src="/icons/social/line.svg" alt="LINE" width={24} height={24} />`.

### Service category icons (custom per client)

Per-client SVGs in `/public/icons/services/` override the Lucide fallbacks assigned in seed data.
The template ships with Lucide fallback assignments:

| Service category | Lucide fallback |
|-----------------|----------------|
| HR / Recruitment | `Briefcase` |
| Language training | `BookOpen` |
| Visa / immigration | `FileCheck` |
| Medical / dental | `HeartPulse` |
| Education / school | `GraduationCap` |
| Telecommunications | `Wifi` |
| Export / import | `Package` |
| Downloads / documents | `FolderOpen` |

---

## Illustrations

**Default:** No illustrations committed to the template repository.

The template ships with blank placeholder SVG files using CSS custom property colors
so they adapt to the vertical palette without client assets:

```svg
<!-- /public/brand/illustrations/hero.svg — shipped placeholder -->
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" rx="12" fill="var(--color-surface)"/>
  <text x="400" y="310" text-anchor="middle" fill="var(--color-muted)"
        font-family="sans-serif" font-size="16">Replace with brand illustration</text>
</svg>
```

### Illustration slots

| Slot | File path | Dimensions | Used on |
|------|-----------|-----------|---------|
| Hero illustration | `/public/brand/illustrations/hero.svg` | 800×600 | HeroBlock `"split"` variant |
| About illustration | `/public/brand/illustrations/about.svg` | 600×400 | About — alongside RichTextBlock |
| Empty state | `/public/brand/illustrations/empty.svg` | 400×300 | `EmptyState` component |
| Contact sidebar | `/public/brand/illustrations/contact.svg` | 400×400 | Contact page sidebar |

---

## Photography

All photography is client-supplied and stored in Cloudflare R2 via Payload's media upload.
No stock photography is committed to the repository or referenced in seed data.

### Categories and specifications

| Category | Recommended dimensions | Aspect ratio | Format | Storage | Notes |
|----------|----------------------|-------------|--------|---------|-------|
| Hero background | 1920×1080 | 16:9 | WebP + AVIF (Next.js optimises) | R2 via Payload | Store focal point in Payload `focalX`, `focalY` fields |
| Team portrait | 600×600 | 1:1 | WebP | R2 | Square crop required; face centred in upper half |
| Service thumbnail | 800×600 | 4:3 | WebP | R2 | CSS `aspect-ratio: 4/3` enforces ratio on render |
| Gallery item | 1200×900 | 4:3 | WebP | R2 | Lightbox serves full resolution |
| News featured image | 1200×630 | 1.91:1 | WebP | R2 | OG-compliant dimensions |
| Case study / testimonial | 800×600 or 600×600 | 4:3 or 1:1 | WebP | R2 | Square avatar crop also accepted |
| Partner logo — light variant | 400×200 | 2:1 | SVG preferred; PNG transparent fallback | R2 | For display on dark backgrounds |
| Partner logo — dark variant | 400×200 | 2:1 | SVG preferred; PNG transparent fallback | R2 | For display on light backgrounds |
| Default OG image | 1200×630 | 1.91:1 | JPG | `/public/brand/og-image.jpg` | Static; not in R2 |
| Favicon (browser tab) | 32×32 | 1:1 | ICO | `/public/brand/favicon.ico` | |
| Apple touch icon | 180×180 | 1:1 | PNG | `/public/brand/apple-touch-icon.png` | |

### Next.js `<Image>` sizing configuration

Sizes are configured per context to minimise bytes on smaller viewports:

| Context | `sizes` value |
|---------|--------------|
| Hero background | `100vw` |
| Service card thumbnail | `(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw` |
| Team card portrait | `(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw` |
| Gallery card | `(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw` |
| News card thumbnail | `(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw` |
| OG image (never rendered in `<Image>`) | — |

All hero images use `priority` (Next.js). All below-fold images use `loading="lazy"` (default).

---

## `/public/brand/` directory structure

Each client deployment (`apps/<client-name>`) has its own `/public/brand/` directory.

```
apps/<client-name>/public/brand/
├── logo.svg                     Required — masthead logo, full lockup
├── favicon.ico                  Required — browser tab icon (32×32)
├── apple-touch-icon.png         Required — 180×180 for iOS home screen
├── og-image.jpg                 Required — 1200×630 default social share image
├── brandmark.svg                Optional — standalone icon (e.g. tooth symbol for clinic)
└── illustrations/
    ├── hero.svg                 Optional — HeroBlock "split" variant illustration
    ├── about.svg                Optional
    ├── contact.svg              Optional
    └── empty.svg                Optional
```

The template repository provides filled-in placeholder files at every required path.

---

## Placeholder strategy for unbranded clones

When scaffolding a new client without brand assets, these conventions apply.

### Images in Payload seed scripts

All media `src` values reference `placehold.co` using the vertical's surface and muted
hex values so placeholders visually match the colour scheme:

```ts
// In apps/saidatech/seed/services.ts
{
  thumbnail: "https://placehold.co/800x600/f1f5f9/64748b?text=Service"
}

// In apps/clinic-template/seed/team.ts
{
  photo: "https://placehold.co/600x600/e6f7f5/4b7a76?text=Team"
}
```

No `placehold.co` URLs appear in production seeds — they are replaced before launch.

### Shipped placeholder brand files

| File | Content |
|------|---------|
| `logo.svg` | Text "Logo" in `var(--color-primary)` on transparent background |
| `favicon.ico` | Generic grey 32×32 square |
| `apple-touch-icon.png` | Generic grey 180×180 square |
| `og-image.jpg` | 1200×630 grey rectangle with centred text "Replace with OG image" |
| `brandmark.svg` | Empty 24×24 SVG |

### Client onboarding checklist (go-live prerequisite)

Before any client deployment goes live, confirm each of the following:

1. Replace all files in `apps/<client>/public/brand/` with client-supplied assets
2. Upload hero, team, service, news, and gallery images via Payload admin or re-run seed with real R2 URLs
3. Upload partner logos to `Globals → Logos` in Payload admin (light and dark variants)
4. Confirm `brand.ogImageFile` in `site.config` matches the deployed OG image filename
5. Confirm `brand.faviconFile` and `brand.logoFile` match deployed filenames
6. Run Lighthouse mobile audit: hero LCP must be ≤ 2.5s, Accessibility score ≥ 95
7. Check hreflang with Google Search Console after first sitemap submission
