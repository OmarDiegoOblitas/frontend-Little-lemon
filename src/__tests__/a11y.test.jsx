import axe from 'axe-core'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { addDays, toISODate } from '../utils/format'

const FUTURE = toISODate(addDays(new Date(), 10))

/** Ejecuta axe (WCAG 2 A/AA). El contraste se omite: jsdom no calcula estilos reales. */
async function audit(container) {
  const results = await axe.run(container, {
    iframes: false, // el iframe del mapa (con title) no se puede inspeccionar en jsdom
    runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  })
  return results.violations.map((v) => `${v.id}: ${v.help} → ${v.nodes[0].target.join(' ')}`)
}

describe('accesibilidad (axe-core)', () => {
  it('la landing no tiene violaciones', async () => {
    const { container } = render(<App />)
    expect(await audit(container)).toEqual([])
  })

  it('cada paso del wizard no tiene violaciones', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const next = () => screen.getByRole('button', { name: 'Siguiente' })

    // Paso 1 (con un error visible para auditar también los mensajes)
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2020-01-01' } })
    fireEvent.blur(screen.getByLabelText('Fecha'))
    expect(await audit(container)).toEqual([])
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: FUTURE } })
    await user.click(screen.getByLabelText('20:00'))
    await user.click(next())

    // Paso 2
    await user.click(screen.getByLabelText(/Terraza al Aire Libre/))
    expect(await audit(container)).toEqual([])
    await user.click(screen.getByRole('button', { name: /Mesa 2, .*disponible/ }))
    await user.click(next())

    // Paso 3 (con errores visibles)
    await user.type(screen.getByLabelText(/Correo electrónico/), 'mal')
    await user.tab()
    expect(await audit(container)).toEqual([])
    await user.type(screen.getByLabelText(/Nombre completo/), 'Ana Pérez')
    await user.type(screen.getByLabelText(/Teléfono/), '3001234567')
    await user.clear(screen.getByLabelText(/Correo electrónico/))
    await user.type(screen.getByLabelText(/Correo electrónico/), 'ana@correo.com')
    await user.selectOptions(screen.getByLabelText(/Motivo/), 'Casual')
    await user.click(next())

    // Paso 4 y éxito
    expect(await audit(container)).toEqual([])
    await user.click(screen.getByLabelText(/Acepto la política/))
    await user.click(screen.getByRole('button', { name: 'Confirmar reserva' }))
    expect(await screen.findByText('¡Reserva confirmada!')).toBeInTheDocument()
    expect(await audit(container)).toEqual([])
  })

  it('el menú hace foco en el diálogo y lo devuelve al cerrar', async () => {
    const user = userEvent.setup()
    render(<App />)
    const open = screen.getAllByRole('button', { name: /Ver foto de/ })[0]
    await user.click(open)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(open).toHaveFocus()
  })
})
