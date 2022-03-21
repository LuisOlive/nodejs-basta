import {
  FILL_PLAYERS,
  SET_ADMIN,
  SET_ROOM_ID,
  SET_AVAILABLE_COLORS,
  SET_STATUS,
  SET_ROUND,
  SET_RESULTS
} from './types'
import { colors } from '../../data/colors.json'

const initialState = {
  players: [],
  roomId: '',
  admin: false,
  round: null,
  status: 'UNSIGNED', //
  availableColors: colors,
  results: []
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
    case SET_ROUND:
      return { ...state, round: payload }
    case SET_RESULTS:
      return { ...state, results: payload }
  }
  return state
}
