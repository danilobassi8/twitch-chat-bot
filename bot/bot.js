const db = require('../database/db');
const config = require('../config');
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
  console.log('UPDATEADO EL REGEX', commandHASH);
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

bot.parseMessage = (metadata) => {
  console.log('//////////// reset //////////////');
  console.log(metadata);
  const command = commandHASH[metadata.command];
  console.log('este es el command', command);

  let finalMessage = [];

  // first, we need to match all variables. Diff btw metadata.command and metadata.message
  splitCommand = metadata.command.split(' ');
  splitMessage = metadata.message.split(' ');

  const MSG_VARS = {};
  splitCommand.forEach((word, index) => {
    // if not a variable, add the same word as in the msg
    if (!(word.startsWith('$(') && word.endsWith(')'))) {
      finalMessage.push(splitMessage[index]);
    } else {
        // check if the variable is  pre-defined
        // if predefined, replace it
        // if not, check is in MSG_VARS
        //    if in MSG_VARS, replace it
        //    if not, add the msg value and replace it
      finalMessage.push('variable');
    }
  });

  console.log('este es el mensaje final', finalMessage);
};

bot.on('message', async (channel, user, message, self) => {
  if (self) return;

  const { exists, command, regex } = bot.checkIfMessageIsValid(message);

  if (!exists) return;

  const parsedMsg = bot.parseMessage({ user, command, regex, message });
  console.log('UN MENSAJE SIGUE UNA LOGICA,', command, regex);

  //   if (commandHASH[message]) {
  //     console.log('existe el value, deberia mandar algo');
  //     return await bot.sendMessage(commandHASH[message]);
  //   }
  console.log('/////');
  console.log(commandHASH[message]);
});

exports.bot = bot;
