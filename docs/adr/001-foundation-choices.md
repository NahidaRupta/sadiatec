# ADR-001: Foundation Technology Choices

**Status:** Accepted  
**Date:** 2026-05-21  
**Authors:** Saidatech / techMirai

---

## Context

We are building a reusable website template for a small Japanese-market agency. The
template must serve three distinct verticals from a single shared codebase:

1. **HR/staffing services** (Saidatech) — content-heavy B2B, multilingual (en/ja/bn),
   job listings, foreign-worker recruitment focus
2. **Dental/medical clinics** — trust-driven, Japanese 医療広告ガイドライン (Medical
   Advertising Guidelines) compliance, booking-critical, strict content control
3. **Schools/daycares/international schools** — events, news, gallery, multilingual
   parent audience (en/ja)

Constraints that shaped every decision here:

- One small development team
- TypeScript strict throughout — `any` is a build error
- All user-facing strings must be localizable; no hardcoded English in components
- Lighthouse mobile: Performance ≥90, Accessibility ≥95, SEO ≥95
- Deployment target: Vercel + Neon Postgres + Cloudflare R2
- Per-client variation lives in exactly three places: `site.config.ts`, Payload seed
  data, and `/public/brand` assets. Component code is brand-agnostic.

---

## Decision

**CMS: Payload CMS 3.x, co-located inside the Next.js 15 App Router application.**

**Reuse model: Template-clone, not multi-tenancy.**

---

## Alternatives Considered

### CMS Alternatives

#### Strapi v5

| Dimension | Assessment |
|-----------|-----------|
| Architecture | Runs as a separate Node.js server. Every deployment needs two processes (Strapi + Next.js). |
| TypeScript | TypeScript support is present but bolted on via code generation, not native. Strict types require workarounds. |
| Co-location | Not possible. Strapi and Next.js are always separate repos/deployments. |
| Localization | Plugin-based; not first-class in schema definition. |
| Block system | Requires the dynamic zones concept, which is less ergonomic than Payload's lexical blocks. |
| Verdict | Rejected. Operational overhead of two servers per client, non-native TypeScript. |

#### Directus v11

| Dimension | Assessment |
|-----------|-----------|
| Architecture | Separate server with database-schema-driven approach (schema-first, not code-first). |
| TypeScript | SDK is TypeScript, but the content model lives in the database, not in version-controlled code. Auditing schema changes for medical compliance is difficult. |
| Co-location | Not possible. |
| Localization | Good REST/GraphQL, but localization requires careful schema design. |
| Compliance | Schema-in-DB model means content model changes are not in git — a liability for medical advertising guideline audits. |
| Verdict | Rejected. Schema-in-DB is incompatible with our compliance requirements for clinics. |

#### Sanity v3

