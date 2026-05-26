# Inner Pages — Saidatech Template

Each entry documents: purpose, block render order, primary CTAs, CMS data required,
and per-field localization decisions.

**Localization conventions used throughout:**

- **Localizes** — field is `Record<locale, string>` in Payload, translated for every locale
  in `locales.enabled`.
- **Static** — single value, same across all locales.
- Japanese address format: `〒postal-code 都道府県市区町村番地` in the `ja` locale.
- Bengali (`bn`) locale applies to Saidatech only; Clinic and School seeds omit `bn` keys.
- Slug, date/time, phone, email, file URL, map embed URL — always static.

---

## 1. About

**Purpose:** Tells the organisation's story, builds trust, confirms the team behind the service.

**Blocks in render order:**
1. `HeroBlock` — page-level hero (shorter variant; text-focused, lighter overlay)
2. `RichTextBlock` — company story: founding context, mission, values
3. `TimelineBlock` — key milestones (`mode: "history"`)
4. `TeamGridBlock` — featured team preview linking to `/team` — `features.team`
5. `LogoCloudBlock` — partner/certification logos
6. `CTABannerBlock` — "Get in touch" or "View our services"

**Primary CTAs:** Contact page, Services index.

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Page heading, subheading | `Pages` (about) hero group | Yes |
| Story body (Lexical) | `Pages` (about) `RichTextBlock` | Yes |
| Timeline item label | `Pages` (about) `timelineItems` | Yes |
| Timeline item description | `Pages` (about) `timelineItems` | Yes |
| Timeline item year | `Pages` (about) `timelineItems.year` | No |
| Team member name | `Team` collection | No |
| Team member title | `Team` collection | Yes |
| Team member photo | `Team` collection (media) | No |
| Logo name, href | `Globals → Logos` | No |

---

## 2. Services Index

**Purpose:** Presents the full service catalogue as entry point to detail pages.

**Blocks in render order:**
1. `HeroBlock` — page-level hero (shorter)
2. `RichTextBlock` — intro paragraph: what the services cover and who they are for
3. `ServicesGridBlock` — all active services (no 6-item cap here)
4. `CTABannerBlock` — "Still unsure? Talk to us."

**Primary CTAs:** Individual service detail pages, Contact.

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Page heading | `Pages` (services) | Yes |
| Intro body | `Pages` (services) `RichTextBlock` | Yes |
| Service title | `Services` collection | Yes |
| Service excerpt | `Services` collection | Yes |
| Service thumbnail | `Services` (media) | No |
| Service slug | `Services` | No |

---

## 3. Service Detail `[slug]`

**Purpose:** Explains a single service in depth — what it is, how it works, who it is for.

**Blocks in render order:**
1. `HeroBlock` — service-level hero (title, thumbnail as background)
2. `RichTextBlock` — full Lexical service description
3. `StatsBlock` — optional, service-specific metrics
4. `CTABannerBlock` — primary conversion action for this service

**Primary CTAs:** Contact page (general enquiry, or service-specific subject line pre-filled).

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Service title | `Services` | Yes |
| Service body (Lexical) | `Services` | Yes |
| Service thumbnail | `Services` (media) | No |
| Service slug | `Services` | No |
| Stats item label | `Services` — embedded stats array | Yes |
| Stats item value | `Services` — embedded stats array | No |
| CTA heading, body, button label | `Services` — CTA group | Yes |

---

## 4. News Index

**Purpose:** Archive of news articles, announcements, and blog posts. Paginated.

**Feature gate:** `features.news`

**Page template renders (not configurable blocks):**
1. `HeroBlock` — short page-level hero
2. Category filter pills
3. Paginated `NewsCard` grid (12 per page)

**Primary CTAs:** Individual article pages.

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Page heading | `Pages` (news) | Yes |
| Article title | `News` | Yes |
| Article excerpt | `News` | Yes |
| Article featured image | `News` (media) | No |
| Article slug | `News` | No |
| Article publishedAt | `News` | No |
| Article category label | `News` | Yes |

---

## 5. News Article `[slug]`

**Purpose:** Full news article or blog post.

**Feature gate:** `features.news`

**Page template renders:**
1. Article header (title, date, author, featured image) — page template
2. `RichTextBlock` — full Lexical body
3. Related articles row (up to 3, same category) — page template

