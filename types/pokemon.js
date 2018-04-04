const { ArgumentType } = require('discord.js-commando')
const { listOfMons } = require('../self-data/listofmons.json')
const { PokeAliases: monAliases } = require('../self-data/aliases')
const { BattlePokedex: dex } = require('../dex-data/data/pokedex')
const parseArg = require('../util/parsearg')

module.exports = class PokemonArgumentType extends ArgumentType {
  constructor (client) {
    super(client, 'pokemon')
  }

  validate (value) {
    if (!isNaN(Number(value))) {
      return (
        (Number(value) > 0 && Number(value) < 808) ||
        'That is not a valid Pokédex number'
      )
    }
    const modifiedValue = parseArg(value, monAliases)
    return (
      Object.keys(dex).includes(modifiedValue) ||
      'I could not find that in my Pokédex'
    )
  }

  parse (value) {
    if (!isNaN(Number(value))) {
      return listOfMons[Number(value) - 1].substring(5).toLowerCase()
    }
    return parseArg(value, monAliases)
  }
}
