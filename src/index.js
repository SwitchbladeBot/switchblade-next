const { Switchblade } = require('./structures/base')

const client = new Switchblade(process.env.DISCORD_TOKEN, {
    firstShardID: process.env.SHARD_ID,
    maxShards: 1
}, {
    prefix: process.env.PREFIX || 'n!',

})

client.start()