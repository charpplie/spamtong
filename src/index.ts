import { GatewayIntentBits, Partials } from 'discord.js'
import { BotManager } from './public/classes/botManager'
import { join } from 'path'

const isDev = process.argv.slice(2).includes('--dev')

const g_Bot = new BotManager({
  sharedOptions: {
    isDev: isDev,
  },
  discordOptions: {
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
    devs: [`${process.env.owner}`],
    commandsDir:
      [
        join(__dirname, 'commands')
      ],
    eventsDir:
      [
        join(__dirname, 'events'),
      ],
  },
  telegramOptions: {
    token: `${process.env.token_tg}`,
    owner: ``,
    devs: [``],
    commandsDir:
      [
        join(__dirname, 'commands_tg')
      ],
    eventsDir:
      [
        join(__dirname, 'events_tg'),
      ],
  }
});