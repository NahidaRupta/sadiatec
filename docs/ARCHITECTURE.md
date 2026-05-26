# Architecture Guide

## Overview

Single Next.js 15 App Router application co-located with Payload CMS 3.x. One `next start` process serves the public site, the CMS admin panel at `/admin`, and the REST API at `/api`. Each client deployment is an independent clone of `apps/saidatech` — no multi-tenancy, no shared runtime.

---

## Request → Response Data Flow

```
Browser
  │
  ├─ /admin/**              → Payload Admin UI (React, served by Next.js)
  ├─ /api/payload/**        → Payload REST API (Next.js route handlers)
  │
  ├─ /api/forms/[type]      → Security layer → Payload Local API → afterChange hook
  │       │                      (Zod + honeypot + Turnstile + rate limit)
  │       └──────────────── store to form-submissions collection
  │                              └─ Payload afterChange → Resend (dual emails)
  │
  ├─ /api/ai/corpus         → Auth check (Bearer AI_CORPUS_SECRET)
  │                              └─ Parallel Payload queries (all locales)
  │                                     → serialised CorpusDocument[]
  ├─ /api/ai/query          → Feature gate (features.aiAgent)
  │                              └─ Proxy to AI_AGENT_BASE_URL/query
  │
  ├─ /sitemap.xml           → Async: static routes + Payload slug queries
  ├─ /robots.txt            → Environment-aware (blocks /admin, /api/)
  │
  └─ /[locale]/**           → Next.js App Router pages
         │
         └─ getCachedPayload() → Payload Local API (in-process, no HTTP)
                │
                └─ Neon Postgres (via @payloadcms/db-postgres)
                       ↑
            afterChange hooks (revalidateTag per collection)
```

All data fetching in React Server Components uses the Payload Local API directly — no `fetch` to `localhost`.

---

## Security Layer

### Form Submission Pipeline

Every form submission at `/api/forms/[type]` passes through five gates in order:

```
POST /api/forms/[type]
  │
  1. Zod schema validation    ← rejects malformed payloads (400)
  2. Honeypot check           ← _hp field must be empty (bot trap)
  3. Turnstile verification   ← server-to-server token check with Cloudflare
  4. Rate limit check         ← sliding window: 5 req / 60 s per IP
  5. Payload.create()         ← persists to form-submissions collection
         └─ afterChange hook  → Resend: staff notification + user confirmation
```

The rate limiter uses Upstash Redis when `UPSTASH_REDIS_REST_URL` is set. When absent (local dev, environments without Redis), it falls back to an in-memory `Map` — safe for single-instance deploys, not recommended for multi-replica.

Turnstile verification is skipped (warning logged) when `TURNSTILE_SECRET_KEY` is absent.

### RBAC Model

Two roles are defined in the Users collection:

| Role | Read | Create | Update | Delete | Manage Users |
|------|------|--------|--------|--------|-------------|
| `admin` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `editor` | ✓ | ✓ | ✓ | — | — |

Delete access is enforced centrally via the `withAdminDelete` wrapper in `config-factory.ts`, applied to every collection via `.map(withAdminDelete)`. Individual collection configs do not need to specify delete access.

Access helpers live in `packages/cms-core/src/payload/access/index.ts`:

```ts
adminOnly     // req.user.role === 'admin'
authenticated // Boolean(req.user)
adminOrEditor // role === 'admin' || role === 'editor'
publicAccess  // () => true
```

---

## Cache Invalidation (ISR Webhook Triggers)

Every content collection and global has a Payload `afterChange` hook that calls `revalidateTag(slug)`. This invalidates the relevant Next.js data cache entry within seconds of a save.

| Collection / Global | Tag invalidated |
|--------------------|----------------|
| Pages | `pages` |
| Blog | `blog` |
| Case Studies | `case-studies` |
| News | `news` |
| Services | `services` |
| FAQs | `faqs` |
| Team | `team` |
| Seminars | `seminars` |
| Jobs | `jobs` |
| Downloads | `downloads` |
| Events | `events` |
| Gallery | `gallery` |
| Testimonials | `testimonials` |
| Media | `media` |
| Header global | `header` |
| Footer global | `footer` |
| SEO Defaults global | `seo` |

