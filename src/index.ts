import { Client, Events, GatewayIntentBits, Partials } from 'discord.js'
import { EventHandler, SlashCommandHandler } from 'cmdx'
import { join } from 'path'
import { I18n } from 'i18n'
import 'dotenv/config'

export const i18n = new I18n({
  locales: [
    'en',
    'ru',
  ],
  directory: join(__dirname, '../locales'),
  defaultLocale: 'en',
  retryInDefaultLocale: true,
  objectNotation: true,
  register: global,
  updateFiles: false,
  logWarnFn: function(msg) {
    console.log(msg)
  },
  logErrorFn: function(msg) {
    console.log(msg)
  },
  missingKeyFn: function(locale, value) {
    return value
  },
})

;(() => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
      Partials.Channel,
      Partials.Message,
      Partials.Reaction,
    ],
  })

  new EventHandler(client, [
    {
      dir: join(__dirname, 'events')
    },
    {
      dir: join(__dirname, 'models'),
      name_override: Events.ClientReady,
    },
  ])

  new SlashCommandHandler(client, [join(__dirname, 'commands')])

  client.login(process.env.token)
})()