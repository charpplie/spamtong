import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { Spamtong } from './server/handler/spamtong'
import { join } from 'path'
// import 'dotenv/config'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env'})

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
  isDev: false,
  eventsDir:
  [
    {
      dir: join(__dirname, 'client/models'),
      name_override: 'ready'
    },
    {
      dir: join(__dirname, 'client/events')
    }
  ]
})

// export const spamtong = Spamtong.getInstance({
//   client: client,
//   token: `${process.env.token}`,
//   appId: `${process.env.appId}`,
//   owner: `${process.env.owner}`,
//   isDev: true,
//   eventsDir:
//     [
//       {
//         dir: join(__dirname, 'client/models'),
//         name_override: 'ready',
//         dev: true,
//       },
//       {
//         dir: join(__dirname, 'client/events'),
//       },
//     ]
// })