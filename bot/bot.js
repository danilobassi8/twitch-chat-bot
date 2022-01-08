const db = require('../database/db');
const config = require('../config');
const replacements = require('./replacements');
const tmi = require('tmi.js');

const bot = new tmi.Client(config.tmi);
let commandHASH = {};

bot.connect().catch(console.error);

bot.sendMessage = function (string) {
  console.log('mandando mensaje');
  setTimeout(() => {
    const message = '[BOT] - ' + string;
    bot.say(config.tmi.channels[0], message);
  }, config.timeout);
};

bot.on('connected', () => {
  console.log('connected');
  // Update commands at start
  commands = db.getData('/commands');
  bot.updateCommands(commands);
});

/** update commandsHASH and add the regex */
bot.updateCommands = function (commands) {
  commandHASH = {};
  commands.forEach((command) => {
    const value = command.value;

    // generates the regex
    const variableRegex = new RegExp(/\$(([^)]*))[)]/g);

    let regex = command.name;
    regex = regex.replace(variableRegex, 'w*');
    commandHASH[command.name] = { value, regex };
  });
};

bot.checkIfMessageIsValid = (message) => {
  /*
    message es el name del commando, ej: !matar @milob8
    tengo que hacer lo siguiente:
    1 - Obtener la regex que corresponde
    2 - ver si existe un comando con esa regex
    3 - devolver el comando parseado

    respuesta: { exists, command, regex, message }
  */

  let regex = '';
  const matched = Object.keys(commandHASH).find((key) => {
    regex = new RegExp(`${commandHASH[key].regex}`, 'g');
    return regex.test(message);
  });

  if (!matched) return { exists: false, command: null, regex: null, message: null };
  return { exists: true, command: matched, regex };
};

bot.parseMessage = async (metadata) => {
  const command = commandHASH[metadata.command];

  let finalMessage = [];

  // first, we need to match all variables. Diff btw metadata.command and metadata.message
  splitCommand = command.value.split(' ');
  splitMessage = metadata.message.split(' ');

  const mappedPromisses = await splitCommand.map(async (word, index) => {
    // if not a variable, add the same word as in the msg
    if (!(word.startsWith('$(') && word.endsWith(')'))) {
      return word;
    } else {
      const replacement = await replacements({
        key: word,
        default: splitMessage[index],
        metadata,
      });
      return replacement;
    }
  });

  const mappedArray = await Promise.all(mappedPromisses);
  return mappedArray.join(' ');
};

bot.on('message', async (channel, user, message, self) => {
  if (self) return;

  const { exists, command, regex } = bot.checkIfMessageIsValid(message);

  if (!exists) return;

  const parsedMsg = await bot.parseMessage({ user, command, regex, message });
  bot.sendMessage(parsedMsg);
  //   if (commandHASH[message]) {
  //     console.log('existe el value, deberia mandar algo');
  //     return await bot.sendMessage(commandHASH[message]);
  //   }
});

exports.bot = bot;
