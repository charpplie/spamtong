import { GatewayIntentBits, Partials } from 'discord.js'
import { Jukai } from './public/classes/bot'
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
      GatewayIntentBits.DirectMessages,
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
  commandsDir:
    [
      join(__dirname, isDev? 'dev_commands' : 'commands')
    ],
  eventsDir:
    [
      {
        dir: join(__dirname, 'events'),
      },
    ],
})