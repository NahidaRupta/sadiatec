# ADR-003: AI Readiness — Corpus Seam and Content Structure

**Status:** Accepted  
**Date:** 2026-05-21  
**Authors:** Saidatech / techMirai

---

## Context

The product charter (PROJECT-CHARTER.md) requires the template to preserve a clean seam
for a future AI customer-service chat agent. This agent is **not built in this project**.
The requirement is that when it is built, it should be able to operate against any
deployed client site without that client site requiring code changes or redeployment.

Three constraints shape this decision:

1. **No AI code in Phase 0–1.** The endpoints are stubbed. Nothing connects to an AI
   service yet.
2. **The seam must be in the template, not added later.** If the endpoints are added
   post-launch, every client site requires a redeploy. If they are in the template, the
   seam is present from day one in every deployment.
3. **Editors must control what the AI sees.** Some content (e.g., internal notes, draft
   pages, medically sensitive claims under review) must be excludable from the AI corpus
   without unpublishing the document.

---

## Decision

**Every content collection includes an `aiVisible` field. Two API endpoints are stubbed
in the template: `/api/ai/corpus` and `/api/ai/query`. The future AI agent uses these
endpoints to acquire knowledge and serve queries without any modification to client sites.**

---

## How the Future AI Agent Gets Its Corpus Without Modifying Client Sites

This is the critical question posed in the acceptance criteria.

The answer is architectural: **the corpus endpoint is part of the template infrastructure,
present in every deployment from the first release**.

When a client site is deployed from this template:
- `/api/ai/corpus` exists and returns structured content immediately (stubbed response
  in Phase 0–1, real data in Phase 2+)
- `features.aiAgent` in `site.config.ts` gates whether the endpoint serves data or
  returns `503 Service Unavailable`
- The external AI service (not built now) will call this endpoint to build its knowledge
  base on its own schedule

No client site ever needs to be modified to enable the AI agent. The activation path is:
1. Set `features.aiAgent: true` in `site.config.ts` and redeploy (one-line change)
2. The external AI service starts polling `/api/ai/corpus`
3. The AI chat widget (future) is embedded via a script tag or iframe — it does not live
   in the Next.js app

This is a configuration change plus redeploy, not a code change.

---

## The `aiVisible` Field Pattern

Every content collection managed by `cms-core` receives this field:

```typescript
{
  name: 'aiVisible',
  type: 'checkbox',
  label: {
    en: 'Include in AI corpus',
    ja: 'AIコーパスに含める',
    bn: 'AI কর্পাসে অন্তর্ভুক্ত করুন',
  },
  defaultValue: true,
  admin: {
    description: {
      en: 'When enabled, this document is available to the AI chat agent corpus. Disable for draft content, internal notes, or legally sensitive claims under review.',
      ja: 'オンにすると、このドキュメントはAIチャットエージェントのコーパスに含まれます。下書きや法的に審査中のコンテンツはオフにしてください。',
    },
    position: 'sidebar',
  },
}
```

Collections that receive `aiVisible`:

| Collection | Rationale |
|------------|-----------|
| Pages | Main content pages are the primary corpus source |
| FAQs | Structured Q&A is the highest-signal data for a chat agent |
| Services | Service descriptions answer "what do you offer?" queries |
| Team | Team bios answer "who works here?" queries |
| News | Recent announcements keep the AI current |
| Events | Event info answers "when is X happening?" queries |
| Downloads | File descriptions (not binary content) are indexed |
| Testimonials | Social proof answers "are you trustworthy?" queries |

Collections that do NOT receive `aiVisible`:

| Collection | Rationale |
|------------|-----------|
| Media | Binary assets; AI indexes descriptions via the parent document, not files |
| Settings | Internal config; not public-facing content |
| Users | Personal data; never in the AI corpus |
| Jobs | Indexed per-job via explicit `aiVisible: true` only (see Open Questions) |

---

## Content Structure for AI Consumption

The FAQs collection is the highest-priority collection for AI readiness because it maps
directly to the question-answering pattern of a chat agent.

### FAQs Collection Schema (relevant fields)

```typescript
{
  slug: 'faqs',
  fields: [
    { name: 'question', type: 'text', localized: true, required: true },
    { name: 'answer', type: 'richText', localized: true, required: true },
    {
      name: 'sources',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'url', type: 'text' },
      ],
    },
    { name: 'category', type: 'text', localized: true },
    { name: 'aiVisible', type: 'checkbox', defaultValue: true },
  ],
}
```

The `sources` array allows editors to cite the authoritative document or regulation that
backs an answer — important for medical/compliance verticals and useful for the AI agent's
citation output.

### General Page Content

All `localized: true` text fields and richText fields in Pages, Services, and News
collections are included in the corpus document body. The adapter layer (not the component
layer) is responsible for serializing richText to plain text for corpus output.

---

## API Contract: `/api/ai/corpus`

**Route:** `GET /api/ai/corpus`

**Authentication:** Bearer token (`AI_CORPUS_SECRET` env var). The external AI service
must include `Authorization: Bearer <token>` in its request. Requests without a valid
token receive `401 Unauthorized`.

