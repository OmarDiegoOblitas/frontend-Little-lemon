const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`

export const SPACES = [
  {
    id: 'terraza',
    name: 'Terraza al Aire Libre',
    short: 'Terraza',
    description: 'Ambiente informal entre plantas y luces cálidas. Pet-friendly: tu mascota es bienvenida.',
    features: ['Pet-friendly', 'Aire libre', 'Informal'],
    image: img('photo-1414235077428-338989a2e8c0'),
  },
  {
    id: 'salon',
    name: 'Salón Central',
    short: 'Salón',
    description: 'Música acústica en vivo y ambiente familiar, ideal para compartir en cualquier ocasión.',
    features: ['Música acústica', 'Familiar', 'Climatizado'],
    image: img('photo-1517248135467-4c7edcad34c4'),
  },
  {
    id: 'vip',
    name: 'Zona Cava / VIP',
    short: 'Cava VIP',
    description: 'Espacio exclusivo rodeado de vinos, pensado para grupos y celebraciones privadas.',
    features: ['Privado', 'Grupos', 'Celebraciones'],
    image: img('photo-1559339352-11d035aa65de'),
  },
]
