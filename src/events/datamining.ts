// import { Event, Events, Utils, g_Prisma } from 'comx'
// import { TextChannel } from 'discord.js'
// import { default as axios } from 'axios'
// import https from 'https'

// const GUILD = '1335656368241119352'
// const CHANNEL = '1340374435294740560'


// const DOTA2_CLIENT_APPID = '570'
// const DOTA2_TEST_APPID = '247040'
// const DOTA2_STAGING_APPID = '2305270'
// const CS2_APPID = ''
// const DEADLOCK_APPID = ''

// const AppIds = [
//     DOTA2_CLIENT_APPID,
//     DOTA2_TEST_APPID,
//     DOTA2_STAGING_APPID,
// ]

// export default {
//     name: Events.ClientReady,
//     dev: true,
//     callback: async (instance) => {
//         AppIds.forEach(appid => {
//             (async () => {
//                 try {
//                     await Main(appid)
//                 } catch (why) {
//                     console.error(why)
//                 }
//             })()
//         })
//     }
// } as Event

// async function Main(appid: string) {
//     while (true) {
//         console.log(appid)
//     }
// }