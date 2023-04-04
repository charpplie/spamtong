import 'dotenv/config'
import { Client, GatewayIntentBits, Collection, Events, ActivityType } from 'discord.js'
import type { ISlashCommand } from './types'

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  shards: 'auto',
})

client.slashCommands = new Collection<string, ISlashCommand>()
client.cooldowns = new Collection<string, number>()

client.once(Events.ClientReady, async c => {
  const handler = (await import('./cmdx')).default
  await handler(c)
})

const reactions = [
  '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣',
]

client.on(Events.MessageCreate, async msg => {
  if (msg.channel.id === '1004117985830649976' && msg.attachments.size > 0) {
    for (const reaction of reactions) {
      await msg.react(reaction)
    }
  }

  if (msg.channel.id === '659767822917959702' && msg.author.id === '159985870458322944') {
    await msg.channel.send('https://media.discordapp.net/attachments/735082107713355796/1089239410597441607/x7B.gif')
  }
})

client.login(process.env.token)
