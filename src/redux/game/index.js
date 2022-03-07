import { FILL_PLAYERS, SET_ADMIN, SET_ROOM_ID, SET_AVAILABLE_COLORS, SET_STATUS } from './types'
import { colors } from '../../data/colors.json'

const initialState = {
  players: [],
  roomId: '',
  admin: false,
  round: null,
  status: 'UNSIGNED', //
  availableColors: colors
}

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case FILL_PLAYERS:
      return { ...state, players: payload }
    case SET_ROOM_ID:
      return { ...state, roomId: payload }
    case SET_ADMIN:
      return { ...state, admin: payload }
    case SET_STATUS:
      return { ...state, status: payload }
    case SET_AVAILABLE_COLORS:
      return { ...state, availableColors: payload }
  }
  return state
}
