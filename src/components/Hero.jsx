import { RESTAURANT } from '../data/config'
import BookingLink from './BookingLink'
import './Hero.css'

/** Portada con propuesta de valor y CTA principal hacia el formulario de reserva. */
export default function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 id="hero-title">{RESTAURANT.name}</h1>
          <p className="hero__slogan">{RESTAURANT.slogan}</p>
          <p>
            Cocina mediterránea de autor con ingredientes frescos, tres ambientes únicos y
            un servicio que te hace sentir en casa.
          </p>
          <BookingLink className="btn btn--primary">Reservar una mesa</BookingLink>
        </div>
        <img
          className="hero__img"
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=70"
          alt="Mesa servida con platos mediterráneos en el salón del restaurante"
          width="800" height="600"
        />
      </div>
    </section>
  )
}
