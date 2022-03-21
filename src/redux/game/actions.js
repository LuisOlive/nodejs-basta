import socket from '../../socket'
import {
  fillPlayers,
  setRoomId,
  setAvailableColors,
  setStatus,
  setRound,
  setResults
} from './mutations'

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

export function listenGameAction() {
  return dispatch => {
    socket.on('game:start', ({ status, round }) => {
      dispatch(setRound(round))
      dispatch(setStatus(status))
    })

    socket.on('countdown:finished', ({ results, status }) => {
      dispatch(setStatus(status))
      dispatch(setResults(results))
    })
  }
}
