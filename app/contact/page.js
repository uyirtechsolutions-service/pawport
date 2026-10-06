import Link from 'next/link'

export const metadata = {
  title: 'Contact Pawport Transport',
  description: 'Contact Pawport Transport on WhatsApp about a pet journey or request a booking online.',
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return (
    <section className="px-6 py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-5">
        <h1 className="text-3xl md:text-4xl font-extrabold font-space text-black">Contact Pawport Transport</h1>
        <p className="max-w-xl mx-auto text-sm md:text-base leading-relaxed text-black/65">
          Have a question about a local ride, a long-distance trip, or international pet relocation? Message our team
          on WhatsApp or send a booking request.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a
            href="https://wa.me/919087470137"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-pawport-orange px-6 py-3 text-sm font-bold text-black"
          >
            WhatsApp +91 90874 70137
          </a>
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-lg border border-black/15 px-6 py-3 text-sm font-bold text-black"
          >
            Book Pet Transport
          </Link>
        </div>
      </div>
    </section>
  )
}