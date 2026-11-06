import { BOOKING_RULES, VISIT_REASONS } from '../data/config'
import { SPACES } from '../data/spaces'
import { TABLES } from '../data/tables'
import { getDateLimits, isValidSlot } from './availability'

// Reglas por campo. Devuelven el mensaje de error o '' si el valor es válido.

export function validateDate(date, now = new Date()) {
  if (!date) return 'Selecciona la fecha de tu visita.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) return 'La fecha no es válida.'
  const { min, max } = getDateLimits(now)
  if (date < min) return 'No puedes reservar en una fecha pasada.'
  if (date > max) return `Solo se puede reservar con hasta ${BOOKING_RULES.maxDaysAhead} días de anticipación.`
  return ''
}

export function validateTime(time, date, now = new Date()) {
  if (!time) return 'Selecciona una franja horaria.'
  if (date && !validateDate(date, now) && !isValidSlot(date, time, now)) {
    return 'Esa franja ya no está disponible. Elige otra hora.'
  }
  return ''
}

export function validateGuests(guests) {
  const n = Number(guests)
  if (!guests && guests !== 0) return 'Indica el número de personas.'
  if (!Number.isInteger(n)) return 'El número de personas debe ser un entero.'
  if (n < BOOKING_RULES.minGuests || n > BOOKING_RULES.maxGuests) {
    return `Atendemos de ${BOOKING_RULES.minGuests} a ${BOOKING_RULES.maxGuests} personas por reserva.`
  }
  return ''
}

export function validateZone(zone) {
  if (!zone) return 'Elige un ambiente.'
  if (!SPACES.some((s) => s.id === zone)) return 'El ambiente seleccionado no existe.'
  return ''
}

export function validateTable(tableId, guests, zone) {
  if (!tableId) return 'Selecciona una mesa.'
  const table = TABLES.find((t) => t.id === tableId)
  if (!table) return 'La mesa seleccionada no existe.'
  if (zone && table.zone !== zone) return 'La mesa no pertenece al ambiente elegido.'
  if (table.capacity < Number(guests)) return `La mesa ${table.number} solo admite ${table.capacity} personas.`
  return ''
}

export function validateName(name) {
  const value = (name ?? '').trim()
  if (!value) return 'Escribe tu nombre completo.'
  if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  if (value.length > 80) return 'El nombre es demasiado largo (máximo 80 caracteres).'
  if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(value)) return 'El nombre solo puede contener letras y espacios.'
  return ''
}

export function validatePhone(phone) {
  const value = (phone ?? '').trim()
  if (!value) return 'Escribe tu teléfono o celular.'
  if (!/^\+?[\d\s()-]+$/.test(value)) return 'El teléfono solo puede contener números, espacios, + ( ) y guiones.'
  const digits = value.replace(/\D/g, '')
  if (digits.length < 7 || digits.length > 15) return 'El teléfono debe tener entre 7 y 15 dígitos.'
  return ''
}

export function validateEmail(email) {
  const value = (email ?? '').trim()
  if (!value) return 'Escribe tu correo electrónico.'
  if (value.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
    return 'Escribe un correo válido, por ejemplo nombre@dominio.com.'
  }
  return ''
}

export const validateReason = (reason) =>
  VISIT_REASONS.includes(reason) ? '' : 'Elige el motivo de tu visita.'

export const validateNotes = (notes) =>
  (notes ?? '').length > 300 ? 'Las notas no pueden superar los 300 caracteres.' : ''

export const validateAccepted = (accepted) =>
  accepted ? '' : `Debes aceptar la política de tolerancia (${BOOKING_RULES.toleranceMinutes} minutos).`

/** Quita las claves sin error. */
const compact = (errors) => Object.fromEntries(Object.entries(errors).filter(([, msg]) => msg))

// Validación por paso del wizard. Devuelven { campo: mensaje } solo con los errores.

export const validateStep1 = (s, now) =>
  compact({
    date: validateDate(s.date, now),
    time: validateTime(s.time, s.date, now),
    guests: validateGuests(s.guests),
  })

export const validateStep2 = (s) =>
  compact({
    zone: validateZone(s.zone),
    tableId: validateTable(s.tableId, s.guests, s.zone),
  })

export const validateStep3 = (s) =>
  compact({
    name: validateName(s.contact.name),
    phone: validatePhone(s.contact.phone),
    email: validateEmail(s.contact.email),
    reason: validateReason(s.contact.reason),
    notes: validateNotes(s.contact.notes),
  })

export const validateStep4 = (s) => compact({ accepted: validateAccepted(s.accepted) })

export const STEP_VALIDATORS = { 1: validateStep1, 2: validateStep2, 3: validateStep3, 4: validateStep4 }

/** Validadores de un solo campo, usados para validar al salir del campo (onBlur). */
export const FIELD_VALIDATORS = {
  date: (s, now) => validateDate(s.date, now),
  time: (s, now) => validateTime(s.time, s.date, now),
  guests: (s) => validateGuests(s.guests),
  zone: (s) => validateZone(s.zone),
  tableId: (s) => validateTable(s.tableId, s.guests, s.zone),
  name: (s) => validateName(s.contact.name),
  phone: (s) => validatePhone(s.contact.phone),
  email: (s) => validateEmail(s.contact.email),
  reason: (s) => validateReason(s.contact.reason),
  notes: (s) => validateNotes(s.contact.notes),
  accepted: (s) => validateAccepted(s.accepted),
}
