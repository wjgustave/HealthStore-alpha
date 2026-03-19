import type { Metadata } from 'next'
import './globals.css'
import AppShell from '@/components/AppShell'

export const metadata: Metadata = {
  title: 'HealthStore',
  description: 'Decision-support tool for NHS digital health technology procurement',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className="min-h-screen" style={{ background: 'var(--surface)' }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
