const { Listener } = require('../structures')
const chalk = require('chalk')

module.exports = class MessageListener extends Listener {
  constructor (client) {
    const discordEvents = ['messageCreate']
    super({ discordEvents }, client)
  }

  onMessageCreate ({ content }) {
    // isso é só pra teste até lançar as nova parada do discord e a gente fazer com base nelas
    
    if (!content) return

    if (content.startsWith('spn!city search')) {
      const query = content.replace('spn!city search ', '')
      console.log(query)
    }
  }
}