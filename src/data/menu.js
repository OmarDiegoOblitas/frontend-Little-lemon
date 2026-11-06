const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70`

export const MENU_CATEGORIES = ['Todos', 'Entradas', 'Platos Fuertes', 'Postres', 'Bebidas']

// tags posibles: 'Vegano', 'Vegetariano', 'Gluten-Free', 'Picante', 'Contiene lácteos', 'Contiene frutos secos'
export const MENU_ITEMS = [
  {
    id: 'm1', category: 'Entradas', name: 'Greek Salad',
    description: 'Tomate, pepino, aceitunas kalamata, queso feta y orégano con aceite de oliva.',
    price: 28000, tags: ['Vegetariano', 'Gluten-Free'], image: img('photo-1540189549336-e6e99c3679fe'),
  },
  {
    id: 'm2', category: 'Entradas', name: 'Hummus con Pita',
    description: 'Crema de garbanzos con tahini, limón y pan pita tostado.',
    price: 22000, tags: ['Vegano'], image: img('photo-1577805947697-89e18249d767'),
  },
  {
    id: 'm3', category: 'Entradas', name: 'Bruschetta de Tomate',
    description: 'Pan rústico, tomate fresco, albahaca y reducción de balsámico.',
    price: 20000, tags: ['Vegano'], image: img('photo-1572695157366-5e585ab2b69f'),
  },
  {
    id: 'm4', category: 'Platos Fuertes', name: 'Lemon Chicken',
    description: 'Pechuga marinada en limón y hierbas, con papas rústicas y vegetales asados.',
    price: 48000, tags: ['Gluten-Free'], image: img('photo-1598515214211-89d3c73ae83b'),
  },
  {
    id: 'm5', category: 'Platos Fuertes', name: 'Pasta al Limone',
    description: 'Spaghetti en salsa cremosa de limón, parmesano y pimienta negra.',
    price: 42000, tags: ['Vegetariano', 'Contiene lácteos'], image: img('photo-1621996346565-e3dbc646d9a9'),
  },
  {
    id: 'm6', category: 'Platos Fuertes', name: 'Risotto de Hongos',
    description: 'Arroz arborio cremoso con hongos silvestres y aceite de trufa.',
    price: 46000, tags: ['Vegetariano', 'Gluten-Free'], image: img('photo-1476124369491-e7addf5db371'),
  },
  {
    id: 'm7', category: 'Platos Fuertes', name: 'Salmón a la Parrilla',
    description: 'Salmón con costra de hierbas, puré de coliflor y espárragos.',
    price: 62000, tags: ['Gluten-Free'], image: img('photo-1467003909585-2f8a72700288'),
  },
  {
    id: 'm8', category: 'Postres', name: 'Lemon Dessert',
    description: 'Tarta de limón con merengue italiano flameado.',
    price: 18000, tags: ['Vegetariano', 'Contiene lácteos'], image: img('photo-1519915028121-7d3463d20b13'),
  },
  {
    id: 'm9', category: 'Postres', name: 'Crepes de Naranja y Miel',
    description: 'Crepes finos con crema, naranja caramelizada y miel de azahar.',
    price: 16000, tags: ['Vegetariano', 'Contiene lácteos'], image: img('photo-1519676867240-f03562e64548'),
  },
  {
    id: 'm10', category: 'Postres', name: 'Sorbete de Frutas',
    description: 'Tres bolas de sorbete de temporada, sin lácteos.',
    price: 14000, tags: ['Vegano', 'Gluten-Free'], image: img('photo-1488900128323-21503983a07e'),
  },
  {
    id: 'm11', category: 'Bebidas', name: 'Limonada de Hierbabuena',
    description: 'Limonada natural con hierbabuena y toque de jengibre.',
    price: 12000, tags: ['Vegano', 'Gluten-Free'], image: img('photo-1523677011781-c91d1bbe2f9e'),
  },
  {
    id: 'm12', category: 'Bebidas', name: 'Mojito Little Lemon',
    description: 'Ron blanco, limón, menta, soda y azúcar de caña.',
    price: 26000, tags: ['Vegano', 'Gluten-Free'], image: img('photo-1551538827-9c037cb4f32a'),
  },
  {
    id: 'm13', category: 'Bebidas', name: 'Copa de Vino de la Casa',
    description: 'Selección de tinto o blanco mediterráneo.',
    price: 24000, tags: ['Vegano', 'Gluten-Free'], image: img('photo-1510812431401-41d2bd2722f3'),
  },
]
