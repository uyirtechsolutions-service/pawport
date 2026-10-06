import Fleet from '@/components/Fleet'
import Philosophy from '@/components/Philosophy'

export const metadata = {
  title: 'About Pawport Transport',
  description: 'Learn about Pawport Transport and our approach to local, interstate, and international pet journeys.',
  alternates: {
    canonical: '/about-us',
  },
}

export default function AboutPage() {
  return (
    <>
      <section className="px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold font-space text-black">About Pawport Transport</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed text-black/65">
            Pawport helps families plan local, interstate, and international pet journeys with dedicated handling,
            comfortable transport options, and updates throughout the trip.
          </p>
        </div>
      </section>
      <Philosophy />
      <Fleet />
    </>
  )
}