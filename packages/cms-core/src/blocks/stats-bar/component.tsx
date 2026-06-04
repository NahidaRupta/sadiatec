import type { StatsBarBlockProps } from './types'

function bgClass(style: string): string {
  if (style === 'dark') return 'bg-[var(--color-neutral-900)]'
  if (style === 'light') return 'bg-[var(--color-neutral-50,#fafafa)]'
  return 'bg-[var(--color-primary)]'
}

function valueColor(style: string): string {
  return style === 'light' ? 'text-[var(--color-primary)]' : 'text-white'
}

function labelColor(style: string): string {
  if (style === 'dark') return 'text-white/70'
  if (style === 'light') return 'text-[var(--color-muted)]'
  return 'text-white/80'
}

function bodyColor(style: string): string {
  if (style === 'dark') return 'text-white/50'
  if (style === 'light') return 'text-[var(--color-muted)]'
  return 'text-white/60'
}

export function StatsBarBlock({
  items,
  backgroundStyle = 'brand',
  layout = 'row',
}: StatsBarBlockProps) {
  if (items.length === 0) return null

  const bg   = bgClass(backgroundStyle)
  const vClr = valueColor(backgroundStyle)
  const lClr = labelColor(backgroundStyle)
  const bClr = bodyColor(backgroundStyle)

  const gridClass = layout === 'grid'
    ? 'grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6'
    : 'flex flex-wrap justify-center gap-8 lg:gap-12'

  return (
    <section className={`py-10 md:py-12 ${bg}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className={gridClass} role="list">
          {items.map((item, i) => (
            <li key={i} className="flex flex-col items-center gap-1 text-center">
              {item.value && (
                <span className={`text-3xl font-extrabold tracking-tight md:text-4xl ${vClr}`}>
                  {item.value}
                </span>
              )}
              <span className={`text-sm font-semibold ${item.value ? lClr : vClr}`}>
                {item.label}
              </span>
              {item.body && (
                <p className={`mt-1 max-w-[14rem] text-xs leading-relaxed ${bClr}`}>
                  {item.body}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
