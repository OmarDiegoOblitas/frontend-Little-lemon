import { RESTAURANT, SPECIAL_REQUESTS } from '../data/config'
import { SPACES } from '../data/spaces'
import { TABLES } from '../data/tables'
import { formatLongDate } from './format'

export const getZoneName = (id) => SPACES.find((s) => s.id === id)?.name ?? id
export const getTable = (id) => TABLES.find((t) => t.id === id)

/** Peticiones especiales marcadas, como lista de etiquetas legibles. */
export const getActiveRequests = (requests = {}) =>
  SPECIAL_REQUESTS.filter((r) => requests[r.id]).map((r) => r.label)

/** Texto plano del comprobante (se descarga como .txt). */
export function buildReceiptText(b) {
  const table = getTable(b.tableId)
  const requests = getActiveRequests(b.contact.requests)
  return [
    `${RESTAURANT.name} – Comprobante de reserva`,
    '='.repeat(40),
    `Código:    ${b.code}`,
    `Fecha:     ${formatLongDate(b.date)}`,
    `Hora:      ${b.time}`,
    `Personas:  ${b.guests}`,
    `Ambiente:  ${getZoneName(b.zone)}`,
    `Mesa:      ${table ? `${table.number} (${table.description})` : b.tableId}`,
    '',
    `Nombre:    ${b.contact.name}`,
    `Teléfono:  ${b.contact.phone}`,
    `Correo:    ${b.contact.email}`,
    `Motivo:    ${b.contact.reason}`,
    `Peticiones: ${requests.length ? requests.join(', ') : 'Ninguna'}`,
    b.contact.notes ? `Notas:     ${b.contact.notes}` : null,
    '',
    'Tolerancia máxima de llegada: 15 minutos.',
    `${RESTAURANT.address} · ${RESTAURANT.phone}`,
  ].filter((line) => line !== null).join('\n')
}

/** Enlace de WhatsApp con el mensaje ya redactado (hacia el número del restaurante). */
export function buildWhatsAppLink(b) {
  const table = getTable(b.tableId)
  const text =
    `Hola ${RESTAURANT.name}, confirmo mi reserva *${b.code}*:\n` +
    `📅 ${formatLongDate(b.date)} a las ${b.time}\n` +
    `👥 ${b.guests} personas · ${getZoneName(b.zone)}` +
    (table ? ` · Mesa ${table.number}` : '') +
    `\nA nombre de ${b.contact.name}.`
  return `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(text)}`
}
