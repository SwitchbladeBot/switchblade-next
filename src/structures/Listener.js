const { createOptionHandler } = require('../utils')

module.exports = class Listener {
  constructor (options, client) {
    options = createOptionHandler('Listener', options)

    this.discordEvents = options.optional('discordEvents', [])

    this.client = client
  }

  listen () {
    return null
  }
}