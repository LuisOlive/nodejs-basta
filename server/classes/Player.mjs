import ShortUniqueId from 'short-unique-id'
import room from './utils/room.mjs'

const createAdminToken = new ShortUniqueId({ length: 25 })

export default class Player {
  score = 0 //+ Math.floor(Math.random() * 100000)
  isAdmin = false
  roomId = ''
  adminToken = ''

  constructor({ name, color, socket }) {
    /** @type {string} */
    this.name = name
    this.socket = socket
    /** @type {string} */
    this.color = color
  }

  data() {
    const { name, score, color, isAdmin } = this
    return { isAdmin, color, name, score }
  }

  makeAdmin() {
    this.isAdmin = true
    this.adminToken = createAdminToken()

    const { roomId, adminToken } = this
    this.#emit('admin', { adminToken, roomId })
  }

  emitEnter() {
    this.#emit('enter', this.data())
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

  die() {
    this.room.deletePlayer(this.color)
  }

  get room() {
    return room(this.roomId)
  }

  get id() {
    return this.socket.id
  }
}
