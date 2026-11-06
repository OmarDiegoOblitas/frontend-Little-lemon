import { useMemo } from 'react'
import { useReservation } from '../context/ReservationContext'
import { LAST_STEP, STATUS, STEPS } from '../context/reservationReducer'
import { STEP_VALIDATORS } from '../utils/validation'
import Stepper from './booking/Stepper'
import StepVisit from './booking/StepVisit'
import StepTable from './booking/StepTable'
import StepContact from './booking/StepContact'
import StepConfirm from './booking/StepConfirm'

const HINTS = {
  [STEPS.VISIT]: 'la fecha, la hora y las personas',
  [STEPS.TABLE]: 'el ambiente y la mesa',
  [STEPS.CONTACT]: 'tu nombre, teléfono, correo y el motivo de la visita',
  [STEPS.CONFIRM]: 'la aceptación de la política de reservas',
}

/**
 * Formulario de reserva en 4 pasos.
 * @param {{id:string,label:string,slots:string[]}[]} availableTimes franjas disponibles para la fecha elegida
 * @param {Function} dispatch dispatch del reducer de la reserva (lo usa el paso 1 para fecha y hora)
 * @param {Function} submitForm se invoca al confirmar en el último paso; devuelve una promesa<boolean>
 */
export default function BookingForm({ availableTimes, dispatch, submitForm }) {
  const { state, nextStep, prevStep } = useReservation()
  const { step, status, submitError } = state

  // Errores del paso actual (sin mostrarlos): habilitan o deshabilitan el botón principal.
  const pending = useMemo(() => STEP_VALIDATORS[step](state), [step, state])
  const canContinue = Object.keys(pending).length === 0
  const submitting = status === STATUS.SUBMITTING
  const isLast = step === LAST_STEP

  return (
    <>
      {submitError && status === STATUS.ERROR && <p className="notice notice--error" role="alert">{submitError}</p>}

      <Stepper current={step} />

      <form noValidate onSubmit={(e) => { e.preventDefault(); if (isLast && canContinue) submitForm() }} aria-labelledby="book-title">
        {step === STEPS.VISIT && <StepVisit availableTimes={availableTimes} dispatch={dispatch} />}
        {step === STEPS.TABLE && <StepTable />}
        {step === STEPS.CONTACT && <StepContact />}
        {step === STEPS.CONFIRM && <StepConfirm />}

        <div className="booking__nav">
          {step > 1 && (
            <button type="button" className="btn btn--secondary" onClick={prevStep} disabled={submitting}>Atrás</button>
          )}
          <button
            type="button" className="btn btn--primary"
            onClick={isLast ? submitForm : nextStep}
            disabled={!canContinue || submitting}
            aria-describedby={canContinue ? undefined : 'next-hint'}
          >
            {isLast ? (submitting ? 'Confirmando…' : 'Confirmar reserva') : 'Siguiente'}
          </button>
        </div>
        {!canContinue && <p id="next-hint" className="field-hint">Completa {HINTS[step]} para continuar.</p>}
      </form>
    </>
  )
}
