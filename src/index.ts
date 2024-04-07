import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { EventHandler } from 'cmdx'
import { join } from 'path'

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
    Partials.User,
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
    Partials.GuildMember,
  ],
  closeTimeout: 10000,
})

;(() => {
  new EventHandler(client, [
    {
      dir: join(__dirname, 'models'),
      name_override: 'ready'
    },
    {
      dir: join(__dirname, 'events')
    }
  ])

  client.login('OTEyMzI2ODI4NTc0NzczMjk5.G48-_q.Pg58-CHugsv25xVWZmTdvBWK8ByY58R3Ycfxuo')
  // client.login('MTE3NDM3MDQ0MDE2OTM5NDI1Ng.Gu76qU.SfZfpc9X8cv158TDVbd7eVVpf7aY-HEznDIsvg')
})();