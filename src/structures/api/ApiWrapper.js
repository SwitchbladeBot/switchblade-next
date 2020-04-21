const { createOptionHandler } = require('../../utils')

module.exports = class ApiWrapper {
  constructor (options, client) {
    options = createOptionHandler('Loader', options)

    this.name = options.optional('name', this.constructor.name)
    this.provider = options.optional('provider', null)
    this.envVars = options.optional('envVars', null)
    this.request = null
  }

  preLoad () {
    if (this.envVars) {
      for (const envVar of this.envVars) 
        if (!process.env[envVar]) return false
    }

    this.request = this.load();

    if (!this.request) return false;
    return true
  }

  load () {
    return null;
  }
}