**Query parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | yes | One of the client's `locales.enabled` values |
| `collection` | string | no | Filter to a single collection slug |
| `updatedSince` | ISO8601 | no | Return only documents updated after this timestamp |
| `page` | integer | no | Pagination (default: 1) |
| `limit` | integer | no | Results per page (default: 100, max: 500) |

**Response (200 OK):**

```json
{
  "locale": "ja",
  "generatedAt": "2026-05-21T09:00:00.000Z",
  "page": 1,
  "totalPages": 3,
  "totalDocuments": 247,
  "documents": [
    {
      "id": "doc-uuid-example",
      "collection": "faqs",
      "slug": "example-faq-slug",
      "title": "Example FAQ title in locale",
      "body": "Plain text body of the answer, serialized from richText.",
      "sources": [
        {
          "label": "Source authority label",
          "url": "https://example.gov/"
        }
      ],
      "locale": "ja",
      "updatedAt": "2026-04-15T14:22:00.000Z"
    }
  ]
}
```

**Response when `features.aiAgent: false` (503 Service Unavailable):**

```json
{
  "error": "AI corpus endpoint is not enabled for this site."
}
```

**Response when stub (Phase 0–1):**

The stub returns the valid envelope with `documents: []` and `totalDocuments: 0`.
This allows the external AI service to be integrated and tested before content is live.

---

## API Contract: `/api/ai/query`

**Route:** `POST /api/ai/query`

**Authentication:** Cloudflare Turnstile token (client-side widget) for user-facing
queries. Bearer token for server-to-server calls. Both are validated before proxying.

**Request body:**

```json
{
  "question": "How long does the visa application process take?",
  "locale": "en",
  "sessionId": "optional-uuid-for-conversation-continuity"
}
```

**Response when `features.aiAgent: false` (501 Not Implemented):**

```json
{
  "error": "AI query endpoint is not enabled for this site.",
  "code": "AI_AGENT_DISABLED"
}
```

**Response when `features.aiAgent: true` (proxied to external AI service):**

```json
{
  "answer": "The visa application review typically takes 2–3 months...",
  "sources": [
    {
      "title": "Visa Requirements for Engineers",
      "url": "/en/faqs/visa-requirements-engineer"
    }
  ],
  "sessionId": "uuid-for-next-turn"
}
```

**Error response (external AI service unavailable):**

```json
{
  "error": "AI service temporarily unavailable.",
  "code": "AI_UPSTREAM_ERROR"
}
```

The Next.js route handler does not implement AI logic. It validates the request,
checks `features.aiAgent`, proxies to the configured external AI service URL
(`integrations.aiServiceUrl` — a future `SiteConfig` field added in Phase 3), and
returns the proxied response. Rate limiting is applied at the Vercel Edge level.

---

## Phase Roadmap for AI Features

| Phase | What ships |
|-------|-----------|
| Phase 0 (now) | This ADR only. No code. |
| Phase 1 | `aiVisible` field on all collections. Stub route handlers return `503`/`501` with valid JSON envelope. `AI_CORPUS_SECRET` documented in `.env.example`. |
| Phase 2 | `/api/ai/corpus` reads from Payload, returns real documents. Pagination and `updatedSince` filtering implemented. richText serializer in adapter layer. |
| Phase 3 | `/api/ai/query` proxy implemented. `integrations.aiServiceUrl` added to `SiteConfig`. External AI service configured per client. Chat widget embedded. |

---

## Consequences (Enables)

- External AI services can integrate with any client site from Phase 1 onward without any
  client-side code change — the seam is already live
- `aiVisible: false` gives editors a simple, non-destructive exclusion mechanism for
  sensitive content without unpublishing
- The `sources` array in FAQs makes citation output trustworthy — particularly important
  for medical and compliance-adjacent content
- The stub envelope in Phase 0–1 lets the external AI service team start integration
  testing before content is authored

## Consequences (Constrains)

- `AI_CORPUS_SECRET` must be provisioned as an env var in every client deployment from
  Phase 1 onward, even if `features.aiAgent: false`. The endpoint exists and must be
  protected against unauthorized access.
- The corpus endpoint must re-serialize Lexical richText to plain text. This serializer
  belongs in the adapter layer, not the component layer, to keep components brand-agnostic.
  It is a non-trivial task deferred to Phase 2.
- Clients wanting a custom corpus shape (e.g., including a proprietary collection) must
  register that collection via `buildCmsConfig` overrides — not by modifying the corpus
  route handler directly.

---

## Open Questions

1. **Corpus update strategy:** Should the external AI service poll `/api/ai/corpus` on a
   schedule, or should the template push to a webhook when content changes? Polling is
   simpler and decoupled; webhooks are more real-time but require the AI service to expose
   an inbound endpoint. Deferred to Phase 3 design.

2. **richText serialization format:** The Lexical format in Payload is complex. The
   serializer must handle headings, lists, links, inline code, and embedded blocks. A
   "markdown-like plain text" output is likely sufficient for AI consumption. Exact format
   deferred to Phase 2 implementation.

3. **Job listings in corpus:** Job listings have a short shelf life and may contain salary
   information that should not be visible to AI by default. Current decision: jobs are
   excluded from the corpus by default (`aiVisible` defaults to `false` for the Jobs
   collection only), and included per-job via explicit editor opt-in.
