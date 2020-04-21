const { Loader, ApiWrapper } = require('../structures')

module.exports = class ApiLoader extends Loader {
  constructor(client) {
    super({ critical: true, name: 'APIs', priority: Loader.LoaderPriority.HIGH }, client)
    this.client = client
    this.client.apis = {}
  }

  load() {
    return this.loadFiles('src/apis')
  }

  loadFile(NewAPI) {
    const api = new NewAPI(this.client)
    if (!(api instanceof ApiWrapper)) throw new Error(`Failed to load ${api.name}: not an api`)

    if (api.preLoad()) {
      this.client.apis[api.name] = api
      return true
    }
    return false
  }
}