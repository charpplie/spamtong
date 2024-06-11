import { Client, GatewayIntentBits} from 'discord.js'

const client1 = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
})

const client2 = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
})

const client3 = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
})

client1.login(process.env.bot1)
client2.login(process.env.bot2)
client3.login(process.env.bot3)