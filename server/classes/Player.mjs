import room from './utils/room.mjs'

export default class Player {
  score = 0
  admin = false
  roomId = ''

  constructor({ name, color, socket }) {
    /**@type {string} */
    this.name = name.trim()
    this.socket = socket
    /**@type {string} */
    this.color = color
  }

  data() {
    const { name, score, color, admin } = this
    return { admin, color, name, score }
  }

  /**
   * @param {string} evName
   * @param {*} event
   */
  emit(evName, event, prefix = 'player') {
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
    this.admin = true
    const { admin, roomId } = this
    this.emit('admin', { admin, roomId }, 'self')
  }
}
