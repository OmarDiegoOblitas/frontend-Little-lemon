import { BOOKING_RULES } from '../data/config'
import { SIMULATED_BOOKINGS, TABLES } from '../data/tables'
import { addDays, toISODate } from './format'

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const toHHMM = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

/** Rango de fechas reservables: [hoy, hoy + maxDaysAhead] en formato YYYY-MM-DD. */
export function getDateLimits(now = new Date()) {
  return {
    min: toISODate(now),
    max: toISODate(addDays(now, BOOKING_RULES.maxDaysAhead)),
  }
}

/**
 * Franjas de 30 min agrupadas por turno. Si la fecha es hoy, se omiten las
 * horas que ya pasaron.
 * @returns {{id:string,label:string,slots:string[]}[]}
 */
export function getTimeSlots(date, now = new Date()) {
  const isToday = date === toISODate(now)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  return BOOKING_RULES.shifts
    .map((shift) => {
      const slots = []
      for (let t = toMinutes(shift.from); t <= toMinutes(shift.to); t += BOOKING_RULES.slotMinutes) {
        if (!isToday || t > nowMinutes) slots.push(toHHMM(t))
      }
      return { id: shift.id, label: shift.label, slots }
    })
    .filter((shift) => shift.slots.length > 0)
}

export const isValidSlot = (date, time, now = new Date()) =>
  getTimeSlots(date, now).some((shift) => shift.slots.includes(time))

/** Reservas "ocupadas" simuladas, calculadas respecto a hoy para que nunca caduquen. */
export function getSimulatedBookings(now = new Date()) {
  return SIMULATED_BOOKINGS.map((b) => ({
    code: `SIM-${b.tableId}-${b.offsetDays}`,
    tableId: b.tableId,
    date: toISODate(addDays(now, b.offsetDays)),
    time: b.time,
    simulated: true,
  }))
}

/** Dos reservas se solapan si caen el mismo día y a menos de `durationMinutes` entre sí. */
const overlaps = (a, b) =>
  a.date === b.date && Math.abs(toMinutes(a.time) - toMinutes(b.time)) < BOOKING_RULES.durationMinutes

export const isTableTaken = (tableId, date, time, bookings) =>
  bookings.some((b) => b.tableId === tableId && overlaps(b, { date, time }))

/**
 * Mesas de una zona con su estado para la fecha/hora/personas pedidas.
 * `fits` = capacidad suficiente; `taken` = ocupada por otra reserva.
 * Se devuelven también las que no caben para poder mostrarlas deshabilitadas.
 */
export function getTablesForSlot({ date, time, zone, guests, bookings }) {
  return TABLES.filter((t) => t.zone === zone).map((t) => ({
    ...t,
    fits: t.capacity >= guests,
    taken: isTableTaken(t.id, date, time, bookings),
  }))
}
