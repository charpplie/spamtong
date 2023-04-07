import 'dotenv/config'
import { GatewayIntentBits, Collection, Events } from 'discord.js'
import { CustomClient, ISlashCommand } from './types'

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

client.slashCommands = new Collection<string, ISlashCommand>()

client.once(Events.ClientReady, async () => {
  const handler = (await import('./cmdx')).default
  await handler(client)
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
})

client.login(process.env.token)
