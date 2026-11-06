import { describe, expect, it } from 'vitest'
import {
  validateDate, validateEmail, validateGuests, validateName, validatePhone, validateStep1, validateTable, validateTime,
} from '../utils/validation'

const NOW = new Date(2026, 10, 5, 10, 0) // 5-nov-2026 10:00

describe('validateDate', () => {
  it('exige una fecha', () => expect(validateDate('', NOW)).toMatch(/Selecciona/))
  it('rechaza fechas pasadas', () => expect(validateDate('2026-11-04', NOW)).toMatch(/pasada/))
  it('acepta hoy', () => expect(validateDate('2026-11-05', NOW)).toBe(''))
  it('acepta el día 30', () => expect(validateDate('2026-12-05', NOW)).toBe(''))
  it('rechaza más de 30 días', () => expect(validateDate('2026-12-06', NOW)).toMatch(/30 días/))
  it('rechaza formatos inválidos', () => expect(validateDate('hoy', NOW)).toMatch(/no es válida/))
})

describe('validateTime', () => {
  it('exige una hora', () => expect(validateTime('', '2026-11-06', NOW)).toMatch(/Selecciona/))
  it('acepta un slot de cena', () => expect(validateTime('20:00', '2026-11-06', NOW)).toBe(''))
  it('rechaza horas fuera de turno', () => expect(validateTime('16:00', '2026-11-06', NOW)).toMatch(/no está disponible/))
  it('acepta 12:00 hoy si aún no son las 12:00', () => expect(validateTime('12:00', '2026-11-05', NOW)).toBe(''))
  it('rechaza 12:00 cuando ya son las 13:00', () =>
    expect(validateTime('12:00', '2026-11-05', new Date(2026, 10, 5, 13, 0))).toMatch(/no está disponible/))
})

describe('validateGuests', () => {
  it.each([1, 6, 12, '4'])('acepta %s', (n) => expect(validateGuests(n)).toBe(''))
  it.each([0, 13, -1, 2.5])('rechaza %s', (n) => expect(validateGuests(n)).not.toBe(''))
})

describe('validateName', () => {
  it('acepta nombres con tildes y apóstrofos', () => expect(validateName("María José O'Brien")).toBe(''))
  it('rechaza vacío, corto y con números', () => {
    expect(validateName('  ')).not.toBe('')
    expect(validateName('Al')).toMatch(/3 caracteres/)
    expect(validateName('Ana123')).toMatch(/letras/)
  })
})

describe('validatePhone', () => {
  it('acepta formatos comunes', () => {
    expect(validatePhone('+57 300 123 4567')).toBe('')
    expect(validatePhone('(601) 234-5678')).toBe('')
  })
  it('rechaza letras y longitudes inválidas', () => {
    expect(validatePhone('300abc4567')).toMatch(/solo puede contener/)
    expect(validatePhone('123')).toMatch(/entre 7 y 15/)
    expect(validatePhone('1'.repeat(16))).toMatch(/entre 7 y 15/)
  })
})

describe('validateEmail', () => {
  it('acepta correos válidos', () => expect(validateEmail('ana@correo.com')).toBe(''))
  it.each(['', 'ana', 'ana@', 'ana@correo', 'a na@correo.com'])('rechaza "%s"', (v) =>
    expect(validateEmail(v)).not.toBe(''))
})

describe('validateTable', () => {
  it('exige mesa', () => expect(validateTable('', 2, 'terraza')).toMatch(/Selecciona/))
  it('rechaza mesa que no cabe', () => expect(validateTable('T1', 4, 'terraza')).toMatch(/solo admite 2/))
  it('rechaza mesa de otra zona', () => expect(validateTable('S7', 2, 'terraza')).toMatch(/ambiente/))
  it('acepta una mesa adecuada', () => expect(validateTable('T3', 4, 'terraza')).toBe(''))
})

it('validateStep1 devuelve solo los campos con error', () => {
  const errors = validateStep1({ date: '', time: '', guests: 2 }, NOW)
  expect(Object.keys(errors)).toEqual(['date', 'time'])
})
