import { describe, expect, it } from 'vitest'
import { getDateLimits, getTablesForSlot, getTimeSlots, isTableTaken } from '../utils/availability'

const NOW = new Date(2026, 10, 5, 10, 0)

describe('getTimeSlots', () => {
  it('genera slots de 30 min por turno', () => {
    const [lunch, dinner] = getTimeSlots('2026-11-06', NOW)
    expect(lunch.slots).toEqual(['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00'])
    expect(dinner.slots[0]).toBe('18:00')
    expect(dinner.slots.at(-1)).toBe('22:00')
  })
  it('omite horas pasadas si es hoy y turnos agotados', () => {
    const late = new Date(2026, 10, 5, 21, 0)
    const shifts = getTimeSlots('2026-11-05', late)
    expect(shifts).toHaveLength(1)
    expect(shifts[0].slots).toEqual(['21:30', '22:00'])
  })
})

it('getDateLimits devuelve hoy y hoy + 30 días', () => {
  expect(getDateLimits(NOW)).toEqual({ min: '2026-11-05', max: '2026-12-05' })
})

describe('disponibilidad de mesas', () => {
  const bookings = [{ code: 'X', tableId: 'T3', date: '2026-11-06', time: '20:00' }]

  it('marca ocupada la misma mesa dentro de la duración de la reserva', () => {
    expect(isTableTaken('T3', '2026-11-06', '20:00', bookings)).toBe(true)
    expect(isTableTaken('T3', '2026-11-06', '21:00', bookings)).toBe(true)
  })
  it('libera la mesa pasados 90 minutos o en otro día', () => {
    expect(isTableTaken('T3', '2026-11-06', '21:30', bookings)).toBe(false)
    expect(isTableTaken('T3', '2026-11-07', '20:00', bookings)).toBe(false)
  })
  it('getTablesForSlot filtra por zona e indica capacidad y ocupación', () => {
    const tables = getTablesForSlot({ date: '2026-11-06', time: '20:00', zone: 'terraza', guests: 4, bookings })
    expect(tables.every((t) => t.zone === 'terraza')).toBe(true)
    expect(tables.find((t) => t.id === 'T3')).toMatchObject({ fits: true, taken: true })
    expect(tables.find((t) => t.id === 'T1')).toMatchObject({ fits: false, taken: false })
  })
})
