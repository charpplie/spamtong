import { Client, Events, GatewayIntentBits } from 'discord.js'
import { EventHandler, SlashCommandHandler } from 'cmdx'
import { join } from 'path'

;(() => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
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

  client.login('OTEyMzI2ODI4NTc0NzczMjk5.G48-_q.Pg58-CHugsv25xVWZmTdvBWK8ByY58R3Ycfxuo')
  // client.login('MTE3NDM3MDQ0MDE2OTM5NDI1Ng.Gu76qU.SfZfpc9X8cv158TDVbd7eVVpf7aY-HEznDIsvg')
})()