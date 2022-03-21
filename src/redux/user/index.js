import { SET_COLOR, SET_ERROR, SET_NAME, SET_STATUS, SET_ADMIN_TOKEN } from './types'

const initialState = {
  name: '',
  color: 'red',
  status: 'UNSIGNED',
  error: '',
  adminToken: ''
}

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_COLOR:
      return { ...state, color: payload }
    case SET_NAME:
      return { ...state, name: payload }
    case SET_ERROR:
      return { ...state, error: payload }
    case SET_STATUS:
      return { ...state, status: payload }
    case SET_ADMIN_TOKEN:
      return { ...state, adminToken: payload }
  }
  return state
}
