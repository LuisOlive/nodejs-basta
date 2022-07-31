import { find, remove } from 'lodash'
import type { InternalServer as Server } from './InternalSocketIO'

import Room from './Room'

export default class Game {
  #rooms: Room[] = []

  /**
   * adds a room to the rooms list of global object game
   * @param room the room we want to add to rooms list
   */
  addRoom(room: Room) {
    this.#rooms.push(room)
    return room
  }

  /**
   * DANGERIOUS. removes a room from server
   * @param id id of room to search in server list
   */
  deleteRoom(id: string) {
    remove(this.#rooms, { id })
  }

  /**
   * searchs a room in the server and returns it if it exists
   * @param id id of room to search in server list
   */
  findRoom(id: string) {
    return find(this.#rooms, { id })
  }

  /**
   * searchs a room in the server and if it exists returns it, else, it creates it and return it
   * @param id id of room to search in server list
   * @returns the room found or created
   */
  findOrCreateRoom(id: string) {
    const room = this.findRoom(id)

    if (room) {
      return room as Room
    }

    return this.addRoom(new Room(id))
  }

  get data() {
    return {
      rooms: this.#rooms.map(r => r.id)
    }
  }

  /**
   * gives the Game class important configurations before start operations
   */
  constructor(io: Server) {
    Room.io = io
  }
}
