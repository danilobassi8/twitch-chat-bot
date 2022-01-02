const { EventEmitter } = require('events');
const { bot } = require('./bot');
const eventEmitter = new EventEmitter();

/** This handle the logic when commands are updated */
eventEmitter.on('updateCommands', (commands) => {
  bot.updateCommands(commands);
});

exports.eventEmitter = eventEmitter;
