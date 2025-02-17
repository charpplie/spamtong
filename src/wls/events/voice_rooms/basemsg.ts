// import { Event, Events } from 'comx'
// import { ChannelType, EmbedBuilder } from 'discord.js'
// import { existsSync, readFileSync, writeFileSync } from 'fs'
// import { join } from 'path'

// const GUILD = '1335656368241119352' //dev
// const CHANNEL = '1340374435294740560'

// // const GUILD = '1336787298385399830' //prod
// // const CHANNEL = ''

// const FILE = '.wls_vrlastmsg'

// export default {
//   name: Events.ClientReady,
//   dev: true,
//   callback: async (instance) => {
//     const guild = instance.client.guilds.cache.get(GUILD)
//     if (!guild) return

//     const channel = guild.channels.cache.get(CHANNEL)
//     if (!channel || !channel.isTextBased() || channel.type != ChannelType.GuildText) return

//     const embed = new EmbedBuilder().setDescription('Диджей ебан').setColor('Yellow').setFooter({ text: 'test', iconURL: instance.getOwnerIcon() })

//     const isLastMsgExist = existsSync(join(__dirname, FILE))

//     if (isLastMsgExist) {
//       const lastMsg = readFileSync(join(__dirname, FILE))
//       const msg = channel.
//     } else {
//       await channel.send({
//         embeds: [embed]
//       }).then((msg) => {
//         // console.log(msg.id)
//         writeFileSync(join(__dirname, FILE), msg.id)
//       })
//     }
//   }
// } as Event