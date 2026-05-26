# Animation Inventory — Framer Motion Patterns

All animations use Framer Motion 11.x. Variant objects live in
`packages/cms-core/src/animations/variants.ts` and are imported by block and component files.

**Reduced motion:** All patterns respect `prefers-reduced-motion`. A global `useReducedMotion`
hook (from Framer) sets `duration: 0` and removes `y`/`x` offsets when the OS accessibility
setting is active. The `LogoCloudScroll` pattern uses a CSS `@media` query instead.

---

## Pattern catalogue

### 1. FadeInUp

**Used by:** HeroBlock, StatsBlock, BentoGridBlock, CTABannerBlock, TimelineBlock, FAQBlock,
LogoCloudBlock, RichTextBlock, ServicesGridBlock section heading

**Trigger:** `whileInView`, `once: true`, `margin: "-80px"`

**Variant sketch:**
```ts
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  }
}
```

Each block wraps its outermost `<motion.section>` with `initial="hidden" whileInView="visible"`.
The easing curve `[0.22, 1, 0.36, 1]` is a custom ease-out that feels snappy without being harsh.

---

### 2. StaggerChildren

**Used by:** ServicesGridBlock, TeamGridBlock, BentoGridBlock, LogoCloudBlock

**Trigger:** Applied to the grid container; children inherit parent animation state.

**Variant sketch:**
```ts
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}
// Child items use fadeInUp variant above
```

Container is `<motion.div initial="hidden" whileInView="visible" variants={staggerContainer}>`.
Each child card is `<motion.div variants={fadeInUp}>` — no separate `whileInView` on children.

---

### 3. CountUp

**Used by:** StatsBlock

**Trigger:** First viewport entry via Framer `useInView`

**Variant sketch:**
```ts
// Inside StatsItem component:
const ref = useRef<HTMLSpanElement>(null)
const isInView = useInView(ref, { once: true })
const motionValue = useMotionValue(0)
const rounded = useTransform(motionValue, Math.round)

useEffect(() => {
  if (isInView) {
    animate(motionValue, targetValue, { duration: 1.8, ease: "easeOut" })
  }
}, [isInView])

return <motion.span ref={ref}>{rounded}</motion.span>
```

Duration is fixed at 1.8s regardless of target number — easing makes small numbers feel
snappy and large numbers feel weighty. Each stat item runs its own independent `useMotionValue`.

---

### 4. ScaleOnHover

**Used by:** ServiceCard, TeamCard, NewsCard, JobCard, EventCard

**Trigger:** `whileHover`

**Variant sketch:**
```ts
export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    transition: { duration: 0.2 }
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    transition: { duration: 0.2, ease: "easeOut" }
  }
}
// Usage: <motion.div initial="rest" whileHover="hover" variants={cardHover}>
```

Scale 1.02 is intentional — subtle enough not to disturb surrounding layout.
Cards that have image thumbnails apply scale only to the image wrapper, not the full card,
to prevent text reflow on zoom.

---

### 5. PageFadeTransition

**Used by:** `app/[locale]/layout.tsx` — wraps `<main>`

**Trigger:** Route change (Next.js App Router re-renders page content)

**Variant sketch:**
```ts
export const pageFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, ease: "easeIn" } },
  exit:    { opacity: 0, transition: { duration: 0.15 } }
}
// Wrapper: <AnimatePresence mode="wait"><motion.main key={pathname} variants={pageFade} ...>
```

`mode="wait"` ensures the outgoing page fully fades before the incoming page appears.
Header and Footer are outside `<main>` and do not fade.

---

### 6. CarouselSlide

**Used by:** CaseStudyCarouselBlock

**Trigger:** Drag gesture + programmatic `setInterval` auto-advance

**Variant sketch:**
```ts
// Track wrapper:
<motion.div
  drag="x"
  dragConstraints={{ left: -(itemCount - 1) * slideWidth, right: 0 }}
  dragElastic={0.1}
  animate={{ x: -activeIndex * slideWidth }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  onDragEnd={(_, info) => {
    if (info.velocity.x < -500) advance()
    if (info.velocity.x >  500) retreat()
  }}
>
```

Auto-advance pauses on `onHoverStart` and resumes on `onHoverEnd`.
Velocity threshold: `|velocity.x| > 500` triggers next/previous regardless of drag distance.
Navigation dots are driven by `activeIndex` state.

