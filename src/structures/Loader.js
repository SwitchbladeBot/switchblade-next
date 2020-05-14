const { createOptionHandler, FileUtils } = require('../utils')

module.exports = class Loader {
  /**
   * @param {Object} opts
   * @param {boolean} [opts.critical]
   * @param {Switchblade} client
   */
  constructor (options, client) {
    options = createOptionHandler('Loader', options)

    this.critical = options.optional('critical', false)

    this.name = options.optional('name', this.constructor.name)

    this.client = client
  }

  async preLoad () {
    try {
      const success = await this.load()
      if (!success) throw new Error('Unhandled error')
      return success
    } catch (e) {
      this.client.logger.error(`Failed to load ${this.name}`, { label: 'Loader' })
      return false
    }
  }

  async loadFiles (path, recursive = false) {
    if (!path || typeof path !== 'string') throw new TypeError(`The 'path' argument on '${this.constructor.name}.loadFiles()' must be a string. Received ${typeof path} instead.`)
    let success = 0
    let fails = 0
    const errorFunction = e => {
      this.client.logger.error(e.stack || e, { label: 'Loader' })
      fails++
    }
    const successFunction = (file, fileName) => {
      try {
        if (this.loadFile(file)) {
          this.client.logger.debug(`Loaded ${fileName}`, { label: this.name })
          success++
        } else {
          this.client.logger.debug(`Failed to load ${fileName}`, { label: this.name })
          throw new Error(`'${this.constructor.name}.loadFile()' returned an unhandled error.`)
        }
      } catch (e) {
        errorFunction(e)
      }
    }
    await FileUtils.requireDirectory(path, successFunction, errorFunction, recursive).then(() => {
      if (fails) this.client.logger.warn(`${success} types of ${this.name} loaded, ${fails} failed.`, { label: 'Loader' })
      else this.client.logger.info(`All ${success} types of ${this.name} loaded without errors.`, { label: 'Loader' })
    })
    return true
  }

  async load () {
    return true
  }

  loadFile (file) {
    throw new Error(`The ${this.name} loader has not implemented the loadFile() function`)
  }
}
