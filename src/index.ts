import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { Spamtong } from './server/handler/spamtong'
import { join } from 'path'
import dotenv from 'dotenv'
import os from 'os'

const IS_DEV = os.type() === 'Windows_NT' ? true : false
dotenv.config({ path: IS_DEV ? '.env' : '../.env' })

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
    Partials.GuildMember,
  ],
  closeTimeout: 12000,
})

export const spamtong = Spamtong.getInstance({
  client: client,
  token: `${process.env.token}`,
  appId: `${process.env.appId}`,
  owner: `${process.env.owner}`,
  isDev: IS_DEV,
  eventsDir:
    [
      {
        dir: join(__dirname, 'client/models'),
        name_override: 'ready',
        dev: IS_DEV
      },
      {
        dir: join(__dirname, 'client/events')
      },
    ],
})