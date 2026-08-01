import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw, faArrowRight, faShieldHalved, faHeadset, faTruckFast } from '@fortawesome/free-solid-svg-icons'

const trustBadges = [
  { icon: faShieldHalved, text: 'Licensed & Insured' },
  { icon: faHeadset, text: '24/7 Support' },
  { icon: faTruckFast, text: 'Tracked Delivery' },
]

const stats = [
  { num: '4,500+', label: 'Pets Delivered' },
  { num: '200+', label: 'Cities Covered' },
  { num: '4.9★', label: 'Google Rating' },
]

function Hero() {
  return (
    <section className="relative min-h-[75vh] lg:min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-pawport-orange/5 via-white to-pawport-orange/10">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-pawport-orange/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-pawport-orange/8 blur-3xl" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-5 text-center lg:text-left">
            {/* Chip badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-pawport-orange/20 rounded-full shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pawport-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pawport-orange" />
              </span>
              <span className="text-xs font-semibold text-black/60 tracking-wide">
                Now serving 200+ cities across India
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] font-space text-black">
              Your pet travels{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-pawport-orange to-pawport-orange-dark bg-clip-text text-transparent">
                  first class
                </span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-pawport-orange/20 rounded-full -z-0 blur-sm" />
              </span>
              <br />
              every single time.
            </h1>

            {/* Sub text */}
            <p className="text-sm sm:text-base text-black/55 leading-relaxed max-w-lg mx-auto lg:mx-0 font-body">
              Door-to-door pet relocation with climate-controlled vehicles, certified handlers,
              and real-time tracking. Because your furry family deserves nothing less than the best.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <Link
                to="/book"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-pawport-orange hover:bg-pawport-orange-dark text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-pawport-orange/25 hover:shadow-xl hover:shadow-pawport-orange/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faPaw} className="w-3.5 h-3.5" />
                Book a Pickup
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="w-3 h-3 transition-transform group-hover:translate-x-1"
                />
              </Link>
              <a
                href="#process"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-black/10 hover:border-black/20 text-black/70 font-semibold text-xs rounded-xl hover:text-black hover:-translate-y-0.5 transition-all duration-300"
              >
                How it works
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start pt-2">
              {trustBadges.map((b) => (
                <span
                  key={b.text}
                  className="flex items-center gap-1.5 text-xs text-black/40 font-medium"
                >
                  <FontAwesomeIcon icon={b.icon} className="w-3.5 h-3.5 text-pawport-orange/50" />
                  {b.text}
                </span>
              ))}
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 sm:gap-10 justify-center lg:justify-start border-t border-black/5 pt-4">
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="font-mono font-bold text-lg sm:text-xl text-black tracking-tight">
                      {s.num}
                    </div>
                    <div className="text-[11px] text-black/35 uppercase tracking-wide font-medium">
                      {s.label}
                    </div>
                  </div>
                  {i < stats.length - 1 && (
                    <div className="h-8 w-px bg-black/8 hidden sm:block" />
                  )}
                </div>
              ))}
              {stats.length > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 bg-pawport-orange/10 rounded-full px-4 py-2">
                  <span className="text-yellow-500 text-sm">★★★★★</span>
                  <span className="text-[10px] font-semibold text-black/50 uppercase tracking-wider">
                    Trusted
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative hidden lg:block">
            {/* Main Image Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-white/80">
              <img
                src="/images/hero-roadtrip.jpg"
                alt="Happy dog on a road trip with PawPort"
                className="w-full h-[320px] object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Floating card on image */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pawport-orange flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faPaw} className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black">Live Tracking Active</p>
                    <p className="text-[11px] text-black/50">Your pet is in safe hands 🐾</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative floating element */}
            <div className="absolute -top-6 -left-6 w-20 h-20 rounded-2xl bg-pawport-orange/15 border border-pawport-orange/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-3xl">🐶</span>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-2xl bg-white shadow-lg border border-black/5 flex items-center justify-center animate-float">
              <span className="text-3xl">🛡️</span>
            </div>
          </div>

          {/* Mobile image (visible below lg) */}
          <div className="lg:hidden relative rounded-2xl overflow-hidden shadow-xl shadow-black/10">
            <img
              src="/images/hero-dog-window.jpg"
              alt="Happy dog traveling with PawPort"
              className="w-full h-44 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-xl p-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-pawport-orange flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faPaw} className="w-4 h-4 text-black" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-black">Live Tracking Active</p>
                  <p className="text-[10px] text-black/50">Your pet is in safe hands 🐾</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero