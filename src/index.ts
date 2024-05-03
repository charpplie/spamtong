import config from '../config.json'
import { GatewayIntentBits, Partials } from 'discord.js'
import { Jukai } from 'jukai'
import { join } from 'path'

const bot = config.dev ?
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
  isDev: config.dev,
  eventsDir:
    [
      {
        dir: join(__dirname, 'models'),
        name_override: 'ready',
        dev: config.dev
      },
      {
        dir: join(__dirname, 'events')
      },
    ],
  // featuresDir:
  //   [
  //     {
  //       dir: join(__dirname, 'features'),
  //       dev: config.dev
  //     }
  //   ],
  bucketOptions: {
    name: config.bucket.name,
    region: config.bucket.region,
    endpoint: config.bucket.endpoint,
    accessKey: config.bucket.accessKey,
    secretKey: config.bucket.secretKey,
  }
})