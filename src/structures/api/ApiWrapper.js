const { createOptionHandler } = require('../../utils')

module.exports = class ApiWrapper {
  constructor (options, client) {
    options = createOptionHandler('Loader', options)

    this.name = options.optional('name', this.constructor.name)
    this.provider = options.optional('provider', null)
    this.envVars = options.optional('provider', null)
  }
}