const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const { BattleItems: dex } = require('../../dex-data/data/items')

module.exports = class MovedexCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'itemdex',
      group: 'dex',
      aliases: ['id', 'idex', 'itemd'],
      description: 'Searches the itemdex for that item',
      memberName: 'item',
      args: [
        {
          key: 'item',
          prompt: 'What item would you like to look up?',
          type: 'item'
        }
      ],
      examples: ['itemdex lum berry', 'itemdex av']
    })
  }

  run (message, { item }) {
    const itemObj = dex[item]

    message.channel.send(
      new RichEmbed()
        .setAuthor('ItemDex')
        .setColor('#9013fe')
        .setTitle(itemObj.name)
        .setDescription(itemObj.desc)
        .addField('Introduced In', `Generation ${itemObj.gen}`, true)
        .addField(
          'Fling',
          `${itemObj.fling ? `${itemObj.fling.basePower} Power` : 'N/A'}`,
          true
        )
        .addField(
          'Natural Gift',
          `${
            itemObj.naturalGift
              ? `${itemObj.naturalGift.type} / ${
                itemObj.naturalGift.basePower
              } Power`
              : 'N/A'
          }`,
          true
        )
    )
  }
}
