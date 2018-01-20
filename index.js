const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const { listOfMons } = require('./listofmons.json');

var helpIcon = {
    url: 'https://housing.umn.edu/sites/housing.umn.edu/files/help.png',
    width: 200,
    height: 200
};
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', evt => {
    void evt;
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    bot.setPresence({ game: { name: '%help' } });
});
bot.on('disconnect', () => {
    logger.warn('Bot disconnected');
    bot.connect();
});
bot.on('message', function(user, userID, channelID, message, evt) {
    void evt;
    if (message.substring(0, 1) == '%') {
        var args = message.substring(1).split('|');
        var cmd = message.substring(1).split(' ')[0];
        args.shift();
        args.unshift(message.substring(1).split(' ')[1]);
        // trim whitespace
        if (args[0]) {
            for (let i = 0; i < args.length; i++) {
                args[i] = args[i].trim();
            }
        } else {
            args = [];
        }

        switch (cmd) {
        // %hello
        case 'hello':
            bot.sendMessage({
                to: channelID,
                message: 'Hi there!'
            });
            break;

            // %randmon
        case 'randmon':
            bot.sendMessage({
                to: channelID,
                message:
                        'Your random Pokemon is: **' +
                        listOfMons[Math.floor(Math.random() * 807)] +
                        '**.'
            });
            break;

            // %help
        case 'help':
            switch (args[0]) {
            case 'help':
            case '%help':
                bot.sendMessage({
                    to: channelID,
                    message: null,
                    embed: {
                        authorname: 'Bot Help',
                        title: 'Command: %help',
                        thumbnail: helpIcon,
                        fields: [
                            {
                                name: 'Usage',
                                value: '**%help [command]**'
                            },
                            {
                                name: '%help',
                                value: 'Lists usable commands'
                            },
                            {
                                name: '%help <command>',
                                value:
                                            'Displays help for a certain command'
                            }
                        ],
                        color: 0x7ae576
                    }
                });

                break;

            case 'hello':
            case '%hello':
                bot.sendMessage({
                    to: channelID,
                    message: null,
                    embed: {
                        authorname: 'Bot Help',
                        title: 'Command: %hello',
                        thumbnail: helpIcon,
                        fields: [
                            { name: 'Usage', value: '**%hello**' },
                            {
                                name: '%hello',
                                value: 'Say hello to the bot!'
                            }
                        ],
                        color: 0x7ae576
                    }
                });

                break;

            case 'randmon':
            case '%randmon':
                bot.sendMessage({
                    to: channelID,
                    message: null,
                    embed: {
                        authorname: 'Bot Help',
                        title: 'Command: %randmon',
                        thumbnail: helpIcon,
                        fields: [
                            { name: 'Usage', value: '**%randmon**' },
                            {
                                name: '%randmon',
                                value:
                                            'Generate a random Pokemon (no formes)'
                            }
                        ],
                        color: 0x7ae576
                    }
                });

                break;

            default:
                bot.sendMessage({
                    to: channelID,
                    message: null,
                    embed: {
                        authorname: 'Bot Help',
                        title: 'Command List',
                        thumbnail: helpIcon,
                        description:
                                    'Bot: `%help`\nPokemon: `%randmon`\nMisc: `%hello`',
                        footer: {
                            text:
                                        'use %help <command> for command-specific help'
                        },
                        color: 0x7ae576
                    }
                });
            }

            break;
        }
    }
});
