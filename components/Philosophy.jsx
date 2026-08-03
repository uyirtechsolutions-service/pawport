'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw } from '@fortawesome/free-solid-svg-icons'

function Philosophy() {
  return (
    <section className="py-8 md:py-10 lg:py-10 px-6 md:px-12 gradient-pawport relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="/images/philosophy-reunion.jpg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-sm text-white rounded-full text-[11px] font-bold uppercase tracking-widest border border-white/20">
          <FontAwesomeIcon icon={faPaw} className="w-3 h-3" /> Our Philosophy
        </span>
        <blockquote className="font-space font-bold italic text-xl md:text-3xl leading-relaxed text-white">
          &ldquo;We never treats a pet like cargo.{' '}
          <span className="text-black">We treat cargo like it&rsquo;s someone&rsquo;s best friend</span>
          {' '}— checked on, walked, and never left alone.&rdquo;
        </blockquote>
        <cite className="block not-italic text-sm text-white/90 font-body">— how we brief every handler before a trip</cite>
      </div>
    </section>
  )
}
export default Philosophy