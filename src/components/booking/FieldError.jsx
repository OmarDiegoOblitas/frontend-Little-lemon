/**
 * Mensaje de error de un campo. Se enlaza al input con aria-describedby="{name}-error".
 * role="alert" hace que los lectores de pantalla lo anuncien al aparecer.
 */
export default function FieldError({ name, message }) {
  if (!message) return null
  return (
    <p id={`${name}-error`} className="field-error" role="alert">
      <span aria-hidden="true">⚠ </span>{message}
    </p>
  )
}
