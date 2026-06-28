import type { ReactNode } from 'react'
import Script from 'next/script'
import "../globals.css" // <-- This restores Tailwind to all your frontend pages!

export default function FrontendRootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <link rel="stylesheet" href="https://sadiatec-assistant.vercel.app/widget-dist/widget.css" />
        {/* <link rel="stylesheet" href="http://localhost:3001/widget-dist/widget.css" /> */}
        <Script
          src="https://sadiatec-assistant.vercel.app/widget-dist/widget.js"
          // src="http://localhost:3001/widget-dist/widget.js"
          strategy="lazyOnload"
          data-whatsapp="8801XXXXXXXXX"
          data-color="#4f46e5"
        />
      </body>
    </html>
  )
}