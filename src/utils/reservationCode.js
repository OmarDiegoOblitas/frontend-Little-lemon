// Alfabeto sin caracteres ambiguos (0/O, 1/I) para que el código sea fácil de dictar.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Código único tipo "LL-7K3QX9". Usa crypto cuando está disponible. */
export function generateReservationCode(length = 6) {
  const values = new Uint32Array(length)
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values)
  } else {
    values.forEach((_, i) => { values[i] = Math.floor(Math.random() * 2 ** 32) })
  }
  return 'LL-' + Array.from(values, (v) => ALPHABET[v % ALPHABET.length]).join('')
}
