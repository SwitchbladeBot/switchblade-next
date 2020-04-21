const { Listener } = require('../structures')
const fetch = require('node-fetch')

const BASE_URL = process.env.BOT_LIST_POSTER_URL || 'http://bot-list-poster'

module.exports = class GuildCountListener extends Listener {
  constructor (client) {
    const discordEvents = ['guildCreate', 'guildDelete']
    super({ discordEvents }, client)
  }

  onGuildCreate (guild) { this.updateGuildCount(guild) }
  onGuildDelete (guild) { this.updateGuildCount(guild) }

  updateGuildCount (guild) {
    this.client.logger.info('Sending updated guild count to statistics manager', { label: `Shard ${guild.shard.id}` })
    fetch(`${BASE_URL}/shards`, {
      method: 'post',
      body: JSON.stringify([
        {
          id: guild.shard.id,
          guildCount: this.client.guilds.filter(g => g.shard.id === guild.shard.id).length
        }
      ]),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BOT_LIST_POSTER_SECRET}`
      }
    })
  }
}
