require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const loadCommands = require('./src/handlers/commandHandler');
const loadEvents = require('./src/handlers/eventHandler');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Map();

loadCommands(client);
loadEvents(client);

client.login(process.env.TOKEN);