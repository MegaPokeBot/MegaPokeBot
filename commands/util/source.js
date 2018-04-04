const { Command } = require('discord.js-commando')

module.exports = class SourceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'source',
      group: 'util',
      memberName: 'source',
      description: 'See the source of 📣 👉 🤖'
    })
  }

  run (message) {
    message.reply('https://github.com/MegaPokeBot/MegaPokeBot')
  }
}
