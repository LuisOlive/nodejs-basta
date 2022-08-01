import socket from '../../socket'
import * as muts from './mutations'

export function watchRoomUpdatesAction() {
  return dispatch => {
    socket.on('room:update', ({ players, status }) => {
      dispatch(muts.fillPlayers(players))
      dispatch(muts.setStatus(status))
    })

    socket.on('room:preview', ({ players }) => {
      dispatch(muts.fillPlayers(players))
    })
  }
}

/** @deprecated and it doeen't anything*/
export function fillPlayersAction() {
  return dispatch => {}
}

/** @param {string} roomId */
export function setRoomIdAction(roomId) {
  return dispatch => {
    // console.log('action="guest:enter"', roomId, { roomId })
    dispatch(muts.setRoomId(roomId))
    socket.emit('guest:enter', { roomId: roomId }) // destructuring doesn't work
  }
}

export function listenGameAction() {
  return dispatch => {
    socket.on('game:start', round => dispatch(muts.setRound(round)))

    socket.on('countdown:finish', ({ results, status }) => {
      dispatch(muts.setStatus(status))
      dispatch(muts.setResults(results))
    })

    socket.on('game:unknownanswers', answers => dispatch(muts.fillUnknownAnswers(answers)))
  }
}

export function prepareIfNamedAdminAction() {
  return dispatch => {}
}
