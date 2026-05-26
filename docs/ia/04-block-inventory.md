# Block Inventory — Saidatech Template

All 15 Payload blocks used in the template. Every block maps to a feature flag in
`docs/variability-matrix.md` (rows 29–44) or is flagged always-on.

Each block has four files in the implementation phase:
- `config.ts` — Payload block config (field definitions)
- `component.tsx` — React render component
- `adapter.ts` — maps Payload types to component props
- `types.ts` — TypeScript interfaces for block props

Block components **never** import from `@/payload-types`. Adapters handle that boundary.

---

## Block summary table

| # | Block name | Feature flag | Matrix row | Verticals | Pages used |
|---|-----------|-------------|-----------|-----------|-----------|
| 1 | `HeroBlock` | always-on | — | all | Homepage, About, all inner page heroes |
| 2 | `StatsBlock` | always-on | — | all | Homepage, About, Service detail |
| 3 | `ServicesGridBlock` | always-on | — | all | Homepage, Services index |
| 4 | `BentoGridBlock` | always-on | — | all | Homepage |
| 5 | `CaseStudyCarouselBlock` | `features.testimonials` | row 34 | Saidatech, Clinic | Homepage |
| 6 | `TimelineBlock` | always-on | — | all | About, Service detail |
| 7 | `LogoCloudBlock` | always-on | — | all | Homepage, About |
| 8 | `CTABannerBlock` | always-on | — | all | Homepage, most inner pages |
| 9 | `RichTextBlock` | always-on | — | all | About, Service detail, News article, Job detail, Team member, Legal pages |
| 10 | `FAQBlock` | always-on (FAQs collection always registered) | row 44 | all | Homepage, FAQ page |
| 11 | `ContactFormBlock` | always-on | — | all | Contact, Job detail |
| 12 | `TeamGridBlock` | `features.team` | row 37 | all | Homepage, About, Team index |
| 13 | `EventListBlock` | `features.events` | row 32 | School | Homepage (School), Events index |
| 14 | `GalleryBlock` | `features.gallery` | row 33 | Clinic, School | Gallery page |
| 15 | `HoursLocationBlock` | `features.locations` | row 38 | Clinic | Contact, Locations page |

---

## Field definitions per block

### 1. HeroBlock

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `heading` | text | Yes | Yes | H1 for the page |
| `subheading` | text | Yes | No | Displayed below heading |
| `ctaPrimary.label` | text | Yes | Yes | Primary button label |
| `ctaPrimary.href` | text | No | Yes | Internal or external URL |
| `ctaSecondary.label` | text | Yes | No | |
| `ctaSecondary.href` | text | No | No | |
| `backgroundImage` | upload (media) | No | No | Falls back to brand OG image |
| `overlayOpacity` | number (0–100) | No | No | Default: 50 |
| `variant` | select (`"center"` \| `"left"` \| `"split"`) | No | No | Default: `"center"` |
| `minHeight` | select (`"full"` \| `"large"` \| `"medium"` \| `"small"`) | No | No | Default: `"large"` |
| `transparentHeader` | checkbox | No | No | Removes header background on this page |

---

### 2. StatsBlock

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `sectionHeading` | text | Yes | No | Optional label above the row |
| `items` | array (max 6) | — | Yes | |
| `items[].value` | number | No | Yes | Raw number; component formats with separators |
| `items[].suffix` | text | No | No | Appended after value, e.g. `"+"` or `"%"` |
| `items[].label` | text | Yes | Yes | Descriptive label, e.g. `"Countries served"` |
| `items[].icon` | text | No | No | Lucide icon name |

---

### 3. ServicesGridBlock

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `sectionHeading` | text | Yes | No | |
| `sectionSubheading` | text | Yes | No | |
| `services` | relationship (→ Services, hasMany) | No | Yes | Order from drag-sort |
| `columns` | select (`"3"` \| `"4"`) | No | No | Default: `"3"` |

**Services collection fields (referenced):**

