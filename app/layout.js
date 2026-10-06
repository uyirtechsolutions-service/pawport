import './globals.css'
import ClientProviders from '@/components/ClientProviders'
import AppShell from '@/components/AppShell'
import { siteUrl } from './_lib/seo'

export const metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'Pet Transport Across India | Pawport Transport',
    template: '%s | Pawport Transport',
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
    title: 'Pet Transport Across India | Pawport Transport',
    description: 'Door-to-door pet transport with climate-controlled vehicles, dedicated handlers, and real-time tracking.',
    images: ['/images/hero-roadtrip.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pet Transport Across India | Pawport Transport',
    description: 'Door-to-door pet transport with climate-controlled vehicles, dedicated handlers, and real-time tracking.',
    images: ['/images/hero-roadtrip.jpg'],
  },
  icons: {
    icon: '/logo.png',
  },
}

const siteStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': new URL('/#organization', siteUrl).toString(),
      name: 'Pawport Transport',
      url: siteUrl.toString(),
      logo: new URL('/logo.png', siteUrl).toString(),
    },
    {
      '@type': 'WebSite',
      '@id': new URL('/#website', siteUrl).toString(),
      name: 'Pawport Transport',
      url: siteUrl.toString(),
      publisher: { '@id': new URL('/#organization', siteUrl).toString() },
    },
    ...[
      ['Home', '/'],
      ['About Pawport', '/about-us'],
      ['Pet Transport Services', '/services'],
      ['How Pet Transport Works', '/process'],
      ['Pet Transport Stories', '/stories'],
      ['Contact Pawport', '/contact'],
      ['Book Pet Transport', '/book'],
    ].map(([name, path], index) => ({
      '@type': 'SiteNavigationElement',
      name,
      url: new URL(path, siteUrl).toString(),
      position: index + 1,
    })),
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteStructuredData) }}
        />
      </head>
      <body>
        <ClientProviders>
          <AppShell>{children}</AppShell>
        </ClientProviders>
      </body>
    </html>
  )
}