const { Listener } = require('../../structures')

module.exports = class MessageListener extends Listener {
  constructor (client) {
    super({
      listenerClient: 'discord',
      events: [
        'messageCreate'
      ]
    }, client)
  }

  async onMessageCreate (message) {
    if (message.author.bot) return
    this.client.logger.info(message.content, { label: 'Message' })
  }
}