React Server Components that fetch from Payload should call `unstable_cache` or `fetch` with `{ next: { tags: ['<tag>'] } }` to opt into this invalidation.

---

## AI Corpus Endpoint

`GET /api/ai/corpus` is available regardless of `features.aiAgent`. It requires an `Authorization: Bearer <AI_CORPUS_SECRET>` header and returns `401` without it.

The `?locale=<code>` query parameter selects which locale's content to return. Defaults to the site's default locale. Validated against `siteConfig.locales.enabled`.

Response shape:

```ts
{
  success: true,
  data: {
    locale: string,
    documents: CorpusDocument[],
    totalDocuments: number,
  }
}

type CorpusDocument = {
  type: string    // collection slug
  slug: string
  title: string
  content: string // plain text extracted from lexical rich text
  sources: string[]
}
```

The endpoint runs parallel `Promise.all` queries for: services, FAQs, company-info, team (feature-gated), case studies (feature-gated), blog (feature-gated), news, seminars (feature-gated). Only records with `aiVisible: true` (or `aiActive: true`) are included.

`POST /api/ai/query` is gated by `features.aiAgent: true`. When disabled it returns `404`. When enabled, it proxies the request body to `AI_AGENT_BASE_URL/query` with an optional `AI_AGENT_API_KEY` bearer header and returns the upstream response verbatim.

---

## Sitemap & Robots

`app/sitemap.ts` is an async Next.js 15 route that:

1. Emits one entry per homepage (with hreflang alternates for all enabled locales)
2. Emits one entry per enabled collection index route
3. Queries Payload live for slugs from blog, case-studies, news, services, seminars — uses actual `updatedAt` as `lastModified`
4. Includes `alternates.languages` (hreflang) on every entry pointing to all locale variants

`app/robots.ts` is environment-aware:
- **Production** (`NODE_ENV === 'production'` and `NEXT_PUBLIC_SERVER_URL` contains the site domain): allows all crawlers, disallows `/admin` and `/api/`
- **Everything else** (preview, staging, local): `Disallow: /` — prevents index of non-production deployments

---

## Monorepo Layout

```
sadiatec/
├── packages/cms-core/          ← shared template library
│   └── src/
│       ├── schema/             ← SiteConfig Zod schema + TypeScript types
│       ├── blocks/             ← 15 blocks, four files each (types/config/adapter/component)
│       ├── payload/
│       │   ├── config-factory.ts   ← buildCmsConfig(siteConfig, adminComponents?)
│       │   ├── access/             ← adminOnly, authenticated, adminOrEditor, publicAccess
│       │   ├── admin/              ← BeforeDashboard component
│       │   ├── collections/        ← one file per collection
│       │   ├── globals/            ← Header, Footer, CompanyInfo, SEODefaults
│       │   ├── fields/             ← aiVisibleField, slugField
│       │   ├── hooks/              ← send-form-emails.ts (Resend afterChange hook)
│       │   └── lib/                ← richtext-to-text.ts (lexical → plain text)
│       ├── i18n/               ← buildRouting(siteConfig) + base messages
│       ├── tokens/             ← buildCssVariables(siteConfig)
│       └── seed/               ← upsertBySlug, upsertGlobal helpers
└── apps/saidatech/             ← client deployment
    ├── site.config.ts          ← the ONLY per-client config file
    ├── scripts/
    │   └── a11y-check.ts       ← axe-core WCAG 2.1 AA CI audit
    ├── src/
    │   ├── middleware.ts        ← next-intl locale routing
    │   ├── messages/            ← per-client i18n overrides
    │   ├── lib/
    │   │   ├── payload.ts       ← getCachedPayload() (React cache wrapper)
    │   │   ├── rate-limit.ts    ← Upstash Redis + in-memory fallback
    │   │   ├── image-loader.ts  ← Cloudflare Image Resizing custom loader
    │   │   └── validation/      ← Zod schemas: contact, seminar, download
    │   ├── app/
    │   │   ├── api/
    │   │   │   ├── forms/[type]/route.ts  ← unified form handler
    │   │   │   ├── ai/corpus/route.ts     ← AI corpus export
    │   │   │   └── ai/query/route.ts      ← AI query proxy
    │   │   ├── (frontend)/      ← public pages
    │   │   ├── (payload)/       ← Payload admin + REST API routes
    │   │   ├── sitemap.ts       ← async multilingual sitemap
    │   │   └── robots.ts        ← environment-aware robots
    ├── payload.config.ts        ← delegates to buildCmsConfig(siteConfig)
    └── public/brand/            ← logo.svg, favicon.ico, og-image.jpg
```

