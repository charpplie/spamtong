// import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, EmbedBuilder } from 'discord.js'
// import { Event, Events } from '../../../comx'
// import { ITEmojiModel } from '../../sys/temoji_db'
// import { TGUILD, TCHANNEL, countEmojis } from './temoji'

// function startDailyTimer(callback: { (): void; (): void }) {
//   const targetHour = 0
//   const targetMinute = 0

//   const timerId = setInterval(() => {
//     const now = new Date()
//     const currentHour = now.getHours()
//     const currentMinute = now.getMinutes()

//     if (currentHour === targetHour && currentMinute === targetMinute) {
//       callback()
//     }
//   }, 60000)

//   return timerId
// }

// export default {
//   name: Events.ClientReady,
//   callback: async (client) => {
//     ITEmojiModel.afterSync(async () =>{
//       const guild = client.guilds.cache.get(TGUILD)
//       const channel = guild.channels.cache.get(TCHANNEL)

//       const emojis = guild.emojis.cache.map((e: any) => {
//         return `${e}`
//       })

//       let emoji_list: any = ''

//       for (let i = 0; i < emojis.length; i++) {
//         const emoji = await ITEmojiModel.findOne({ where: { emoji: emojis[i] }})
//         if (emoji) {
//           emoji_list += `${emoji.get('emoji')}: ${emoji.get('daily_usage')}\n`
//         }
//       }

//       const embeds: EmbedBuilder[] = []
//       const pages: number[] = []

//       for (let i = 0; i < 4; i++) {
//         embeds.push(new EmbedBuilder().setFooter({ text: `${process.env.footer} | Page ${i + 1}`, iconURL: `${process.env.icon}` }))
//       }

//       const getRow = (id: string) => {
//         const row = new ActionRowBuilder()

//         row.addComponents(
//           new ButtonBuilder()
//             .setCustomId('next_embed')
//             .setLabel('▶️')
//             .setStyle(ButtonStyle.Secondary)
//             .setDisabled(pages.length === embeds.length - 1)
//         )

//         row.addComponents(
//             new ButtonBuilder()
//             .setCustomId('prev_embed')
//             .setLabel('◀️')
//             .setStyle(ButtonStyle.Secondary)
//             .setDisabled(pages[id] === 0)
//         )

//         return row
//       }

//       const dailyTimer = startDailyTimer(async () => {
//         await channel.send('Новый день - новый новый')
//         pages[id] = 0
//       })
//     })
//   }
// } as Event