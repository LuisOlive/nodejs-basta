import { SET_COLOR, SET_ERROR, SET_NAME, SET_STATUS } from './types'

const initialState = {
  name: '',
  color: 'red',
  status: 'UNSIGNED',
  error: ''
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
  }
  return state
}
