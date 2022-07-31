import { colors } from '../../data/colors.json'
import * as types from './types'

export function setName(name) {
  if (/^\S[a-z0-9ñáéíóú\s_]+\S$/i.test(name)) {
    localStorage.setItem('name', name)
    return { type: types.SET_NAME, payload: name }
  }
}

export function setColor(color) {
  if (colors.includes(color)) {
    localStorage.setItem('color', color)
    return { type: types.SET_COLOR, payload: color }
  }
}

export function setError(error) {
  return { type: types.SET_ERROR, payload: error }
}

export function setStatus(newStatus) {
  return {
    type: types.SET_STATUS,

    cb({ status }) {
      if (status === 'ADMIN') return status
      return newStatus
    }
  }
}

export function setAdminToken(adminToken) {
  return { type: types.SET_ADMIN_TOKEN, payload: adminToken }
}

export function setId(id) {
  return { type: types.SET_ID, payload: id }
}
