// import { Event, Events, Prisma, Utils } from 'comx'
// import { AppIds, AppInfos } from './!apps'
// import { __scrapVersions } from './!func'
// import { TextChannel } from 'discord.js'
// import SteamUser from 'steam-user'

// const GUILD = '1335656368241119352'

// const CHANNEL_TG = '-1002308379884'

// export default {
//     name: Events.ClientReady,
//     callback: async (instance) => {
//         const guild = instance.client.guilds.cache.get(GUILD)!

//         // const pendingApps = await Prisma.pending_apps.findMany({
//         //     where: {
//         //         OR: [
//         //             {
//         //                 pendingDs: true,
//         //             },
//         //             {
//         //                 pendingTg: true,
//         //             }
//         //         ]
//         //     }
//         // })

//         // if (pendingApps) {
//         //     for (const app of pendingApps) {
//         //         const idx = AppInfos.findIndex(entry => entry.appid === app.appId.toString() || entry.appid_server === app.appId.toString())
//         //         const channel = guild.channels.cache.get(AppInfos[idx].channel) as TextChannel
//         //         const isServer = ServerAppIds.includes(app.appId.toString())
//         //         await __scrapVersions(AppInfos[idx], channel, CHANNEL_TG, isServer)
//         //     }
//         // }

//         const user = new SteamUser()
//         user.logOn({ anonymous: true })

//         user.once('loggedOn', async () => {
//             let obj = await Prisma.cversions.findFirst({ where: { appId: '0' } })

//             let lastChangeNumber = 0

//             if (obj) {
//                 lastChangeNumber = obj.changeNumber!
//             } else {
//                 await Prisma.cversions.create({
//                     data: {
//                         appId: '0',
//                         version: '0',
//                         versionServer: '0',
//                         changeNumber: 0
//                     }
//                 })

//                 obj = await Prisma.cversions.findFirst({ where: { appId: '0' } })
//             }

//             while (true) {
//                 try {
//                     await user.getProductChanges(lastChangeNumber, async (error, currentChangeNumber, appChanges) => {
//                         if (error) {
//                             console.error(error)
//                         }

//                         if (appChanges && appChanges.length !== 0) {
//                             for (const app of appChanges) {
//                                 if (AppIds.includes(app.appid.toString())) {

//                                     let isServer = false
//                                     const idx = AppInfos.findIndex(entry => {
//                                         if (entry.appid === app.appid.toString()) {
//                                             entry.appid === app.appid.toString()
//                                         }

//                                         if (entry.appid_server === app.appid.toString()) {
//                                             entry.appid_server === app.appid.toString()
//                                             isServer = true
//                                         }
//                                     })
//                                     const channel = guild.channels.cache.get(AppInfos[idx].channel) as TextChannel

//                                     await __scrapVersions(AppInfos[idx], channel, CHANNEL_TG, isServer)
//                                 }
//                             }
//                         }

//                         lastChangeNumber = currentChangeNumber
//                         await Prisma.cversions.update({
//                             where: { id: obj!.id, appId: '0' }, data: {
//                                 changeNumber: lastChangeNumber
//                             }
//                         })
//                     })

//                     await Utils.Sleep(10000)
//                 } catch (why) {
//                     console.error(`[${(new Date).toLocaleString()}] ${why}`)
//                 }
//             }
//         })
//     }
// } as Event