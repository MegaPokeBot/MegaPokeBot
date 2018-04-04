const Commando = require('discord.js-commando')
const config = require('./.config.json')
const sqlite = require('sqlite')
const path = require('path')

const prefix = config.prefix || '%'

const client = new Commando.Client({
  commandPrefix: prefix,
  unknownCommandResponse: false,
  owner: config.owner
})

client.on('ready', () => {
  console.info('Connected')
  console.info('Logged in as: ')
  console.info(`${client.user.tag} - (${client.user.id})`)
  client.user.setPresence({
    game: {
      name: `${prefix}help`,
      type: 'WATCHING'
    }
  })
})

client
  .setProvider(
    sqlite
      .open(path.join(__dirname, 'settings.sqlite3'))
      .then(db => new Commando.SQLiteProvider(db))
  )
  .catch(console.error)

client.registry
  .registerGroups([['dex', 'Pokédex'], ['pokemon', 'General Pokémon commands']])
  .registerDefaults()
  .registerTypesIn(path.join(__dirname, 'types'))
  .registerCommandsIn(path.join(__dirname, 'commands'))
client.on('reconnecting', () => {
  console.info('Reconnecting...')
})

client.login(config.token)
