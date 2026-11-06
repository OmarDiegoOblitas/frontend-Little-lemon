// Mesas del restaurante. `description` se muestra en el preview del paso 2.
export const TABLES = [
  // Terraza
  { id: 'T1', number: 1, zone: 'terraza', capacity: 2, description: 'Junto a la baranda, vista a la calle' },
  { id: 'T2', number: 2, zone: 'terraza', capacity: 2, description: 'Rincón con plantas' },
  { id: 'T3', number: 3, zone: 'terraza', capacity: 4, description: 'Bajo la pérgola, pet-friendly' },
  { id: 'T4', number: 4, zone: 'terraza', capacity: 4, description: 'Junto a la fuente' },
  { id: 'T5', number: 5, zone: 'terraza', capacity: 6, description: 'Mesa larga bajo luces colgantes' },
  // Salón central
  { id: 'S6', number: 6, zone: 'salon', capacity: 2, description: 'Junto a la ventana' },
  { id: 'S7', number: 7, zone: 'salon', capacity: 4, description: 'Junto a la ventana' },
  { id: 'S8', number: 8, zone: 'salon', capacity: 4, description: 'Cerca del escenario acústico' },
  { id: 'S9', number: 9, zone: 'salon', capacity: 6, description: 'Mesa familiar al centro' },
  { id: 'S10', number: 10, zone: 'salon', capacity: 8, description: 'Mesa grande, ideal para familias' },
  // Cava VIP
  { id: 'V11', number: 11, zone: 'vip', capacity: 6, description: 'Reservado privado con vista a la cava' },
  { id: 'V12', number: 12, zone: 'vip', capacity: 8, description: 'Salita privada con barra de vinos' },
  { id: 'V13', number: 13, zone: 'vip', capacity: 12, description: 'Mesa de celebración para grupos grandes' },
]

// Reservas "ocupadas" simuladas para que siempre haya mesas no disponibles.
// Se usan como base y se combinan con las reservas reales en localStorage.
// `offsetDays` = días desde hoy, así los datos nunca caducan.
export const SIMULATED_BOOKINGS = [
  { tableId: 'T3', offsetDays: 1, time: '20:00' },
  { tableId: 'S7', offsetDays: 1, time: '13:00' },
  { tableId: 'V13', offsetDays: 2, time: '20:30' },
  { tableId: 'S9', offsetDays: 3, time: '19:00' },
  { tableId: 'T1', offsetDays: 0, time: '19:00' },
  { tableId: 'S10', offsetDays: 5, time: '13:30' },
]
