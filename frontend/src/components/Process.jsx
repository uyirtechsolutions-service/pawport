import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faClipboardList, faClipboardCheck, faHandshake, faTruck, faHome } from '@fortawesome/free-solid-svg-icons'

const steps = [
  { num: '01', icon: faClipboardList, title: 'Book', desc: "Tell us the route, dates, and your pet's needs.", tag: 'Instant quote' },
  { num: '02', icon: faClipboardCheck, title: 'Health & Docs Check', desc: 'We confirm vaccination records and permits required.', tag: 'Verified paperwork' },
  { num: '03', icon: faHandshake, title: 'Pickup', desc: 'A certified handler collects your pet from your door.', tag: 'Handler ID sent' },
  { num: '04', icon: faTruck, title: 'In Transit', desc: 'Regular rest, water and comfort checks with live updates.', tag: 'Live tracking' },
  { num: '05', icon: faHome, title: 'Safe Arrival', desc: 'Delivered with a health check and confirmation call.', tag: 'Confirmation call' }
]

function Process() {
  return (
    <section id="process" className="py-8 md:py-10 lg:py-10 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pawport-orange/20 text-pawport-orange rounded-full text-[11px] font-bold uppercase tracking-widest">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" /> How it works
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-space text-black">Five stages to safe delivery</h2>
          <p className="text-pawport-muted text-sm">Your pet is never handed off unattended.</p>
        </div>
        <div className="space-y-0 border border-pawport-orange/10 rounded-2xl overflow-hidden">
          {steps.map((step, i) => (
            <div key={step.num} className={`grid grid-cols-[60px_1fr_auto] md:grid-cols-[80px_1fr_auto] gap-4 md:gap-6 p-5 md:p-6 items-center transition-colors ${i < steps.length - 1 ? 'border-b border-pawport-orange/10' : ''} hover:bg-pawport-orange/5`}>
              <div className="flex flex-col items-center gap-1">
                <FontAwesomeIcon icon={step.icon} className="w-5 h-5 text-pawport-orange" />
                <span className="font-mono text-xs font-bold text-pawport-orange">{step.num}</span>
              </div>
              <div><h3 className="font-space font-bold text-sm text-black">{step.title}</h3><p className="text-xs text-pawport-muted mt-1">{step.desc}</p></div>
              <div className="hidden md:block"><span className="inline-flex items-center px-3 py-1 bg-pawport-orange/10 text-pawport-orange rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{step.tag}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Process