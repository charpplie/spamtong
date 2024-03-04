import { EventHandler, FeaturesHandler, SlashCommandHandler } from './public/cmdx'
import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { join } from 'path'
import 'dotenv/config'

;(() => {
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
      Partials.Channel,
      Partials.Message,
      Partials.Reaction,
    ],
  })

  EventHandler(client, join(__dirname, 'events'))
  FeaturesHandler(client, join(__dirname, 'models'))
  // SlashCommandHandler(client, join(__dirname, 'commands'))

  client.login(process.env.token)
})()

interface IAppInfo {
  appId: string,
  owner: string,
}

export const AppInfo: IAppInfo = {
  appId: `${process.env.appId}`,
  owner: `${process.env.owner}`,
}