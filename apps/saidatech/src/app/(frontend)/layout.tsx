import type { ReactNode } from 'react'
import "../globals.css" // <-- This restores Tailwind to all your frontend pages!

export default function FrontendRootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}