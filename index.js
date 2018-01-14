
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
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '%') {
        var args = message.substring(1).split('|');
        var cmd = message.substring(1).split(' ')[0];
        args.shift();
        args.unshift(message.substring(1).split(' ')[1])
        // trim whitespace
        for (let i = 0; i < args.length; i++) {
            args[i] =  args[i].trim();
        }

        switch(cmd) {
            // %hello
            case 'hello':
                bot.sendMessage({
                    to: channelID,
                    message: 'Hi there!'
                });
                break;
            // %repeat
            case 'repeat':
                bot.sendMessage({
                    to: channelID,
                    message: 'Bot testing command\nYou said:' + args.join(" and ")
                });
                break;
         }
     }
});
