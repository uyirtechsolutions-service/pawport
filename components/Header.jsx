'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw, faPhone, faXmark, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

const PHONE_NUMBER = '+91 99943 70137'
const WHATSAPP_NUMBER = '919087470137' // digits only for wa.me link
const EMAIL = 'hello@pawport.com'

function ImageViewer({ onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close image"
      >
        <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
      </button>

      {/* Caption */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-white font-bold text-sm tracking-wide">PawPort</p>
        <p className="text-pawport-orange text-[10px] uppercase tracking-widest font-semibold">Transport</p>
      </div>

      {/* Full image */}
      <div
        className="relative max-w-xs w-full mx-8 animate-in zoom-in-75 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src="/logo.png"
          alt="PawPort logo"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  )
}

function ProfilePopup({ onClose }) {
  const ref = useRef(null)
  const [showImageViewer, setShowImageViewer] = useState(false)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <>
      {showImageViewer && <ImageViewer onClose={() => setShowImageViewer(false)} />}
    <div className="fixed inset-0 z-50 flex items-start justify-start sm:items-start sm:justify-start pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />

      {/* Popup card — anchored to top-left like WhatsApp profile panel */}
      <div
        ref={ref}
        className="relative pointer-events-auto mt-16 md:mt-20 ml-4 md:ml-6 w-72 rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      >
        {/* Header band */}
        <div className="bg-pawport-orange h-24 relative" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
        </button>

        {/* Avatar — click to view full screen */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2">
          <button
            onClick={() => setShowImageViewer(true)}
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white hover:brightness-90 transition-all cursor-zoom-in focus:outline-none"
            aria-label="View logo full screen"
          >
            <img
              src="/logo.png"
              alt="PawPort"
              className="w-full h-full object-contain p-1"
            />
          </button>
        </div>

        {/* Content */}
        <div className="pt-14 pb-5 px-5 text-center">
          <h3 className="font-space font-bold text-lg text-black leading-none">PawPort</h3>
          <p className="text-[11px] text-pawport-orange font-semibold uppercase tracking-widest mt-0.5">
            Transport
          </p>
          <p className="text-xs text-gray-500 mt-2">Safe, stress-free pet transport</p>

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Contact details */}
          <div className="space-y-3 text-left">
            {/* Phone */}
            <a
              href={`tel:${PHONE_NUMBER.replace(/\D/g, '')}`}
              className="flex items-center gap-3 group"
            >
              <span className="w-8 h-8 rounded-full bg-pawport-orange/10 flex items-center justify-center shrink-0 group-hover:bg-pawport-orange/20 transition-colors">
                <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5 text-pawport-orange" />
              </span>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Phone</p>
                <p className="text-sm font-semibold text-black group-hover:text-pawport-orange transition-colors">
                  {PHONE_NUMBER}
                </p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <span className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5 text-green-500" />
              </span>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">WhatsApp</p>
                <p className="text-sm font-semibold text-black group-hover:text-green-500 transition-colors">
                  +91 90874 70137
                </p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-3 group"
            >
              <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5 text-blue-500" />
              </span>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Email</p>
                <p className="text-sm font-semibold text-black group-hover:text-blue-500 transition-colors">
                  {EMAIL}
                </p>
              </div>
            </a>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
    </>
  )
}

function Header() {
  const pathname = usePathname()
  const [showProfile, setShowProfile] = useState(false)

  const isActive = (path) =>
    pathname === path
      ? 'text-pawport-orange font-semibold'
      : 'text-black hover:text-pawport-orange transition-colors'

  return (
    <>
      {showProfile && <ProfilePopup onClose={() => setShowProfile(false)} />}
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-pawport-orange/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 md:h-20 px-6">
        {/* Logo — click opens profile popup */}
        <button
          onClick={() => setShowProfile(true)}
          className="flex items-center gap-3 shrink-0 group cursor-pointer"
          aria-label="View PawPort contact info"
        >
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
        </button>

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
    </>
  )
}

export default Header