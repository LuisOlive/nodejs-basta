import { SET_COLOR, SET_ERROR, SET_NAME } from './types'

const initialState = {
  name: '',
  color: 'red',
  isIdentified: false,
  error: ''
}

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_COLOR:
      return { ...state, color: payload }
    case SET_NAME:
      return { ...state, name: payload, isIdentified: true }
    case SET_ERROR:
      return { ...state, error: payload }
  }
  return state
}
