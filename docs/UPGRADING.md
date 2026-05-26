# Upgrading Guide

## When to Use This Guide

Use this guide when pulling in a new version of `packages/cms-core` into an existing client deployment (`apps/<client>`).

---

## Phase 6 Changes (Forms, Security, AI, SEO, a11y)

If you are upgrading an app created before Phase 6, apply these changes in order.

### New environment variables

Add to `.env.local` and Vercel project settings:

```bash
# Rate limiting (optional — falls back to in-memory)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Cloudflare Image Resizing (optional — enables custom next/image loader)
NEXT_PUBLIC_R2_BUCKET_URL=

# AI corpus auth (required if features.aiAgent is true)
AI_CORPUS_SECRET=

# AI query proxy (required if features.aiAgent is true)
AI_AGENT_BASE_URL=
AI_AGENT_API_KEY=
```

### New packages in `apps/<client>/package.json`

```json
"dependencies": {
  "@upstash/ratelimit": "^2.0.5",
  "@upstash/redis": "^1.34.3"
},
"devDependencies": {
  "@axe-core/playwright": "^4.10.0",
  "playwright": "^1.48.0"
}
```

Run `pnpm install` after adding.

### Database migration

Phase 6 adds the `form-submissions` collection. On first start after upgrade, Payload will create the migration automatically. To pre-generate it:

```bash
pnpm --filter <client> exec payload migrate:create --name phase6-form-submissions
pnpm --filter <client> exec payload migrate
```

### `FormSubmissionsCollection` is now a factory function

If you previously imported `FormSubmissionsCollection` as a constant, update the import and call:

```ts
// Before
import { FormSubmissionsCollection } from '@saidatech/cms-core/payload/collections/form-submissions'
// ...
collections: [..., FormSubmissionsCollection]

// After
import { FormSubmissionsCollection } from '@saidatech/cms-core/payload/collections/form-submissions'
// ...
collections: [..., FormSubmissionsCollection({
  contactRecipient: siteConfig.forms.contactRecipient,
  jobApplicationRecipient: siteConfig.forms.jobApplicationRecipient ?? siteConfig.forms.contactRecipient,
  seminarRecipient: siteConfig.forms.contactRecipient,
  fromEmail: siteConfig.integrations.resendFromEmail,
})]
```

In practice, `buildCmsConfig` handles this automatically — only manual usages need updating.

### `buildCmsConfig` signature change

The function now accepts an optional second argument for custom admin components:

```ts
// Backward compatible — existing calls with one argument still work
buildCmsConfig(siteConfig)

// New optional signature
buildCmsConfig(siteConfig, adminComponents)
```

### site.config.ts additions

Phase 6 uses `siteConfig.forms.jobApplicationRecipient` and `siteConfig.integrations.resendFromEmail`. If your `site.config.ts` is missing these, add them:

```ts
forms: {
  contactRecipient: 'contact@yourdomain.com',
  jobApplicationRecipient: 'hr@yourdomain.com', // add this
},
integrations: {
  resendFromEmail: 'no-reply@yourdomain.com',   // add this
  turnstileSiteKey: process.env['TURNSTILE_SITE_KEY'] ?? '',
},
```

### Accessibility CI script setup

After upgrading:

```bash
# Install playwright browser (once per machine / CI runner)
pnpm --filter <client> exec playwright install chromium

# Run the a11y audit
BASE_URL=http://localhost:3000 pnpm --filter <client> a11y
```

---

## Prerequisites

- Node.js 20+
- pnpm 11+
- A working database backup (take one before starting)
- Access to the client's `.env` file

---

## Step-by-Step Upgrade

### 1. Pull the latest monorepo changes

```bash
git fetch origin
git checkout main
git pull origin main
```

### 2. Review the changelog

```bash
cat CHANGELOG.md | head -100
```

Check for breaking changes. A breaking change is any addition to the `features` object in `SiteConfig` that is **required** (non-optional). Optional additions with a default are non-breaking.

### 3. Install dependencies

```bash
pnpm install
```

If new peer dependency versions are required, pnpm will warn. Resolve conflicts before continuing.

### 4. Update site.config.ts (if SiteConfig schema changed)

If a new required field was added to `SiteConfig`, TypeScript will tell you:

```bash
pnpm --filter <client> typecheck
```