---

### 7. DrawerSlideIn

**Used by:** MobileMenuDrawer

**Trigger:** `isOpen` boolean state, toggled by Header hamburger

**Variant sketch:**
```ts
export const drawerVariants = {
  closed: { x: "100%", transition: { duration: 0.3,  ease: [0.32, 0, 0.67, 0] } },
  open:   { x: "0%",   transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] } }
}

export const backdropVariants = {
  closed: { opacity: 0 },
  open:   { opacity: 0.5, transition: { duration: 0.3 } }
}

// Usage:
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div key="backdrop" variants={backdropVariants} initial="closed" animate="open" exit="closed" />
      <motion.aside key="drawer"  variants={drawerVariants}  initial="closed" animate="open" exit="closed" />
    </>
  )}
</AnimatePresence>
```

---

### 8. AccordionExpand

**Used by:** FAQBlock

**Trigger:** Per-item `isOpen` state toggled on click

**Variant sketch:**
```ts
// Answer content:
<AnimatePresence initial={false}>
  {isOpen && (
    <motion.div
      key="answer"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.28, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    />
  )}
</AnimatePresence>
```

`initial={false}` on `AnimatePresence` prevents all items from animating on first render.
The question row chevron icon rotates 180°: `animate={{ rotate: isOpen ? 180 : 0 }}`.

---

### 9. LogoCloudScroll

**Used by:** LogoCloudBlock (when `scrolling: true`)

**Trigger:** Continuous — no Framer Motion. Pure CSS animation for performance.

**Implementation:**
```css
@keyframes logoScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.logo-track {
  display: flex;
  animation: logoScroll 30s linear infinite;
  width: max-content; /* two copies side by side */
}

.logo-track:hover {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .logo-track { animation: none; }
}
```

The logo list is duplicated in the DOM (two identical copies) so the scroll appears seamless
when the first copy exits left and the second copy enters from right.

---

### 10. HeroParallax

**Used by:** HeroBlock (when `backgroundImage` is set and viewport width > 640px)

**Trigger:** Window scroll, via Framer `useScroll` + `useTransform`

**Variant sketch:**
```ts
const { scrollY } = useScroll()
const backgroundY = useTransform(scrollY, [0, 400], [0, 80])

// Background image container:
<motion.div
  style={{ y: backgroundY, position: "absolute", inset: "-10%" }}
  aria-hidden
/>
```

Parallax rate: 20% of scroll distance (80px over 400px). Disabled on touch devices
via `@media (hover: none)` and when `useReducedMotion()` returns `true`.
The container has 10% negative inset to prevent empty edges at maximum parallax offset.

---

### 11. GalleryLightbox

**Used by:** GalleryBlock

**Trigger:** Click on `GalleryCard`; dismiss on backdrop click or Escape key

**Variant sketch:**
```ts
// GalleryCard (thumbnail):
<motion.img layoutId={`gallery-${id}`} src={thumbnailSrc} alt={alt} />

// Lightbox overlay:
<AnimatePresence>
  {selectedId && (
    <motion.div
      key="backdrop"
      className="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={dismiss}
    >
      <motion.img
        layoutId={`gallery-${selectedId}`}
        src={fullSrc}
        alt={selectedAlt}
        style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  )}
</AnimatePresence>
```

The shared `layoutId` between thumbnail and lightbox image creates a smooth expand/contract
transition with no additional `initial`/`animate` needed on the image itself.

---

### 12. TimelineDraw

**Used by:** TimelineBlock

**Trigger:** Section scrolls into view (`whileInView`, `once: true`)

**Variant sketch:**
```ts
// Connector SVG line (vertical layout):
<motion.line
  x1="50%" y1="0%" x2="50%" y2="100%"
  stroke="var(--color-primary)"
  strokeWidth={2}
  initial={{ pathLength: 0 }}
  whileInView={{ pathLength: 1 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: "easeOut" }}
/>

// Each item dot (staggered):
const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: i * 0.15 + 0.3, duration: 0.3 }
  })
}
```

Dots use a custom `delay` based on item index so each one appears after the line segment
above it draws in. Horizontal timeline variant (desktop): line draws left to right (`x1: 0%, x2: 100%`).
