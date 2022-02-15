import socket from '../../socket'
import { fillPlayers } from './mutations'

export function fillPlayersAction() {
  return dispatch => {
    socket.on('playerslist:change', ({ players }) => {
      dispatch(fillPlayers(players))
    })
  }
}
