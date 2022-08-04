import socket from '../../socket'
import * as muts from './mutations'

export function watchPlayerUpdatesAction() {
  return dispatch => {
    socket.on('guest:becomeplayer', ({ id }) => {
      dispatch(muts.setId(id))
      dispatch(muts.setStatus('ACCEPTED'))
    })

    socket.on('player:becomeadmin', () => dispatch(muts.setStatus('ADMIN')))
  }
}
/** @deprecated, use watchPlayerUpdatesAction instead */
export const giveServerStateControlAction = watchPlayerUpdatesAction

export function loadUserFromCacheAction() {
  return dispatch => {
    const name = localStorage.getItem('name')
    const color = localStorage.getItem('color')

    if (name) dispatch(muts.setName(name))
    if (color) dispatch(muts.setColor(color))
  }
}

export function loginAction() {
  return (_, getState) => {
    const {
      user: { name, color },
      game: { roomId }
    } = getState()

    socket.emit('player:enter', { name, color, roomId })
    localStorage.setItem('name', name)
    localStorage.setItem('color', color)
  }
}

export function setNameAction(name) {
  return dispatch => dispatch(muts.setName(name))
}

export function setColorAction(color) {
  return dispatch => dispatch(muts.setColor(color))
}

export function setErrorAction(error) {
  return dispatch => dispatch(muts.setError(error))
}
