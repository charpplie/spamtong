import 'dotenv/config'

import { GatewayIntentBits, Collection, Events } from 'discord.js'
import { CustomClient, SlashCommand } from './types'
import { ppSlashCommandHandler } from './cmdx'

const client = new CustomClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  shards: 'auto',
})

client.slashCommands = new Collection<string, SlashCommand>()

client.once(Events.ClientReady, async () => {
  await ppSlashCommandHandler(client)
})

client.login(process.env.token)
