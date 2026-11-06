// Configuración general del restaurante y reglas de reserva.

export const RESTAURANT = {
  name: 'Little Lemon',
  slogan: 'Sabores del Mediterráneo, con alma de barrio',
  address: 'Av. Principal 123, Centro',
  phone: '+57 300 000 0000',
  whatsapp: '573000000000', // solo dígitos, con código de país
  email: 'reservas@littlelemon.example',
}

export const SCHEDULE = [
  { id: 'almuerzo', label: 'Almuerzo', days: 'Lunes a Domingo', from: '12:00', to: '15:30' },
  { id: 'cena', label: 'Cena', days: 'Lunes a Domingo', from: '18:00', to: '22:30' },
]

export const BOOKING_RULES = {
  minGuests: 1,
  maxGuests: 12,
  maxDaysAhead: 30,
  slotMinutes: 30,
  toleranceMinutes: 15,
  // Duración estimada de una reserva: una mesa no puede reservarse de nuevo mientras dure
  durationMinutes: 90,
  // Última hora de entrada por turno (se deja margen antes del cierre)
  shifts: [
    { id: 'almuerzo', label: 'Almuerzo', from: '12:00', to: '15:00' },
    { id: 'cena', label: 'Cena', from: '18:00', to: '22:00' },
  ],
}

export const VISIT_REASONS = ['Casual', 'Cumpleaños', 'Aniversario', 'Negocios']

export const SPECIAL_REQUESTS = [
  { id: 'babyChair', label: 'Silla para niños' },
  { id: 'glutenFree', label: 'Menú sin gluten' },
  { id: 'quietTable', label: 'Mesa tranquila' },
]
