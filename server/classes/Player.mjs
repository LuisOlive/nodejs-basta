import ShortUniqueId from 'short-unique-id'
import room from './utils/room.mjs'

const createAdminToken = new ShortUniqueId({ length: 25 })

export default class Player {
  score = 0
  isAdmin = false
  roomId = ''

  constructor({ name, color, socket }) {
    /**@type {string} */
    this.name = name
    this.socket = socket
    /**@type {string} */
    this.color = color
  }

  data() {
    const { name, score, color, isAdmin } = this
    return { isAdmin, color, name, score }
  }

  /**
   * @param {string} evName
   * @param {*} event
   */
  emit(evName, event) {
    this.#emit(evName, event, 'player')
  }

  #emit(evName, event, prefix = 'self') {
    try {
      this.socket.emit(`${prefix}:${evName}`, event)
    } catch {
      console.error(`event "${prefix}:${evName}" not sended`)
    }
  }

  get room() {
    return room(this.roomId)
  }

  makeAdmin() {
    this.isAdmin = true
    const { roomId } = this
    this.#emit('admin', { adminToken: createAdminToken(), roomId })
  }

  emitEnter() {
    this.#emit('enter', this.data())
  }
}
