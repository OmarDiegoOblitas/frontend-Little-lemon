import { useEffect, useRef } from 'react'
import './Modal.css'

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Diálogo modal accesible: role="dialog", cierre con Escape o clic fuera,
 * focus trap con Tab y devolución del foco al elemento que lo abrió.
 */
export default function Modal({ title, onClose, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const dialog = dialogRef.current
    dialog.querySelector(FOCUSABLE)?.focus()
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab') return
      const items = dialog.querySelectorAll(FOCUSABLE)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={dialogRef}>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar">×</button>
        <h2 id="modal-title" className="sr-only">{title}</h2>
        {children}
      </div>
    </div>
  )
}
