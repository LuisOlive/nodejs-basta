import socket from '../socket'

const initialState = {
  players: [],
  roomId: '',
  admin: false,
  round: null,
  status: 'WAITING_PLAYERS'
}

const SET_ADMIN = 'GAME/SET_ADMIN'
const SET_ROOM_ID = 'GAME/SET_ROOM_ID'
const FILL_PLAYERS = 'GAME/FILL_PLAYERS'

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case FILL_PLAYERS:
      return { ...state, players: payload }
    case SET_ROOM_ID:
      return { ...state, roomId: payload }
  }
  return state
}

export function setAdmin(admin) {
  return { type: SET_ADMIN, payload: admin }
}

export function setRoomId(roomId) {
  return { type: SET_ROOM_ID, payload: roomId }
}

export function fillPlayers(players) {
  return { type: FILL_PLAYERS, payload: players }
}

export function fillPlayersAction() {
  return dispatch => {
    socket.on('playerslist:change', ({ players }) => {
      dispatch(fillPlayers(players))
    })
  }
}
