const { Listener } = require('../structures')
const chalk = require('chalk')

module.exports = class MainListener extends Listener {
  constructor (client) {
    const discordEvents = ['connect']
    super({ discordEvents }, client)
  }

  onConnect (id) {
    this.client.logger.info(`Switchblade established a successfull connection. Connected as shard ${id}.`, { label: 'Connection' })
  }
}