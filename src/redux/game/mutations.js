import * as types from './types'

export function setAdmin(admin) {
  return { type: types.SET_ADMIN, payload: admin }
}

export function setRoomId(roomId) {
  return { type: types.SET_ROOM_ID, payload: roomId }
}

export function fillPlayers(players) {
  return { type: types.FILL_PLAYERS, payload: players }
}
/** @deprecated and doesn't anything*/
export function setAvailableColors(colors) {
  return { type: '', payload: colors }
}

export function setStatus(status) {
  return { type: types.SET_STATUS, payload: status }
}

export function setRound(round) {
  return { type: types.SET_ROUND, payload: round }
}

export function setResults(results) {
  return { type: types.SET_RESULTS, payload: results }
}

export function fillUnknownAnswers(payload) {
  return { type: types.FILL_UNKNOWN_ANSWERS, payload }
}
