import { RESTAURANT, SCHEDULE } from '../data/config'
import './Contact.css'

/** Horarios por turno, dirección, mapa (iframe OpenStreetMap) y WhatsApp. */
export default function Contact() {
  const waLink = `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent('Hola Little Lemon, quisiera más información.')}`

  return (
    <section id="contacto" className="section contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div>
          <h2 id="contact-title">Horarios y Contacto</h2>

          <h3>Horarios</h3>
          <table className="contact__table">
            <caption className="sr-only">Horarios de atención por turno</caption>
            <thead>
              <tr><th scope="col">Turno</th><th scope="col">Días</th><th scope="col">Horario</th></tr>
            </thead>
            <tbody>
              {SCHEDULE.map((s) => (
                <tr key={s.id}>
                  <th scope="row">{s.label}</th>
                  <td>{s.days}</td>
                  <td>{s.from} – {s.to}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Encuéntranos</h3>
          <address>
            {RESTAURANT.address}<br />
            Tel: <a href={`tel:${RESTAURANT.phone.replace(/\s/g, '')}`}>{RESTAURANT.phone}</a><br />
            <a href={`mailto:${RESTAURANT.email}`}>{RESTAURANT.email}</a>
          </address>

          <a href={waLink} className="btn btn--secondary" target="_blank" rel="noopener noreferrer">
            Escríbenos por WhatsApp<span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </div>

        <iframe
          className="contact__map"
          title="Mapa con la ubicación de Little Lemon"
          loading="lazy"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-74.09%2C4.59%2C-74.05%2C4.62&layer=mapnik"
        />
      </div>
    </section>
  )
}