---

## Per-Client Variation

Exactly three places change per client. Component code is brand-agnostic.

| Location | What changes |
|----------|-------------|
| `site.config.ts` | Every feature flag, color, locale, SEO value, form recipient |
| `src/seed/index.ts` | Homepage content, nav items, global defaults |
| `public/brand/` | `logo.svg`, `favicon.ico`, `og-image.jpg` |

---

## Feature Flag System

Each feature flag in `site.config.ts` has four consequences:

| Consequence | Where |
|------------|-------|
| Admin collection hidden | `buildCmsConfig` — collection excluded from `optional[]` |
| Route returns 404 | `app/(frontend)/[locale]/<feature>/page.tsx` calls `notFound()` |
| Sitemap entries omitted | `app/sitemap.ts` — `featureGate` map filters collections |
| Page builder blocks hidden | `PagesCollection(siteConfig)` — block excluded from `layout` field |

### Verification checklist (features.seminars example)

1. Set `features.seminars: false` in `site.config.ts`
2. Restart dev server
3. `GET /admin` → Seminars absent from sidebar ✓
4. `GET /en/seminars` → 404 ✓
5. `GET /sitemap.xml` → no seminars URLs ✓
6. Page builder layout field → no seminars-related blocks ✓

---

## Admin UX

### BeforeDashboard

A branded info panel (`packages/cms-core/src/payload/admin/BeforeDashboard.tsx`) renders above the Payload dashboard home. It describes the workspace permissions and cache behaviour to editors.

Custom per-client admin components can be passed as `adminComponents` to `buildCmsConfig(siteConfig, adminComponents)` and are merged via spread into `admin.components`.

### Live Preview

Live preview is configured in `config-factory.ts` for the `pages`, `blog`, and `case-studies` collections. The URL builder is locale-aware:

- Default locale: `${base}/${slug}`
- Non-default locale: `${base}/${locale}/${slug}`

Breakpoints: Mobile (375×667), Tablet (768×1024), Desktop (1440×900).

### Trilingual Labels

All Payload field labels, collection labels, and select option labels use `{ en, ja, bn }` objects. Reference: `docs/admin-labels.md`. The canonical `aiVisibleField` is defined once in `packages/cms-core/src/payload/fields/ai-visible.ts` with full trilingual coverage.

---

## Adding a New Block

Seven steps, in order:

1. **`packages/cms-core/src/blocks/<name>/types.ts`** — define `<Name>BlockProps`. Zero Payload imports.
2. **`packages/cms-core/src/blocks/<name>/config.ts`** — define `<Name>BlockConfig: Block`.
3. **`packages/cms-core/src/blocks/<name>/adapter.ts`** — `adapt<Name>Block(raw): <Name>BlockProps`. Only file that may import from `payload-types`.
4. **`packages/cms-core/src/blocks/<name>/component.tsx`** — stub: `return <div data-block="<name>" />`. No Payload imports.
5. **`packages/cms-core/src/blocks/index.ts`** — add config to `allBlockConfigs` and re-export the props type.
6. **`packages/cms-core/src/payload/collections/pages.ts`** — add to `buildAvailableBlocks(siteConfig)`.
7. If feature-gated: wrap the block addition in `siteConfig.features.<flag> ? [...] : []`.

