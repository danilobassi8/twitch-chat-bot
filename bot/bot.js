const config = require('../config');
const tmi = require('tmi.js');

const client = new tmi.Client(config.tmi);
client.connect().catch(console.error);

const sendMessage = (string) => {
  setTimeout(() => {
    const message = '[BOT] - ' + string;
    client.say(config.tmi.channels[0], message);
  }, config.timeout);
};

client.on('connected', () => {
});
