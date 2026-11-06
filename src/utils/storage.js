// Acceso seguro a localStorage. Puede fallar (modo privado, cuota llena, datos
// corruptos), por eso nunca lanza: devuelve un valor por defecto o `false`.

export const STORAGE_KEYS = {
  bookings: 'littlelemon:bookings',
  draft: 'littlelemon:draft',
}

export function isStorageAvailable() {
  try {
    const probe = '__ll_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback // JSON corrupto o almacenamiento no disponible
  }
}

/** @returns {boolean} true si se guardó correctamente */
export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* sin acciones: no hay nada que limpiar si no hay almacenamiento */
  }
}

/** Lista de reservas guardadas; descarta entradas que no tengan la forma esperada. */
export function loadBookings() {
  const data = readJSON(STORAGE_KEYS.bookings, [])
  if (!Array.isArray(data)) return []
  return data.filter((b) => b && b.code && b.tableId && b.date && b.time)
}
