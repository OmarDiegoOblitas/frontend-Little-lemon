import {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState,
} from 'react'
import { SPACES } from '../data/spaces'
import { TABLES } from '../data/tables'
import { getDateLimits, getSimulatedBookings, getTablesForSlot, isTableTaken } from '../utils/availability'
import { generateReservationCode } from '../utils/reservationCode'
import { STORAGE_KEYS, isStorageAvailable, loadBookings, readJSON, removeKey, writeJSON } from '../utils/storage'
import { FIELD_VALIDATORS, STEP_VALIDATORS } from '../utils/validation'
import {
  ACTIONS, LAST_STEP, STATUS, initialContact, initialState, reservationReducer,
} from './reservationReducer'

const ReservationContext = createContext(null)

/**
 * Estado inicial del reducer: recupera el borrador guardado (autoguardado ante
 * recargas accidentales) y descarta lo que ya no sea válido, por ejemplo una
 * fecha que quedó en el pasado.
 */
function init() {
  const draft = readJSON(STORAGE_KEYS.draft, null)
  if (!draft || typeof draft !== 'object') return initialState

  const { min, max } = getDateLimits()
  const dateOk = typeof draft.date === 'string' && draft.date >= min && draft.date <= max
  const contact = {
    ...initialContact,
    ...(draft.contact ?? {}),
    requests: { ...initialContact.requests, ...(draft.contact?.requests ?? {}) },
  }

  return {
    ...initialState,
    step: dateOk && Number.isInteger(draft.step) ? Math.min(Math.max(draft.step, 1), LAST_STEP) : 1,
    date: dateOk ? draft.date : '',
    time: dateOk && typeof draft.time === 'string' ? draft.time : '',
    guests: Number.isInteger(draft.guests) ? draft.guests : initialState.guests,
    zone: SPACES.some((s) => s.id === draft.zone) ? draft.zone : '',
    tableId: dateOk && TABLES.some((t) => t.id === draft.tableId) ? draft.tableId : '',
    contact,
  }
}