| Field name | Payload type | Localized | Required |
|-----------|-------------|-----------|----------|
| `title` | text | Yes | Yes |
| `excerpt` | textarea | Yes | Yes |
| `thumbnail` | upload (media) | No | No |
| `icon` | text | No | No | Lucide icon name or custom SVG filename |
| `slug` | text | No | Yes |
| `sort` | number | No | No |
| `active` | checkbox | No | Yes |
| `aiVisible` | checkbox | No | Yes |

---

### 4. BentoGridBlock

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `sectionHeading` | text | Yes | No | |
| `items` | array (max 6) | — | Yes | At least one `"large"` size required |
| `items[].heading` | text | Yes | Yes | |
| `items[].body` | text | Yes | No | Short paragraph |
| `items[].size` | select (`"large"` \| `"small"`) | No | Yes | |
| `items[].icon` | text | No | No | Lucide icon name |
| `items[].image` | upload (media) | No | No | Optional background for large tile |

---

### 5. CaseStudyCarouselBlock

**Feature gate:** `features.testimonials` (Variability Matrix row 34)

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `sectionHeading` | text | Yes | No | |
| `items` | relationship (→ Testimonials, hasMany) | No | Yes | |
| `autoAdvanceSeconds` | number | No | No | Default: 5; set 0 to disable |

**Testimonials collection fields (referenced):**

| Field name | Payload type | Localized | Required |
|-----------|-------------|-----------|----------|
| `quote` | textarea | Yes | Yes |
| `author.name` | text | No | Yes |
| `author.title` | text | Yes | No |
| `author.photo` | upload (media) | No | No |
| `company` | text | No | No |
| `rating` | number (1–5) | No | No |
| `active` | checkbox | No | Yes |

---

### 6. TimelineBlock

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `sectionHeading` | text | Yes | No | |
| `mode` | select (`"history"` \| `"process"`) | No | Yes | |
| `items` | array | — | Yes | |
| `items[].year` | text | No | No | Used in `"history"` mode |
| `items[].stepNumber` | number | No | No | Used in `"process"` mode |
| `items[].label` | text | Yes | Yes | |
| `items[].description` | textarea | Yes | No | |
| `items[].icon` | text | No | No | Lucide icon name |

---

### 7. LogoCloudBlock

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `sectionHeading` | text | Yes | No | |
| `scrolling` | checkbox | No | No | Enables CSS infinite scroll animation |

Logo data is read from `Globals → Logos` — not per-block.

**Logos Global fields (referenced):**

| Field name | Payload type | Localized | Required |
|-----------|-------------|-----------|----------|
| `name` | text | No | Yes |
| `logoLight` | upload (media) | No | Yes |
| `logoDark` | upload (media) | No | No |
| `href` | text | No | No |

---

### 8. CTABannerBlock

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `heading` | text | Yes | Yes | |
| `subheading` | text | Yes | No | |
| `primaryButton.label` | text | Yes | Yes | |
| `primaryButton.href` | text | No | Yes | |
| `secondaryButton.label` | text | Yes | No | |
| `secondaryButton.href` | text | No | No | |
| `variant` | select (`"filled"` \| `"outlined"` \| `"image-bg"`) | No | No | Default: `"filled"` |
| `backgroundImage` | upload (media) | No | No | Required when `variant: "image-bg"` |

---

### 9. RichTextBlock

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `content` | richText (Lexical) | Yes | Yes | Full Lexical editor |
| `maxWidth` | select (`"prose"` \| `"wide"` \| `"full"`) | No | No | Default: `"prose"` |

---

### 10. FAQBlock

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `sectionHeading` | text | Yes | No | |
| `items` | relationship (→ FAQs, hasMany) | No | Yes | Author curates; drag-sort order |
| `variant` | select (`"accordion"` \| `"grid"`) | No | No | Default: `"accordion"` |

**FAQs collection fields (referenced):**

