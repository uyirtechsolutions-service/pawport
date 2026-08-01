import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw, faShuttleVan, faPlaneDeparture, faGlobeAsia, faTaxi, faCheck } from '@fortawesome/free-solid-svg-icons'

const services = [
  { icon: faShuttleVan, title: 'Ground Transport', desc: 'Climate-controlled vans with secure crating, water and rest stops, for trips across the city or across states.', image: '/images/service-ground.jpg', features: ['Door to door', 'Live GPS tracking', 'Multi-pet friendly'] },
  { icon: faPlaneDeparture, title: 'Flight Escort', desc: 'A dedicated handler flies with your pet — in-cabin or cargo-hold — from check-in to baggage claim.', image: '/images/service-flight.jpg', features: ['In-cabin escort', 'Cargo-hold specialist', 'Airline docs'] },
  { icon: faGlobeAsia, title: 'International Relocation', desc: 'Import permits, health certificates and customs paperwork handled end to end for moving abroad.', image: '/images/service-relocation.jpg', features: ['Customs clearance', 'Import permits', 'Quarantine support'] },
  { icon: faTaxi, title: 'Local Pet Taxi', desc: 'On-demand rides to the vet, groomer or daycare, booked in minutes with a tracked pickup window.', image: '/images/service-taxi.jpg', features: ['Vet runs', 'Grooming visits', 'Same-day booking'] },
]

function Services() {
  return (
    <section id="services" className="py-8 md:py-10 lg:py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pawport-orange/20 text-pawport-orange rounded-full text-[11px] font-bold uppercase tracking-widest">
            <FontAwesomeIcon icon={faPaw} className="w-3 h-3" /> Our Services
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-space text-black">Four ways to move your pet</h2>
          <p className="text-pawport-muted text-sm">One team watching over them end to end — no handoffs between operators.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div key={i} className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-pawport-orange/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <div className="relative h-36 overflow-hidden">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                  <FontAwesomeIcon icon={s.icon} className="w-5 h-5 text-pawport-orange" />
                </div>
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-space font-bold text-black text-sm">{s.title}</h3>
                <p className="text-xs text-pawport-muted leading-relaxed flex-1">{s.desc}</p>
                <ul className="space-y-1 pt-3 border-t border-pawport-orange/10">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[11px] text-black font-medium">
                      <span className="w-4 h-4 rounded-full bg-pawport-orange/10 text-pawport-orange flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faCheck} className="w-2 h-2" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services