const { Switchblade } = require('./structures/base')

const client = new Switchblade(process.env.DISCORD_TOKEN, {}, {
    prefix: process.env.PREFIX || 's!'
})

client.start()