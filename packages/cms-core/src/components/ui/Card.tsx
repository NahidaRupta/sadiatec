import type { ElementType, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  as?: ElementType
  hover?: boolean
}

export function Card({ children, className = '', as: Tag = 'div', hover = false }: CardProps) {
  return (
    <Tag
      className={`bg-[var(--color-surface)] rounded-lg border border-neutral-200 overflow-hidden ${
        hover ? 'transition-shadow duration-200 hover:shadow-md' : ''
      } ${className}`}
    >
      {children}
    </Tag>
  )
}
