import chalk from 'chalk'

/** fake socket to watch objects events without load server or socket.io
 */
const simulator = (color, name) => ({
  emit(evName, event) {
    console.log(chalk.bold[color](`${name}->${evName}`), event)
  },

  in(namein) {
    return simulator(color, namein)
  }
})

export default simulator
