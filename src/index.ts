import { GatewayIntentBits, Partials } from 'discord.js'
import { Jukai } from './public/classes/jukai'
import { join } from 'path'

const isDev = process.argv.slice(2).includes('--dev')

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
  token: `${process.env.token}`,
  appId: `${process.env.appId}`,
  owner: `${process.env.owner}`,
  isDev: isDev,
  eventsDir:
    [
      {
        dir: join(__dirname, 'models'),
        name_override: 'ready',
        dev: isDev,
      },
      {
        dir: join(__dirname, 'events'),
      },
    ],
})