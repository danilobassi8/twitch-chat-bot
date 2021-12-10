const { EventEmitter } = require('events');
const eventEmitter = new EventEmitter();

/** This handle the logic when commands are updated */
eventEmitter.on('updateCommands', (commands) => {
  console.log(commands);
});

exports.eventEmitter = eventEmitter;
