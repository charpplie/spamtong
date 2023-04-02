import 'dotenv/config'
import { Client, GatewayIntentBits, Collection, Events } from 'discord.js'
import { ISlashCommand } from './types'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  shards: 'auto',
})

client.slashCommands = new Collection<string, ISlashCommand>()
client.cooldowns = new Collection<string, number>()

client.once(Events.ClientReady, async c => {
  let handler = require('./cmdx')
  if (handler.default) handler = handler.default
  await handler(c)
})

const reactions = [
  '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣',
]

client.on(Events.MessageCreate, async msg => {
  if (msg.channel.id == '1004117985830649976') {
    if (msg.attachments.size > 0) {
      for (let i = 0; i < reactions.length; i++) {
        msg.react(reactions[i])
      }
    }
  }
})

client.login(process.env.token)
