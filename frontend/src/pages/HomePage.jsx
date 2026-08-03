import Hero from '../components/Hero'
import Services from '../components/Services'
import Process from '../components/Process'
import Fleet from '../components/Fleet'
import Transports from '../components/Transports'
import SuccessfulStories from '../components/SuccessfulStories'
import Philosophy from '../components/Philosophy'
import CustomerReviews from '../components/CustomerReviews'

function HomePage() {
  return (
    <>
      {/* Hero - Full-width brand statement */}
      <Hero />

      {/* Services - What we offer */}
      <section className="relative bg-white">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pawport-orange/20 to-transparent" />
        <Services />
      </section>

      {/* Process - How it works */}
      <section className="relative bg-pawport-orange/[0.02]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pawport-orange/10 to-transparent" />
        <Process />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pawport-orange/10 to-transparent" />
      </section>

      {/* Fleet & Safety - Infrastructure */}
      <section className="relative bg-white">
        <Fleet />
      </section>

      {/* Transports - Social proof / Recent trips */}
      <section className="relative bg-pawport-orange/[0.02]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pawport-orange/10 to-transparent" />
        <Transports />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pawport-orange/10 to-transparent" />
      </section>

      {/* Success Stories - Testimonials */}
      <section className="relative bg-white">
        <SuccessfulStories />
      </section>

      {/* Philosophy - Brand values / Why us */}
      <section className="relative bg-pawport-orange/[0.02]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pawport-orange/10 to-transparent" />
        <Philosophy />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pawport-orange/10 to-transparent" />
      </section>

      {/* Customer Reviews - Ratings & Feedback */}
      <section className="relative bg-white">
        <CustomerReviews />
      </section>

      {/* Compact CTA Bar */}
      <section className="relative bg-white py-6 md:py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-pawport-orange to-pawport-orange-dark rounded-2xl px-6 py-4 md:px-8 md:py-5 shadow-lg shadow-pawport-orange/20">
          <p className="text-sm md:text-base font-bold text-black text-center sm:text-left">
            Ready to move your furry friend?
          </p>
          <div className="flex items-center gap-3">
            <a
              href="/book"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Book a Pickup
            </a>
            <a
              href="https://wa.me/919087470137"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 text-black font-bold text-xs rounded-xl hover:bg-white/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage