import * as types from './types'
import { colors } from '../../data/colors.json'

const initialState = {
  players: [],
  roomId: '',
  admin: false,
  round: null,
  status: 'WAITING_PLAYERS',
  availableColors: colors,
  results: [],
  unknownAnswers: []
}

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case types.FILL_PLAYERS:
      return { ...state, players: payload }
    case types.SET_ROOM_ID:
      return { ...state, roomId: payload }
    case types.SET_ADMIN:
      return { ...state, admin: payload }
    case types.SET_STATUS:
      return { ...state, status: payload }
    case types.SET_AVAILABLE_COLORS:
      return { ...state, availableColors: payload }
    case types.SET_ROUND:
      return { ...state, round: payload }
    case types.SET_RESULTS:
      return { ...state, results: payload }
    case types.FILL_UNKNOWN_ANSWERS:
      return { ...state, unknownAnswers: payload }
  }
  return state
}
