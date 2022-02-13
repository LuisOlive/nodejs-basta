import { colors } from '../data/colors.json'
import socket from '../socket'

const initialState = {
  name: '',
  color: 'red',
  roomId: '',
  isIdentified: false,
  error: ''
}

const SET_NAME = 'USER/SET_NAME'
const SET_COLOR = 'USER/SET_COLOR'
const SET_ERROR = 'USER/SET_ERROR'
const SET_ROOM_ID = 'USER/SET_ROOM_ID'

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_COLOR:
      return { ...state, color: payload }
    case SET_NAME:
      return { ...state, name: payload, isIdentified: true }
    case SET_ERROR:
      return { ...state, error: payload }
    case SET_ROOM_ID:
      return { ...state, roomId: payload }
  }
  return state
}

export function setName(name) {
  if (/^\S[a-z0-9ñáéíóú\s_]+\S$/i.test(name)) {
    localStorage.setItem('name', name)
    return { type: SET_NAME, payload: name }
  }
}

export function setColor(color) {
  if (colors.includes(color)) {
    localStorage.setItem('color', color)
    return { type: SET_COLOR, payload: color }
  }
}

export function setError(error) {
  return { type: SET_ERROR, payload: error }
}

export function setRoomId(roomId) {
  return { type: SET_ROOM_ID, payload: roomId }
}

export function loadUserFromCacheAction() {
  return dispatch => {
    const name = localStorage.getItem('name')
    const color = localStorage.getItem('color')

    if (name) {
      dispatch(setName(name))
    }

    if (color) {
      dispatch(setColor(color))
    }
  }
}

export function setColorAction(color) {
  return dispatch => dispatch(setColor(color))
}

export function setNameAction(name) {
  return (dispatch, getState) => {
    dispatch(setName(name))

    const { color, roomId } = getState().user
    socket.emit('user:tryenter', { name, color, roomId })
  }
}

export function setErrorAction(error) {
  return dispatch => dispatch(setError(error))
}
