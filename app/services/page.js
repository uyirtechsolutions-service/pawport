import Services from '@/components/Services'

export const metadata = {
  title: 'Pet Transport Services in India',
  description: 'Explore Pawport ground pet transport, flight escort, international relocation, and local pet taxi services across India.',
  alternates: {
    canonical: '/services',
  },
}

export default function ServicesPage() {
  return (
    <div>
      <Services />
    </div>
  )
}