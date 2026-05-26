# PROJECT-CHARTER.md — Saidatech Template

## Strategic context
We are a small Japanese tech startup building a reusable Next.js + Payload CMS template.
Client #1 is Saidatech (HR/staffing/visa, https://sadiatec.com/).
Future clients (target verticals): Japanese dental/medical clinics and schools/daycares/international schools.
We chose these verticals deliberately. We are NOT serving restaurants or e-commerce.

## Reference sites (use web_fetch, do not hallucinate)
- Structure reference: https://www.careerlinkfactory.co.jp
- Content/tone reference (current Saidatech site): https://sadiatec.com/

## Tech stack (pinned, non-negotiable)
- Next.js 15.x App Router, TypeScript strict
- Payload CMS 3.x (integrated in same Next.js app)
- Tailwind CSS 4.x
- Framer Motion 11.x
- Neon Postgres
- next-intl 3.x (frontend i18n)
- React Hook Form + Zod
- Cloudflare R2 (media) via Payload S3-compatible adapter
- Resend (email)
- Cloudflare Turnstile (spam)
- Vercel (deployment)

## Languages (built in from day one, toggleable per client)
- en (English) — primary dev language
- ja (Japanese) — primary user language for Saidatech and Japanese clinics/schools
- bn (Bengali) — Saidatech-specific (foreign worker recruitment)
Future clients may enable/disable any of these and add others.

## Non-negotiables
- All copy original. Never copy text/images from reference sites.
- All user-facing strings localizable. Zero hardcoded English in components.
- TypeScript strict, zero `any`.
- Block components MUST NOT import from @/payload-types. Adapters handle that.
- Every block has four files: config.ts, component.tsx, adapter.ts, types.ts.
- Per-client variation lives in exactly three places:
  1. site.config.ts
  2. Payload seed data
  3. /public/brand assets
  Component code is brand-agnostic.
- Lighthouse mobile: Performance ≥90, Accessibility ≥95, SEO ≥95.

## Reusability strategy
Template-clone model (NOT multi-tenancy). Each client is a separate deployment.
Shared logic lives in a `packages/cms-core` workspace package.
Each client is an `apps/<client-name>` directory that depends on cms-core and provides only: site.config.ts, seed data, /public/brand, custom blocks/collections.

## AI-readiness (future, NOT built in this project)
The template MUST preserve a clean seam for a future AI customer-service chat agent:
- Every content document has `aiVisible: boolean` field
- Endpoint /api/ai/corpus returns structured content per locale
- Endpoint /api/ai/query proxies to external AI service if features.aiAgent === true
- FAQs collection structured for AI consumption (question, answer, sources, locale)

## Working agreement with Claude
- After /plan, WAIT for human confirmation before writing any code.
- Run /verify before considering any phase done.
- Run /code-review on every batch of changes before commit.
- /save-session at end of work session.
- If a foundational decision turns out wrong mid-phase, STOP and revise the ADR before continuing. Do not paper over.
- Prefer prose responses over emojis. Match the user's communication style: direct, technical, no fluff.

## Target client verticals (for variability planning)
1. HR/staffing services (Saidatech) — content-heavy B2B
2. Dental/medical clinics — trust-driven, hours/booking critical, compliance with Japanese 医療広告ガイドライン (medical advertising guidelines)
3. Schools/daycares — events/news/gallery critical, multilingual parent audience

Each vertical needs the template to support different combinations of:
Services, Team, News/Blog, Events, Gallery, FAQ, Downloads, Testimonials, Hours/Locations.