'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import MobileBottomNav from './MobileBottomNav'

function AppShell({ children }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-white text-black antialiased flex flex-col pb-16 md:pb-0">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}

export default AppShell