import 'dotenv/config'

import { Client, GatewayIntentBits } from 'discord.js'
import Jukai from 'jukai'
import { join } from 'path'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

;(async () => {
  new Jukai({
    client: client,
    eventsDir: join(__dirname, 'events')
  })
})()

client.login(process.env.token)