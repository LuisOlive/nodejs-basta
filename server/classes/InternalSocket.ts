import chalk from 'chalk'
import ShortUniqueId from 'short-unique-id'

const createAdminToken = new ShortUniqueId({ length: 8 })

export interface Emitter {
  emit: (event: string, payload: any) => any
}

export default interface InternalSocket extends Emitter {
  in: (room: string) => Emitter
  id: string
}

export class SocketSimulator implements InternalSocket {
  id = createAdminToken()

  emit(event: string, payload: any) {
    console.log(chalk[this.color](`${chalk.inverse(this.name)} ${event}`), payload)
  }

  in(room: string) {
    return new SocketSimulator(this.color, room)
  }

  constructor(readonly color: socketColor, readonly name: string) {}
}

type socketColor =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'blackBright '
  | 'gray'
  | 'grey'
  | 'redBright'
  | 'greenBright'
  | 'yellowBright'
  | 'blueBright'
  | 'magentaBright'
  | 'cyanBright'
  | 'whiteBright'
