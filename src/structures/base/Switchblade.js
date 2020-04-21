const { CommandClient } = require('eris')
const Loaders = require('../../loaders')
const { LoaderPriority } = require('../Loader.js')
const { readFileSync } = require('fs')
const winston = require('winston')
const chalk = require('chalk')

module.exports = class Switchblade extends CommandClient {
  constructor(token, options, commandOptions) {
    super(token, options, commandOptions)
    this.initializeWinston()
    this.start()
  }

  start() {
    if (process.env.NODE_ENV !== 'production') console.log(readFileSync('bigtitle.txt', 'utf8').toString().replace(/{UNICODE}/g, '\u001b['))
    this.logger.info('Starting switchblade...', { label: 'Switchblade' })
    this.initializeLoaders()

    this.connect()
  }

  initializeWinston() {
    this.logger = winston.createLogger()

    if (process.env.NODE_ENV === 'production') {
      this.logger.add(new winston.transports.Console())
    } else {
      this.logger.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(
            info => `${info.timestamp} ${info.level} [${info.label || ''}]: ${info.message}`
          )
        ),
        level: 'silly'
      }))
    }
  }

  async initializeLoaders() {
    const loaders = [[], [], []]
    for (let file in Loaders) {
      const loader = new Loaders[file](this)
      loaders[loader.priority].push(loader)
    }

    for (let loaderPriority of loaders) {
      const priority = Object.keys(LoaderPriority)[loaders.indexOf(loaderPriority)]
      this.logger.info(`Starting to load ${chalk.yellow(priority)}`, { label: 'Loaders' })

      for (let loader of loaderPriority) {
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
}
