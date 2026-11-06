import { useCallback, useEffect, useRef } from 'react'

/**
 * Devuelve una versión de `fn` que espera `delay` ms sin nuevas llamadas antes de
 * ejecutarse. Se usa para validar en tiempo real sin hacerlo en cada tecla.
 * Cancela el temporizador al desmontar.
 */
export function useDebouncedCallback(fn, delay = 500) {
  const timer = useRef(null)
  const latest = useRef(fn)

  useEffect(() => { latest.current = fn }, [fn])
  useEffect(() => () => clearTimeout(timer.current), [])

  return useCallback((...args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => latest.current(...args), delay)
  }, [delay])
}
