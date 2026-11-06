import { useRef, useState } from 'react'
import { SPACES } from '../data/spaces'
import BookingLink from './BookingLink'
import './Spaces.css'

/** Tabs accesibles (patrón WAI-ARIA) con navegación por flechas, Inicio y Fin. */
export default function Spaces() {
  const [activeId, setActiveId] = useState(SPACES[0].id)
  const tabRefs = useRef({})
  const active = SPACES.find((s) => s.id === activeId)

  const onKeyDown = (e, index) => {
    const last = SPACES.length - 1
    const target = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[e.key]
    if (target === undefined) return
    e.preventDefault()
    const next = SPACES[target].id
    setActiveId(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="espacios" className="section spaces" aria-labelledby="spaces-title">
      <div className="container">
        <h2 id="spaces-title">Experiencias y Espacios</h2>

        <div role="tablist" aria-label="Espacios del restaurante" className="spaces__tabs">
          {SPACES.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => { tabRefs.current[s.id] = el }}
              role="tab"
              id={`tab-${s.id}`}
              type="button"
              aria-selected={s.id === activeId}
              aria-controls={`panel-${s.id}`}
              tabIndex={s.id === activeId ? 0 : -1}
              className={`spaces__tab ${s.id === activeId ? 'is-active' : ''}`}
              onClick={() => setActiveId(s.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {s.short}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${active.id}`} aria-labelledby={`tab-${active.id}`} className="spaces__panel" tabIndex={0}>
          <img src={active.image} alt={`Ambiente de ${active.name}`} loading="lazy" width="900" height="600" />
          <div className="spaces__info">
            <h3>{active.name}</h3>
            <p>{active.description}</p>
            <ul className="card__tags" aria-label="Características">
              {active.features.map((f) => <li key={f} className="tag">{f}</li>)}
            </ul>
            <BookingLink className="btn btn--primary">Reservar en este espacio</BookingLink>
          </div>
        </div>
      </div>
    </section>
  )
}
