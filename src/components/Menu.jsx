import { useState } from 'react'
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menu'
import { formatPrice } from '../utils/format'
import Modal from './Modal'
import './Menu.css'

/** Carta con filtro por categoría y modal de foto del plato (todo con useState). */
export default function Menu() {
  const [category, setCategory] = useState('Todos')
  const [selected, setSelected] = useState(null)

  const items = category === 'Todos' ? MENU_ITEMS : MENU_ITEMS.filter((i) => i.category === category)

  return (
    <section id="carta" className="section menu" aria-labelledby="menu-title">
      <div className="container">
        <h2 id="menu-title">Nuestra Carta</h2>
        <p className="menu__intro">Precios referenciales en pesos colombianos.</p>

        <div className="menu__filters" role="group" aria-label="Filtrar por categoría">
          {MENU_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${c === category ? 'is-active' : ''}`}
              aria-pressed={c === category}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* aria-live avisa a lectores de pantalla cuántos platos hay tras filtrar */}
        <p className="sr-only" aria-live="polite">{items.length} platos en {category}</p>

        {items.length === 0 ? (
          <p className="menu__empty">No hay platos en esta categoría por ahora.</p>
        ) : (
          <ul className="menu__grid">
            {items.map((item) => (
              <li key={item.id} className="card">
                <button type="button" className="card__img-btn" onClick={() => setSelected(item)}
                  aria-label={`Ver foto de ${item.name}`}>
                  <img src={item.image} alt="" loading="lazy" width="600" height="400" />
                </button>
                <div className="card__body">
                  <div className="card__head">
                    <h3>{item.name}</h3>
                    <span className="card__price">{formatPrice(item.price)}</span>
                  </div>
                  <p>{item.description}</p>
                  <ul className="card__tags" aria-label="Etiquetas dietéticas y alérgenos">
                    {item.tags.map((t) => <li key={t} className="tag">{t}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <img className="menu__modal-img" src={selected.image.replace('w=600', 'w=1000')}
            alt={`Foto de ${selected.name}`} />
          <div className="menu__modal-body">
            <h3>{selected.name}</h3>
            <p>{selected.description}</p>
            <p><strong>{formatPrice(selected.price)}</strong></p>
          </div>
        </Modal>
      )}
    </section>
  )
}
