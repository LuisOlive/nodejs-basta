import chalk from 'chalk'
import type { SafeParseError, Schema } from 'zod'
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
        return originalValue.call(this, safeEvent.data, socket)
        //
      } else if (socket && socket.emit && typeof socket.emit === 'function') {
        socket?.emit?.('validation:error', safeEvent.error)
        //
      } else {
        console.error(chalk.red(safeEvent.error.toString()))
      }
    }

    return descriptor
  }
}

export function log(color: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalValue = descriptor.value

    descriptor.value = function (...args: any[]) {
      const result = originalValue.apply(this, args)

      console.log(
        chalk[color](`function ${propertyKey} called w/ args ${args}, returned ${result}`)
      )

      return result
    }

    return descriptor
  }
}
