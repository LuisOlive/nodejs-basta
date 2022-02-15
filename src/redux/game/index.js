import { FILL_PLAYERS, SET_ADMIN, SET_ROOM_ID } from './types'

const initialState = {
  players: [],
  roomId: '',
  admin: false,
  round: null,
  status: 'WAITING_PLAYERS'
}

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case FILL_PLAYERS:
      return { ...state, players: payload }
    case SET_ROOM_ID:
      return { ...state, roomId: payload }
    case SET_ADMIN:
      return { ...state, admin: payload }
  }
  return state
}
