import { useState } from 'react'
import { RESTAURANT } from '../data/config'
import BookingLink from './BookingLink'
import './Header.css'

const LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#carta', label: 'Carta' },
  { href: '#espacios', label: 'Espacios' },
  { href: '#contacto', label: 'Contacto' },
]

/** Barra de navegación fija con menú hamburguesa en móvil (useState). */
export default function Header() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#inicio" className="header__brand" onClick={close}>
          <span aria-hidden="true">🍋</span> {RESTAURANT.name}
        </a>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          <span aria-hidden="true">{open ? '✕' : '☰'}</span>
        </button>

        <nav id="main-nav" className={`header__nav ${open ? 'is-open' : ''}`} aria-label="Principal">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}><a href={l.href} onClick={close}>{l.label}</a></li>
            ))}
            <li><BookingLink className="btn btn--primary" onClick={close}>Reservar</BookingLink></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
