
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
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
bot.on('ready', function (evt) {
    void evt;
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('disconnect', () => {
    logger.warn('Bot disconnected');
    bot.connect();
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
                        'title': '**Command: %help**',
                        'thumbnail': {'url': 'https://cdn.discordapp.com/embed/avatars/0.png', width: 256, height: 256},
                        'fields': [
                            {name: '**Usage**', value: '**help**'},
                            {name: '\t%help <command>', value: '\tDisplays help for a certain command'},
                            {name: '\t%help <command>', value: '\tDisplays help for a certain command'}
                        ],
                        'color': 0x7ae576
                    }
                });

                break;
            default:
                bot.sendMessage({
                    to: channelID,
                    message: 'List of commands: %hello, %help\nUse %help [command] for details on a certain command'
                });
            }

            break;
        }
    }
});
