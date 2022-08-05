import type { Schema } from 'zod'
import type { Socket } from 'socket.io'

export default function validate(validator: Schema) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // copying original method
    const originalValue: Function = descriptor.value

    // overwritting method
    descriptor.value = function (event: any, socket?: Socket) {
      // evaluating entering event
      const safeEvent = validator.safeParse(event)

      if (safeEvent.success) {
        // calling original method forcing "this" context
        return originalValue.call(this, safeEvent.data, socket)
        //
      } else if (socket && socket.emit && typeof socket.emit === 'function') {
        socket?.emit?.('validation:error', safeEvent.error)
        //
      } else {
        console.error(safeEvent.error.toString())
      }
    }

    return descriptor
  }
}
