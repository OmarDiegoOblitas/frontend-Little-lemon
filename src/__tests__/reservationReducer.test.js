import { describe, expect, it } from 'vitest'
import { ACTIONS, STATUS, initialState, reservationReducer as reduce } from '../context/reservationReducer'

describe('reservationReducer', () => {
  it('SET_FIELD actualiza el valor y limpia su error', () => {
    const s = reduce({ ...initialState, errors: { date: 'x', time: 'y' } }, { type: ACTIONS.SET_FIELD, field: 'date', value: '2026-11-06' })
    expect(s.date).toBe('2026-11-06')
    expect(s.errors).toEqual({ time: 'y' })
  })
  it('cambiar personas, zona, fecha u hora invalida la mesa elegida', () => {
    const base = { ...initialState, tableId: 'T3' }
    for (const field of ['guests', 'zone', 'date', 'time']) {
      expect(reduce(base, { type: ACTIONS.SET_FIELD, field, value: 'a' }).tableId).toBe('')
    }
  })
  it('seleccionar mesa no la invalida', () => {
    expect(reduce(initialState, { type: ACTIONS.SET_FIELD, field: 'tableId', value: 'T3' }).tableId).toBe('T3')
  })
  it('GO_TO_STEP acota el paso entre 1 y 4', () => {
    expect(reduce(initialState, { type: ACTIONS.GO_TO_STEP, step: 0 }).step).toBe(1)
    expect(reduce(initialState, { type: ACTIONS.GO_TO_STEP, step: 9 }).step).toBe(4)
  })
  it('TOGGLE_REQUEST alterna la petición sin mutar el estado anterior', () => {
    const s = reduce(initialState, { type: ACTIONS.TOGGLE_REQUEST, id: 'babyChair' })
    expect(s.contact.requests.babyChair).toBe(true)
    expect(initialState.contact.requests.babyChair).toBe(false)
  })
  it('SUBMIT_ERROR puede devolver al paso 2 y limpiar la mesa', () => {
    const s = reduce({ ...initialState, step: 4, tableId: 'T3' }, { type: ACTIONS.SUBMIT_ERROR, message: 'm', backToStep: 2, clearTable: true })
    expect(s).toMatchObject({ status: STATUS.ERROR, step: 2, tableId: '', submitError: 'm' })
  })
  it('RESET vuelve al estado inicial', () => {
    expect(reduce({ ...initialState, step: 3, date: 'x' }, { type: ACTIONS.RESET })).toEqual(initialState)
  })
})
