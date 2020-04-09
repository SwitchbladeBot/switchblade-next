const { Switchblade } = require('./structures/base')

const client = new Switchblade(process.env.DISCORD_TOKEN, {
    firstShardID: process.env.SHARD_ID || 0,
    maxShards: 1
}, {
    prefix: process.env.PREFIX || 'n!',

})