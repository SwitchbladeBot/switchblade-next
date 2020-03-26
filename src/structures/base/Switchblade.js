const { CommandClient } = require('eris')
const Loaders = require('../../loaders')
const chalk = require('chalk')

module.exports = class Switchblade extends CommandClient {
  constructor(token, options, commandOptions) {
    super(token, options, commandOptions)
  }

  log(message, type = 'info', prefix) {
    if (!message || typeof message !== 'string') throw new TypeError(`Error while logging: message must be string. Received ${typeof message} instead.`)
    if (prefix && typeof prefix !== 'string') throw new TypeError(`Error while logging: prefix must be string. Received ${typeof prefix} instead.`)
    const logTypes = {
      info: [chalk.blue, console.info, 'Info'],
      error: [chalk.red, console.error, 'ErrorLog'],
      warning: [chalk.yellow, console.warn, 'Warning']
    }
    if (!Object.keys(logTypes).includes(type)) throw new TypeError(`Error while logging: log type must be 'info', 'error' or 'warning'. Received ${type.toString()} instead.`)
    const logType = logTypes[type]
    logType[1](logType[0](`[${prefix || logType[2]}] `) + message)
  }

  logError(...args) {
    const tags = args.length > 1 ? args.slice(0, -1).map(t => `[${t}]`) : []
    const message = [...tags, args[args.length - 1]].join(' ')
    this.log(message, 'error')
  }

  start() {
    this.log('Starting switchblade...')
    this.initializeLoaders()
    this.connect()
  }

  async initializeLoaders () {
    for (let file in Loaders) {
      const loader = new Loaders[file](this)
      let success = true
      try {
        success = await loader.preLoad()
      } catch (e) {
        this.logError(e)
      } finally {
        if (!success && loader.critical) process.exit(1)
      }
    }
  }
}
