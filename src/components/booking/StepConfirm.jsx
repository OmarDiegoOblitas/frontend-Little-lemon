import { BOOKING_RULES } from '../../data/config'
import { useReservation } from '../../context/ReservationContext'
import { formatLongDate } from '../../utils/format'
import { getActiveRequests, getTable, getZoneName } from '../../utils/receipt'
import FieldError from './FieldError'

/** Paso 4: tarjeta de resumen y aceptación de la política antes de confirmar. */
export default function StepConfirm() {
  const { state, setField, validateField, goToStep } = useReservation()
  const { date, time, guests, zone, tableId, contact, accepted, errors } = state
  const table = getTable(tableId)
  const requests = getActiveRequests(contact.requests)

  const rows = [
    ['Fecha', formatLongDate(date), 1],
    ['Hora', time, 1],
    ['Personas', guests, 1],
    ['Ambiente', getZoneName(zone), 2],
    ['Mesa', table ? `Mesa ${table.number} · ${table.description}` : '—', 2],
    ['Nombre', contact.name, 3],
    ['Teléfono', contact.phone, 3],
    ['Correo', contact.email, 3],
    ['Motivo', contact.reason, 3],
    ['Peticiones', requests.length ? requests.join(', ') : 'Ninguna', 3],
    ...(contact.notes ? [['Notas', contact.notes, 3]] : []),
  ]

  return (
    <>
      <h3 className="step__title">Revisa y confirma</h3>

      <dl className="summary">
        {rows.map(([label, value, step]) => (
          <div key={label} className="summary__row">
            <dt>{label}</dt>
            <dd>
              {value}
              <button type="button" className="link-btn" onClick={() => goToStep(step)}>
                Editar<span className="sr-only"> {label.toLowerCase()}</span>
              </button>
            </dd>
          </div>
        ))}
      </dl>

      <div className="field">
        <label className="check">
          <input
            type="checkbox" name="accepted" checked={accepted} required aria-required="true"
            aria-invalid={Boolean(errors.accepted)} aria-describedby={errors.accepted ? 'accepted-error' : undefined}
            onChange={(e) => setField('accepted', e.target.checked)} onBlur={() => validateField('accepted')}
          />
          <span>
            Acepto la política de reservas: la mesa se mantiene hasta{' '}
            <strong>{BOOKING_RULES.toleranceMinutes} minutos</strong> después de la hora reservada.
          </span>
        </label>
        <FieldError name="accepted" message={errors.accepted} />
      </div>
    </>
  )
}
