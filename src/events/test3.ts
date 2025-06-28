// import axios from 'axios'
// import { Event, Events } from 'comx'
// import { TextChannel, EmbedBuilder } from 'discord.js'

// interface IAppMsgData {
//     newVer: string,
//     oldVer: string,
//     type: MsgType,
//     appId: string,
//     fmtName?: string,
//     isServer?: boolean,
// }

// type MsgType = 'STEAM_API'

// const TgBaseUrl = `https://api.telegram.org/bot${process.env.token_tg}`

// async function sendMsgTg(data: IAppMsgData, chatId: string): Promise<boolean> {
//     try {
//         let msg = ''

//         switch (data.type) {
//             case 'STEAM_API': {
//                 msg = `\`[v]\`  *${data.appId} — ${data.fmtName}${data.isServer ? ' Server' : ''}*  \`${data.oldVer} => ${data.newVer}\``
//                 break
//             }
//         }

//         const r = await axios.post(`${TgBaseUrl}/sendMessage`, {
//             chat_id: chatId,
//             text: msg,
//             parse_mode: 'markdown',
//         })

//         if (r.data.ok) {
//             return true
//         }

//         return false
//     } catch (why) {
//         console.error(why)

//         return false
//     }
// }

// export default {
//     name: Events.ClientReady,
//     dev: true,
//     callback: async (instance) => {
//         const r = await axios.post("https://neftyblocks.com/api/neftydrops/drops", {
//             collection_name: "ranchersland",
//             limit: 50,
//             page: "1",
//             sort_available_first: true,
//             state: "0,2,3"
//         })

//         console.log(r.data)
//         // const msg = '*#steam\_api*\n\`[v]\` *570 — Dota 2*  \`1337 => 1488\`\n*Changelist* [29617033](https://steamdb.info/changelist/29617033/)'
//         // const r = await axios.post(`${TgBaseUrl}/sendMessage`, {
//         //     chat_id: '-1002566844049',
//         //     text: msg,
//         //     parse_mode: 'markdown',
//         //     link_preview_options: {
//         //         is_disabled: true
//         //     }
//         // })
//         // const guild = instance.client.guilds.cache.get('1335656368241119352')
//         // const channel = guild!.channels.cache.get('1340374435294740560') as TextChannel

//         // const embed = new EmbedBuilder()
//         //     .setColor('DarkGreen')

//     }
// } as Event