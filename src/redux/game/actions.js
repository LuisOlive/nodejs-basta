import socket from '../../socket'
import { fillPlayers, setRoomId } from './mutations'

export function fillPlayersAction() {
  return dispatch => {
    socket.on('playerslist:change', ({ players }) => {
      dispatch(fillPlayers(players))
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
