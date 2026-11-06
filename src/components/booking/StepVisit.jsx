import { BOOKING_RULES } from '../../data/config'
import { useReservation } from '../../context/ReservationContext'
import { ACTIONS } from '../../context/reservationReducer'
import { getDateLimits, getTimeSlots } from '../../utils/availability'
import FieldError from './FieldError'

/**
 * Paso 1: fecha, franja horaria (slots de 30 min) y cantidad de personas.
 * @param {{id:string,label:string,slots:string[]}[]} availableTimes franjas del día elegido, por turno
 * @param {Function} dispatch dispatch del reducer de la reserva
 */
export default function StepVisit({ availableTimes, dispatch }) {
  const { state, validateField } = useReservation()
  const { date, time, guests, errors } = state
  const { min, max } = getDateLimits()
  const shifts = availableTimes

  const setField = (field, value) => dispatch({ type: ACTIONS.SET_FIELD, field, value })

  const onDateChange = (value) => {
    setField('date', value)
    // Si la hora elegida no existe en la nueva fecha (p. ej. ya pasó hoy), se limpia.
    if (time && value && !getTimeSlots(value).some((s) => s.slots.includes(time))) setField('time', '')
  }

  const changeGuests = (delta) => {
    const next = Math.min(BOOKING_RULES.maxGuests, Math.max(BOOKING_RULES.minGuests, Number(guests || 0) + delta))
    setField('guests', next)
  }

  return (
    <>
      <h3 className="step__title">¿Cuándo nos visitas?</h3>

      <div className="field">
        <label htmlFor="date">Fecha</label>
        <input
          id="date" name="date" type="date" min={min} max={max} value={date}
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? 'date-error' : 'date-hint'}
          onChange={(e) => onDateChange(e.target.value)}
          onBlur={() => validateField('date')}
        />
        <p id="date-hint" className="field-hint">Reservas hasta con {BOOKING_RULES.maxDaysAhead} días de anticipación.</p>
        <FieldError name="date" message={errors.date} />
      </div>

      <fieldset className="field" aria-describedby={errors.time ? 'time-error' : undefined}>
        <legend>Hora</legend>
        {!date ? (
          <p className="field-hint">Elige primero una fecha para ver las horas disponibles.</p>
        ) : shifts.length === 0 ? (
          <p className="field-hint">Ya no quedan horarios disponibles para hoy. Prueba con otra fecha.</p>
        ) : (
          shifts.map((shift) => (
            <div key={shift.id} className="slots">
              <p className="slots__label">{shift.label}</p>
              <div className="slots__list">
                {shift.slots.map((slot, i) => (
                  <label key={slot} className="slot">
                    <input
                      type="radio" name="time" value={slot} checked={time === slot}
                      aria-invalid={Boolean(errors.time)}
                      // Solo el primer radio lleva data-field para recibir el foco si hay error
                      {...(shift === shifts[0] && i === 0 ? { 'data-field': 'time' } : {})}
                      onChange={() => setField('time', slot)}
                    />
                    <span>{slot}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
        <FieldError name="time" message={errors.time} />
      </fieldset>

      <div className="field">
        <label htmlFor="guests">Personas</label>
        <div className="stepper-input">
          <button type="button" className="btn btn--secondary" aria-label="Una persona menos"
            disabled={Number(guests) <= BOOKING_RULES.minGuests} onClick={() => changeGuests(-1)}>−</button>
          <input
            id="guests" name="guests" type="number" inputMode="numeric"
            min={BOOKING_RULES.minGuests} max={BOOKING_RULES.maxGuests} value={guests}
            aria-invalid={Boolean(errors.guests)}
            aria-describedby={errors.guests ? 'guests-error' : 'guests-hint'}
            onChange={(e) => setField('guests', e.target.value === '' ? '' : Number(e.target.value))}
            onBlur={() => validateField('guests')}
          />
          <button type="button" className="btn btn--secondary" aria-label="Una persona más"
            disabled={Number(guests) >= BOOKING_RULES.maxGuests} onClick={() => changeGuests(1)}>+</button>
        </div>
        <p id="guests-hint" className="field-hint">De {BOOKING_RULES.minGuests} a {BOOKING_RULES.maxGuests} comensales.</p>
        <FieldError name="guests" message={errors.guests} />
      </div>
    </>
  )
}
