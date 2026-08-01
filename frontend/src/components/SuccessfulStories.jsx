import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw, faMapMarkerAlt, faPlaneDeparture, faStar } from '@fortawesome/free-solid-svg-icons'

const stats = [
  { num: '4,500+', label: 'Transports', icon: faPaw },
  { num: '200+', label: 'Cities', icon: faMapMarkerAlt },
  { num: '50+', label: 'International', icon: faPlaneDeparture },
  { num: '9.8★', label: 'Rating', icon: faStar }
]

const stories = [
  { title: 'Golden Retriever — Chennai to Mumbai', date: 'Mar 2025', desc: 'Picked up from home, transported with rest stops, delivered next morning safe and happy.', mode: 'Ground', pet: '🐕 Large' },
  { title: 'Persian Cat — Bangalore to Singapore', date: 'Jan 2025', desc: 'Full customs and quarantine handling. Flew cargo-hold with escort handler.', mode: 'Flight', pet: '🐱 Cat' },
  { title: 'Two Indie Dogs — Coimbatore to Hyderabad', date: 'Dec 2024', desc: 'Climate-controlled van, shared crate, scheduled rest stops, live GPS tracking.', mode: 'Ground', pet: '🐕 Medium' },
  { title: 'Labrador Puppy — Pune to Delhi', date: 'Nov 2024', desc: 'Gentle handling for 3-month-old pup, vet-checked at pickup, wellness follow-up.', mode: 'Ground', pet: '🐶 Large' }
]

const galleryImages = [
  { src: 'https://raw.githubusercontent.com/uyirtechsolutions-service/pawport/main/images/story-1.jpeg', alt: 'Happy pet reunion 1' },
  { src: 'https://raw.githubusercontent.com/uyirtechsolutions-service/pawport/main/images/story-2.jpeg', alt: 'Happy pet reunion 2' },
  { src: 'https://raw.githubusercontent.com/uyirtechsolutions-service/pawport/main/images/story-3.jpeg', alt: 'Happy pet reunion 3' },
  { src: 'https://raw.githubusercontent.com/uyirtechsolutions-service/pawport/main/images/story-4.jpeg', alt: 'Happy pet reunion 4' },
  { src: 'https://raw.githubusercontent.com/uyirtechsolutions-service/pawport/main/images/story-5.jpeg', alt: 'Happy pet reunion 5' },
  { src: 'https://raw.githubusercontent.com/uyirtechsolutions-service/pawport/main/images/story-6.jpeg', alt: 'Happy pet reunion 6' },
  { src: 'https://raw.githubusercontent.com/uyirtechsolutions-service/pawport/main/images/story-7.jpeg', alt: 'Happy pet reunion 7' },
  { src: 'https://raw.githubusercontent.com/uyirtechsolutions-service/pawport/main/images/story-8.jpeg', alt: 'Happy pet reunion 8' }
]

function SuccessfulStories() {
  return (
    <section id="stories" className="py-8 md:py-10 lg:py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pawport-orange/20 text-pawport-orange rounded-full text-[11px] font-bold uppercase tracking-widest">
            <FontAwesomeIcon icon={faStar} className="w-3 h-3" /> Since 2020
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-space text-black">Successful stories</h2>
          <p className="text-pawport-muted text-sm">Over 4,500 pets delivered safely across India and abroad.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-4 bg-white rounded-2xl shadow-card border border-pawport-orange/10">
              <FontAwesomeIcon icon={s.icon} className="w-5 h-5 text-pawport-orange mb-1" />
              <div className="font-mono text-xl font-bold text-pawport-orange">{s.num}</div>
              <div className="text-[10px] text-pawport-muted mt-1 uppercase tracking-wider font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stories.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card border border-pawport-orange/10 p-5 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 bg-pawport-orange/10 text-pawport-orange rounded-full text-[10px] font-bold uppercase tracking-wider">{s.mode}</span>
                <span className="text-[11px] text-pawport-muted">{s.pet}</span>
                <span className="text-[11px] text-pawport-muted ml-auto">{s.date}</span>
              </div>
              <h3 className="font-space font-bold text-black text-sm mb-1">{s.title}</h3>
              <p className="text-[11px] text-pawport-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center max-w-2xl mx-auto space-y-1 pt-2">
          <h3 className="text-lg md:text-xl font-extrabold tracking-tight font-space text-black">Our happy clients</h3>
          <p className="text-pawport-muted text-xs">Moments of joy—pets reunited with their families.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {galleryImages.map((img, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl shadow-card border border-pawport-orange/10 aspect-square hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SuccessfulStories