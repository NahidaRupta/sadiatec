// SERVER COMPONENT — do not add 'use client'
import { getCachedPayload } from '@/lib/payload'
import { Container, Text } from '@saidatech/cms-core/components/ui'
import siteConfig from '../../../../../site.config'
import { Link } from '@/i18n/routing'

interface FooterLink {
  label?: string
  href: string
}

interface FooterColumn {
  heading?: string
  links?: FooterLink[]
}

interface FooterGlobalData {
  columns?: FooterColumn[]
  copyrightText?: string
}

interface FooterProps {
  locale: string
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  )
}

function TwitterXIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const socialIconMap: Record<string, React.FC> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  line: LineIcon,
  twitter: TwitterXIcon,
  x: TwitterXIcon,
}

export async function Footer({ locale }: FooterProps) {
  const payload = await getCachedPayload()

  let footerData: FooterGlobalData = {}
  try {
    const raw = await payload.findGlobal({
      slug: 'footer',
      locale: locale as 'en' | 'ja' | 'bn',
    })
    footerData = raw as FooterGlobalData
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.warn('[Footer] CMS unavailable:', err)
  }

  const columns = footerData.columns ?? []
  const currentYear = new Date().getFullYear()
  const copyrightText =
    footerData.copyrightText ?? `© ${currentYear} ${siteConfig.site.name}. All rights reserved.`

  return (
    <footer className="bg-neutral-950 text-neutral-50">
      {/* Main columns */}
      {columns.length > 0 && (
        <div className="border-b border-neutral-800">
          <Container>
            <div className="py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {columns.map((column, idx) => (
                <div key={idx}>
                  {column.heading && (
                    <p className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">
                      {column.heading}
                    </p>
                  )}
                  <ul role="list" className="flex flex-col gap-2">
                    {(column.links ?? []).map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <Link
                          href={link.href}
                          className="text-sm text-neutral-400 hover:text-neutral-50 transition-colors
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                            rounded-sm"
                        >
                          {link.label ?? link.href}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}

      {/* Social links */}
      {siteConfig.nav.socialLinks.length > 0 && (
        <div className="border-b border-neutral-800">
          <Container>
            <div className="py-6 flex items-center gap-4">
              {siteConfig.nav.socialLinks.map((social) => {
                const Icon = socialIconMap[social.platform]
                if (!Icon) return null
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="text-neutral-400 hover:text-neutral-50 transition-colors
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                      rounded-sm p-1"
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          </Container>
        </div>
      )}

      {/* Bottom bar: copyright + legal */}
      <Container>
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Text as="span" variant="caption" className="text-neutral-500">
            {copyrightText}
          </Text>
          <ul role="list" className="flex items-center gap-4 flex-wrap">
            {siteConfig.nav.legalLinks.map((link) => (
              <li key={link.slug}>
                <Link
                  href={link.slug}
                  className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                    rounded-sm"
                >
                  {link.labelKey}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
