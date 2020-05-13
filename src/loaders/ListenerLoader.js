const { Loader, Listener } = require('../structures')

module.exports = class ListenerLoader extends Loader {
  constructor (client) {
    super({ critical: true, name: 'Listeners' }, client)
    this.listeners = []
  }

  load () {
    return this.loadFiles('src/listeners', true)
  }

  loadFile (NewListener) {
    const listener = new NewListener(this.client)
    this.client.logger.debug(`Loading ${NewListener.name}`, { label: 'ListenerLoader' })
    if (!(listener instanceof Listener)) throw new Error(`Failed to load ${NewListener.name}: not a Listener`)

    // Load all events from functions listed on listener.events
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
    listener.events.forEach(event => {
      if (listener.listenerClient === 'discord') {
        this.client.on(event, (...e) => listener['on' + capitalize(event)](...e))
      } else {
        this.client[listener.listenerClient].on(event, (...e) => listener['on' + capitalize(event)](...e))
      }
    })

    return true
  }
}
