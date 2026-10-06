import SuccessfulStories from '@/components/SuccessfulStories'

export const metadata = {
  title: 'Pet Transport Stories',
  description: 'Read stories and customer feedback from pets and families who have travelled with Pawport Transport.',
  alternates: {
    canonical: '/stories',
  },
}

export default function StoriesPage() {
  return (
    <div>
      <h1 className="px-6 pt-8 text-center text-3xl font-extrabold font-space text-black">Pet Transport Stories and Reviews</h1>
      <SuccessfulStories />
    </div>
  )
}