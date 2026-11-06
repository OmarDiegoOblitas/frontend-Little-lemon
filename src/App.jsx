import Header from './components/Header'
import Hero from './components/Hero'
import Menu from './components/Menu'
import Spaces from './components/Spaces'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BookingSection from './components/BookingSection'
import { ReservationProvider } from './context/ReservationContext'

export default function App() {
  return (
    // El Provider envuelve todo: los CTA de la landing y el formulario comparten el mismo estado.
    <ReservationProvider>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Menu />
        <Spaces />
        <BookingSection />
        <Contact />
      </main>
      <Footer />
    </ReservationProvider>
  )
}