| Field name | Payload type | Localized | Required |
|-----------|-------------|-----------|----------|
| `question` | text | Yes | Yes |
| `answer` | richText (Lexical) | Yes | Yes |
| `category` | text | Yes | No |
| `homepage` | checkbox | No | No |
| `sortOrder` | number | No | No |
| `aiVisible` | checkbox | No | Yes |

---

### 11. ContactFormBlock

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `variant` | select (`"contact"` \| `"job-apply"`) | No | Yes | Controls fields shown + Resend recipient |
| `heading` | text | Yes | No | |
| `subheading` | text | Yes | No | |
| `showTurnstile` | checkbox | No | No | Default: `true`; disable in dev only |

Form field labels, placeholders, validation messages are in `messages/{locale}.json` — not in Payload.

---

### 12. TeamGridBlock

**Feature gate:** `features.team` (Variability Matrix row 37)

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `sectionHeading` | text | Yes | No | |
| `members` | relationship (→ Team, hasMany) | No | No | When empty, renders all `featured: true` |
| `columns` | select (`"3"` \| `"4"`) | No | No | Default: `"3"` |
| `showBio` | checkbox | No | No | Default: `false` (homepage), `true` (team page) |

**Team collection fields (referenced):**

| Field name | Payload type | Localized | Required |
|-----------|-------------|-----------|----------|
| `name` | text | No | Yes |
| `title` | text | Yes | Yes |
| `photo` | upload (media) | No | No |
| `bio` | richText (Lexical) | Yes | No |
| `slug` | text | No | Yes |
| `featured` | checkbox | No | No |
| `sortOrder` | number | No | No |
| `aiVisible` | checkbox | No | Yes |

---

### 13. EventListBlock

**Feature gate:** `features.events` (Variability Matrix row 32)

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `sectionHeading` | text | Yes | No | |
| `limit` | number | No | No | Default: 3 (homepage), 0 = unlimited (events page) |
| `showPastToggle` | checkbox | No | No | Default: `false` (homepage), `true` (events page) |
| `category` | text | No | No | Optional filter by category slug |

**Events collection fields (referenced):**

| Field name | Payload type | Localized | Required |
|-----------|-------------|-----------|----------|
| `title` | text | Yes | Yes |
| `startDate` | date | No | Yes |
| `endDate` | date | No | No |
| `location` | text | Yes | No |
| `excerpt` | textarea | Yes | No |
| `thumbnail` | upload (media) | No | No |
| `category` | text | Yes | No |
| `slug` | text | No | Yes |
| `attachment` | upload (media — PDF) | No | No |
| `aiVisible` | checkbox | No | Yes |

---

### 14. GalleryBlock

**Feature gate:** `features.gallery` (Variability Matrix row 33)

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `sectionHeading` | text | Yes | No | |
| `categories` | text array | No | No | Filter pills; empty = show all |
| `columns` | select (`"2"` \| `"3"` \| `"4"`) | No | No | Default: `"3"` |
| `lightbox` | checkbox | No | No | Default: `true` |

**Gallery collection fields (referenced):**

| Field name | Payload type | Localized | Required |
|-----------|-------------|-----------|----------|
| `image` | upload (media) | No | Yes |
| `alt` | text | Yes | Yes |
| `caption` | text | Yes | No |
| `category` | text | Yes | No |
| `sortOrder` | number | No | No |

---

### 15. HoursLocationBlock

**Feature gate:** `features.locations` (Variability Matrix row 38)

| Field name | Payload type | Localized | Required | Notes |
|-----------|-------------|-----------|----------|-------|
| `sectionHeading` | text | Yes | No | |
| `showMap` | checkbox | No | No | Default: `true`; requires `contact.mapEmbedUrl` |
| `showHours` | checkbox | No | No | Default: `true`; requires `contact.businessHours` |
| `showAddress` | checkbox | No | No | Default: `true`; requires `contact.address` |
| `showPhone` | checkbox | No | No | Default: `true`; requires `contact.phone` |

All location data (address, hours, phone, map URL) is read from `site.config.contact` —
not from Payload. These block fields are display toggles only.
