const fs = require('fs');
const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');

var helpIcon = {url: 'https://housing.umn.edu/sites/housing.umn.edu/files/help.png', width: 200, height: 200};

const writer = fs.createWriteStream('server.log');
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
bot.on('ready', (evt) => {
    void evt;
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    bot.setPresence({'game': {'name': '%help'}});
});
bot.on('disconnect', () => {
    logger.warn('Bot disconnected');
    bot.connect();
});
bot.on('any', (evt) => {
    function write () {
        return writer.write(JSON.stringify(evt) + '\n\n\n', 'utf-8');
    }
    write() || writer.once('drain', write);
});
bot.on('message', function (user, userID, channelID, message, evt) {
    void evt;
    if (message.substring(0, 1) == '%') {
        var args = message.substring(1).split('|');
        var cmd = message.substring(1).split(' ')[0];
        args.shift();
        args.unshift(message.substring(1).split(' ')[1]);
        // trim whitespace
        if (args[0]) {
            for (let i = 0; i < args.length; i++) {
                args[i] =  args[i].trim();
            }
        } else {
            args = [];
        }

        switch(cmd) {
        // %hello
        case 'hello':
            bot.sendMessage({
                to: channelID,
                message: 'Hi there!'
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
                        'authorname': 'Bot Help',
                        'title': 'Command: %help',
                        'thumbnail': helpIcon,
                        'fields': [
                            {name: 'Usage', value: '**%help [command]**'},
                            {name: '\t%help', value: '\tLists usable commands'},
                            {name: '\t%help <command>', value: '\tDisplays help for a certain command'}
                        ],
                        'color': 0x7ae576
                    }
                });

                break;
            case 'hello':
            case '%hello':
                bot.sendMessage({
                    to: channelID,
                    message: null,
                    embed: {
                        'authorname': 'Bot Help',
                        'title': 'Command: %hello',
                        'thumbnail': helpIcon,
                        'fields': [
                            {name: 'Usage', value: '**%hello**'},
                            {name: '\t%hello', value: '\tSay hello to the bot!'}
                        ],
                        'color': 0x7ae576
                    }
                });

                break;
            default:
                bot.sendMessage({
                    to: channelID,
                    message: null,
                    embed: {
                        'authorname': 'Bot Help',
                        'title': 'Command List',
                        'thumbnail': helpIcon,
                        'description': 'Bot: `%help`\nMisc: `%hello`',
                        'footer': {'text': 'use %help <command> for command-specific help'},
                        'color': 0x7ae576
                    }
                });
            }

            break;
        }
    }
});
