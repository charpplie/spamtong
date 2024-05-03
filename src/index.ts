import config from '../config.json'
import { GatewayIntentBits, Partials } from 'discord.js'
import { Jukai } from 'jukai'
import { join } from 'path'

const isDev = process.argv.slice(2).includes('--dev')

const bot = isDev ?
  {
    token: config.bot_dev.token,
    appId: config.bot_dev.appId,
    owner: config.bot_dev.owner,
  }
  :
  {
    token: config.bot_prod.token,
    appId: config.bot_prod.appId,
    owner: config.bot_prod.owner,
  }

new Jukai({
  clientOptions: {
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
  bucketOptions: {
    name: config.bucket.name,
    region: config.bucket.region,
    endpoint: config.bucket.endpoint,
    accessKey: config.bucket.accessKey,
    secretKey: config.bucket.secretKey,
  }
})