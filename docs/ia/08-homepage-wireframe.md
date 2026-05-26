# Homepage Wireframe — Saidatech

Structural wireframes for the Saidatech homepage. All sections map to block types
defined in `packages/cms-core/src/blocks/`. Measurements are approximate design
targets, not enforced pixel values.

---

## Section 1 — Header (sticky, ~64px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [LOGO]          Services  Jobs  About  News  Contact    [EN▾] [CTA]│
│                                                           ───────────│
│  bg: --color-background/95, backdrop-blur                           │
│  border-bottom: 1px neutral-200                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Mobile** (~56px):
```
┌──────────────────────────────────┐
│  [LOGO]                    [☰]  │
└──────────────────────────────────┘
```
Drawer slides in from right at 288px width with dark backdrop.

Block: `HeaderGlobal` (Payload global) + `MobileMenu` client component.
Responsive: desktop flex row / mobile hamburger toggle.

---

## Section 2 — Hero Block (~600px min-height)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌─── Full-width background image (parallax max 30px on scroll) ──┐ │
│  │                                                                 │ │
│  │   [Eyebrow label — small caps, --color-accent]                  │ │
│  │                                                                 │ │
│  │   H1 heading (3xl–5xl, --font-weight-heading)                   │ │
│  │   Sub-heading (lg, --color-muted)                               │ │
│  │                                                                 │ │
│  │   [Primary CTA Button]   [Ghost CTA Button]                     │ │
│  │                                                                 │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Block: `HeroBlock` — FadeInUp on mount, HeroParallax on background.
Responsive: center-aligned on mobile, left-aligned on ≥md.

---

## Section 3 — Logo Cloud (~100px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← [Logo] [Logo] [Logo] [Logo] [Logo] [Logo] [Logo] →  (scrolling) │
│  bg: --color-surface                                                │
└─────────────────────────────────────────────────────────────────────┘
```

Block: `LogoCloudBlock` — CSS keyframe scroll (no Framer Motion), pauses on hover.
Reduced motion: static row, no animation.

---

## Section 4 — Stats Block (~160px)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│    [1,200+]        [98%]          [15+]          [3]                │
│  Placements    Satisfaction   Countries       Languages              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Block: `StatsBlock` — CountUp animation on first viewport entry.
Responsive: 2×2 grid on mobile, 4-column row on ≥md.

---

## Section 5 — Services Grid (~560px)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   [Section heading — H2, center aligned]                            │
│   [Sub-heading — muted, center aligned]                             │
│                                                                     │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐                           │
│   │ [Icon]  │  │ [Icon]  │  │ [Icon]  │                           │
│   │ Title   │  │ Title   │  │ Title   │   ← StaggerChildren        │
│   │ Excerpt │  │ Excerpt │  │ Excerpt │     FadeInUp per card      │
│   └─────────┘  └─────────┘  └─────────┘                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Block: `ServicesGridBlock` — ScaleOnHover on each card.
Responsive: 1-col mobile → 2-col sm → 3-col lg.

---

## Section 6 — Bento Grid / About (~480px)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ┌───────────────────────┐  ┌──────────┐  ┌──────────┐           │
│   │                       │  │          │  │          │           │
│   │   Large feature card  │  │ Stat or  │  │ Quote or │           │
│   │   (image + heading)   │  │  visual  │  │  badge   │           │
│   │                       │  │          │  │          │           │
│   └───────────────────────┘  └──────────┘  └──────────┘           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Block: `BentoGridBlock` — FadeInUp + StaggerChildren.
Responsive: single column stack on mobile.

---

## Section 7 — News / Latest Updates (~440px)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   [H2 heading]                              [View all → link]       │
│                                                                     │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│   │ [thumbnail]  │  │ [thumbnail]  │  │ [thumbnail]  │            │
│   │ Date · Tag   │  │ Date · Tag   │  │ Date · Tag   │            │
│   │ Headline     │  │ Headline     │  │ Headline     │            │
│   └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Block: Latest 3 posts from News collection (future block — not in Phase 2).
Responsive: 1-col mobile → 3-col md.

---

## Section 8 — CTA Banner (~200px)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   [H2 heading — white on --color-primary background]               │
│   [Sub-text — white, opacity 0.85]                                  │
│                                                                     │
│                    [CTA Button — white/outline]                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Block: `CTABannerBlock` — FadeInUp on scroll entry.
Background: `--color-primary` with optional diagonal pattern overlay.

---

## Section 9 — Footer (~320px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: neutral-950 (dark)                                             │
│                                                                     │
│   Services        Jobs           About         Contact              │
│   ─────────       ─────────      ─────────     ─────────           │
│   Visa support    Job board       Our team      Email               │
│   Placement       Apply now       Company       Address             │
│   Seminars        FAQ             News                              │
│                                                                     │
│   ─────────────────────────────────────────────────────────────── │
│   [LinkedIn icon]                                                   │
│                                                                     │
│   ─────────────────────────────────────────────────────────────── │
│   © 2026 Saidatech. All rights reserved.   Privacy  Terms          │
└─────────────────────────────────────────────────────────────────────┘
```

Component: `Footer` (Server Component) — fetches Payload `footer` global.
Social icons: from `siteConfig.nav.socialLinks`.
Legal links: from `siteConfig.nav.legalLinks`.
Responsive: 2-col grid mobile → 4-col lg.
