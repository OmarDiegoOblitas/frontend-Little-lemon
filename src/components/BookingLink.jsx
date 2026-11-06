import { useReservation } from '../context/ReservationContext'

/**
 * Enlace a la sección de reserva. Con JavaScript hace scroll suave y enfoca el
 * formulario (useContext + useRef); sin él, el href="#reservar" sigue funcionando.
 */
export default function BookingLink({ onClick, children, ...props }) {
  const { scrollToBooking } = useReservation()
  return (
    <a
      href="#reservar"
      {...props}
      onClick={(e) => {
        e.preventDefault()
        onClick?.()
        scrollToBooking()
      }}
    >
      {children}
    </a>
  )
}
