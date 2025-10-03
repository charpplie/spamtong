import { GatewayIntentBits, Partials } from 'discord.js'
import { BotManager } from '../../public/classes/botManager'
import { IBotConfig, IConfig } from '../../public/structures/config'
import { join } from 'path'

const isDev = process.argv.slice(2).includes('--dev')

const BotConfig: IBotConfig = {
  isDev: isDev,
  Discord: {
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
    token: `${process.env.token_wls}`,
    appId: isDev ? '1334933369837846548' : '912326828574773299',
    owner: '783443296382746672',
    commandsDir: join(__dirname, 'commands'),
    eventsDir: join(__dirname, 'events'),
    devs: ['783443296382746672', '1350181921946075229']
  },
  Telegram: {
    token: `${process.env.token_tg_wls}`,
    commandsDir: join(__dirname, 'commands_tg'),
    eventsDir: join(__dirname, 'events_tg'),
    devs: '',
  },
}

const g_Bot = new BotManager(BotConfig)

// export const Config: IConfig = {
//   EvO: {
//     Radio: {
//       Discord: {
//         Guild: isDev ? '1335656368241119352' : '1150427580734906368',
//         Channel: isDev ? '1340374435294740560' : '1391480237627412502',
//       },
//       Telegram: {
//         Channel: isDev ? '-1002800988001' : '-4887194388',
//       },
//     },
//     Yt: {
//       Guild: isDev ? '1335656368241119352' : '1150427580734906368',
//       Channel: isDev ? '1340374435294740560' : '1155440414443180032',
//       YtChannels: [
//         '',
//       ]
//     },
//     Vcont: {
//       // Guild: isDev ? '1335656368241119352' : '1150427580734906368',
//       Channel: isDev ? '1340374435294740560' : '1181427849303965768',
//       Reactions: [
//         '1️⃣',
//         '2️⃣',
//         '3️⃣',
//         '4️⃣',
//         '5️⃣',
//         // '⭐',

//       ]
//     }
//   },
//   CmO: {}
// }