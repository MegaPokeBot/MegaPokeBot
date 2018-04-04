const { ArgumentType } = require('discord.js-commando')
const { MoveAliases: moveAliases } = require('../self-data/aliases')
const { BattleMovedex: dex } = require('../dex-data/data/moves')
const parseArg = require('../util/parsearg')

module.exports = class MoveArgumentType extends ArgumentType {
  constructor (client) {
    super(client, 'move')
  }

  validate (value) {
    const modifiedValue = parseArg(value, moveAliases)
    return (
      Object.keys(dex).includes(modifiedValue) ||
      'I could not find that in my movedex'
    )
  }

  parse (value) {
    return parseArg(value, moveAliases)
  }
}
