import { IConfig } from './public/structures/config'

const isDev = process.argv.slice(2).includes('--dev')

export const Config: IConfig = {
  EvO: {
    Radio: {
      Discord: {
        Guild: isDev ? '1335656368241119352' : '1150427580734906368',
        Channel: isDev ? '1340374435294740560' : '1391480237627412502',
      },
      Telegram: {
        Channel: isDev ? '-1002800988001' : '-4887194388',
      },
    },
    // Yt: {
    //   Guild: isDev ? '1335656368241119352' : '1150427580734906368',
    //   Channel: isDev ? '1340374435294740560' : '1155440414443180032',
    //   YtChannels: [
    //     '',
    //   ]
    // },
    Vcont: {
      // Guild: isDev ? '1335656368241119352' : '1150427580734906368',
      Channel: isDev ? '1340374435294740560' : '1181427849303965768',
      Reactions: [
        '1️⃣',
        '2️⃣',
        '3️⃣',
        '4️⃣',
        '5️⃣',
        // '⭐',

      ]
    }
  },
  CmO: {}
}