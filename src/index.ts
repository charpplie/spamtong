import { EventHandler, SlashCommandHandler } from './public/cmdx'
import { Client, Events, GatewayIntentBits, Partials } from 'discord.js'
import { join } from 'path'
import 'dotenv/config'

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

  // new SlashCommandHandler(client, [join(__dirname, 'commands')])

  client.login(process.env.token)
})()