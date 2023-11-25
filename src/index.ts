import 'dotenv/config'
import { Collection, GatewayIntentBits } from 'discord.js'
import { EventHandler, SlashCommandHandler } from './cmdx'
import { CustomClient, SlashCommand } from './comx'
import { join } from 'path'

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
client.cooldowns = new Collection<string, number>()

;(async () => {
  EventHandler(client, join(__dirname, 'events'))
  SlashCommandHandler(client, join(__dirname, 'commands'))
})()

client.login(process.env.token)