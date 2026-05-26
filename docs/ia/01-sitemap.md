# Sitemap — Saidatech Template

## Routing strategy

next-intl **prefix-all-locales** mode. Every public URL carries a locale prefix.
`/` redirects to `/{defaultLocale}` (configured per client in `locales.default`).
`/admin`, `/api/*`, `/sitemap.xml`, `/robots.txt` are unlocalized system routes.

Locale segments use `{locale}` as a placeholder for `ja`, `en`, `bn` (or whichever
locales are enabled in `site.config.locales.enabled`).

---

## Route tree

```
/                                   always-on | all verticals | redirect → /{defaultLocale}
/{locale}/                          always-on | all verticals | Homepage

── Content routes (always-on) ──────────────────────────────────────────────────────────────

/{locale}/about                     always-on | all verticals
/{locale}/services                  always-on | all verticals
/{locale}/services/[slug]           always-on | all verticals
/{locale}/news                      feature-gated:news    (news:true for all three verticals)
/{locale}/news/[slug]               feature-gated:news
/{locale}/faq                       always-on | all verticals
/{locale}/contact                   always-on | all verticals

── Legal pages ──────────────────────────────────────────────────────────────────────────────

/{locale}/privacy                   always-on | all verticals
/{locale}/terms                     conditional: legal.termsSlug defined
/{locale}/cookie-policy             conditional: legal.cookiePolicySlug defined

── Feature-gated routes ─────────────────────────────────────────────────────────────────────

/{locale}/team                      feature-gated:team
/{locale}/team/[slug]               feature-gated:team

/{locale}/jobs                      feature-gated:jobListings
/{locale}/jobs/[slug]               feature-gated:jobListings

/{locale}/events                    feature-gated:events
/{locale}/events/[slug]             feature-gated:events

/{locale}/gallery                   feature-gated:gallery

/{locale}/downloads                 feature-gated:downloads

/{locale}/locations                 feature-gated:locations

── System routes (unlocalized) ──────────────────────────────────────────────────────────────

/admin                              Payload CMS admin panel
/api/contact                        Contact form submission handler
/api/jobs/apply                     Job application handler — feature-gated:jobListings
/api/ai/corpus                      AI corpus endpoint stub — ADR-003, always present
/api/ai/query                       AI query proxy stub — ADR-003, always present
/sitemap.xml                        Generated from seo.sitemapIncludeCollections
/robots.txt                         seo.robotsTxt override or Next.js default
```

---

## Vertical availability matrix

Routes that differ across verticals are marked below. Unmarked always-on routes are active for all three.

| Route | Saidatech | Clinic | School | Flag |
|-------|-----------|--------|--------|------|
| `/{locale}/` | active | active | active | always-on |
| `/{locale}/about` | active | active | active | always-on |
| `/{locale}/services` | active | active | active | always-on |
| `/{locale}/services/[slug]` | active | active | active | always-on |
| `/{locale}/news` | active | active | active | `features.news` |
| `/{locale}/news/[slug]` | active | active | active | `features.news` |
| `/{locale}/faq` | active | active | active | always-on |
| `/{locale}/contact` | active | active | active | always-on |
| `/{locale}/privacy` | active | active | active | always-on |
| `/{locale}/terms` | active | active | — | `legal.termsSlug` |
| `/{locale}/cookie-policy` | — | active | — | `legal.cookiePolicySlug` |
| `/{locale}/team` | active | active | active | `features.team` |
| `/{locale}/team/[slug]` | active | active | active | `features.team` |
| `/{locale}/jobs` | active | — | — | `features.jobListings` |
| `/{locale}/jobs/[slug]` | active | — | — | `features.jobListings` |
| `/{locale}/events` | — | — | active | `features.events` |
| `/{locale}/events/[slug]` | — | — | active | `features.events` |
| `/{locale}/gallery` | — | active | active | `features.gallery` |
| `/{locale}/downloads` | — | active | active | `features.downloads` |
| `/{locale}/locations` | — | active | — | `features.locations` |
| `/api/jobs/apply` | active | — | — | `features.jobListings` |

### Locale segments per vertical

| Locale | Saidatech | Clinic | School |
|--------|-----------|--------|--------|
| `/ja/` | active (default) | active (default) | active (default) |
| `/en/` | active | active | active |
| `/bn/` | active | — | — |

---

## Sitemap.xml collections

Controlled by `seo.sitemapIncludeCollections` in `site.config`:

| Vertical | Collections included |
|----------|---------------------|
| Saidatech | pages, news, services, faqs, jobs, team |
| Clinic | pages, news, services, faqs, team, gallery |
| School | pages, news, events, faqs, team, gallery |

`/admin` and `/api/*` routes are always excluded from sitemap.

---

## Notes

- Feature-gated routes return HTTP 404 when the corresponding flag is `false`. The route file
  exists in the template but wraps its rendering in a `notFound()` guard that reads the flag.
- `legal.termsSlug` and `legal.cookiePolicySlug` follow the same pattern: the route exists
  only when the slug string is defined in `site.config.legal`.
- The `/bn/` locale segment is rendered only for Saidatech (`locales.enabled` includes `"bn"`).
  Clinic and School have no Bengali content; their builds never generate `/bn/*` routes.
- `/api/ai/corpus` and `/api/ai/query` are stub handlers present in all builds regardless of
  `features.aiAgent`. ADR-003 requires the seam to exist even before the feature is enabled.
