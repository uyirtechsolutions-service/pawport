import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faPaw } from '@fortawesome/free-solid-svg-icons'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) =>
    location.pathname === path
      ? 'text-pawport-orange font-semibold'
      : 'text-black hover:text-pawport-orange transition-colors'

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-pawport-orange/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img src="/logo.png" alt="PawPort" className="w-14 h-14 object-contain group-hover:scale-105 transition-transform" />
          <div className="flex flex-col leading-none">
            <span className="font-space font-bold text-base text-black tracking-tight">PawPort</span>
            <span className="text-[10px] text-pawport-orange font-semibold uppercase tracking-widest">Transport</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider">
          <Link to="/services" className={isActive('/services')}>Services</Link>
          <Link to="/process" className={isActive('/process')}>Process</Link>
          <Link to="/stories" className={isActive('/stories')}>Stories</Link>
          <Link to="/book" className={isActive('/book')}>Book</Link>
        </nav>

        <div className="hidden md:block">
          <Link to="/book" className="inline-flex items-center gap-2 px-5 py-2.5 bg-pawport-orange hover:bg-pawport-orange-dark text-black font-bold text-xs uppercase tracking-wider  shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
            <FontAwesomeIcon icon={faPaw} className="w-3.5 h-3.5" /> Book a pickup
          </Link>
        </div>

        <button
          className="md:hidden flex items-center justify-center w-10 h-10 border border-pawport-orange/20 rounded-xl text-black"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-pawport-orange/10 px-6 py-5 flex flex-col gap-3">
          <Link to="/services" className="text-sm text-black py-2" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link to="/process" className="text-sm text-black py-2" onClick={() => setMenuOpen(false)}>Process</Link>
          <Link to="/stories" className="text-sm text-black py-2" onClick={() => setMenuOpen(false)}>Stories</Link>
          <Link to="/book" className="text-sm font-semibold text-black py-2" onClick={() => setMenuOpen(false)}>Book</Link>
          <Link to="/book" className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-pawport-orange text-black font-bold rounded-xl text-xs uppercase tracking-wider" onClick={() => setMenuOpen(false)}>
            <FontAwesomeIcon icon={faPaw} className="w-3.5 h-3.5" /> Book a pickup
          </Link>
        </div>
      )}
    </header>
  )
}

export default Header