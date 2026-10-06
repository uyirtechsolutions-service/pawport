import Process from '@/components/Process'

export const metadata = {
  title: 'How Pet Transport Works',
  description: 'See how Pawport plans, tracks, and completes a pet journey, from booking and pickup through safe delivery.',
  alternates: {
    canonical: '/process',
  },
}

export default function ProcessPage() {
  return (
    <div>
      <Process />
    </div>
  )
}