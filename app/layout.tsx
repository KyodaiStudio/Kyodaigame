import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Game Quiz Kyodai',
  description: 'Created By Kyodaistudio',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
