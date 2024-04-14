import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { Spamtong } from './public/spamtong'
import { join } from 'path'

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

// export const spamtong = Spamtong.getInstance({
//   client: client,
//   token: 'OTEyMzI2ODI4NTc0NzczMjk5.G48-_q.Pg58-CHugsv25xVWZmTdvBWK8ByY58R3Ycfxuo',
//   appId: '912326828574773299',
//   owner: '783443296382746672',
//   isDev: false,
//   eventsDir:
//   [
//     {
//       dir: join(__dirname, 'models'),
//       name_override: 'ready'
//     },
//     {
//       dir: join(__dirname, 'events')
//     }
//   ]
// })

export const spamtong = Spamtong.getInstance({
  client: client,
  token: 'MTE3NDM3MDQ0MDE2OTM5NDI1Ng.Gu76qU.SfZfpc9X8cv158TDVbd7eVVpf7aY-HEznDIsvg',
  appId: '1174370440169394256',
  owner: '783443296382746672',
  isDev: true,
  eventsDir:
  [
    // {
    //   dir: join(__dirname, 'models'),
    //   name_override: 'ready',
    //   dev: true,
    // },
    {
      dir: join(__dirname, 'test'),
      dev: true,
    },
    // {
    //   dir: join(__dirname, 'events')
    // }
  ],
  // commandsDir:
  // [
  //   join(__dirname, 'commands')
  // ]
})