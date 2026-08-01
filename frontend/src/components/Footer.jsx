import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

function Footer() {
  return (
    <footer className="bg-pawport-orange text-black mt-0">
      <div className="max-w-7xl mx-auto px-6 py-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="PawPort" className="w-9 h-9 rounded-xl object-cover" />
              <div className="flex flex-col leading-none">
                <span className="font-space font-bold text-sm text-black tracking-tight">PawPort</span>
                <span className="text-[9px] text-black font-semibold uppercase tracking-widest">Transport</span>
              </div>
            </div>
            <p className="text-sm text-black/80 leading-relaxed max-w-xs">Premium pet relocation services across India and abroad. Certified handlers, climate-controlled vehicles, 24/7 tracking.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-space font-bold text-sm text-black">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {['Services', 'Process', 'Fleet', 'Stories', 'Book'].map((l) => (
                <Link key={l} to={l === 'Book' ? '/book' : `/#${l.toLowerCase()}`} className="text-sm text-black/70 hover:text-black transition-colors py-1">
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-space font-bold text-sm text-black">Contact</h4>
            <div className="space-y-2">
              <a href="https://wa.me/919087470137" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-black/70 hover:text-black transition-colors">
                <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" /> WhatsApp: +91 90874 70137
              </a>
              <p className="flex items-center gap-2 text-sm text-black/70">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" /> hello@pawport.in
              </p>
              <p className="flex items-center gap-2 text-sm text-black/70">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4" /> All over India & International
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-black/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-black/60">
            &copy; {new Date().getFullYear()} PawPort Transport. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-black/60">
            <span className="flex items-center gap-1">
              Made with <FontAwesomeIcon icon={faPaw} className="w-3 h-3" /> for pet parents
            </span>
          </div>
        </div>

        <div className="text-center pt-2">
          <a
            href="https://www.vaazhltechsolutions.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-black/60 hover:text-black transition-colors"
          >
            Developed by Vaazhl Tech Solutions
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer