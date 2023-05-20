import 'dotenv/config'

import { Collection, GatewayIntentBits } from 'discord.js'
import { ppSlashCommandHandler, ppEventHandler } from './cmdx'
import { CustomClient, SlashCommand } from './comx'

const client = new CustomClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.slashCommands = new Collection<string, SlashCommand>()
client.cooldowns = new Collection<string, number>()

;(async () => {
  await ppSlashCommandHandler(client)
  await ppEventHandler(client)
  console.log('Ok!')
})()

client.login(process.env.token)
