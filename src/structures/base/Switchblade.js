const { CommandClient } = require('eris')
const Loaders = require('../../loaders')
const { readFileSync } = require('fs')
const winston = require('winston')
const { Tedis } = require('tedis')

module.exports = class Switchblade extends CommandClient {
  constructor (token, options, commandOptions) {
    super(token, options, commandOptions)
    this.token = token
    this.initializeWinston()
    this.start()
  }

  start () {
    if (process.env.NODE_ENV !== 'production') console.log(readFileSync('bigtitle.txt', 'utf8').toString().replace(/{UNICODE}/g, '\u001b['))
    if (!this.token) {
      this.logger.error('Discord token not specified. Exiting.')
      process.exit(1)
    }
    this.logger.info('Starting Switchblade...', { label: 'Switchblade' })

    this.initializeRedis()
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
            info => `${info.timestamp} ${info.level}${info.label ? ` [${info.label || ''}]` : ''}: ${info.message}`
          )
        ),
        level: process.env.LOGGING_LEVEL || 'silly'
      }))
    }
  }

  initializeRedis () {
    // TODO: Find a way to capture initialization events
    //       Currently, the RedisListener is only loaded after Tedis tries to connect, which
    //       leads to it not capturing the first connection events.
    this.logger.info('Initializing Redis', { label: 'Redis' })
    this.redis = new Tedis({
      host: process.env.REDIS_SERVICE_HOST || process.env.REDIS_HOST || 'redis',
      port: process.env.REDIS_SERVICE_PORT || process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD
    })
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
