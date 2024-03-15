import { Client, GatewayIntentBits } from 'discord.js'
import { Jukai } from 'jukai'
import { join } from 'path'

;(() => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMessageReactions,
    ],
  })

  new Jukai(client, {
    eventsDir: join(__dirname, 'events')
  })

  client.login('OTEyMzI2ODI4NTc0NzczMjk5.G48-_q.Pg58-CHugsv25xVWZmTdvBWK8ByY58R3Ycfxuo')
  // client.login('MTE3NDM3MDQ0MDE2OTM5NDI1Ng.Gu76qU.SfZfpc9X8cv158TDVbd7eVVpf7aY-HEznDIsvg')
})()