import { Collection, GatewayIntentBits } from 'discord.js'
import { CustomClient, SlashCommand } from './comx'
import { EventHandler, SlashCommandHandler } from './cmdx'
import { readFileSync } from 'fs'
import { join } from 'path'

enum fields {
  token = 'token',
  appId = 'appId',
  ownId = 'ownId',
  vkToken = 'vkToken',
}

const config = JSON.parse(readFileSync(join(__dirname + '/../config.json'), 'utf-8'))

for (let i = 0; i < Object.keys(fields).length; i++) {
  if (!Object.keys(config).includes(Object.keys(fields)[i])) {
    console.error(`Error: The JSON config does not contain the following field: ${Object.keys(fields)[i]}`)
    process.exit(-1)
  }
}

const client = new CustomClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.commands = new Collection<string, SlashCommand>()
// client.cooldowns = new Collection<string, number>()

;(async () => {
  EventHandler(client, join(__dirname, 'events'))
  SlashCommandHandler(client, join(__dirname, 'commands'))
})()

client.login(config.token)
client.on('ready', () => {client.users.send(String(config.ownId), `Successfully logged in as ${client.user?.tag} at ${(new Date()).toUTCString()}`)})

export default config