const { createOptionHandler, FileUtils } = require('../utils')

module.exports = class Loader {
  /**
   * @param {Object} opts
   * @param {boolean} [opts.critical]
   * @param {Switchblade} client
   */
  constructor(options, client) {
    options = createOptionHandler('Loader', options)

    this.critical = options.optional('critical', false)
    
    this.name = options.optional('name', this.constructor.name)

    this.client = client
  }

  async preLoad() {
    try {
      const success = await this.load()
      if (!success) throw new Error(`Unhandled error`)
      return success
    } catch (e) {
      this.client.logger.error(`Failed to load ${this.name}`, 'error', { label: 'Loader' })
      this.logError(e)
      return false
    }
  }

  async loadFiles(path, recursive = false) {
    if (!path || typeof path !== 'string') throw new TypeError(`The 'path' argument on '${this.constructor.name}.loadFiles()' must be a string. Received ${typeof path} instead.`)
    let success = 0
    let fails = 0
    const errorFunction = e => {
      this.logError(e)
      fails++
    }
    const successFunction = file => {
      try {
        if (this.loadFile(file)) success++
        else throw new Error(`'${this.constructor.name}.loadFile()' returned an unhandled error.`)
      }
      catch (e) {
        errorFunction(e)
      }
    }
    await FileUtils.requireDirectory(path, successFunction, errorFunction, recursive).then(() => {
      if (fails) this.client.logger.warn(`${success} types of ${this.name} loaded, ${fails} failed.`, { label: this.name })
      else this.client.logger.info(`All ${success} types of ${this.name} loaded without errors.`, 'info', { label: this.name })
    })
    return true
  }

  async load() {
    return true
  }

  loadFile(file) {
    throw new Error(`The ${this.name} loader has not implemented the loadFile() function`)
  }
}