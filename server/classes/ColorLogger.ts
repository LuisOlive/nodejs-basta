import chalk from 'chalk'
/**
 * @deprecated
 */
export default class ColorLogger {
  logCyan(msg: string) {
    console.log(chalk.cyan(msg))
  }

  logGreen(msg: string) {
    console.log(chalk.green(msg))
  }

  logGreenBright(msg: string) {
    console.log(chalk.greenBright(msg))
  }

  logRed(msg: string) {
    console.log(chalk.red(msg))
  }

  log = console.log.bind(console)
}
