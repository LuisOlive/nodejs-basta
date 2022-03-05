import find from 'lodash/find.js'
import Game from '../Game.mjs'

/** @param {string} id the room id */
export default function room(id) {
  const result = find(Game.rooms, { id })

  if (result) {
    return result
  }

  throw `room ${id} not found`
}
