// import { Event, Events, Utils, Constants } from 'comx'
// import { TextChannel } from 'discord.js'

// export default {
//   name: Events.ClientReady,
//   callback: async (instance) => {
//     while (true) {
//       Constants.vcont_channels.forEach(async (_channel) => {
//         const channel = instance.client.channels.cache.get(`${_channel}`) as TextChannel
//         const messages = await Utils.fetchMessages(channel, 1000)
//         messages.forEach(message => {
//           if (!message.member?.user.bot) return
//           if (message.member.user.id !== instance.client.application?.id) return
//           if (message.content.startsWith(`v${message.id}`)) {
//             let reactions: string[] = []
//             message.reactions.cache.forEach(async (react) => { if (react.emoji.name) reactions.push(react.emoji.name) })
//             if (!Constants.vcont_reacts.every(react => reactions.includes(react))) for (let i = 0; i < Constants.vcont_reacts.length; i++) message.react(Constants.vcont_reacts[i])
//             reactions = []
//           }
//         })
//       })

//       await Utils.Sleep(12 * 60 * 60 * 1000)
//     }
//   }
// } as Event