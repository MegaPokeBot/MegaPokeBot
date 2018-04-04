const { ArgumentType } = require('discord.js-commando')
const { ItemAliases: itemAliases } = require('../self-data/aliases')
const { BattleItems: dex } = require('../dex-data/data/items')
const parseArg = require('../util/parsearg')

module.exports = class ItemArgumentType extends ArgumentType {
  constructor (client) {
    super(client, 'item')
  }

  validate (value) {
    const modifiedValue = parseArg(value, itemAliases)
    return (
      Object.keys(dex).includes(modifiedValue) ||
      'I could not find that in my itemdex'
    )
  }

  parse (value) {
    return parseArg(value, itemAliases)
  }
}
