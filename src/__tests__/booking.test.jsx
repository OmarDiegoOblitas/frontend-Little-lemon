import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import BookingSection from '../components/BookingSection'
import { ReservationProvider } from '../context/ReservationContext'
import { addDays, toISODate } from '../utils/format'
import { STORAGE_KEYS } from '../utils/storage'

const FUTURE = toISODate(addDays(new Date(), 10)) // lejos de las reservas simuladas

const renderWizard = () =>
  render(<ReservationProvider><BookingSection /></ReservationProvider>)

const next = () => screen.getByRole('button', { name: 'Siguiente' })

async function completeStep1(user) {
  fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: FUTURE } })
  await user.click(screen.getByLabelText('20:00'))
  await user.click(next())
}

async function completeStep2(user) {
  await user.click(screen.getByLabelText(/Terraza al Aire Libre/))
  await user.click(screen.getByRole('button', { name: /Mesa 2, capacidad 2 personas, disponible/ }))
  await user.click(next())
}

async function completeStep3(user) {
  await user.type(screen.getByLabelText(/Nombre completo/), 'Ana Pérez')
  await user.type(screen.getByLabelText(/Teléfono/), '3001234567')
  await user.type(screen.getByLabelText(/Correo electrónico/), 'ana@correo.com')
  await user.selectOptions(screen.getByLabelText(/Motivo/), 'Cumpleaños')
  await user.click(next())
}

describe('wizard de reserva', () => {
  it('el botón Siguiente está deshabilitado hasta completar el paso 1', async () => {
    const user = userEvent.setup()
    renderWizard()
    expect(next()).toBeDisabled()
    expect(screen.getByText(/Elige primero una fecha/)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: FUTURE } })
    expect(next()).toBeDisabled() // falta la hora
    await user.click(screen.getByLabelText('20:00'))
    expect(next()).toBeEnabled()
  })

  it('rechaza una fecha pasada y muestra el mensaje al salir del campo', async () => {
    renderWizard()
    const date = screen.getByLabelText('Fecha')
    fireEvent.change(date, { target: { value: '2020-01-01' } })
    fireEvent.blur(date)
    expect(await screen.findByRole('alert')).toHaveTextContent(/fecha pasada/)
    expect(date).toHaveAttribute('aria-invalid', 'true')
    expect(date).toHaveAccessibleDescription(/fecha pasada/)
  })

  it('en el paso 2 deshabilita las mesas que no caben y las ocupadas', async () => {
    const user = userEvent.setup()
    renderWizard()
    await user.click(screen.getByRole('button', { name: 'Una persona más' })) // 3 personas
    await completeStep1(user)
    await user.click(screen.getByLabelText(/Terraza al Aire Libre/))
    const small = screen.getByRole('button', { name: /Mesa 1, .*capacidad insuficiente/ })
    expect(small).toHaveAttribute('aria-disabled', 'true')
    await user.click(small)
    expect(next()).toBeDisabled() // no se pudo seleccionar
    await user.click(screen.getByRole('button', { name: /Mesa 3, .*disponible/ }))
    expect(next()).toBeEnabled()
  })

  it('valida el paso 3 con mensajes claros', async () => {
    const user = userEvent.setup()
    renderWizard()
    await completeStep1(user)
    await completeStep2(user)

    const email = screen.getByLabelText(/Correo electrónico/)
    await user.type(email, 'no-es-correo')
    await user.tab()
    expect(await screen.findByText(/correo válido/)).toBeInTheDocument()
    expect(email).toHaveAttribute('aria-invalid', 'true')

    await user.type(screen.getByLabelText(/Teléfono/), 'abc')
    await user.tab()
    expect(await screen.findByText(/solo puede contener números/)).toBeInTheDocument()
    expect(next()).toBeDisabled()
  })

  it('completa una reserva, muestra el código y la guarda en localStorage', async () => {
    const user = userEvent.setup()
    renderWizard()
    await completeStep1(user)
    await completeStep2(user)
    await completeStep3(user)

    const confirm = screen.getByRole('button', { name: 'Confirmar reserva' })
    expect(confirm).toBeDisabled() // falta aceptar la política
    await user.click(screen.getByLabelText(/Acepto la política/))
    await user.click(confirm)

    expect(await screen.findByText('¡Reserva confirmada!')).toBeInTheDocument()
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.bookings))
    expect(saved).toHaveLength(1)
    expect(saved[0]).toMatchObject({ date: FUTURE, time: '20:00', tableId: 'T2', zone: 'terraza' })
    expect(screen.getByText(saved[0].code)).toBeInTheDocument()
    expect(window.localStorage.getItem(STORAGE_KEYS.draft)).toBeNull() // borrador limpiado
    expect(screen.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', expect.stringContaining('wa.me'))

    await user.click(screen.getByRole('button', { name: 'Nueva reserva' }))
    expect(screen.getByLabelText('Fecha')).toHaveValue('')
  })

  it('si la mesa fue tomada mientras tanto, avisa y vuelve al paso 2', async () => {
    const user = userEvent.setup()
    renderWizard()
    await completeStep1(user)
    await completeStep2(user)
    await completeStep3(user)
    await user.click(screen.getByLabelText(/Acepto la política/))

    // Otra pestaña reserva la misma mesa a la misma hora
    window.localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify([
      { code: 'LL-OTHER2', tableId: 'T2', date: FUTURE, time: '20:00' },
    ]))
    await user.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

    expect(await screen.findByText(/acaba de ser reservada/)).toBeInTheDocument()
    expect(screen.getByText('Elige tu ambiente y mesa')).toBeInTheDocument()
    expect(screen.queryByText('¡Reserva confirmada!')).not.toBeInTheDocument()
  })

  it('restaura el borrador guardado tras una recarga', async () => {
    window.localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify({
      step: 1, date: FUTURE, time: '13:00', guests: 5,
    }))
    renderWizard()
    expect(screen.getByLabelText('Fecha')).toHaveValue(FUTURE)
    expect(screen.getByLabelText('13:00')).toBeChecked()
    expect(screen.getByLabelText('Personas')).toHaveValue(5)
    await waitFor(() => expect(next()).toBeEnabled())
  })

  it('descarta un borrador con fecha vencida o datos corruptos', () => {
    window.localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify({ step: 3, date: '2020-01-01', time: '20:00' }))
    renderWizard()
    expect(screen.getByLabelText('Fecha')).toHaveValue('')
    expect(screen.getByText('¿Cuándo nos visitas?')).toBeInTheDocument()
  })

  it('no se rompe con JSON corrupto en localStorage', () => {
    window.localStorage.setItem(STORAGE_KEYS.draft, '{no es json')
    window.localStorage.setItem(STORAGE_KEYS.bookings, 'tampoco')
    expect(() => renderWizard()).not.toThrow()
    expect(screen.getByText('¿Cuándo nos visitas?')).toBeInTheDocument()
  })
})
