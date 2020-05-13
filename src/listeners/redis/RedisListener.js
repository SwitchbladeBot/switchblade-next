const { Listener } = require('../../structures')

module.exports = class RedisListener extends Listener {
  constructor (client) {
    super({
      listenerClient: 'redis',
      events: [
        'connect',
        'timeout',
        'close',
        'error'
      ]
    }, client)
  }

  onConnect () {
    this.client.logger.info('Connected', { label: 'Redis' })
  }

  onTimeout () {
    this.client.logger.info('Timeout', { label: 'Redis' })
  }

  onError (error) {
    this.client.logger.error(error, { label: 'Redis' })
  }

  onClose (hadError) {
    if (hadError) {
      this.client.logger.error('Connection closed with errors', { label: 'Redis' })
    } else {
      this.client.logger.warn('Connection closed without errors', { label: 'Redis' })
    }
  }
}
