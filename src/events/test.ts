// import { Event, Events, Utils } from 'comx'
// import SteamUser from 'steam-user'

// const apps = [
//     '570',
//     '2305270',
//     '247040',
//     '1422450',
//     '3488080',
//     '440',
//     '232250',
//     '3488100',
//     '1422460',
//     '247060',
//     '2305290',
//     '373310',
// ]

// export default {
//     name: Events.ClientReady,
//     dev: true,
//     callback: async (instance) => {
//         const user = new SteamUser()
//         user.logOn({ anonymous: true })

//         user.on('loggedOn', async () => {
//             let lastChangeNumber = 0

//             while (true) {
//                 try {
//                     await user.getProductChanges(lastChangeNumber, (err, currentChangeNumber, appChanges) => {
//                         if (err) {
//                             console.error(err)
//                         }

//                         console.log(currentChangeNumber)
//                         // console.log(appChanges)

//                         if (appChanges.length !== 0) {
//                             for (const app of appChanges) {
//                                 if (apps.includes(app.appid.toString())) {
//                                     console.log(`detected ${app.appid} update`)
//                                 }
//                             }
//                         }

//                         lastChangeNumber = currentChangeNumber
//                     })

//                     await Utils.Sleep(10000)
//                 } catch (why) {
//                     console.error(why)
//                 }
//             }
//         })
//     }
// } as Event  