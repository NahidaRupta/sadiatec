import Link from 'next/link'
import type { PageHeroBlockProps, PageHeroBreadcrumbItem } from './types'

function minHeightClass(h: string | undefined): string {
  if (h === 'sm') return 'min-h-[240px]'
  if (h === 'lg') return 'min-h-[480px]'
  return 'min-h-[360px]'
}

function overlayColorClass(c: string | undefined): string {
  if (c === 'brand') return 'bg-[var(--color-primary)]'
  if (c === 'none') return ''
  return 'bg-black'
}

function PageTitleVariant({
  pageTitle,
  showBreadcrumb,
  breadcrumbItems,
}: {
  pageTitle: string
  showBreadcrumb?: boolean | undefined
  breadcrumbItems?: PageHeroBreadcrumbItem[] | undefined
}) {
  return (
    <section aria-labelledby="page-title-heading" className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {showBreadcrumb && breadcrumbItems && breadcrumbItems.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap justify-center items-center gap-1 text-sm text-[var(--color-muted)]">
              {breadcrumbItems.map((item, i) => (
                <li key={i} className="flex items-center gap-1">
                  {i > 0 && <span aria-hidden="true" className="opacity-40">/</span>}
                  {item.href ? (
                    <Link href={item.href} className="hover:text-[var(--color-text)] transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1
          id="page-title-heading"
          className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl"
        >
          {pageTitle}
        </h1>
      </div>
    </section>
  )
}

export function PageHeroBlock({
  variant = 'hero',
  heading,
  coloredSubtitle,
  body,
  backgroundImageUrl,
  overlayOpacity = 50,
  overlayColor = 'black',
  primaryButton,
  secondaryButton,
  profileCard,
  pageTitle,
  showBreadcrumb = false,
  breadcrumbItems,
  textAlignment = 'left',
  minHeight = 'md',
}: PageHeroBlockProps) {
  if (variant === 'page-title') {
    return (
      <PageTitleVariant
        pageTitle={pageTitle ?? ''}
        showBreadcrumb={showBreadcrumb}
        breadcrumbItems={breadcrumbItems}
      />
    )
  }

  const mhClass = minHeightClass(minHeight)
  const overlayClass = overlayColorClass(overlayColor)
  const alignClass = textAlignment === 'center' ? 'text-center items-center' : 'text-left items-start'
  const hasCard = !!(profileCard?.cardHeading)

  return (
    <section
      aria-labelledby="page-hero-heading"
      className={`relative flex w-full flex-col justify-end overflow-hidden ${mhClass} bg-[var(--color-neutral-900)]`}
    >
      {backgroundImageUrl && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
        />
      )}

      {overlayColor !== 'none' && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 ${overlayClass}`}
          style={{ opacity: overlayOpacity / 100 }}
        />
      )}

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className={`flex flex-col gap-6 ${hasCard ? 'lg:flex-row lg:items-center lg:justify-between' : ''}`}>

          {/* left: text content */}
          <div className={`flex flex-col gap-4 ${alignClass} ${hasCard ? 'lg:max-w-xl' : ''}`}>
            {showBreadcrumb && breadcrumbItems && breadcrumbItems.length > 0 && (
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-1 text-sm text-white/70">
                  {breadcrumbItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-1">
                      {i > 0 && <span aria-hidden="true" className="text-white/40">/</span>}
                      {item.href ? (
                        <Link href={item.href} className="hover:text-white transition-colors duration-150">
                          {item.label}
                        </Link>
                      ) : (
                        <span className="text-white/90">{item.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {heading && (
              <h1
                id="page-hero-heading"
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
              >
                {heading}
                {coloredSubtitle && (
                  <>
                    <br />
                    <span className="text-[var(--color-primary)]">{coloredSubtitle}</span>
                  </>
                )}
              </h1>
            )}

            {body && (
              <p className="max-w-2xl text-base text-white/80 md:text-lg">{body}</p>
            )}

            {(primaryButton || secondaryButton) && (
              <div className="flex flex-wrap gap-3 pt-1">
                {primaryButton && (
                  <Link
                    href={primaryButton.href}
                    className="inline-flex items-center rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow hover:brightness-110 transition-all"
                  >
                    {primaryButton.label}
                  </Link>
                )}
                {secondaryButton?.label && (
                  <Link
                    href={secondaryButton.href ?? '#'}
                    className="inline-flex items-center rounded-full border border-white/60 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                  >
                    {secondaryButton.label}
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* right: profile card */}
          {hasCard && profileCard && (
            <aside className="shrink-0 w-full lg:w-72 rounded-2xl bg-[var(--color-neutral-900)]/90 backdrop-blur-sm border border-white/10 p-5 shadow-xl">
              {profileCard.badgeText && (
                <span className="mb-3 inline-block rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white">
                  {profileCard.badgeText}
                </span>
              )}
              {profileCard.cardHeading && (
                <h2 className="mb-3 text-base font-bold text-white">{profileCard.cardHeading}</h2>
              )}
              {profileCard.rows && profileCard.rows.length > 0 && (
                <dl className="flex flex-col gap-2">
                  {profileCard.rows.map((row, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <dt className="text-xs text-white/50 font-medium">{row.label}</dt>
                      <dd className="text-sm text-white/90">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}
