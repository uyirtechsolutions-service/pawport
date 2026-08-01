import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

const footerLinks = {
  Services: ['Pet Taxi', 'Ground Transport', 'Flight Relocation', 'International Moves'],
  Company: ['Our Process', 'Our Fleet', 'Success Stories', 'About Us'],
  Support: ['FAQ', 'Contact Us', 'Track Booking', 'Terms & Conditions'],
}

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-pawport-black text-white overflow-hidden">
      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pawport-orange via-pawport-orange-light to-pawport-orange-lighter" />

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-pawport-orange/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-pawport-orange/3 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Main Footer Content */}
        <div className="pt-16 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10">
            {/* Brand Column - spans 4 cols on desktop */}
            <div className="col-span-2 md:col-span-5 lg:col-span-4 space-y-5">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="relative flex-shrink-0">
                  <img
                    src="/logo.png"
                    alt="PawPort"
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-pawport-orange/50 transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-space font-bold text-lg text-white tracking-tight">
                    PawPort
                  </span>
                  <span className="text-[10px] text-pawport-orange font-semibold uppercase tracking-[0.2em]">
                    Transport
                  </span>
                </div>
              </Link>
              <p className="text-sm text-white/60 leading-relaxed max-w-sm">
                Premium pet relocation services across India and abroad. Certified handlers,
                climate-controlled vehicles, and 24/7 real-time tracking — because your pet
                deserves first-class travel.
              </p>
              {/* Social/Contact quick links */}
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://wa.me/919087470137"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-white/50 hover:bg-pawport-orange hover:text-white transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                </a>
                <a
                  href="mailto:hello@pawport.in"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-white/50 hover:bg-pawport-orange hover:text-white transition-all duration-300"
                  aria-label="Email"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="col-span-1 md:col-span-2 lg:col-span-2 space-y-4">
                <h4 className="font-space font-bold text-xs uppercase tracking-[0.15em] text-white/80">
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        to={
                          link === 'Pet Taxi'
                            ? '/services'
                            : link === 'Ground Transport'
                            ? '/services'
                            : link === 'Flight Relocation'
                            ? '/services'
                            : link === 'International Moves'
                            ? '/services'
                            : link === 'Our Process'
                            ? '/process'
                            : link === 'Our Fleet'
                            ? '/#fleet'
                            : link === 'Success Stories'
                            ? '/stories'
                            : link === 'About Us'
                            ? '/#philosophy'
                            : link === 'Track Booking'
                            ? '/book'
                            : '#'
                        }
                        className="text-sm text-white/50 hover:text-pawport-orange transition-colors duration-200 inline-block py-0.5"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
              <h4 className="font-space font-bold text-xs uppercase tracking-[0.15em] text-white/80">
                Contact
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://wa.me/919087470137"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 text-sm text-white/50 hover:text-pawport-orange transition-colors duration-200 group"
                  >
                    <FontAwesomeIcon
                      icon={faWhatsapp}
                      className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/30 group-hover:text-pawport-orange transition-colors"
                    />
                    <span>+91 90874 70137</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@pawport.in"
                    className="flex items-start gap-2.5 text-sm text-white/50 hover:text-pawport-orange transition-colors duration-200 group"
                  >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/30 group-hover:text-pawport-orange transition-colors"
                    />
                    <span>hello@pawport.in</span>
                  </a>
                </li>
                <li>
                  <p className="flex items-start gap-2.5 text-sm text-white/50">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/30"
                    />
                    <span>All over India & International</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.08] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/35 order-2 sm:order-1">
            &copy; {currentYear} PawPort Transport. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/35 order-1 sm:order-2">
            <span>Made with</span>
            <FontAwesomeIcon icon={faPaw} className="w-3 h-3 text-pawport-orange/60" />
            <span>for pet parents</span>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="border-t border-white/[0.05] py-4 text-center">
          <a
            href="https://www.vaazhltechsolutions.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-white/25 hover:text-pawport-orange/60 transition-colors duration-200"
          >
            Developed by Vaazhl Tech Solutions
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer