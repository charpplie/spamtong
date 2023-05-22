import 'dotenv/config'

import { Collection, GatewayIntentBits, TextChannel } from 'discord.js'
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
  const channel = client.channels.cache.get('1058064189610020914') as TextChannel
  channel.send('Ok!')
})()

client.login(process.env.token)
