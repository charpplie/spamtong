import { GatewayIntentBits, Partials } from 'discord.js'
import { Jukai } from 'jukai'
import { join } from 'path'
import dotenv from 'dotenv'

const args = process.argv.slice(2)
const IS_DEV = args.includes('--dev')

dotenv.config({ path: IS_DEV ? '.env' : '../.env' })

new Jukai({
  clientOptions: {
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
  // isDev: IS_DEV,
  eventsDir:
    [
      {
        dir: join(__dirname, 'models'),
        name_override: 'ready',
        dev: IS_DEV
      },
      {
        dir: join(__dirname, 'events')
      },
    ],
  bucketOptions: {
    bucketName: `${process.env.bucketName}`,
    accessKeyId: `${process.env.bucketAccessKey}`,
    secretAccessKey: `${process.env.bucketSecretAccessKey}`,
    endpoint: `${process.env.bucketURL}`,
    region: 'ru-1'
  }
})