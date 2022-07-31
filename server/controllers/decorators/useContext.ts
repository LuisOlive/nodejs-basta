import chalk from 'chalk'
import type { SafeParseError, Schema } from 'zod'
import type { Socket } from 'socket.io'

/** not the react context :P */
export default function useContext(validator: Schema) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // copying original method
    const originalValue: Function = descriptor.value

    // overwritting method
    descriptor.value = function (event: any, socket?: Socket) {}

    return descriptor
  }
}
