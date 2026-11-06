const LABELS = ['Visita', 'Mesa', 'Tus datos', 'Confirmar']

/** Indicador de progreso del wizard. El paso actual se marca con aria-current="step". */
export default function Stepper({ current }) {
  return (
    <ol className="stepper" aria-label="Progreso de la reserva">
      {LABELS.map((label, i) => {
        const n = i + 1
        const status = n < current ? 'done' : n === current ? 'current' : 'todo'
        return (
          <li key={label} className={`stepper__item is-${status}`} aria-current={n === current ? 'step' : undefined}>
            <span className="stepper__dot" aria-hidden="true">{status === 'done' ? '✓' : n}</span>
            <span className="stepper__label">
              <span className="sr-only">Paso {n}: </span>{label}
              {status === 'done' && <span className="sr-only"> (completado)</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
