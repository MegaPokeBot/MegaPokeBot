const { Command } = require('discord.js-commando')
const { listOfMons } = require('../../self-data/listofmons.json')

module.exports = class SourceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'randmon',
      group: 'pokemon',
      aliases: [
        'rand-mon',
        'randommon',
        'random-mon',
        'rand-poke',
        'randompoke',
        'random-poke',
        'randpoke',
        'rand-pokemon',
        'randompokemon',
        'random-pokemon',
        'randpokemon',
        'rand-pkmn',
        'randompkmn',
        'random-pkmn',
        'randpkmn'
      ],
      memberName: 'random',
      description: 'Generate a random Pokémon (no formes)'
    })
  }

  run (message) {
    const randmon = listOfMons[Math.floor(Math.random() * 807)]
    message.reply(
      `Your random Pokémon is: **${randmon}**.\nUse \`@${
        this.client.user.tag
      } pd ${randmon.substring(5)}\` for more information`
    )
  }
}
