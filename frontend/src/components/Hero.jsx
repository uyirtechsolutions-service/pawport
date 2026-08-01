import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw, faPlaneDeparture, faMoneyBillWave, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

const badges = [
  { icon: faPaw, text: 'All over India delivery' },
  { icon: faPlaneDeparture, text: 'Foreign transport available' },
  { icon: faMoneyBillWave, text: 'Part payment while booking' },
  { icon: faMapMarkerAlt, text: 'Amount based on mode & location' },
]

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-pawport"></div>
      <div className="absolute inset-0 z-0">
        <img src="/images/hero-dog-window.jpg" alt="" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-16 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 text-white text-xs font-semibold">
          <span className="w-2 h-2 bg-pawport-orange rounded-full animate-pulse-soft"></span>
          Trusted since 2020 — 4,500+ pets delivered safely
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] font-space text-white">
          Your pet deserves a{' '}
          <span className="text-black">safe journey</span>,{' '}
          <br className="hidden md:block" />
          not just a ride.
        </h1>

        <p className="text-white/95 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-body">
          PawPort moves pets across the city, across the country and across borders —
          certified handlers, climate-controlled vehicles, and someone checking on them at every stop.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {badges.map((b) => (
            <span key={b.text} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-[11px] text-white/90 font-medium">
              <FontAwesomeIcon icon={b.icon} className="w-3 h-3" />
              {b.text}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-pawport-orange hover:bg-pawport-orange-dark text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <FontAwesomeIcon icon={faPaw} className="w-3.5 h-3.5" /> Book a pickup
          </Link>
          <a
            href="#process"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            See how it works →
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
          {[
            { num: '4,500+', label: 'Pets Delivered' },
            { num: '200+', label: 'Cities' },
            { num: '9.8★', label: 'Rating' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-mono font-bold text-base text-white">{s.num}</div>
              <div className="text-[10px] text-white/80 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero