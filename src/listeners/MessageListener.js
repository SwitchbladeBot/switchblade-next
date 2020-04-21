const { Listener } = require('../structures')
const chalk = require('chalk')

module.exports = class MessageListener extends Listener {
  constructor (client) {
    const discordEvents = ['messageCreate']
    super({ discordEvents }, client)
  }

  onMessageCreate ({ content, channel }) {
    // isso é só pra teste até lançar as nova parada do discord e a gente fazer com base nelas
    
    if (!content) return

    if (content.startsWith('psh!user get')) {
      const query = content.replace('psh!user get ', '')
      console.log(query)
      this.client.apis.deezer.search(query).then(a => {
        console.log(a.data[0])
        this.client.createMessage(channel.id, a.data[0].artist.picture_big)
      })
    }
  }
}