**Primary CTAs:** Related articles, Contact.

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Title | `News` | Yes |
| Body (Lexical) | `News` | Yes |
| Excerpt | `News` | Yes |
| Featured image | `News` (media) | No |
| Author name | `News` (text or relation to `Team`) | No |
| Published date | `News` | No |
| Category label | `News` | Yes |
| `aiVisible` | `News` | No |

---

## 6. Team Index

**Purpose:** Full listing of team members.

**Feature gate:** `features.team`

**Blocks in render order:**
1. `HeroBlock` — page-level hero
2. `TeamGridBlock` — all active team members, sorted by `sortOrder`

**Primary CTAs:** Individual team member profiles.

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Page heading | `Pages` (team) | Yes |
| Team member name | `Team` | No |
| Team member title | `Team` | Yes |
| Team member photo | `Team` (media) | No |
| Team member sortOrder | `Team` | No |

---

## 7. Team Member Detail `[slug]`

**Purpose:** Individual profile — credentials, bio, areas of expertise.

**Feature gate:** `features.team`

**Blocks in render order:**
1. Profile header (photo, name, title) — page template
2. `RichTextBlock` — full bio
3. `CTABannerBlock` — "Contact our team"

**Primary CTAs:** Contact page.

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Name | `Team` | No |
| Title | `Team` | Yes |
| Photo | `Team` (media) | No |
| Full bio (Lexical) | `Team` | Yes |
| Slug | `Team` | No |
| Qualifications | `Team` — text array | Yes |
| `aiVisible` | `Team` | No |

---

## 8. Jobs Index

**Purpose:** Lists all open positions. Primary acquisition page for job-seeking audience.

**Feature gate:** `features.jobListings`

**Page template renders:**
1. `HeroBlock` — short page-level hero
2. Filter bar (location, job type, category) — page template
3. Paginated `JobCard` list (12 per page)
4. `CTABannerBlock` — "Don't see your role? Send a general enquiry."

**Primary CTAs:** Individual job detail pages.

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Page heading | `Pages` (jobs) | Yes |
| Job title | `Jobs` | Yes |
| Job location | `Jobs` | Yes |
| Job type label | `Jobs` (enum: full-time, part-time, contract, intern) | Yes |
| Job category label | `Jobs` | Yes |
| Job excerpt | `Jobs` | Yes |
| Job slug | `Jobs` | No |
| Job publishedAt | `Jobs` | No |
| Job closingDate | `Jobs` | No |

---

## 9. Job Detail `[slug]`

**Purpose:** Full job description with inline application form.

**Feature gate:** `features.jobListings`

**Blocks in render order:**
1. Job header (title, location, type, closing date) — page template
2. `RichTextBlock` — full job description
3. `ContactFormBlock` — job application variant (`variant: "job-apply"`)

**Primary CTAs:** Submit application.

**Form recipient:** `forms.jobApplicationRecipient` from `site.config` (Resend `to:`).

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Job title | `Jobs` | Yes |
| Job body (Lexical) | `Jobs` | Yes |
| Location | `Jobs` | Yes |
| Job type label | `Jobs` | Yes |
| Closing date | `Jobs` | No |
| Salary range | `Jobs` (optional) | Yes |
| Required qualifications | `Jobs` — text array | Yes |

---

## 10. Events Index

**Purpose:** School calendar — upcoming and past events.

**Feature gate:** `features.events`

**Blocks in render order:**
1. `HeroBlock` — page-level hero
2. `EventListBlock` — full list, toggled between upcoming / past via tab

**Primary CTAs:** Individual event detail pages, Contact.

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Page heading | `Pages` (events) | Yes |
| Event title | `Events` | Yes |
| Event startDate | `Events` | No |
| Event endDate | `Events` | No |
| Event location | `Events` | Yes |
| Event category label | `Events` | Yes |
| Event thumbnail | `Events` (media) | No |
| Event slug | `Events` | No |

---

## 11. Event Detail `[slug]`

**Purpose:** Full event description, date, location, downloadable materials.

**Feature gate:** `features.events`

**Blocks in render order:**
1. Event header (title, date, location) — page template
2. `RichTextBlock` — full event description
3. Download attachment row (when `attachment` field is set) — page template

**Primary CTAs:** Download attachment, Contact for enquiries.

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Title | `Events` | Yes |
| Body (Lexical) | `Events` | Yes |
| Start/end date | `Events` | No |
| Location | `Events` | Yes |
| Attachment | `Events` (media — PDF) | No |
| `aiVisible` | `Events` | No |

---

## 12. Gallery

**Purpose:** Visual showcase — treatment results (Clinic), school life (School).

**Feature gate:** `features.gallery`

