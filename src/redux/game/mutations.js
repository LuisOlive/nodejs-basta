import { FILL_PLAYERS, SET_ADMIN, SET_ROOM_ID, SET_AVAILABLE_COLORS, SET_STATUS } from './types'

export function setAdmin(admin) {
  return { type: SET_ADMIN, payload: admin }
}

export function setRoomId(roomId) {
  return { type: SET_ROOM_ID, payload: roomId }
}

export function fillPlayers(players) {
  return { type: FILL_PLAYERS, payload: players }
}

export function setAvailableColors(colors) {
  return { type: SET_AVAILABLE_COLORS, payload: colors }
}

export function setStatus(status) {
  return { type: SET_STATUS, payload: status }
}
