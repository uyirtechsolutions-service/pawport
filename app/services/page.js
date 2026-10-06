import Services from '@/components/Services'

export const metadata = {
  title: 'Pet Transport Services',
  description: 'Explore Pawport ground pet transport, flight escort, international relocation, and local pet taxi services across India.',
  alternates: {
    canonical: '/services',
  },
}

export default function ServicesPage() {
  return (
    <div>
      <h1 className="px-6 pt-8 text-center text-3xl font-extrabold font-space text-black">Pet Transport Services in India</h1>
      <Services />
    </div>
  )
}