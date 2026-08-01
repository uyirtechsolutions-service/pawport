import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShuttleVan, faPlaneDeparture, faDog, faPaw } from '@fortawesome/free-solid-svg-icons'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

const trips = [
  { kind: 'Ground', icon: faShuttleVan, title: 'Chennai to Bangalore, next-day delivery', desc: "Family relocated for work. Two dogs transported with rest stops, delivered next morning safe and happy." },
  { kind: 'Flight', icon: faPlaneDeparture, title: 'In-cabin — Bangalore to Singapore', desc: 'Full customs handling. Cat flew cargo-hold with escort handler.' },
  { kind: 'Multi-pet', icon: faDog, title: 'Two Indie Dogs — Coimbatore to Hyderabad', desc: 'Climate-controlled van, shared crate, scheduled rest stops, live GPS.' },
  { kind: 'Puppy', icon: faPaw, title: 'Labrador Puppy — Pune to Delhi', desc: 'Gentle handling for 3-month-old pup, vet-checked, wellness follow-up.' }
]

function Transports() {
  return (
    <section id="transports" className="py-8 md:py-10 lg:py-10 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pawport-orange/20 text-pawport-orange rounded-full text-[11px] font-bold uppercase tracking-widest">
            <FontAwesomeIcon icon={faShuttleVan} className="w-3 h-3" /> Recent Trips
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-space text-black">Real pets, real journeys</h2>
          <p className="text-pawport-muted text-sm">Moved without drama. Every trip is a story of care.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trips.map((trip, i) => (
            <div key={i} className="group bg-white rounded-2xl shadow-card border border-pawport-orange/10 p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={trip.icon} className="w-5 h-5 text-pawport-orange" />
                  <span className="inline-flex items-center px-2.5 py-1 bg-pawport-orange/10 text-pawport-orange rounded-full text-[10px] font-bold uppercase tracking-wider">{trip.kind}</span>
                </div>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-4 h-4 text-pawport-muted group-hover:text-pawport-orange transition-colors" />
              </div>
              <h3 className="font-space font-bold text-black text-base mb-2">{trip.title}</h3>
              <p className="text-xs text-pawport-muted leading-relaxed">{trip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Transports