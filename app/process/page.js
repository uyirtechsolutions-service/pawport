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
      <h1 className="px-6 pt-8 text-center text-3xl font-extrabold font-space text-black">How Pawport Pet Transport Works</h1>
      <Process />
    </div>
  )
}