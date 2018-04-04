const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const { BattleAbilities: dex } = require('../../dex-data/data/abilities')
const abilRatings = require('../../self-data/ratings.json')

module.exports = class MovedexCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'abilitydex',
      group: 'dex',
      aliases: ['ad', 'adex', 'abilityd'],
      description: 'Searches the abilitydex for that ability',
      memberName: 'ability',
      args: [
        {
          key: 'ability',
          prompt: 'What ability would you like to look up?',
          type: 'ability'
        }
      ],
      examples: ['abilitydex adapdability', 'abilitydex stag']
    })
  }

  run (message, { ability }) {
    const abilObj = dex[ability]

    message.channel.send(
      new RichEmbed()
        .setAuthor('AbilityDex')
        .setColor('#9013fe')
        .setTitle(abilObj.name)
        .setDescription(abilObj.desc || abilObj.shortDesc)
        .addField('Rating', abilRatings[abilObj.rating], true)
    )
  }
}
