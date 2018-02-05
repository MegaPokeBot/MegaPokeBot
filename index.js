const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const { listOfMons } = require('./listofmons.json');
const dex = require('./dex-data/data/pokedex').BattlePokedex;
const aliases = require('./dex-data/data/aliases').BattleAliases;
const moves = require('./dex-data/data/moves').BattleMovedex;
const moveFlags = require('./moveFlags.json');
const items = require('./dex-data/data/items').BattleItems;
const monaliases = require('./self-data/aliases').PokeAliases;
const movealiases = require('./self-data/aliases').MoveAliases;
const abilityaliases = require('./self-data/aliases').AbilityAliases;
const formataliases = require('./self-data/aliases').FormatAliases;
const itemaliases = require('./self-data/aliases').ItemAliases;

var helpIcon = {
    url: 'https://housing.umn.edu/sites/housing.umn.edu/files/help.png',
    width: 200,
    height: 200
};
function spliceSlice(str, index, count, add) {
    // We cannot pass negative indexes dirrectly to the 2nd slicing operation.
    if (index < 0) {
        index = str.length + index;
        if (index < 0) {
            index = 0;
        }
    }

    return str.slice(0, index) + (add || '') + str.slice(index + count);
}
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
        var cmd = message
            .substring(1)
            .split('|')[0]
            .toLowerCase()
            .trim();
        args.shift();
        // trim whitespace
        if (args[0]) {
            for (let i = 0; i < args.length; i++) {
                args[i] = args[i].trim().toLowerCase();
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
            var randmon = listOfMons[Math.floor(Math.random() * 807)];
            bot.sendMessage({
                to: channelID,
                message:
                        'Your random Pokémon is: **' +
                        randmon +
                        '**.\nUse `%pd | ' +
                        randmon.substring(5) +
                        '` for more information'
            });
            break;

            // %pokedex (or %pd)
        case 'pokedex':
        case 'pd':
            if (!args[0]) {
                break;
            }
            if (Number(args[0]) > 0 && Number(args[0]) < 808) {
                args[0] = listOfMons[Number(args[0]) - 1]
                    .substring(5)
                    .toLowerCase();
            }
            var stuffToRemove = [],
                numChanged = 0;
            for (var i = 0; i < args[0].length; i++) {
                if (
                    args[0][i] === '-' ||
                        args[0][i] === ' ' ||
                        args[0][i] === '.' ||
                        args[0][i] === ':' ||
                        args[0][i] === '\'' ||
                        args[0][i] === '%' ||
                        args[0][i] === ','
                ) {
                    stuffToRemove.push(i);
                }
            }
            for (var j = 0; j < stuffToRemove.length; j++) {
                args[0] = spliceSlice(
                    args[0],
                    stuffToRemove[j] - numChanged,
                    1
                );
                numChanged++;
            }
            if (Object.keys(monaliases).includes(args[0])) {
                let currentOne = monaliases[args[0]],
                    stuffToRemove = [],
                    numChanged = 0;
                for (var i = 0; i < currentOne.length; i++) {
                    if (
                        currentOne[i] === '-' ||
                            currentOne[i] === ' ' ||
                            currentOne[i] === '.' ||
                            currentOne[i] === ':' ||
                            currentOne[i] === '%' ||
                            currentOne[i] === '\'' ||
                            currentOne[i] === ','
                    ) {
                        stuffToRemove.push(i);
                    }
                }
                for (var j = 0; j < stuffToRemove.length; j++) {
                    currentOne = spliceSlice(
                        currentOne,
                        stuffToRemove[j] - numChanged,
                        1
                    );
                    numChanged++;
                }
                args[0] = currentOne.toLowerCase();
            }
            if (!Object.keys(dex).includes(args[0])) {
                bot.sendMessage({
                    to: channelID,
                    message: `I could not find ${args[0]} in my pokédex.`
                });
                break;
            }
            var dexObj = dex[args[0]];
            bot.sendMessage({
                to: channelID,
                message: null,
                embed: {
                    author: { name: 'Pokédex' },
                    title: `${dexObj.species} #${dexObj.num}`,
                    thumbnail: {
                        url: `http://play.pokemonshowdown.com/sprites/xyani/${(fStr => {
                            switch (fStr) {
                            case 'ho-oh':
                            case 'jangmo-o':
                            case 'hakamo-o':
                            case 'kommo-o':
                                return spliceSlice(
                                    fStr,
                                    fStr.indexOf('-'),
                                    1
                                );
                            case 'nidoran-m':
                                return 'nidoran';
                            default:
                                if (/.+-totem/.test(fStr)) {
                                    return spliceSlice(
                                        fStr,
                                        fStr.lastIndexOf('-'),
                                        6
                                    );
                                }
                                if (/.+-.+-.+/.test(fStr)) {
                                    return spliceSlice(
                                        fStr,
                                        fStr.lastIndexOf('-'),
                                        1
                                    );
                                }
                                return fStr;
                            }
                        })(
                            dexObj.species
                                .toLowerCase()
                                .replace(' ', '')
                                .replace('.', '')
                                .replace('\'','')
                                .replace('%', '')
                                .replace(':', '')
                                .replace(/é/g, 'e')
                        )}.gif`
                    },
                    fields: [
                        {
                            name: 'Type',
                            value: dexObj.types.join(' / ')
                        },
                        {
                            name: 'Evolves into',
                            value: (() => {
                                var evosResolved = [];
                                if (!dexObj.evos) return 'N/A';
                                for (
                                    var i = 0;
                                    i < dexObj.evos.length;
                                    i++
                                ) {
                                    evosResolved.push(
                                        dex[dexObj.evos[i]].species
                                    );
                                }
                                return evosResolved.join(' or ');
                            })(),
                            inline: true
                        },
                        {
                            name: 'Evolves from',
                            value: (() => {
                                if (!dexObj.prevo) return 'N/A';
                                return dex[dexObj.prevo].species;
                            })(),
                            inline: true
                        },
                        {
                            name: 'Egg Group',
                            value: dexObj.eggGroups.join(', '),
                            inline: true
                        },
                        {
                            name: 'Abilities',
                            value:
                                    dexObj.abilities['0'] +
                                        (dexObj.abilities['1']
                                            ? ', ' + dexObj.abilities['1']
                                            : '') +
                                        (dexObj.abilities['H']
                                            ? ', Hidden: ' +
                                              dexObj.abilities['H']
                                            : '') || 'None',
                            inline: true
                        },
                        {
                            name: 'Other Formes',
                            value: (() => {
                                var formesResolved = [];
                                if (!dexObj.otherFormes) return 'N/A';
                                for (
                                    var i = 0;
                                    i < dexObj.otherFormes.length;
                                    i++
                                ) {
                                    formesResolved.push(
                                        dex[dexObj.otherFormes[i]].species
                                    );
                                }
                                return formesResolved.join(', ');
                            })(),
                            inline: true
                        },
                        {
                            name: 'Base Stats',
                            value: `${dexObj.baseStats.hp} HP, ${
                                dexObj.baseStats.atk
                            } Atk, ${dexObj.baseStats.def} Def, ${
                                dexObj.baseStats.spa
                            } SpA, ${dexObj.baseStats.spd} SpD, ${
                                dexObj.baseStats.spe
                            } Spe, ${dexObj.baseStats.hp +
                                    dexObj.baseStats.atk +
                                    dexObj.baseStats.def +
                                    dexObj.baseStats.spa +
                                    dexObj.baseStats.spd +
                                    dexObj.baseStats.spe} Total`,
                            inline: true
                        }
                    ],
                    footer: {
                        text: `See more on Serebii: https://www.serebii.net/pokedex-sm/${
                            dexObj.num
                        }.shtml`
                    },
                    color: 0xff3333
                }
            });
            break;

            // %movedex (or %md)
        case 'movedex':
        case 'md':
            if (!args[0]) {
                break;
            }
            var stuffToRemove = [],
                numChanged = 0;
            for (var i = 0; i < args[0].length; i++) {
                if (
                    args[0][i] === '-' ||
                        args[0][i] === ' ' ||
                        args[0][i] === '.' ||
                        args[0][i] === ':' ||
                        args[0][i] === '\'' ||
                        args[0][i] === '%' ||
                        args[0][i] === ','
                ) {
                    stuffToRemove.push(i);
                }
            }
            for (var j = 0; j < stuffToRemove.length; j++) {
                args[0] = spliceSlice(
                    args[0],
                    stuffToRemove[j] - numChanged,
                    1
                );
                numChanged++;
            }
            if (Object.keys(movealiases).includes(args[0])) {
                let currentOne = aliases[args[0]],
                    stuffToRemove = [],
                    numChanged = 0;
                for (var i = 0; i < currentOne.length; i++) {
                    if (
                        currentOne[i] === '-' ||
                            currentOne[i] === ' ' ||
                            currentOne[i] === '.' ||
                            currentOne[i] === ':' ||
                            currentOne[i] === '%' ||
                            currentOne[i] === '\'' ||
                            currentOne[i] === ','
                    ) {
                        stuffToRemove.push(i);
                    }
                }
                for (var j = 0; j < stuffToRemove.length; j++) {
                    currentOne = spliceSlice(
                        currentOne,
                        stuffToRemove[j] - numChanged,
                        1
                    );
                    numChanged++;
                }
                args[0] = currentOne.toLowerCase();
            }
            if (!Object.keys(moves).includes(args[0])) {
                bot.sendMessage({
                    to: channelID,
                    message: `I could not find ${args[0]} in my movedex.`
                });
                break;
            }
            var moveObj = moves[args[0]];
            bot.sendMessage({
                to: channelID,
                message: null,
                embed: {
                    author: { name: 'MoveDex' },
                    color: 0xe3b100,
                    title: `${moveObj.name}`,
                    description: `${moveObj.desc || moveObj.shortDesc}`,
                    fields: [
                        {
                            name: 'Type',
                            value: `${moveObj.type}`,
                            inline: true
                        },
                        {
                            name: 'Category',
                            value: `${
                                moveObj.basePower !== 1
                                    ? moveObj.category
                                    : 'N/A'
                            }`,
                            inline: true
                        },
                        {
                            name: 'Power',
                            value: `${
                                moveObj.basePower === 1
                                    ? 'N/A'
                                    : moveObj.basePower
                            }`,
                            inline: true
                        },
                        {
                            name: 'PP',
                            value: `${moveObj.pp}`,
                            inline: true
                        },
                        {
                            name: 'Priority',
                            value: `${moveObj.priority}`,
                            inline: true
                        },
                        {
                            name: 'Z-Move',
                            value: moveObj.isZ
                                ? `${items[moveObj.isZ].name}`
                                : (zEffect => {
                                    if (!zEffect) return;
                                    if (zEffect === 'heal')
                                        return 'Restores 100% of user\'s max health';
                                    if (zEffect === 'clearnegativeboost')
                                        return 'Resets all negative stat boosts';
                                })(moveObj.zMoveEffect) ||
                                      (zBoosts => {
                                          if (!zBoosts) return;
                                          let boosts = [];
                                          if (zBoosts.atk)
                                              boosts.push(
                                                  `+${zBoosts.atk} Atk`
                                              );
                                          if (zBoosts.def)
                                              boosts.push(
                                                  `+${zBoosts.def} Def`
                                              );
                                          if (zBoosts.spa)
                                              boosts.push(
                                                  `+${zBoosts.spa} SpA`
                                              );
                                          if (zBoosts.spd)
                                              boosts.push(
                                                  `+${zBoosts.spd} SpD`
                                              );
                                          if (zBoosts.spe)
                                              boosts.push(
                                                  `+${zBoosts.spe} Spe`
                                              );
                                          if (zBoosts.accuracy)
                                              boosts.push(
                                                  `+${
                                                      zBoosts.accuracy
                                                  } Accuracy`
                                              );
                                          if (zBoosts.evasion)
                                              boosts.push(
                                                  `+${zBoosts.evasion} Evasion`
                                              );
                                          return boosts.join(', ');
                                      })(moveObj.zMoveBoost) ||
                                      `Power: ${moveObj.zMovePower || 'N/A'}`,
                            inline: true
                        },
                        {
                            name: 'Flags',
                            value: Object.keys(moveObj.flags).length
                                ? (flags => {
                                    let flagList = [];
                                    flags.forEach(flag => {
                                        flagList.push(moveFlags[flag]);
                                    });
                                    return flagList.join('\n');
                                })(Object.keys(moveObj.flags))
                                : 'N/A'
                        }
                    ]
                }
            });
            break;

            // %itemdex (or %id)
        case 'itemdex':
        case 'id':
            if (!args[0]) {
                break;
            }
            var stuffToRemove = [],
                numChanged = 0;
            for (var i = 0; i < args[0].length; i++) {
                if (
                    args[0][i] === '-' ||
                        args[0][i] === ' ' ||
                        args[0][i] === '.' ||
                        args[0][i] === ':' ||
                        args[0][i] === '\'' ||
                        args[0][i] === '%' ||
                        args[0][i] === ','
                ) {
                    stuffToRemove.push(i);
                }
            }
            for (var j = 0; j < stuffToRemove.length; j++) {
                args[0] = spliceSlice(
                    args[0],
                    stuffToRemove[j] - numChanged,
                    1
                );
                numChanged++;
            }
            if (Object.keys(itemaliases).includes(args[0])) {
                let currentOne = aliases[args[0]],
                    stuffToRemove = [],
                    numChanged = 0;
                for (var i = 0; i < currentOne.length; i++) {
                    if (
                        currentOne[i] === '-' ||
                            currentOne[i] === ' ' ||
                            currentOne[i] === '.' ||
                            currentOne[i] === ':' ||
                            currentOne[i] === '%' ||
                            currentOne[i] === '\'' ||
                            currentOne[i] === ','
                    ) {
                        stuffToRemove.push(i);
                    }
                }
                for (var j = 0; j < stuffToRemove.length; j++) {
                    currentOne = spliceSlice(
                        currentOne,
                        stuffToRemove[j] - numChanged,
                        1
                    );
                    numChanged++;
                }
                args[0] = currentOne.toLowerCase();
            }
            if (!Object.keys(items).includes(args[0])) {
                bot.sendMessage({
                    to: channelID,
                    message: `I could not find ${args[0]} in my itemdex.`
                });
                break;
            }
            var itemObj = items[args[0]];
            bot.sendMessage({
                to: channelID,
                message: null,
                embed: {
                    author: { name: 'ItemDex' },
                    color: 0x9013fe,
                    title: `${itemObj.name}`,
                    description: `${itemObj.desc}`,
                    fields: [
                        {
                            name: 'Introduced In',
                            value: `Generaton ${itemObj.gen}`,
                            inline: true
                        },
                        {
                            name: 'Fling',
                            value: `${
                                itemObj.fling
                                    ? itemObj.fling.basePower + ' Power'
                                    : 'N/A'
                            }`,
                            inline: true
                        },
                        {
                            name: 'Natural Gift',
                            value: `${
                                itemObj.naturalGift
                                    ? itemObj.naturalGift.type +
                                          ' / ' +
                                          itemObj.naturalGift.basePower +
                                          ' Power'
                                    : 'N/A'
                            }`,
                            inline: true
                        }
                    ]
                }
            });
            break;
            break;
            // %god
        case 'god':
            bot.sendMessage({
                to: channelID,
                message: '<a:godnitro:404791673617514496>'
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
                        author: { name: 'Bot Help' },
                        title: 'Command: %help',
                        thumbnail: helpIcon,
                        fields: [
                            {
                                name: 'Usage',
                                value: '**%help | [command]**'
                            },
                            {
                                name: '%help',
                                value: 'Lists usable commands'
                            },
                            {
                                name: '%help | <command>',
                                value:
                                            'Displays help for a certain command'
                            }
                        ],
                        color: 0x7ae576
                    }
                });

                break;
            case 'pd':
            case '%pd':
            case 'pokedex':
            case '%pokedex':
                bot.sendMessage({
                    to: channelID,
                    message: null,
                    embed: {
                        author: { name: 'Bot Help' },
                        title: 'Command: %pokedex',
                        thumbnail: helpIcon,
                        fields: [
                            {
                                name: 'Usage',
                                value:
                                            '**%pokedex | <pokémon OR dexno>**',
                                inline: true
                            },
                            {
                                name: 'Shorthand',
                                value: '**%pd**',
                                inline: true
                            },
                            {
                                name: '%pokedex | <pokémon>',
                                value:
                                            'Searches the pokédex for that pokémon'
                            },
                            {
                                name: '%pokedex | <dexno>',
                                value:
                                            'Searches the pokédex for that dex number'
                            }
                        ],
                        color: 0x7ae576
                    }
                });
                break;

            case 'md':
            case '%md':
            case 'movedex':
            case '%movedex':
                bot.sendMessage({
                    to: channelID,
                    message: null,
                    embed: {
                        author: { name: 'Bot Help' },
                        title: 'Command: %movedex',
                        thumbnail: helpIcon,
                        fields: [
                            {
                                name: 'Usage',
                                value: '**%movedex | <move>**',
                                inline: true
                            },
                            {
                                name: 'Shorthand',
                                value: '**%md**',
                                inline: true
                            },
                            {
                                name: '%movedex | <move>',
                                value: 'Searches the movedex'
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
                        author: { name: 'Bot Help' },
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
                        author: { name: 'Bot Help' },
                        title: 'Command: %randmon',
                        thumbnail: helpIcon,
                        fields: [
                            { name: 'Usage', value: '**%randmon**' },
                            {
                                name: '%randmon',
                                value:
                                            'Generate a random Pokémon (no formes)'
                            }
                        ],
                        color: 0x7ae576
                    }
                });

                break;
            case 'god':
            case '%god':
                bot.sendMessage({
                    to: channelID,
                    message: null,
                    embed: {
                        author: { name: 'Bot Help' },
                        title: 'Command: %god',
                        thumbnail: helpIcon,
                        fields: [
                            { name: 'Usage', value: '**%god**' },
                            {
                                name: '%god',
                                value: 'Send the god of all Pokémon'
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
                        author: { name: 'Bot Help' },
                        title: 'Command List',
                        thumbnail: helpIcon,
                        description:
                                    'Bot: `%help`\nPokémon: `%pokedex`, `%movedex`, `%randmon`\nMisc: `%hello`, `%god`',
                        footer: {
                            text:
                                        'use %help | <command> for command-specific help'
                        },
                        color: 0x7ae576
                    }
                });
            }

            break;
        }
    }
});
