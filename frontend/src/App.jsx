import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ProcessPage from './pages/ProcessPage'
import StoriesPage from './pages/StoriesPage'
import BookingPage from './pages/BookingPage'

function App() {
  return (
<div className="min-h-screen bg-white text-black antialiased flex flex-col pb-16 md:pb-0">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/book" element={<BookingPage />} />
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}

export default App
