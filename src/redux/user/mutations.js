import { colors } from '../../data/colors.json'
import { SET_COLOR, SET_ERROR, SET_NAME } from './types'

export function setName(name) {
  if (/^\S[a-z0-9ñáéíóú\s_]+\S$/i.test(name)) {
    localStorage.setItem('name', name)
    return { type: SET_NAME, payload: name }
  }
}

export function setColor(color) {
  if (colors.includes(color)) {
    localStorage.setItem('color', color)
    return { type: SET_COLOR, payload: color }
  }
}

export function setError(error) {
  return { type: SET_ERROR, payload: error }
}
