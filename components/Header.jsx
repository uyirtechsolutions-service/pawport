'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw } from '@fortawesome/free-solid-svg-icons'

function Header() {
  const pathname = usePathname()

  const isActive = (path) =>
    pathname === path
      ? 'text-pawport-orange font-semibold'
      : 'text-black hover:text-pawport-orange transition-colors'

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-pawport-orange/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 md:h-20 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/logo.png"
            alt="PawPort"
            className="w-11 h-11 md:w-14 md:h-14 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col leading-none">
            <span className="font-space font-bold text-sm md:text-base text-black tracking-tight">
              PawPort
            </span>
            <span className="text-[9px] md:text-[10px] text-pawport-orange font-semibold uppercase tracking-widest">
              Transport
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider">
          <Link href="/services" className={isActive('/services')}>
            Services
          </Link>
          <Link href="/process" className={isActive('/process')}>
            Process
          </Link>
          <Link href="/stories" className={isActive('/stories')}>
            Stories
          </Link>
          <Link href="/book" className={isActive('/book')}>
            Book
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-pawport-orange hover:bg-pawport-orange-dark text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <FontAwesomeIcon icon={faPaw} className="w-3.5 h-3.5" /> Book a pickup
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header