Add missing fields to `apps/<client>/site.config.ts`. Consult `docs/variability-matrix.md` for the full list of options and defaults.

### 5. Run the full typecheck

```bash
pnpm typecheck
```

Zero errors required before proceeding.

### 6. Generate and review Payload migrations (if collections changed)

```bash
pnpm --filter <client> exec payload migrate:create --name upgrade
```

Review the generated migration file in `apps/<client>/src/migrations/` before applying.

```bash
pnpm --filter <client> exec payload migrate
```

### 7. Verify locally

```bash
pnpm --filter <client> dev
```

- Admin panel loads at `localhost:3000/admin`
- All feature-flagged routes behave as expected
- Run the feature flag acceptance test (see `docs/ARCHITECTURE.md`)
- Run the a11y audit: `BASE_URL=http://localhost:3000 pnpm --filter <client> a11y`

---

## Rollback Scenarios

### Scenario A — TypeScript errors after upgrade

**Symptom:** `pnpm typecheck` fails with type errors in `site.config.ts`.  
**Cause:** A required `SiteConfig` field was added.  
**Fix:** Add the missing field to `site.config.ts` with the appropriate value. If unsure of the value, copy the default from `docs/variability-matrix.md`.

### Scenario B — Runtime error after migration

**Symptom:** `pnpm dev` fails or the admin panel shows a database error.  
**Cause:** A migration was applied incorrectly.  
**Fix:**
```bash
# Restore from backup
pg_restore -d $DATABASE_URI backup.dump

# Revert the code
git checkout HEAD~1 -- apps/<client>
pnpm install
```

### Scenario C — Payload admin shows blank screen

**Symptom:** `/admin` loads but the UI is blank or shows an error.  
**Cause:** Usually a `PAYLOAD_SECRET` mismatch or missing `DATABASE_URI`.  
**Fix:** Verify all environment variables are set correctly and restart the server.

### Scenario D — Emails not sending after Phase 6 upgrade

**Symptom:** Form submissions succeed (saved to `form-submissions`) but no emails arrive.  
**Cause:** `RESEND_API_KEY` missing, Resend domain not verified, or `fromEmail` not on a verified domain.  
**Fix:**
1. Check Resend dashboard → domain must show **Verified**
2. Verify `RESEND_API_KEY` is set in the deployment environment
3. Confirm `integrations.resendFromEmail` in `site.config.ts` matches a Resend-verified sending address

### Scenario E — Rate limiter returning 429 unexpectedly

**Symptom:** Forms return HTTP 429 (Too Many Requests) even with few submissions.  
**Cause:** Upstash Redis env vars are set but the token or URL is wrong; or the sliding window limit (5 requests / 60 s) is being hit by automated tests.  
**Fix:**
- In CI/tests: unset `UPSTASH_REDIS_REST_URL` to use the in-memory fallback
- In production: verify both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in the Upstash console

---

## Breaking Change Policy

| Change type | Version bump |
|-------------|-------------|
| New **required** field in `SiteConfig` | **Major** — clients must update `site.config.ts` |
| New **optional** field with a default | Minor — backwards compatible |
| Collection field added (nullable) | Minor — no migration required |
| Collection field removed | Major — migration required |
| Block slug renamed | Major — existing page documents break |
| `buildCmsConfig` signature breaking change | Major — update all `payload.config.ts` callsites |

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `siteConfigSchema.parse` throws at startup | Invalid `site.config.ts` value | Fix the value; error message lists the failing field |
| `Cannot find module '@saidatech/cms-core/...'` | Path alias not in `tsconfig.json` | Add the missing alias following the pattern in `apps/<client>/tsconfig.json` |
| `pnpm install` peer dependency warnings | Version mismatch | Check `pnpm-workspace.yaml` overrides; align the client's dep version |
| `payload migrate` fails with relation errors | Migration applied out of order | Check `_migrations` table; run `payload migrate:status` |
| `notFound()` called unexpectedly | Feature flag is `false` but route exists | Set the feature flag to `true` in `site.config.ts` or remove the route |
| `checkRateLimit` import error | `@upstash/ratelimit` / `@upstash/redis` not installed | Run `pnpm install` in the monorepo root |
| axe a11y script fails to launch | Playwright browser not installed | Run `pnpm --filter <client> exec playwright install chromium` |
