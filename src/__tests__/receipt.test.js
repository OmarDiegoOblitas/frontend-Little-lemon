import { describe, expect, it } from 'vitest'
import { buildReceiptText, buildWhatsAppLink, getActiveRequests } from '../utils/receipt'
import { generateReservationCode } from '../utils/reservationCode'

const booking = {
  code: 'LL-ABC234', date: '2026-11-10', time: '20:00', guests: 4, zone: 'terraza', tableId: 'T3',
  contact: { name: 'Ana Pérez', phone: '+57 300 123 4567', email: 'ana@correo.com', reason: 'Cumpleaños',
    requests: { babyChair: true, glutenFree: false, quietTable: false }, notes: '' },
}

describe('comprobante', () => {
  it('incluye código, mesa y peticiones', () => {
    const text = buildReceiptText(booking)
    expect(text).toContain('LL-ABC234')
    expect(text).toContain('Terraza al Aire Libre')
    expect(text).toContain('Silla para niños')
    expect(text).not.toContain('Notas:')
  })
  it('el enlace de WhatsApp lleva el mensaje codificado', () => {
    const link = buildWhatsAppLink(booking)
    expect(link).toMatch(/^https:\/\/wa\.me\/\d+\?text=/)
    expect(decodeURIComponent(link)).toContain('LL-ABC234')
  })
  it('getActiveRequests tolera datos ausentes', () => expect(getActiveRequests(undefined)).toEqual([]))
})

describe('generateReservationCode', () => {
  it('tiene el formato LL-XXXXXX sin caracteres ambiguos', () => {
    for (let i = 0; i < 50; i += 1) expect(generateReservationCode()).toMatch(/^LL-[A-HJ-NP-Z2-9]{6}$/)
  })
  it('genera códigos distintos', () => {
    expect(new Set(Array.from({ length: 100 }, () => generateReservationCode())).size).toBeGreaterThan(95)
  })
})
