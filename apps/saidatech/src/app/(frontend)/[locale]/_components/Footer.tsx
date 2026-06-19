// SERVER COMPONENT
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
  contactEmail?: string  
  officeAddress?: string 
}

interface FooterProps {
  locale: string
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

const socialIconMap: Record<string, React.FC> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
}

const brandColorMap: Record<string, string> = {
  facebook: 'bg-[#0066FF] text-white hover:bg-[#0052cc]',
  instagram: 'bg-gradient-to-tr from-[#FFB000] via-[#FF0078] to-[#9400D3] text-white hover:opacity-95',
  youtube: 'bg-[#FF0000] text-white hover:bg-[#cc0000]',
  linkedin: 'bg-[#0077B5] text-white hover:bg-[#005988]',
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
    footerData.copyrightText ?? `COPYRIGHT (C) ${currentYear} ${siteConfig.site.name.toUpperCase()} Co., Ltd. ALL RIGHTS RESERVED.`

  const dynamicEmail = footerData.contactEmail || 'info@sadiatec.com'
  const dynamicAddress = footerData.officeAddress || '3-16-7 Nihonbashihamacho, Chuo-ku, Tokyo\nSprout Nihonbashi Hamacho Building 6F'

  return (
    <footer className="w-full bg-gradient-to-b from-[#D6E9FA] via-[#3B9AE2] to-[#1E71C6] lg:from-white lg:via-[#3B9AE2]/70 lg:to-[#1E71C6] text-white pt-12 pb-6 overflow-hidden">
      <Container>
        <div className="relative flex items-center justify-center mb-10 w-full max-w-5xl mx-auto">
          <div className="absolute left-0 right-0 h-px bg-white/40 z-0" />
          <h2 className="relative z-10 px-6 bg-white/0 text-2xl md:text-3xl font-bold tracking-widest text-[#3A89DA] font-sans mix-blend-difference">
            Follow us
          </h2>
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-5 mb-20">
          {['facebook', 'instagram', 'youtube', 'linkedin'].map((platform) => {
            const Icon = socialIconMap[platform]
            if (!Icon) return null
            
            const linkMatch = siteConfig.nav.socialLinks.find(s => s.platform === platform)
            const targetUrl = linkMatch ? linkMatch.url : '#'
            const platformColors = brandColorMap[platform]

            return (
              <a
                key={platform}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform}
                className={[
                  'flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:scale-110 focus:outline-none',
                  platformColors
                ].join(' ')}
              >
                <Icon />
              </a>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-white/20 pb-12">
          <div className="lg:col-span-5 flex flex-col space-y-6 text-left">
            <Link href="/" className="inline-block select-none focus:outline-none mb-2">
              <span className="text-3xl font-bold tracking-wider text-white">
                Sadiatec Co., Ltd
              </span>
            </Link>
            
            <div className="space-y-4 font-medium text-white/90 text-[15px] sm:text-[16px] leading-relaxed tracking-wide">
              <div>
                <p className="font-bold text-white/70 text-sm uppercase tracking-widest mb-1">Company Address</p>
                <p className="whitespace-pre-line font-medium">{dynamicAddress}</p>
              </div>
              <div className="pt-2">
                <p className="font-bold text-white/70 text-sm uppercase tracking-widest mb-1">Inquiries</p>
                <p className="font-semibold underline underline-offset-4 hover:text-white transition-colors cursor-pointer">
                  {dynamicEmail}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
            {columns.map((column, idx) => (
              <div key={idx} className="flex flex-col">
                {column.heading && (
                  <p className="text-[14px] font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                    {column.heading}
                  </p>
                )}
                <ul role="list" className="flex flex-col gap-3">
                  {(column.links ?? []).map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-white/85 hover:text-white font-medium hover:underline transition-all duration-150"
                      >
                        {link.label ?? link.href}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 pb-2 text-center">
          <Text as="span" className="text-xs md:text-sm font-medium tracking-widest text-white/60 uppercase">
            {copyrightText}
          </Text>
        </div>
      </Container>
    </footer>
  )
}