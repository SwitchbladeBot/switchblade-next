const Sentry = require('@sentry/node')
Sentry.init({ dsn: process.env.SENTRY_DSN })

const { Switchblade } = require('./structures/base')

const CLUSTER_ID = process.env.INDEX_CLUSTER_ID_FROM_ONE ? parseInt(process.env.CLUSTER_ID) - 1 : parseInt(process.env.CLUSTER_ID)
const firstShardID = CLUSTER_ID * parseInt(process.env.SHARDS_PER_CLUSTER)
const lastShardID = ((CLUSTER_ID + 1) * parseInt(process.env.SHARDS_PER_CLUSTER)) - 1
const maxShards = parseInt(process.env.SHARDS_PER_CLUSTER) * parseInt(process.env.MAX_CLUSTERS)

const client = new Switchblade(process.env.DISCORD_TOKEN, { firstShardID, lastShardID, maxShards }, {
  prefix: process.env.PREFIX || 'n!'
})

client.logger.info(`Starting. First Shard: ${firstShardID}; Last Shard: ${lastShardID}`, { label: `Cluster ${process.env.CLUSTER_ID}` })
