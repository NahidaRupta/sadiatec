// Server Component — scrolling handled entirely by .logo-track CSS (globals.css)

import { SectionEyebrow } from '../../components/ui'
import type { LogoCloudBlockProps, ScrollSpeed } from './types'

const speedDuration: Record<ScrollSpeed, string> = {
  slow: '50s',
  medium: '30s',
  fast: '18s',
}

export function LogoCloudBlock({
  eyebrow,
  heading,
  logos,
  scrollSpeed = 'medium',
}: LogoCloudBlockProps) {
  // Double the array so the CSS translateX(-50%) loop is seamless
  const doubledLogos = [...logos, ...logos]

  return (
    <section className="overflow-hidden bg-white py-12 md:py-16" aria-label={eyebrow}>
      {/* Header */}
      <div className="mx-auto mb-8 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        {heading && (
          <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">{heading}</p>
        )}
      </div>

      {/* 
        Scroll track container updated to take 70% width on desktops (max-w-5xl)
        and centered on the screen with horizontal mask fades on edges like image_304b9e.png
      */}
      <div className="relative mx-auto w-full max-w-5xl px-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
        <div
          className="logo-track items-center gap-12 md:gap-16"
          style={{ animationDuration: speedDuration[scrollSpeed] }}
        >
          {doubledLogos.map((logo, i) => (
            <div key={i} className="flex shrink-0 flex-col items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.logoUrl}
                alt={logo.name}
                className="max-h-12 w-auto object-contain transition-all duration-300 hover:scale-105 md:max-h-16"
              />
              {logo.caption && (
                <span className="text-xs text-[var(--color-muted)]">{logo.caption}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}