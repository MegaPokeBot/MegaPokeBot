const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const spliceSlice = require('../../util/spliceSlice')
const { BattlePokedex: dex } = require('../../dex-data/data/pokedex')

module.exports = class PokedexCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'pokedex',
      group: 'dex',
      aliases: ['pd', 'pdex', 'poked'],
      description: 'Searches the Pokédex for that Pokémon',
      memberName: 'pokemon',
      args: [
        {
          key: 'pokemon',
          prompt: 'What Pokémon would you like to look up?',
          type: 'pokemon'
        }
      ],
      examples: ['pokedex pikachu', 'pokedex ttar', 'pokedex 360']
    })
  }

  run (message, { pokemon }) {
    const dexObj = dex[pokemon]

    message.channel.send(
      new RichEmbed()
        .setAuthor('Pokédex')
        .setTitle(`${dexObj.species} #${dexObj.num}`)
        .setThumbnail(
          (([str, str2], fStr) => {
            switch (fStr) {
              case 'ho-oh':
              case 'jangmo-o':
              case 'hakamo-o':
              case 'kommo-o':
                return spliceSlice(fStr, fStr.indexOf('-'), 1)
              case 'nidoran-m':
                return 'nidoran'
              default:
                if (/.+-totem/.test(fStr)) {
                  return spliceSlice(fStr, fStr.lastIndexOf('-'), 6)
                }
                if (/.+-.+-.+/.test(fStr)) {
                  return spliceSlice(fStr, fStr.lastIndexOf('-'), 1)
                }
                return str + fStr + str2
            }
          })`http://play.pokemonshowdown.com/sprites/xyani/${dexObj.species
            .toLowerCase()
            .replace(' ', '')
            .replace('.', '')
            .replace("'", '')
            .replace('%', '')
            .replace(':', '')
            .replace(/é/g, 'e')}.gif`
        )
        .addField('Type', dexObj.types.join(' / '))
        .addField(
          'Evolves into',
          (() => {
            const evosResolved = []
            if (!dexObj.evos) return 'N/A'
            for (let i = 0; i < dexObj.evos.length; i++) {
              evosResolved.push(dex[dexObj.evos[i]].species)
            }
            return evosResolved.join(' or ')
          })``,
          true
        )
        .addField(
          'Evolves from',
          dexObj.prevo ? dex[dexObj.prevo].species : 'N/A',
          true
        )
        .addField(
          'Evolves at',
          `${
            dexObj.evoLevel && dexObj.evoLevel !== 1
              ? `Lv. ${dexObj.evoLevel}`
              : 'N/A'
          }`
        )
        .addField('Egg Group', dexObj.eggGroups.join(', '), true)
        .addField(
          'Abilities',
          dexObj.abilities['0'] +
            (dexObj.abilities['1'] ? `, ${dexObj.abilities['1']}` : '') +
            (dexObj.abilities.H ? `, Hidden: ${dexObj.abilities.H}` : '') ||
            'None',
          true
        )
        .addField(
          'Base Stats',
          `${dexObj.baseStats.hp} HP, ${dexObj.baseStats.atk} Atk, ${
            dexObj.baseStats.def
          } Def, ${dexObj.baseStats.spa} SpA, ${dexObj.baseStats.spd} SpD, ${
            dexObj.baseStats.spe
          } Spe, ${dexObj.baseStats.hp +
            dexObj.baseStats.atk +
            dexObj.baseStats.def +
            dexObj.baseStats.spa +
            dexObj.baseStats.spd +
            dexObj.baseStats.spe} Total`,
          true
        )
        .setColor('#ff3333')
    )
  }
}
