# Resume

This is a simple twitch chat bot made with Node.js and Vue.

# Idea
The idea is simple, I wanted to create a light-weight bot to help newbie streamers to organize their commands.
Every time a command is updated via the web page, the bot will change its command definition and will respond as the bot's owner indicates.

The commands are stored in a JSON database for now, but I will improve this later. 

You can contact me to request some ideas or new features, **but keep in mind that this is a hobby project.** 

## Requirements

Only [Node.js](https://nodejs.org/en/). The Vue app is using a CDN for now.

## Installation

You will need to define some environment variables before start using the bot. Please go to the root directory of this project and create a `.env` file.
There, you'll need to define 3 variables:

```bash

# The channel you want the bot to be
CHANNEL=exampleChannel
# aut token from https://twitchapps.com/tmi
TOKEN=InsertTokenHere
# username
USERNAME=username

```
Then, go to the root directory and run `npm install`

### Starting the bot
After all packages are installed, you can run `npm run dev` to start the bot.

*Notes: I will add an `npm run start` when the project get bigger and more serious.*
