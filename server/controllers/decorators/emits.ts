import type { Socket } from 'socket.io'

export default function emits(eventName: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // save original method
    const originalValue = descriptor.value

    // overwrite method
    descriptor.value = function (event: object, socket: Socket) {
      try {
        // waiting method to return the event data to emit if it doesn't, it should throw and error
        const result: object = originalValue.call(this, event, socket)
        socket.emit(eventName, result)
        return result

        // receiving error of method
      } catch ([eventErrorName, message]) {
        socket.emit(eventErrorName, { message })
      }
    }

    return descriptor
  }
}
