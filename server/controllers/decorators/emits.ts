import type { Socket } from 'socket.io'
import type { RoomId } from '../../validators/roomIdSchema'

export default function emits(eventName: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // save original method
    const originalValue = descriptor.value

    // overwrite method
    descriptor.value = function (event: RoomId, socket: Socket) {
      try {
        // waiting method to return the event data to emit if it doesn't, it should throw and error
        const result: object = originalValue.call(this, event, socket)

        // sending event to all room subscribers
        this?.io?.in(event.roomId)?.emit(eventName, result)

        // returning orgininal information
        return result
        // receiving error of method
      } catch ([eventErrorName, message]) {
        socket.emit(eventErrorName, { message })
      }
    }

    return descriptor
  }
}
