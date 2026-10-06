import BookingForm from '@/components/BookingForm'

export const metadata = {
  title: 'Book Pet Transport Service',
  description: 'Request a Pawport pet transport booking for local rides, road journeys, flight escort, or international relocation.',
  alternates: {
    canonical: '/book',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function BookingPage() {
  return (
    <div>
      <BookingForm />
    </div>
  )
}