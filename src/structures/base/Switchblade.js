const { CommandClient } = require('eris')
const Loaders = require('../../loaders')
const { readFileSync } = require('fs')
const winston = require('winston')

module.exports = class Switchblade extends CommandClient {
  constructor (token, options, commandOptions) {
    super(token, options, commandOptions)
    this.initializeWinston()
    this.start()
  }

  start () {
    if (process.env.NODE_ENV !== 'production') console.log(readFileSync('bigtitle.txt', 'utf8').toString().replace(/{UNICODE}/g, '\u001b['))
    this.logger.info('Starting switchblade...', { label: 'Switchblade' })
    this.initializeLoaders()

    this.connect()
  }

  initializeWinston () {
    this.logger = winston.createLogger()

    if (process.env.NODE_ENV === 'production') {
      this.logger.add(new winston.transports.Console({ level: process.env.LOGGING_LEVEL || 'silly' }))
    } else {
      this.logger.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(
            info => `${info.timestamp} ${info.level} [${info.label || ''}]: ${info.message}`
          )
        ),
        level: process.env.LOGGING_LEVEL || 'silly'
      }))
    }
  }

  async initializeLoaders () {
    for (const file in Loaders) {
      const loader = new Loaders[file](this)
      let success = true
      try {
        success = await loader.preLoad()
      } catch (error) {
        this.logger.error(error.stack, { label: 'Loaders', stack: error.stack })
      } finally {
        if (!success && loader.critical) process.exit(1)
      }
    }
  }
}