---

## Adding a New Optional Collection

Five steps:

1. **`packages/cms-core/src/payload/collections/<name>.ts`** — define `CollectionConfig`. Include `aiVisibleField`, `slugField`, and an `active` boolean field. Add `afterChange: [() => { revalidateTag('<name>') }]`.
2. **`packages/cms-core/src/payload/config-factory.ts`** — add to `optional[]` gated by `siteConfig.features.<flag>`.
3. **`packages/cms-core/src/schema/site-config.ts`** — add `<flag>: z.boolean()` to `featuresSchema`.
4. **`apps/saidatech/src/app/(frontend)/[locale]/<name>/page.tsx`** — call `notFound()` when `!siteConfig.features.<flag>`.
5. **`apps/saidatech/src/app/sitemap.ts`** — add to `featureGate` map and to `slugCollections` if items have individual pages.

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URI` | ✓ | Neon Postgres connection string |
| `PAYLOAD_SECRET` | ✓ | Payload session signing key (min 32 chars) |
| `NEXT_PUBLIC_SERVER_URL` | ✓ | Public URL — also used by `robots.ts` to detect production |
| `RESEND_API_KEY` | for forms | Resend transactional email API key |
| `TURNSTILE_SITE_KEY` | for forms | Cloudflare Turnstile public key (also in site.config) |
| `TURNSTILE_SECRET_KEY` | for forms | Cloudflare Turnstile private key (server-side only) |
| `UPSTASH_REDIS_REST_URL` | optional | Upstash Redis endpoint for distributed rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | optional | Upstash Redis auth token |
| `CLOUDFLARE_R2_BUCKET` | for media | R2 bucket name |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | for media | R2 access key |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | for media | R2 secret |
| `CLOUDFLARE_R2_ENDPOINT` | for media | R2 endpoint URL |
| `NEXT_PUBLIC_R2_BUCKET_URL` | for image opt. | R2 public URL — enables Cloudflare Image Resizing loader |
| `AI_CORPUS_SECRET` | for AI corpus | Bearer token required by `GET /api/ai/corpus` |
| `AI_AGENT_BASE_URL` | if `features.aiAgent` | Upstream AI agent URL for query proxy |
| `AI_AGENT_API_KEY` | if `features.aiAgent` | Optional bearer token for upstream AI agent |

---

## Accessibility

`scripts/a11y-check.ts` runs axe-core (via `@axe-core/playwright`) against the running server. It checks WCAG 2.1 AA tags across key pages. Exit code 1 on any violation.

```bash
# First time: install browser
pnpm --filter saidatech exec playwright install chromium

# Run audit
BASE_URL=http://localhost:3000 pnpm --filter saidatech a11y
```

Built-in a11y features in every deployment:
- Skip-to-content link in `[locale]/layout.tsx` targeting `#main-content`
- `aria-invalid`, `aria-describedby`, `aria-busy` on all form inputs
- `role="status" aria-live="polite"` for async state announcements
- `role="alert" aria-live="assertive"` for error messages

---

## AI Readiness Seam (ADR-003)

Every content collection has an `aiVisible` checkbox (default `true`; Jobs collection defaults to `false`). The field is defined once in `packages/cms-core/src/payload/fields/ai-visible.ts` and imported wherever needed.

`GET /api/ai/corpus`:
- Always available (no feature flag gate)
- Requires `Authorization: Bearer AI_CORPUS_SECRET`
- Returns structured `CorpusDocument[]` with plain-text content extracted from Lexical rich text via `lexicalToText()` in `packages/cms-core/src/payload/lib/richtext-to-text.ts`
- Returns `401` when auth header is missing or incorrect

`POST /api/ai/query`:
- Returns `404` when `!siteConfig.features.aiAgent`
- Returns `503` when `AI_AGENT_BASE_URL` is not set
- Proxies to `${AI_AGENT_BASE_URL}/query` with optional bearer auth
