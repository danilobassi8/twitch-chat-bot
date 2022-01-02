require('dotenv').config();

const config = {
  timeout: 2000,
  port: 3000,
  tmi: {
    options: { debug: false },
    connection: {
      reconnect: true,
      secure: true,
    },
    identity: {
      username: process.env.USERNAME,
      password: process.env.TOKEN,
    },
    channels: [process.env.CHANNEL],
  },
};

module.exports = config;
