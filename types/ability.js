const { ArgumentType } = require('discord.js-commando')
const { AbilityAliases: abilityAliases } = require('../self-data/aliases')
const { BattleAbilities: dex } = require('../dex-data/data/abilities')
const parseArg = require('../util/parsearg')

module.exports = class AbilityArgumentType extends ArgumentType {
  constructor (client) {
    super(client, 'ability')
  }

  validate (value) {
    const modifiedValue = parseArg(value, abilityAliases)
    return (
      Object.keys(dex).includes(modifiedValue) ||
      'I could not find that in my abilitydex'
    )
  }

  parse (value) {
    return parseArg(value, abilityAliases)
  }
}
