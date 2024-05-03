import { GatewayIntentBits, Partials } from 'discord.js'
import { Jukai } from 'jukai'
import { join } from 'path'

import config from '../config.json'

const isDev = process.argv.slice(2).includes('--dev')

const bot = isDev ?
  {
    token: config.bot.dev.token,
    appId: config.bot.dev.appId,
    owner: config.bot.dev.owner,
  }
  :
  {
    token: config.bot.prod.token,
    appId: config.bot.prod.appId,
    owner: config.bot.prod.owner,
  }

new Jukai({
  client: {
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
  },
  token: bot.token,
  appId: bot.appId,
  owner: bot.owner,
  isDev: isDev,
  eventsDir:
    [
      {
        dir: join(__dirname, 'models'),
        name_override: 'ready',
        dev: isDev
      },
      {
        dir: join(__dirname, 'events')
      },
    ],
})