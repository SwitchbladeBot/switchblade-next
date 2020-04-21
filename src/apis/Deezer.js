const { ApiWrapper } = require('../structures/api')
const axios = require('axios')

class DeezerAPI extends ApiWrapper {
  constructor(client) {
    super({ name: 'deezer' }, client)
  }

  load () {
    return axios.create({
      baseURL: 'https://api.deezer.com/',
      responseType: 'json'
    })
  }

  getTrack (id) {
    return this.request('fala')
  }

  search(q) {
    return this.request.get('search', {
      params: { q }
    }).then(r => r.data)
  }
}

module.exports = DeezerAPI
