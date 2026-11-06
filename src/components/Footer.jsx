import { RESTAURANT } from '../data/config'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-primary-dark)', color: '#fff', padding: '1.5rem 0', textAlign: 'center' }}>
      <div className="container">
        <p>© {YEAR} {RESTAURANT.name}. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
