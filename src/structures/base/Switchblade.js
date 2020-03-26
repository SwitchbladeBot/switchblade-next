const { CommandClient } = require('eris')

module.exports = class Switchblade extends CommandClient {
    constructor (token, options, commandOptions) {
        super(token, options, commandOptions)
    }
}