**Blocks in render order:**
1. `HeroBlock` — short page-level hero
2. Category filter pills — page template
3. `GalleryBlock` — filterable grid with lightbox

**Primary CTAs:** Contact, Book appointment (Clinic only via `features.bookingWidget`).

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Page heading | `Pages` (gallery) | Yes |
| Image | `Gallery` (media) | No |
| Image alt text | `Gallery` | Yes |
| Image caption | `Gallery` | Yes |
| Category label | `Gallery` | Yes |

---

## 13. Downloads

**Purpose:** Downloadable resources — guides, forms, term calendars, clinical leaflets.

**Feature gate:** `features.downloads`

**Page template renders:**
1. `HeroBlock` — short page-level hero
2. Category filter pills — page template
3. `DownloadCard` grid (reads `Downloads` collection)

**Primary CTAs:** Download file (direct), Contact if file not found.

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Page heading | `Pages` (downloads) | Yes |
| Download title | `Downloads` | Yes |
| Download description | `Downloads` | Yes |
| File | `Downloads` (media — PDF, XLSX, DOCX) | No |
| File size (computed by Payload) | `Downloads` | No |
| Category label | `Downloads` | Yes |
| `aiVisible` | `Downloads` | No |

---

## 14. Locations

**Purpose:** Physical location, opening hours, and embedded map.

**Feature gate:** `features.locations`

**Blocks in render order:**
1. `HeroBlock` — short page-level hero
2. `HoursLocationBlock` — address, hours table, Google Maps embed iframe

**Primary CTAs:** Call phone number, Get directions (external maps link), Book appointment (Clinic).

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Page heading | `Pages` (locations) | Yes |
| Address | `site.config.contact.address` (`Record<locale, string>`) | Yes |
| Business hours | `site.config.contact.businessHours` (`Record<locale, string>`) | Yes |
| Map embed URL | `site.config.contact.mapEmbedUrl` | No |
| Phone | `site.config.contact.phone` | No |

---

## 15. FAQ

**Purpose:** Full FAQ accordion for visitors who want comprehensive answers before contacting.

**Blocks in render order:**
1. `HeroBlock` — short page-level hero
2. `FAQBlock` — all active FAQs, grouped by category

**Primary CTAs:** Contact (at page bottom).

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Page heading | `Pages` (faq) | Yes |
| FAQ question | `FAQs` | Yes |
| FAQ answer (Lexical) | `FAQs` | Yes |
| FAQ category label | `FAQs` | Yes |
| FAQ sortOrder | `FAQs` | No |
| `aiVisible` | `FAQs` | No |

---

## 16. Contact

**Purpose:** Primary conversion page — enquiry form, office details, optional map.

**Blocks in render order:**
1. `HeroBlock` — short page-level hero
2. `ContactFormBlock` — general enquiry form (Cloudflare Turnstile protected)
3. `HoursLocationBlock` — rendered only when `features.locations: true`

**Primary CTAs:** Submit enquiry form, Call phone number, Email direct link.

**Form recipient:** `forms.contactRecipient` from `site.config` (Resend `to:`).

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Page heading | `Pages` (contact) | Yes |
| Form field labels, placeholders | `messages/{locale}.json` translation files | Yes |
| Form success/error messages | `messages/{locale}.json` | Yes |
| Address | `site.config.contact.address` | Yes |
| Business hours | `site.config.contact.businessHours` | Yes |
| Phone | `site.config.contact.phone` | No |
| Email | `site.config.contact.email` | No |
| Map embed URL | `site.config.contact.mapEmbedUrl` | No |

---

## 17. Privacy Policy / Terms / Cookie Policy

**Purpose:** Legal compliance pages. Content authored in Payload, not hardcoded in components.

All three pages share the same template:
1. `HeroBlock` — title only, minimal variant
2. `RichTextBlock` — full legal text (Lexical)

**CMS data:**

| Field | Source | Localizes |
|-------|--------|-----------|
| Page title | `Pages` (privacy / terms / cookie-policy) | Yes |
| Legal body (Lexical) | `Pages` | Yes |

**Localization note:** Legal text always localizes. Japanese privacy law (APPI) requirements
differ substantively from GDPR-style English language; the `ja` legal text is not a translation
of the `en` text — it is independently authored by a Japanese legal professional.

**Conditional presence:**
- `/terms` rendered only when `legal.termsSlug` is defined in `site.config`
- `/cookie-policy` rendered only when `legal.cookiePolicySlug` is defined
