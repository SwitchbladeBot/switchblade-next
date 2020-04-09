const { Listener } = require('../structures')

module.exports = class LoggingListener extends Listener {
  constructor (client) {
    const discordEvents = ['error', 'disconnect', 'debug', 'shardDisconnect', 'connect', 'rawWS']
    super({ discordEvents }, client)
  }

  onError (error, shardId) {
    this.client.logger.error(`Shard ${shardId} encountered an error. ${error.stack}`, { label: `Shard ${shardId}`, shardId, stack: error.stack })
  }

  onDebug (message, shardId) {
    this.client.logger.debug(message, { label: `Shard ${shardId || '?'}`,  })
  }

  onRawWS (packet, shardId) {
    this.client.logger.silly(packet, { label: `Shard ${shardId || '?'}`, packet })
  }

  onDisconnect() {
    this.client.logger.error('All shards disconnected', { label: `Connection` })
  }

  onShardDisconnect(error, shardId) {
      if (error) {
        this.client.logger.error(`Disconnected. ${error.stack || error.message}`, { label: `Shard ${shardId}`, shardId })
      } else {
        this.client.logger.warn('Disconnected.', { label: `Shard ${shardId}`, shardId })
      }
  }

  onConnect(shardId) {
    this.client.logger.info(`Connected to the gateway`, { label: `Shard ${shardId}`, shardId })
  }
}