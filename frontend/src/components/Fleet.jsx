import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShuttleVan, faShieldAlt, faFileAlt, faHeadset } from '@fortawesome/free-solid-svg-icons'

const categories = [
  { icon: faShuttleVan, title: 'Vehicles', items: ['Climate-controlled vans', 'Air-ride suspension', 'Crash-tested crates', 'Live GPS tracking'] },
  { icon: faShieldAlt, title: 'Safety & Care', items: ['Certified pet handlers', 'Scheduled rest stops', 'In-transit health checks', 'Emergency vet network'] },
  { icon: faFileAlt, title: 'Documentation', items: ['Health certificates', 'Customs & import permits', 'Airline-compliant crates', 'Breed-specific paperwork'] },
  { icon: faHeadset, title: 'Support', items: ['24/7 live tracking', 'WhatsApp trip updates', 'Dedicated coordinator', 'Post-arrival check-in'] }
]

function Fleet() {
  return (
    <section id="fleet" className="py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pawport-orange/20 text-pawport-orange rounded-full text-[11px] font-bold uppercase tracking-widest">
            <FontAwesomeIcon icon={faShieldAlt} className="w-3 h-3" /> Fleet & Safety
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-space text-black">Built for pet wellbeing</h2>
          <p className="text-pawport-muted text-sm">Every vehicle built around your pet's wellbeing.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card border border-pawport-orange/10 p-5 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-pawport-orange/10 rounded-xl flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={cat.icon} className="w-5 h-5 text-pawport-orange" />
              </div>
              <h4 className="font-space font-bold text-black text-sm mb-2">{cat.title}</h4>
              <ul className="space-y-1.5">{cat.items.map((item) => (<li key={item} className="flex items-center gap-2 text-[11px] text-pawport-muted"><span className="w-1.5 h-1.5 rounded-full bg-pawport-orange shrink-0"></span>{item}</li>))}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Fleet