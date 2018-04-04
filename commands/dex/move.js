const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const { BattleMovedex: dex } = require('../../dex-data/data/moves')
const { BattleItems: items } = require('../../dex-data/data/items')
const moveFlags = require('../../self-data/moveFlags.json')

module.exports = class MovedexCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'movedex',
      group: 'dex',
      aliases: ['md', 'mdex', 'moved'],
      description: 'Searches the movedex for that move',
      memberName: 'move',
      args: [
        {
          key: 'move',
          prompt: 'What move would you like to look up?',
          type: 'move'
        }
      ],
      examples: ['movedex tackle', 'movedex z-snorlax', 'movedex sssss']
    })
  }

  run (message, { move }) {
    const moveObj = dex[move]

    message.channel.send(
      new RichEmbed()
        .setAuthor('Movedex')
        .setColor('#e3b100')
        .setTitle(moveObj.name)
        .setDescription(moveObj.desc || moveObj.shortDesc)
        .addField('Type', moveObj.type, true)
        .addField(
          'Category',
          moveObj.basePower !== 1 ? moveObj.category : 'N/A',
          true
        )
        .addField(
          'Base Power',
          moveObj.basePower === 1 ? 'N/A' : moveObj.basePower,
          true
        )
        .addField('PP', moveObj.pp, true)
        .addField('Priority', moveObj.priority, true)
        .addField(
          'Accuracy',
          moveObj.accuracy === true ? 'N/A' : moveObj.accuracy,
          true
        )
        .addField(
          'Z-Move',
          moveObj.isZ
            ? `${items[moveObj.isZ].name}`
            : (zEffect => {
              if (!zEffect) return
              if (zEffect === 'heal') {
                return "Restores 100% of user's max health"
              }
              if (zEffect === 'clearnegativeboost') {
                return 'Resets all negative stat boosts'
              }
            })(moveObj.zMoveEffect) ||
              (zBoosts => {
                if (!zBoosts) return
                const boosts = []
                if (zBoosts.atk) {
                  boosts.push(`+${zBoosts.atk} Atk`)
                }
                if (zBoosts.def) {
                  boosts.push(`+${zBoosts.def} Def`)
                }
                if (zBoosts.spa) {
                  boosts.push(`+${zBoosts.spa} SpA`)
                }
                if (zBoosts.spd) {
                  boosts.push(`+${zBoosts.spd} SpD`)
                }
                if (zBoosts.spe) {
                  boosts.push(`+${zBoosts.spe} Spe`)
                }
                if (zBoosts.accuracy) {
                  boosts.push(`+${zBoosts.accuracy} Accuracy`)
                }
                if (zBoosts.evasion) {
                  boosts.push(`+${zBoosts.evasion} Evasion`)
                }
                return boosts.join(', ')
              })(moveObj.zMoveBoost) ||
              `Power: ${moveObj.zMovePower || 'N/A'}`,
          true
        )
        .addField(
          'Flags',
          Object.keys(moveObj.flags).length
            ? (flags => {
              const flagList = []
              flags.forEach(flag => {
                flagList.push(moveFlags[flag])
              })
              return flagList.join('\n')
            })(Object.keys(moveObj.flags))
            : 'N/A'
        )
    )
  }
}
