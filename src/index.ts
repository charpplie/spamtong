import 'dotenv/config'

import { GatewayIntentBits } from 'discord.js'
import { CustomClient } from './comx'
import { EventHandler } from './cmdx'

const client = new CustomClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

;(async () => {
  EventHandler(client)
})()

client.login(process.env.token)
client.users.send('783443296382746672', 'Ok!')