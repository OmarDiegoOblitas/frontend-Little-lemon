import { SPECIAL_REQUESTS, VISIT_REASONS } from '../../data/config'
import { useReservation } from '../../context/ReservationContext'
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback'
import FieldError from './FieldError'

const NOTES_MAX = 300

/** Paso 3: datos de contacto, motivo de la visita y peticiones especiales. */
export default function StepContact() {
  const { state, setContactField, toggleRequest, validateField } = useReservation()
  const { contact, errors } = state

  // Validación en tiempo real con debounce: espera a que el usuario deje de escribir.
  const validateLater = useDebouncedCallback((field) => validateField(field), 600)

  const onText = (field) => (e) => {
    setContactField(field, e.target.value)
    if (e.target.value) validateLater(field) // no se molesta con "campo obligatorio" mientras escribe
  }

  const describedBy = (field, hint) => (errors[field] ? `${field}-error` : hint)

  return (
    <>
      <h3 className="step__title">Tus datos</h3>

      <div className="field">
        <label htmlFor="name">Nombre completo <span aria-hidden="true">*</span></label>
        <input id="name" name="name" type="text" autoComplete="name" required aria-required="true"
          value={contact.name} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy('name')}
          onChange={onText('name')} onBlur={() => validateField('name')} />
        <FieldError name="name" message={errors.name} />
      </div>

      <div className="field">
        <label htmlFor="phone">Teléfono / Celular <span aria-hidden="true">*</span></label>
        <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required aria-required="true"
          value={contact.phone} aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy('phone', 'phone-hint')}
          onChange={onText('phone')} onBlur={() => validateField('phone')} />
        <p id="phone-hint" className="field-hint">Ejemplo: +57 300 123 4567</p>
        <FieldError name="phone" message={errors.phone} />
      </div>

      <div className="field">
        <label htmlFor="email">Correo electrónico <span aria-hidden="true">*</span></label>
        <input id="email" name="email" type="email" autoComplete="email" required aria-required="true"
          value={contact.email} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy('email')}
          onChange={onText('email')} onBlur={() => validateField('email')} />
        <FieldError name="email" message={errors.email} />
      </div>

      <div className="field">
        <label htmlFor="reason">Motivo de la visita <span aria-hidden="true">*</span></label>
        <select id="reason" name="reason" required aria-required="true" value={contact.reason}
          aria-invalid={Boolean(errors.reason)} aria-describedby={describedBy('reason')}
          onChange={(e) => setContactField('reason', e.target.value)} onBlur={() => validateField('reason')}>
          <option value="">Selecciona una opción</option>
          {VISIT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <FieldError name="reason" message={errors.reason} />
      </div>

      <fieldset className="field">
        <legend>Peticiones especiales (opcional)</legend>
        {SPECIAL_REQUESTS.map((r) => (
          <label key={r.id} className="check">
            <input type="checkbox" checked={Boolean(contact.requests[r.id])} onChange={() => toggleRequest(r.id)} />
            <span>{r.label}</span>
          </label>
        ))}
      </fieldset>

      <div className="field">
        <label htmlFor="notes">Notas adicionales (opcional)</label>
        <textarea id="notes" name="notes" rows={3} maxLength={NOTES_MAX + 50} value={contact.notes}
          aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? 'notes-error' : 'notes-count'}
          onChange={(e) => setContactField('notes', e.target.value)} onBlur={() => validateField('notes')} />
        <p id="notes-count" className="field-hint">{contact.notes.length}/{NOTES_MAX} caracteres</p>
        <FieldError name="notes" message={errors.notes} />
      </div>
    </>
  )
}