export function ReservationProvider({ children }) {
  const [state, dispatch] = useReducer(reservationReducer, undefined, init)
  const [bookings, setBookings] = useState(loadBookings) // reservas reales (localStorage)
  // Aviso si el navegador no permite guardar (p. ej. modo privado). Se evalúa una vez al montar.
  const [storageWarning] = useState(() =>
    isStorageAvailable() ? '' : 'Tu navegador no permite guardar datos: el borrador y la reserva no se conservarán al recargar.')
  const formRef = useRef(null) // contenedor del formulario: scroll y foco

  // ---- Efectos -------------------------------------------------------------

  // Autoguardado del borrador. Se omite al terminar para no restaurar una reserva ya confirmada.
  useEffect(() => {
    if (state.status === STATUS.SUCCESS) return
    const { step, date, time, guests, zone, tableId, contact } = state
    writeJSON(STORAGE_KEYS.draft, { step, date, time, guests, zone, tableId, contact })
  }, [state])

  // Si otra pestaña confirma una reserva, se refleja aquí para evitar solapamientos.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEYS.bookings || e.key === null) setBookings(loadBookings())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // ---- Derivados -----------------------------------------------------------

  // Reservas simuladas + reales. Se recalcula solo cuando cambian las reales.
  const allBookings = useMemo(() => [...getSimulatedBookings(), ...bookings], [bookings])

  // Mesas de la zona con su estado. Solo se recalcula si cambian sus entradas
  // (no en cada tecla del paso 3).
  const { date, time, zone, guests } = state
  const tablesForSlot = useMemo(
    () => (date && time && zone ? getTablesForSlot({ date, time, zone, guests: Number(guests), bookings: allBookings }) : []),
    [date, time, zone, guests, allBookings],
  )

  // ---- Handlers estables (useCallback) ------------------------------------

  const setField = useCallback((field, value) => dispatch({ type: ACTIONS.SET_FIELD, field, value }), [])
  const setContactField = useCallback((field, value) => dispatch({ type: ACTIONS.SET_CONTACT_FIELD, field, value }), [])
  const toggleRequest = useCallback((id) => dispatch({ type: ACTIONS.TOGGLE_REQUEST, id }), [])
  const selectTable = useCallback((tableId) => dispatch({ type: ACTIONS.SET_FIELD, field: 'tableId', value: tableId }), [])
  const goToStep = useCallback((step) => dispatch({ type: ACTIONS.GO_TO_STEP, step }), [])

  // Mantiene la última versión del estado accesible a los callbacks sin recrearlos.
  const stateRef = useRef(state)
  useEffect(() => { stateRef.current = state }, [state])

  /** Foco en el primer campo con error (accesibilidad). */
  const focusFirstError = useCallback((errors) => {
    const first = Object.keys(errors)[0]
    if (!first) return
    requestAnimationFrame(() => {
      formRef.current?.querySelector(`[name="${first}"], [data-field="${first}"]`)?.focus()
    })
  }, [])

  /** Valida un solo campo (al salir de él) y muestra su error. */
  const validateField = useCallback((field) => {
    const validate = FIELD_VALIDATORS[field]
    if (!validate) return ''
    const message = validate(stateRef.current, new Date())
    dispatch({ type: ACTIONS.SET_FIELD_ERROR, field, message })
    return message
  }, [])

  /** Valida el paso actual; si hay errores los muestra y enfoca el primero. */
  const validateCurrentStep = useCallback(() => {
    const s = stateRef.current
    const errors = STEP_VALIDATORS[s.step](s, new Date())
    dispatch({ type: ACTIONS.SET_ERRORS, errors })
    focusFirstError(errors)
    return Object.keys(errors).length === 0
  }, [focusFirstError])

  const nextStep = useCallback(() => {
    if (validateCurrentStep()) dispatch({ type: ACTIONS.GO_TO_STEP, step: stateRef.current.step + 1 })
  }, [validateCurrentStep])

  const prevStep = useCallback(() => {
    dispatch({ type: ACTIONS.GO_TO_STEP, step: stateRef.current.step - 1 })
  }, [])

  /** Scroll programático desde los CTA de la landing (useRef) y foco para lectores de pantalla. */
  const scrollToBooking = useCallback(() => {
    const el = formRef.current
    if (!el) return
    el.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
    el.focus({ preventScroll: true })
  }, [])

  /**
   * Confirma la reserva. Revalida todo y vuelve a comprobar que la mesa siga libre
   * (otra pestaña pudo tomarla). Cualquier fallo devuelve un mensaje claro.
   */
  const confirmBooking = useCallback(async () => {
    const s = stateRef.current
    const now = new Date()

    // 1) Validación completa de todos los pasos
    for (let step = 1; step <= LAST_STEP; step += 1) {
      const errors = STEP_VALIDATORS[step](s, now)
      if (Object.keys(errors).length) {
        dispatch({
          type: ACTIONS.SUBMIT_ERROR,
          message: 'Hay datos por corregir antes de confirmar. Revisa el paso indicado.',
          backToStep: step,
        })
        dispatch({ type: ACTIONS.SET_ERRORS, errors })
        focusFirstError(errors)
        return false
      }
    }

    dispatch({ type: ACTIONS.SUBMIT_START })

    // 2) La mesa debe seguir libre con los datos más recientes del almacenamiento
    const latest = [...getSimulatedBookings(now), ...loadBookings()]
    if (isTableTaken(s.tableId, s.date, s.time, latest)) {
      setBookings(loadBookings())
      dispatch({
        type: ACTIONS.SUBMIT_ERROR,
        message: 'Lo sentimos, esa mesa acaba de ser reservada. Elige otra para continuar.',
        backToStep: 2,
        clearTable: true,
      })
      return false
    }

    // 3) Crear y guardar
    const booking = {
      code: generateReservationCode(),
      date: s.date,
      time: s.time,
      guests: Number(s.guests),
      zone: s.zone,
      tableId: s.tableId,
      contact: { ...s.contact, name: s.contact.name.trim(), email: s.contact.email.trim(), phone: s.contact.phone.trim() },
      createdAt: now.toISOString(),
    }
    const stored = loadBookings()
    if (!writeJSON(STORAGE_KEYS.bookings, [...stored, booking])) {
      dispatch({
        type: ACTIONS.SUBMIT_ERROR,
        message: 'No pudimos guardar tu reserva porque el almacenamiento del navegador no está disponible. Revisa que no estés en modo privado e inténtalo de nuevo.',
      })
      return false
    }

    setBookings([...stored, booking])
    removeKey(STORAGE_KEYS.draft)
    dispatch({ type: ACTIONS.SUBMIT_SUCCESS, confirmation: booking })
    return true
  }, [focusFirstError])

  const resetBooking = useCallback(() => {
    removeKey(STORAGE_KEYS.draft)
    dispatch({ type: ACTIONS.RESET })
  }, [])

  // El valor del contexto solo cambia cuando cambian sus dependencias reales.
  const value = useMemo(
    () => ({
      state, dispatch, bookings, tablesForSlot, storageWarning, formRef,
      setField, setContactField, toggleRequest, selectTable, goToStep, nextStep, prevStep,
      validateField, scrollToBooking, confirmBooking, resetBooking,
    }),
    [state, bookings, tablesForSlot, storageWarning, setField, setContactField, toggleRequest,
      selectTable, goToStep, nextStep, prevStep, validateField, scrollToBooking, confirmBooking, resetBooking],
  )

  return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReservation() {
  const ctx = useContext(ReservationContext)
  if (!ctx) throw new Error('useReservation debe usarse dentro de <ReservationProvider>.')
  return ctx
}
