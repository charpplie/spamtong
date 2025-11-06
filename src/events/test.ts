// import { Event, Events, Utils } from 'comx'
// import axios from 'axios'
// import { TextChannel } from 'discord.js'

// const CHANNEL = '-1002566844049'

// const TgBaseUrl = `https://api.telegram.org/bot${process.env.token_tg}`

// export default {
//     name: Events.ClientReady,
//     dev: true,
//     callback: async (instance) => {
//         // const guild = instance.client.guilds.cache.get('1335656368241119352')
//         // const channel = guild?.channels.cache.get('1340374435294740560') as TextChannel

//         // const rDs = await channel.send('test')

//         // const rTg = await axios.post(`${TgBaseUrl}/sendMessage`, {
//         //     chat_id: CHANNEL,
//         //     text: 'test',
//         //     parse_mode: 'markdown',
//         // })

//         // if (rDs && rTg?.data.ok) {
//         //     console.log('Ok')
//         // }

//         console.log(Utils.locale('g.copyright', 'en'))
//     }
// } as Event