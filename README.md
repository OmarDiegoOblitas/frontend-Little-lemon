# Little Lemon – Landing y reservas

SPA en React (Vite) con una landing del restaurante y un wizard de reserva de 4 pasos.
Todo funciona en el navegador: sin backend, la persistencia usa `localStorage`.
Requerimientos originales: [`Solicitud.txt`](./Solicitud.txt).

## Requisitos
- Node.js 20 o superior y npm.

## Puesta en marcha
```bash
npm install      # instala dependencias
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # build de producción en dist/
npm run preview  # sirve el build localmente
npm run lint     # análisis estático
npm test         # pruebas unitarias (Vitest)
```

## Estructura
```
src/
  components/   Componentes de UI (cada uno con su .css)
  context/      Estado global de la reserva (useReducer + useContext)
  data/         Datos simulados: configuración, menú, espacios, mesas
  hooks/        Hooks personalizados
  utils/        Funciones puras (formato, validación, disponibilidad, storage)
  __tests__/    Pruebas unitarias
```

## Configuración
Los datos del restaurante (nombre, dirección, teléfono, WhatsApp, horarios y reglas de reserva)
están en `src/data/config.js`. Cambia ahí el número de WhatsApp antes de publicar.

## Estado de avance
- [x] Etapa 1: base del proyecto y datos
- [x] Etapa 2: landing (Header, Hero, Carta, Espacios, Contacto)
- [x] Etapa 3: estado de la reserva (reducer, contexto, localStorage, validación, disponibilidad) + pruebas de lógica
- [x] Etapa 4: wizard pasos 1 y 2
- [x] Etapa 5: wizard pasos 3 y 4, éxito/comprobante + pruebas de componentes
- [x] Etapa 6: verificación en navegador, auditoría de accesibilidad y README final

## Pruebas
`npm test` ejecuta 64 pruebas con Vitest + Testing Library (jsdom):
- Lógica pura: validación, disponibilidad de mesas, reducer, comprobante y códigos.
- Accesibilidad: auditoría automática con axe-core (WCAG 2 A/AA) de la landing y de cada paso del wizard, incluidos los estados de error; foco del modal.
- Flujo del wizard: validación reactiva, mesas deshabilitadas, reserva completa guardada en
  `localStorage`, conflicto de mesa tomada, restauración del borrador y datos corruptos.

## Cómo funciona la persistencia
- `littlelemon:draft`: borrador del formulario (se restaura al recargar; se descarta si la fecha venció).
- `littlelemon:bookings`: reservas confirmadas. Una mesa queda bloqueada 90 minutos desde su hora.
- Las reservas son locales a cada navegador: no hay backend.

## Accesibilidad y responsividad
- HTML semántico: `header`, `nav`, `main`, `section` con `aria-labelledby`, `footer`, tabla de horarios con `th scope`.
- Formularios: `<label>` en cada campo, `fieldset/legend` en grupos, `aria-invalid` + `aria-describedby` en errores,
  `role="alert"` en mensajes, foco automático al primer campo con error.
- Teclado: enlace "Saltar al contenido", pestañas con flechas, modal con focus trap y cierre con Escape, foco visible.
- Contraste: todos los pares de color del diseño cumplen 4.5:1 (comprobado por cálculo).
- Mobile-first: sin desbordamiento horizontal a 320 y 390 px; controles táctiles de al menos 44 px.
- Respeta `prefers-reduced-motion`.

## Limitaciones conocidas
- Sin backend: las reservas solo existen en el navegador donde se hicieron y no hay correo de confirmación.
- Los datos de contacto (teléfono, WhatsApp, dirección, mapa) y los precios son de ejemplo: edítalos en `src/data/`.
- Las fotos vienen de Unsplash por URL; requieren conexión.
