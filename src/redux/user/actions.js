import socket from '../../socket'
import { setName, setColor, setError } from './mutations'

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

    const {
      user: { color },
      game: { roomId }
    } = getState()

    socket.emit('user:asktojoin', { name, color, roomId })
  }
}

export function setErrorAction(error) {
  return dispatch => dispatch(setError(error))
}
