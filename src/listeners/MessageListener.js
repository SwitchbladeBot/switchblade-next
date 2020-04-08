const { Listener } = require('../structures')
const chalk = require('chalk')

module.exports = class MessageListener extends Listener {
  constructor (client) {
    const discordEvents = ['messageCreate']
    super({ discordEvents }, client)
  }

  onMessageCreate (message) {
    this.client.logger.info(message.content, { label: 'Message' })
  }
}