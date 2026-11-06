import { useMemo } from 'react'
import { useReservation } from '../context/ReservationContext'
import { STATUS } from '../context/reservationReducer'
import { getTimeSlots } from '../utils/availability'
import BookingForm from './BookingForm'
import BookingSuccess from './booking/BookingSuccess'
import './BookingSection.css'

/** Sección "Reserva tu mesa": prepara los datos del formulario y muestra el éxito al confirmar. */
export default function BookingSection() {
  const { state, dispatch, formRef, storageWarning, confirmBooking } = useReservation()

  // Franjas del día elegido; solo se recalculan si cambia la fecha.
  const availableTimes = useMemo(() => (state.date ? getTimeSlots(state.date) : []), [state.date])

  return (
    <section id="reservar" className="section booking" aria-labelledby="book-title">
      <div className="container booking__container">
        <h2 id="book-title">Reserva tu mesa</h2>
        <p className="booking__intro">Cuatro pasos sencillos. Tu borrador se guarda automáticamente.</p>

        <div ref={formRef} tabIndex={-1} className="booking__card">
          {storageWarning && <p className="notice notice--warn" role="alert">{storageWarning}</p>}

          {state.status === STATUS.SUCCESS ? (
            <BookingSuccess />
          ) : (
            <BookingForm availableTimes={availableTimes} dispatch={dispatch} submitForm={confirmBooking} />
          )}
        </div>
      </div>
    </section>
  )
}
