# White-Label Deployment Guide

Clone this template and deploy a fully-configured client site in under two hours.
Each step includes a time budget. Run steps 1–4 and external-service steps in parallel
where indicated.

---

## Prerequisites

| Tool | Minimum version | Check |
|------|----------------|-------|
| Node.js | 20 LTS | `node -v` |
| pnpm | 11 | `pnpm -v` |
| Git | any recent | `git -v` |

External accounts to prepare before starting:

- **Neon** (neon.tech) — Postgres database
- **Resend** (resend.com) — transactional email
- **Cloudflare** — Turnstile (bot protection) + R2 (media storage)
- **Vercel** (vercel.com) — deployment host

---

## Step 1 — Create the client app directory  *(5 min)*

```bash
# From the monorepo root
cp -r apps/saidatech apps/<client-slug>
cd apps/<client-slug>
```

Register the new app in the monorepo workspace (if it isn't already via the `apps/*` glob):

```bash
# apps/<client-slug>/package.json — change "name" field
sed -i 's/"name": "saidatech"/"name": "<client-slug>"/' package.json
```

Install from the monorepo root:

```bash
cd ../..
pnpm install
```

---

## Step 2 — Replace brand assets  *(5 min)*

Overwrite the three required files in `apps/<client-slug>/public/brand/`:

| File | Purpose | Format | Min size |
|------|---------|--------|---------|
| `logo.svg` | Header + footer logo | SVG | 40–200px height |
| `favicon.ico` | Browser tab icon | ICO (multi-size) | 16×16 + 32×32 |
| `og-image.jpg` | Social share preview | JPEG | 1200×630 |

---

## Step 3 — Edit `site.config.ts`  *(25 min)*

`apps/<client-slug>/site.config.ts` is the only file that defines the client's identity.
Every field is documented in `docs/variability-matrix.md`.

**Minimum set for a functioning deploy:**

```ts
site: {
  name: 'Client Name',           // appears in <title>, footer
  tagline: { en: '...', ja: '...' },
  domain: 'clientdomain.com',    // used for canonical URLs, sitemap
},
brand: {
  logoFile: 'logo.svg',
  faviconFile: 'favicon.ico',
  ogImageFile: 'og-image.jpg',
  colors: { primary: '#1a56db', ... },   // brand colours — see variability-matrix §2
  typography: { fontSans: 'Noto Sans JP', fontSizeBase: '16px', ... },
},
locales: {
  enabled: ['en', 'ja'],          // remove 'bn' unless Bengali is needed
  default: 'ja',
},
features: {
  // set false for every feature the client does not need
  aiAgent: false,
  blog: true,
  jobListings: false,
  ...
},
forms: {
  contactRecipient: 'contact@clientdomain.com',
  jobApplicationRecipient: 'hr@clientdomain.com', // omit if jobListings: false
},
integrations: {
  resendFromEmail: 'no-reply@clientdomain.com', // must be Resend-verified domain
  turnstileSiteKey: process.env['TURNSTILE_SITE_KEY'] ?? '',
},
seo: {
  titleTemplate: '%s | Client Name',
  defaultDescription: { en: '...', ja: '...' },
  sitemapIncludeCollections: ['pages', 'news', 'blog', 'services'],
},
```

Run typecheck immediately after editing to catch config errors:

```bash
pnpm --filter <client-slug> typecheck
```

---

## Step 4 — Create the Neon database  *(10 min)*

1. Log in to [neon.tech](https://neon.tech) → **New Project**
2. Region: `AWS ap-northeast-1` (Tokyo) for Japan-based clients
3. Copy the **Connection string** (`postgres://...`) → save as `DATABASE_URI`
4. Create a second branch named `preview` for Vercel preview deployments

---

## Step 5 — Configure Resend  *(10 min)*

1. Log in to [resend.com](https://resend.com) → **Domains** → **Add Domain**
2. Enter the client's sending domain (e.g. `clientdomain.com`)
3. Add the DNS records shown (SPF, DKIM, DMARC)
4. **API Keys** → **Create API Key** (full access) → save as `RESEND_API_KEY`
5. Set `integrations.resendFromEmail` in `site.config.ts` to a verified address on that domain

> DNS propagation takes 5–30 minutes. Continue with other steps while waiting.

---

## Step 6 — Configure Cloudflare Turnstile  *(5 min)*

1. Cloudflare Dashboard → **Turnstile** → **Add Site**
2. Domain: the client's production domain
3. Widget type: **Managed** (recommended)
4. Copy **Site Key** → `TURNSTILE_SITE_KEY` (also set `integrations.turnstileSiteKey`)
5. Copy **Secret Key** → `TURNSTILE_SECRET_KEY`

---

## Step 7 — Configure Cloudflare R2  *(10 min)*

1. Cloudflare Dashboard → **R2** → **Create Bucket**
2. Bucket name: `<client-slug>-media`
3. **Settings** → **Public Access** → enable (or connect a custom domain)
4. **Manage R2 API Tokens** → **Create API Token** with object read/write on this bucket
5. Copy:
   - **Access Key ID** → `CLOUDFLARE_R2_ACCESS_KEY_ID`
   - **Secret Access Key** → `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
   - **Endpoint** → `CLOUDFLARE_R2_ENDPOINT` (format: `https://<account>.r2.cloudflarestorage.com`)
   - **Bucket name** → `CLOUDFLARE_R2_BUCKET`
   - **Public bucket URL** → `NEXT_PUBLIC_R2_BUCKET_URL` (enables Cloudflare Image Resizing)

---

## Step 8 — Create `.env.local`  *(5 min)*

```bash
# apps/<client-slug>/.env.local
DATABASE_URI=postgres://...
PAYLOAD_SECRET=<random-64-char-string>      # openssl rand -hex 32
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Email
RESEND_API_KEY=re_...

# Bot protection
TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...

# Media storage
CLOUDFLARE_R2_BUCKET=<bucket-name>
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_ENDPOINT=https://<account>.r2.cloudflarestorage.com
NEXT_PUBLIC_R2_BUCKET_URL=https://pub-<hash>.r2.dev   # or custom domain

# Rate limiting (optional — falls back to in-memory if absent)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# AI corpus (only needed when features.aiAgent: true)
AI_CORPUS_SECRET=<random-64-char-string>
AI_AGENT_BASE_URL=https://...
AI_AGENT_API_KEY=...
```

Generate `PAYLOAD_SECRET`:

```bash
openssl rand -hex 32
```

---

## Step 9 — First local run  *(10 min)*

```bash
# From monorepo root
pnpm --filter <client-slug> dev
```

On first run, Payload generates and runs all migrations automatically.

Verify:
- `http://localhost:3000` → site renders
- `http://localhost:3000/admin` → Payload admin login
- Create the first admin user when prompted

---

## Step 10 — Seed initial content  *(10 min)*

```bash
pnpm --filter <client-slug> seed
```

This creates:
- Global defaults (Header navigation, Footer links, Company Info, SEO defaults)
- Homepage page document with the configured block layout
- Sample records for enabled collections (services, blog posts, FAQs, etc.)

Review the seeded content in the admin and adjust as needed.

---

## Step 11 — Deploy to Vercel  *(15 min)*

### 11a. Connect the repository

1. Vercel Dashboard → **New Project** → import from Git
2. **Root directory**: `apps/<client-slug>`
3. **Framework Preset**: Next.js

### 11b. Set environment variables

In Vercel project settings → **Environment Variables**, add every variable from `.env.local`
with these adjustments:

| Variable | Production value |
|----------|----------------|
| `NEXT_PUBLIC_SERVER_URL` | `https://clientdomain.com` |
| `DATABASE_URI` | Neon production branch connection string |

Set `DATABASE_URI` from the Neon **preview** branch for Vercel preview deployments.

### 11c. Deploy

```bash
# Or push to the connected Git branch
vercel deploy --prod
```

---

## Step 12 — Post-launch verification  *(10 min)*

```bash
# All checks against the production URL
SITE=https://clientdomain.com

# Sitemap contains locale URLs
curl -s "$SITE/sitemap.xml" | grep '<loc>'

# Robots.txt blocks admin and api, allows crawlers
curl -s "$SITE/robots.txt"

# Admin panel accessible
open "$SITE/admin"

# Contact form submits without error (use a real email)
# (test from the browser)

# Accessibility audit (requires playwright install chromium)
cd apps/<client-slug>
pnpm exec playwright install chromium
BASE_URL=$SITE pnpm a11y
```

---

## Estimated Time Budget

| Step | Time |
|------|------|
| 1 — Bootstrap directory | 5 min |
| 2 — Brand assets | 5 min |
| 3 — site.config.ts | 25 min |
| 4 — Neon database | 10 min |
| 5 — Resend domain | 10 min |
| 6 — Turnstile | 5 min |
| 7 — R2 storage | 10 min |
| 8 — .env.local | 5 min |
| 9 — First local run | 10 min |
| 10 — Seed content | 10 min |
| 11 — Vercel deploy | 15 min |
| 12 — Verification | 10 min |
| **Total** | **~2h** |

Steps 4–7 (external services) can be done in parallel by a second team member while
the first works on steps 2–3.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `siteConfigSchema.parse` error on startup | Invalid value in `site.config.ts` | The error message names the failing field; consult `docs/variability-matrix.md` |
| Admin blank screen | `DATABASE_URI` wrong or `PAYLOAD_SECRET` too short | Verify both env vars; `PAYLOAD_SECRET` must be ≥32 chars |
| Emails not arriving | Resend domain not verified or `RESEND_API_KEY` missing | Check Resend dashboard → Domain status must be **Verified** |
| Turnstile challenge never passes | `TURNSTILE_SECRET_KEY` mismatched | Ensure both site key and secret key are from the same Turnstile widget |
| Images not loading from R2 | `remotePatterns` missing for bucket hostname | Add the bucket hostname to `images.remotePatterns` in `next.config.ts` |
| Rate limiter not working | Upstash env vars absent | Without them, the in-memory fallback is active — this is expected in local dev |
| `pnpm typecheck` fails after config change | Required `SiteConfig` field missing | See `docs/UPGRADING.md` — Scenario A |
