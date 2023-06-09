import { Collection, GatewayIntentBits } from 'discord.js'
import { CustomClient, SlashCommand } from './comx'
import { EventHandler, SlashCommandHandler } from './cmdx'
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
  SlashCommandHandler(client, join(__dirname, 'commands'))
  EventHandler(client, join(__dirname, 'events'))
})()

client.login(process.argv[2])
client.users.send('783443296382746672', 'Ok!')
