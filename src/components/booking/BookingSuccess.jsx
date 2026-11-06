import { useEffect, useRef } from 'react'
import { useReservation } from '../../context/ReservationContext'
import { formatLongDate } from '../../utils/format'
import { buildReceiptText, buildWhatsAppLink, getTable, getZoneName } from '../../utils/receipt'

/** Pantalla de éxito: código, comprobante descargable, WhatsApp y nueva reserva. */
export default function BookingSuccess() {
  const { state, resetBooking, scrollToBooking } = useReservation()
  const b = state.confirmation
  const headingRef = useRef(null)

  // Mueve el foco al título para que lectores de pantalla anuncien el resultado.
  useEffect(() => { headingRef.current?.focus() }, [])

  if (!b) return null
  const table = getTable(b.tableId)

  const downloadReceipt = () => {
    const blob = new Blob([buildReceiptText(b)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reserva-${b.code}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const startOver = () => {
    resetBooking()
    scrollToBooking()
  }

  return (
    <div className="success">
      <p className="success__icon" aria-hidden="true">🍋</p>
      <h3 ref={headingRef} tabIndex={-1}>¡Reserva confirmada!</h3>
      <p>Te esperamos, {b.contact.name.split(' ')[0]}.</p>

      <p className="success__code-label">Tu código de reserva</p>
      <p className="success__code" aria-label={`Código de reserva ${b.code.split('').join(' ')}`}>{b.code}</p>

      <p>
        {formatLongDate(b.date)} · {b.time} · {b.guests} {b.guests === 1 ? 'persona' : 'personas'}
        <br />
        {getZoneName(b.zone)}{table ? ` · Mesa ${table.number}` : ''}
      </p>
      <p className="field-hint">
        Guardada solo en este navegador. Presenta el código al llegar; la mesa se mantiene 15 minutos.
      </p>

      <div className="success__actions">
        <button type="button" className="btn btn--primary" onClick={downloadReceipt}>Guardar comprobante</button>
        <a className="btn btn--secondary" href={buildWhatsAppLink(b)} target="_blank" rel="noopener noreferrer">
          Compartir en WhatsApp<span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
        <button type="button" className="btn btn--secondary" onClick={startOver}>Nueva reserva</button>
      </div>
    </div>
  )
}
