import SuccessfulStories from '@/components/SuccessfulStories'

export const metadata = {
  title: 'Pet Transport Stories and Reviews',
  description: 'Read stories and customer feedback from pets and families who have travelled with Pawport Transport.',
  alternates: {
    canonical: '/stories',
  },
}

export default function StoriesPage() {
  return (
    <div>
      <SuccessfulStories />
    </div>
  )
}