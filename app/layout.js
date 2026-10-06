import './globals.css'
import ClientProviders from '@/components/ClientProviders'
import AppShell from '@/components/AppShell'
import { siteUrl } from './_lib/seo'

export const metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'Pet Transport & Relocation Across India | Pawport',
    template: '%s | Pawport',
  },
  description: 'Pawport Transport moves pets across the city, the country, and international borders — certified handlers, climate-controlled vehicles, and live tracking every mile.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    siteName: 'Pawport Transport',
    title: 'Pet Transport & Relocation Across India | Pawport',
    description: 'Door-to-door pet transport with climate-controlled vehicles, dedicated handlers, and real-time tracking.',
    images: ['/images/hero-roadtrip.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pet Transport & Relocation Across India | Pawport',
    description: 'Door-to-door pet transport with climate-controlled vehicles, dedicated handlers, and real-time tracking.',
    images: ['/images/hero-roadtrip.jpg'],
  },
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ClientProviders>
          <AppShell>{children}</AppShell>
        </ClientProviders>
      </body>
    </html>
  )
}