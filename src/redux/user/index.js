import * as types from './types'

const initialState = {
  name: '',
  color: 'red',
  status: 'UNSIGNED',
  error: '',
  adminToken: '',
  id: ''
}

export default function reducer(state = initialState, { type, payload, cb }) {
  switch (type) {
    case types.SET_COLOR:
      return { ...state, color: payload }
    case types.SET_NAME:
      return { ...state, name: payload }
    case types.SET_ERROR:
      return { ...state, error: payload }
    case types.SET_STATUS:
      return { ...state, status: cb?.(state) ?? payload }
    case types.SET_ADMIN_TOKEN:
      return { ...state, adminToken: payload }
    case types.SET_ID:
      return { ...state, id: payload }
  }

  return state
}