| Dimension | Assessment |
|-----------|-----------|
| Architecture | Hosted studio (Sanity.io CDN). Content is served from Sanity's CDN, not from the client's own infrastructure. |
| TypeScript | GROQ query language, while powerful, is not TypeScript-native. Type generation requires extra tooling. |
| Cost | Per-seat studio cost. Our three-vertical model requires separate Sanity projects per client. |
| Compliance | Serving medical content from a third-party CDN (Sanity's) introduces a data-residency question under Japanese 医療広告ガイドライン. A clinic's content sitting on a US CDN is a compliance risk. |
| Co-location | Possible via "embedded studio" but the content API is still external. |
| Verdict | Rejected. External CDN for medical content violates compliance isolation. Per-seat cost adds up. |

### Why Payload CMS 3.x Wins for All Three Verticals

**For dental/medical clinics:**

Japanese 医療広告ガイドライン requires that medical advertising content be accurate,
verifiable, and not misleading. This implies:
- The content model must be auditable in version control (code-first schema = git history)
- No third-party CDN serving the content (Payload + Neon Postgres = client controls their own data)
- Fine-grained field-level control over what is published vs. draft (Payload's status system)
- The `aiVisible` field (see ADR-003) lets editors explicitly exclude sensitive clinical
  claims from AI corpus output

**For schools/daycares:**

Block-based content (lexical blocks in Payload) maps directly to the school vertical's
needs: events with dates, photo galleries, news posts, downloadable forms. All of these
are first-class collections in Payload without requiring any plugins.

**For HR/staffing (Saidatech):**

- Three-locale support (en/ja/bn) with `localized: true` fields is native to Payload 3.x
- Job listings, FAQ, team profiles, and testimonials are all standard Payload collections
- Forms with file upload (resume submission) are handled by Payload's built-in form
  builder or custom collection — no third-party form service required
- Bengali (bn) typographic override via `site.config.ts` `brand.typography.perLocale`
  means Noto Sans Bengali can be loaded only when Bengali locale is active, preserving
  Lighthouse performance scores

**Cross-cutting:**

- Payload 3.x lives inside the Next.js app. One `next start` serves the site, the admin
  panel (`/admin`), and the REST API (`/api`). No second server to operate, monitor, or
  secure separately.
- `payload.config.ts` is TypeScript. The schema is in git. TypeScript strict ensures that
  schema changes break the build immediately if dependent code is not updated.

### Reuse Model Alternatives

#### Multi-tenancy (single deployment, shared database)

| Dimension | Assessment |
|-----------|-----------|
| Infrastructure | One deployment serves all clients. Lower hosting cost at first. |
| Data isolation | All client data in one database. Row-level isolation with tenant IDs. |
| Compliance | Medical client data in same DB as HR client — potential data sovereignty and compliance issue. |
| Schema divergence | Clinic needs `medicalSpecialty` collection. School needs `eventCalendar`. HR needs `jobListings`. Encoding all three in one schema grows complexity with no clean boundary. |
| Deploy coupling | One deployment means a migration for Clinic A can break School B. |
| Verdict | Rejected. Compliance isolation alone rules it out for Japanese medical clients. |

#### Template-clone model (separate deployment per client)

Each client is a separate Vercel deployment with its own Neon Postgres database. Shared
logic lives in `packages/cms-core`; each client's `apps/<client>` directory provides
only: `site.config.ts`, seed data, `/public/brand`, and any client-exclusive
collections/blocks.

This is the chosen approach. Rationale:

- **Data isolation:** Each client's data never touches another client's database
- **Compliance:** Medical content stays in one isolated deployment; no cross-contamination
- **Independent deployments:** A schema migration for Clinic does not risk a School deploy
- **Vertical flexibility:** Each client extends `cms-core` collections without polluting
  the base or affecting other clients
- **Operational simplicity:** Each Vercel project is independent; rollback is per-client

---

## Consequences (Enables)

- TypeScript strict everywhere — schema changes surface as compile errors, not runtime bugs
- Medical compliance: code-first schema is auditable in git; no third-party CDN for content
- Bengali font loading can be gated behind `locales.enabled` check, protecting performance
- Each client can be sold, transferred, or shut down independently without affecting others
- The monorepo structure (ADR-002) lets us upgrade all clients from a single `cms-core`
  version bump while keeping their data and customisation fully separate
- AI readiness (ADR-003) is possible because Payload collections are structured, typed,
  and queryable — the corpus endpoint can filter by `aiVisible` and `locale` cleanly

---

## Consequences (Constrains)

- **Hosting cost scales linearly:** Three separate Vercel deployments + three Neon databases
  vs. one of each for multi-tenancy. Acceptable for three clients; revisit at 10+.
- **cms-core upgrade discipline required:** A breaking change in `cms-core` must be
  coordinated across all client apps. Mitigated by the upgrade workflow in ADR-002.
- **No shared Payload admin:** Each client has its own `/admin`. Editors at Saidatech
  cannot see Clinic content. This is a feature, not a bug (compliance), but means no
  "superadmin across clients" view.
- **Block components must not import `@/payload-types`:** Adapters mediate between
  Payload's generated types and the component layer. This constraint is non-negotiable
  to keep components brand-agnostic and independently testable.

---

## Open Questions

1. **Bengali font load strategy:** Noto Sans Bengali is ~200KB. If a school client later
   adds Bengali as a locale, we may need a `fontLoadStrategy: 'swap' | 'optional' | 'block'`
   field in `SiteConfig` to stay above Lighthouse 90. Deferred to Phase 2 typography work.

2. **Medical disclaimer blocks:** Clinics may need a legally-required disclaimer block on
   every page (different per prefecture). Whether this is a global setting in `site.config.ts`
   or a per-page block is unresolved. Deferred to Clinic client onboarding.

3. **Payload admin UI locale:** The Payload admin UI supports a limited set of admin
   locales. Japanese admin UI support should be verified before Clinic client onboarding.
   This is separate from content localization (which works for any locale).
