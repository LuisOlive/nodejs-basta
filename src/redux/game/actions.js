import socket from '../../socket'
import { fillPlayers, setRoomId, setAvailableColors, setStatus } from './mutations'

export function fillPlayersAction() {
  return dispatch => {
    socket.on('playerslist:change', ({ players, availableColors, status }) => {
      dispatch(fillPlayers(players))
      dispatch(setAvailableColors(availableColors))
      dispatch(setStatus(status))
    })
  }
}

/** @param {string} roomId */
export function setRoomIdAction(roomId) {
  return dispatch => {
    // console.log('action="user:askforpreview"', roomId, { roomId })
    dispatch(setRoomId(roomId))
    socket.emit('user:askforpreview', { roomId: roomId }) // destructuring doesn't work
  }
}

/** @deprecated */
export function giveServerStateControlAction() {
  return dispatch => {
    socket.on('status:change', ({ status }) => dispatch(setStatus(status)))
  }
}
