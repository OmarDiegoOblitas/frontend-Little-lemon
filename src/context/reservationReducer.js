// Reducer puro del formulario de reserva. No accede a localStorage ni al DOM:
// eso vive en el Provider, así este archivo es fácil de probar.

export const STEPS = { VISIT: 1, TABLE: 2, CONTACT: 3, CONFIRM: 4 }
export const LAST_STEP = 4

/** Estados del envío: IDLE → SUBMITTING → SUCCESS | ERROR */
export const STATUS = { IDLE: 'IDLE', SUBMITTING: 'SUBMITTING', SUCCESS: 'SUCCESS', ERROR: 'ERROR' }

export const ACTIONS = {
  SET_FIELD: 'SET_FIELD',
  SET_CONTACT_FIELD: 'SET_CONTACT_FIELD',
  TOGGLE_REQUEST: 'TOGGLE_REQUEST',
  SET_ERRORS: 'SET_ERRORS',
  SET_FIELD_ERROR: 'SET_FIELD_ERROR',
  GO_TO_STEP: 'GO_TO_STEP',
  SUBMIT_START: 'SUBMIT_START',
  SUBMIT_SUCCESS: 'SUBMIT_SUCCESS',
  SUBMIT_ERROR: 'SUBMIT_ERROR',
  RESET: 'RESET',
}

export const initialContact = {
  name: '', phone: '', email: '', reason: '',
  requests: { babyChair: false, glutenFree: false, quietTable: false },
  notes: '',
}

export const initialState = {
  step: STEPS.VISIT,
  date: '',
  time: '',
  guests: 2,
  zone: '',
  tableId: '',
  contact: initialContact,
  accepted: false,
  errors: {},        // { campo: mensaje }
  status: STATUS.IDLE,
  submitError: '',   // mensaje global si falla el envío
  confirmation: null, // reserva confirmada (código, datos)
}

// Cambiar estos campos invalida la mesa elegida (puede dejar de caber o de estar libre).
const INVALIDATES_TABLE = ['date', 'time', 'guests', 'zone']

export function reservationReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_FIELD: {
      const { field, value } = action
      const { [field]: _removed, ...errors } = state.errors // limpia el error del campo editado
      const next = { ...state, [field]: value, errors }
      if (INVALIDATES_TABLE.includes(field) && state.tableId) {
        next.tableId = ''
      }
      return next
    }

    case ACTIONS.SET_CONTACT_FIELD: {
      const { [action.field]: _removed, ...errors } = state.errors
      return { ...state, contact: { ...state.contact, [action.field]: action.value }, errors }
    }

    case ACTIONS.TOGGLE_REQUEST:
      return {
        ...state,
        contact: {
          ...state.contact,
          requests: { ...state.contact.requests, [action.id]: !state.contact.requests[action.id] },
        },
      }

    case ACTIONS.SET_ERRORS:
      return { ...state, errors: action.errors }

    case ACTIONS.SET_FIELD_ERROR: {
      const errors = { ...state.errors }
      if (action.message) errors[action.field] = action.message
      else delete errors[action.field]
      return { ...state, errors }
    }

    case ACTIONS.GO_TO_STEP:
      // El rango se acota para que un valor inválido nunca deje el wizard en un paso inexistente.
      return {
        ...state,
        step: Math.min(Math.max(action.step, STEPS.VISIT), LAST_STEP),
        errors: {},
        submitError: '',
      }

    case ACTIONS.SUBMIT_START:
      return { ...state, status: STATUS.SUBMITTING, submitError: '' }

    case ACTIONS.SUBMIT_SUCCESS:
      return { ...state, status: STATUS.SUCCESS, confirmation: action.confirmation, errors: {}, submitError: '' }

    case ACTIONS.SUBMIT_ERROR:
      return {
        ...state,
        status: STATUS.ERROR,
        submitError: action.message,
        // Si el problema fue la mesa, se devuelve al usuario al paso 2 para elegir otra.
        step: action.backToStep ?? state.step,
        tableId: action.clearTable ? '' : state.tableId,
      }

    case ACTIONS.RESET:
      return { ...initialState, contact: { ...initialContact, requests: { ...initialContact.requests } } }

    default:
      return state
  }
}
