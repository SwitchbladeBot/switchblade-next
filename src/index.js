const { Switchblade } = require('./structures')

const client = new Switchblade(process.env.DISCORD_TOKEN, {}, {
    prefix: process.env.PREFIX || 's!'
})

client.on('ready', () => {
    console.log('bom dia família')
})

client.registerCommand('ping', 'zap', {
    description: 'zop',
    fullDescription: 'zip'
})

client.connect()
