import Hero from '../components/Hero'
import Services from '../components/Services'
import Process from '../components/Process'
import Fleet from '../components/Fleet'
import Philosophy from '../components/Philosophy'
import Transports from '../components/Transports'
import SuccessfulStories from '../components/SuccessfulStories'
import BookingForm from '../components/BookingForm'

function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Process />
      <Fleet />
      <Philosophy />
      <SuccessfulStories />
      <Transports />
      <BookingForm />
    </>
  )
}

export default HomePage