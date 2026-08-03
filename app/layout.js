import './globals.css'
import ClientProviders from '@/components/ClientProviders'
import AppShell from '@/components/AppShell'

export const metadata = {
  title: 'Pawport Transport — Getting your best friend there safely',
  description: 'Pawport Transport moves pets across the city, the country, and international borders — certified handlers, climate-controlled vehicles, and live tracking every mile.',
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