# Homepage Sections — Saidatech Template

Each homepage is composed from a Payload `blocks` array on the root Page document.
The CMS author assembles sections by adding blocks in this order. The order below is
the **recommended default seed order** — it can be reordered per client in Payload admin.

Every section maps to exactly one block. No block appears twice on the homepage.

---

## Section order

| # | Section name | Block | Purpose | Target audience | CMS data source | Saidatech | Clinic | School |
|---|-------------|-------|---------|-----------------|-----------------|-----------|--------|--------|
| 1 | Primary Hero | `HeroBlock` | Headline, tagline, primary CTA button, full-bleed background image | All first-time visitors | `Pages` document — hero group fields | active | active | active |
| 2 | Key Stats | `StatsBlock` | 3–5 numeric proof points (years active, placements, countries served) | Skeptical evaluators | `Globals → SiteStats` | active | active | active |
| 3 | Services Overview | `ServicesGridBlock` | 3–6 service cards linking to `/services/[slug]` | Decision-makers | `Services` collection (first 6 by sort) | active | active | active |
| 4 | Why Choose Us | `BentoGridBlock` | 4–6 asymmetric value-proposition tiles | Comparison shoppers | `Pages` — bento items array | active | active | active |
| 5 | Success Stories | `CaseStudyCarouselBlock` | Rotating carousel of testimonials or case study excerpts | Trust-seekers | `Testimonials` collection | active `(features.testimonials)` | active `(features.testimonials)` | — |
| 6 | Process / History | `TimelineBlock` | Milestones or step-by-step process, author-selectable mode | New visitors building trust | `Pages` — timeline items array | active | active | active |
| 7 | Partners & Certifications | `LogoCloudBlock` | Partner/client/certification logos | Credibility-seekers | `Globals → Logos` | active | active | active |
| 8 | Our Team | `TeamGridBlock` | 3–4 featured team member cards | Trust-seekers | `Team` collection — `featured: true` items | active `(features.team)` | active `(features.team)` | active `(features.team)` |
| 9 | Upcoming Events | `EventListBlock` | Next 3 events: date chip, title, location | Parents, community | `Events` collection — upcoming, sorted by date | — | — | active `(features.events)` |
| 10 | Top FAQ | `FAQBlock` | 4–6 accordion items | All visitors | `FAQs` collection — `homepage: true` items | active | active | active |
| 11 | Final CTA | `CTABannerBlock` | Full-width conversion banner with headline and primary button | Ready-to-act visitors | `Pages` — CTA group fields | active | active | active |

---

## Blocks NOT used on the homepage

The following blocks exist in the template but appear on inner pages only:

| Block | Used on |
|-------|---------|
| `GalleryBlock` | `/gallery` |
| `HoursLocationBlock` | `/contact`, `/locations` |
| `RichTextBlock` | News articles, service detail, job detail, about, legal pages |
| `ContactFormBlock` | `/contact`, `/jobs/[slug]` |

---

## Section detail notes

### 1. HeroBlock

First impression. Communicates what the organisation does, for whom, and what the visitor should do next.

**CMS fields:** `heading` (localized), `subheading` (localized), `ctaPrimary.label` (localized),
`ctaPrimary.href`, `ctaSecondary.label` (localized, optional), `ctaSecondary.href` (optional),
`backgroundImage` (Payload media), `overlayOpacity` (number 0–100).

Per-vertical tone:
- Saidatech: career and visa services for foreign workers in Japan
- Clinic: booking-forward; primary CTA targets appointment booking or contact
- School: welcoming, community-forward; primary CTA targets admissions or enquiry

---

### 2. StatsBlock

Instant social proof. Three to five numbers that answer "how established / proven is this organisation?"

**CMS fields (Globals → SiteStats):** array of `{ value: number, label: Record<locale,string>, icon?: string }`.
Value is a raw number; the component handles formatting (e.g. "2,000+" suffix from a `suffix` field).

---

### 3. ServicesGridBlock

Entry point to the service catalogue. Renders the first six services ordered by `sort` field.
Links each card to `/services/[slug]`.

**CMS fields (Services collection):** `title` (localized), `excerpt` (localized), `thumbnail` (media),
`slug`, `icon` (Lucide icon name or custom SVG reference).

---

### 4. BentoGridBlock

Differentiates the organisation from competitors using an asymmetric tile layout. At least one
`"large"` tile draws attention to the strongest value proposition.

**CMS fields (Pages — bentoItems array, max 6):** `heading` (localized), `body` (localized),
`size` (`"large"` | `"small"`), `icon` (optional), `accentColor` (optional CSS color override).

---

### 5. CaseStudyCarouselBlock

Rotating carousel of testimonials or case study summaries. Provides evidence that services work.

**Feature gate:** `features.testimonials`

**CMS fields (Testimonials collection):** `quote` (localized), `author.name`, `author.title` (localized),
`author.photo` (media, optional), `company` (optional), `rating` (1–5, optional), `active` (boolean).

---

### 6. TimelineBlock

Builds trust through history or provides process clarity. Author sets `mode` in Payload.

**CMS fields (Pages — timelineItems array):** `year` (string, static — used in "history" mode),
`label` (localized), `description` (localized, optional), `icon` (optional), `mode` (`"history"` | `"process"`).

---

### 7. LogoCloudBlock

Signals credibility via recognised partners, clients, or certification bodies.

**CMS fields (Globals → Logos):** array of `{ name, logoLight: media, logoDark: media, href?: string }`.
`logoLight` is used on dark-background sections; `logoDark` on light backgrounds.

---

### 8. TeamGridBlock

Puts faces to the organisation. Filtered to `featured: true` on the homepage (3–4 members).

**Feature gate:** `features.team`

**CMS fields (Team collection):** `name`, `title` (localized), `photo` (media), `featured` (boolean),
`sortOrder` (number), `bio` (localized — short form used on homepage card).

---

### 9. EventListBlock (School only)

Keeps the school community informed and demonstrates active programming to prospective families.
Pulls the next 3 events where `startDate >= today`.

**Feature gate:** `features.events` — absent from Saidatech and Clinic homepages.

**CMS fields (Events collection):** `title` (localized), `startDate`, `location` (localized, optional), `slug`.

---

### 10. FAQBlock

Reduces pre-contact friction. Homepage variant shows a maximum of 6 items (`homepage: true`).
Full FAQ page shows all items.

**CMS fields (FAQs collection):** `question` (localized), `answer` (Lexical, localized),
`homepage` (boolean), `sortOrder` (number), `aiVisible` (boolean — for AI corpus endpoint).

---

### 11. CTABannerBlock

Final conversion push. Full-width, high-contrast, one clear action. No competing elements.

**CMS fields (Pages — cta group):** `heading` (localized), `subheading` (localized, optional),
`primaryButton.label` (localized), `primaryButton.href`,
`secondaryButton.label` (localized, optional), `secondaryButton.href` (optional),
`variant` (`"filled"` | `"outlined"` | `"image-bg"`).
