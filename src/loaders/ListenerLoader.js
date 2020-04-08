const { Loader, Listener } = require('../structures')

module.exports = class ListenerLoader extends Loader {
  constructor(client) {
    super({ critical: true, name: 'Listeners' }, client)
    this.listeners = []
  }

  load() {
    return this.loadFiles('src/listeners')
  }

  loadFile(NewListener) {
    const listener = new NewListener(this.client)
    if (!(listener instanceof Listener)) throw new Error(`Failed to load ${NewListener.name}: not a Listener`)

    // Load all custom events that aren't from the eris API
    listener.listen()

    // Load all events from functions listed on listener.discordEvents
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
    listener.discordEvents.forEach(event => {
      this.client.on(event, (...e) => listener['on' + capitalize(event)](...e))
    })
    
    return true
  }
}