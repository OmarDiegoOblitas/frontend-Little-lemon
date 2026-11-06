import { memo, useState } from 'react'
import { SPACES } from '../../data/spaces'
import { useReservation } from '../../context/ReservationContext'
import FieldError from './FieldError'

/**
 * Botón de mesa. Está memoizado: solo se vuelve a renderizar si cambia SU estado,
 * porque `onSelect` y `onPreview` son estables (useCallback / setState).
 */
const TableButton = memo(function TableButton({ table, selected, onSelect, onPreview }) {
  const unavailable = table.taken || !table.fits
  const status = selected ? 'selected' : table.taken ? 'taken' : !table.fits ? 'small' : 'free'
  const statusText = { selected: 'seleccionada', taken: 'ocupada', small: 'capacidad insuficiente', free: 'disponible' }[status]

  return (
    <button
      type="button"
      className={`table-btn is-${status}`}
      aria-pressed={selected}
      aria-disabled={unavailable}
      aria-label={`Mesa ${table.number}, capacidad ${table.capacity} personas, ${statusText}`}
      onClick={() => !unavailable && onSelect(table.id)}
      onMouseEnter={() => onPreview(table.id)}
      onMouseLeave={() => onPreview(null)}
      onFocus={() => onPreview(table.id)}
      onBlur={() => onPreview(null)}
    >
      <span className="table-btn__num" aria-hidden="true">{table.number}</span>
      <span className="table-btn__cap" aria-hidden="true">👥 {table.capacity}</span>
    </button>
  )
})

/** Paso 2: ambiente y grilla de mesas filtrada por capacidad, con preview. */
export default function StepTable() {
  const { state, tablesForSlot, setField, selectTable, validateField } = useReservation()
  const { zone, tableId, guests, errors } = state
  const [hoveredId, setHoveredId] = useState(null) // tooltip/preview temporal (useState)

  const previewTable = tablesForSlot.find((t) => t.id === (hoveredId ?? tableId))
  const freeCount = tablesForSlot.filter((t) => t.fits && !t.taken).length

  return (
    <>
      <h3 className="step__title">Elige tu ambiente y mesa</h3>

      <fieldset className="field" aria-describedby={errors.zone ? 'zone-error' : undefined}>
        <legend>Ambiente</legend>
        <div className="zones">
          {SPACES.map((s) => (
            <label key={s.id} className={`zone ${zone === s.id ? 'is-active' : ''}`}>
              <input
                type="radio" name="zone" value={s.id} checked={zone === s.id}
                aria-invalid={Boolean(errors.zone)}
                onChange={() => setField('zone', s.id)}
                onBlur={() => zone && validateField('zone')}
              />
              <img src={s.image} alt="" loading="lazy" width="300" height="200" />
              <span className="zone__name">{s.name}</span>
              <span className="zone__desc">{s.features.join(' · ')}</span>
            </label>
          ))}
        </div>
        <FieldError name="zone" message={errors.zone} />
      </fieldset>

      {zone && (
        <div className="field" data-field="tableId" tabIndex={-1} role="group" aria-labelledby="tables-title">
          <p id="tables-title" className="field-label">
            Mesas para {guests} {Number(guests) === 1 ? 'persona' : 'personas'}
          </p>

          <ul className="legend" aria-label="Leyenda">
            <li><span className="legend__box is-free" /> Disponible</li>
            <li><span className="legend__box is-taken" /> Ocupada</li>
            <li><span className="legend__box is-small" /> No alcanza la capacidad</li>
            <li><span className="legend__box is-selected" /> Seleccionada</li>
          </ul>

          <div className="tables-grid">
            {tablesForSlot.map((t) => (
              <TableButton key={t.id} table={t} selected={t.id === tableId} onSelect={selectTable} onPreview={setHoveredId} />
            ))}
          </div>

          {freeCount === 0 && (
            <p className="field-hint" role="status">
              No hay mesas disponibles en este ambiente para esa hora y cantidad de personas.
              Prueba con otro ambiente u otro horario.
            </p>
          )}

          <div className="table-preview" aria-live="polite">
            {previewTable ? (
              <p>
                <strong>Mesa {previewTable.number}:</strong> {previewTable.description}, capacidad máx.{' '}
                {previewTable.capacity} personas.
                {previewTable.taken && ' (Ocupada a esa hora)'}
                {!previewTable.taken && !previewTable.fits && ' (Muy pequeña para tu grupo)'}
              </p>
            ) : (
              <p className="field-hint">Pasa el cursor o enfoca una mesa para ver sus detalles.</p>
            )}
          </div>
          <FieldError name="tableId" message={errors.tableId} />
        </div>
      )}
    </>
  )
}
