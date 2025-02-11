// import { Event, Events, Constants } from 'comx'
// import { VCUser } from 'models/media/vcont_fav'

// export default {
//   name: Events.MessageReactionAdd,
//   callback: async (instance, react, user) => {
//     if (user.bot || !Constants.vcont_channels.includes(react.message.channelId) || react._emoji.name !== '⭐') return

//     const channel = instance.client.channels.cache.get('1173213492153688098')
//     if (!channel || !channel.isTextBased()) return

//     const msgChannel = instance.client.channels.cache.get(react.message.channelId)
//     if (!msgChannel || !msgChannel.isTextBased()) return

//     const message = await msgChannel.messages.fetch(react.message.id)

//     if (!message.content.startsWith(`v${message.id}`)) return

//     const dmMsg = await user.send(`[v${message.id}](https://discord.com/channels/${message.guildId}/${message.channelId}/${react.message.id}) | [#избранное](${message.attachments.at(0)?.url})`).then((message: { id: any }) => message.id)
//       .catch(() => { channel.send(`<@${user.id}> Не смог отправить вам видева ;(( Откройте, пожалуйста, личные сообщения для простых ботов. Сделать это можно нажав на название сервера -> Настройки конфиденциальности -> Личные сообщения`) })

//     const favVid = await VCUser.findOne({ where: { guild: `${react.message.guildId}`, user: `${user.id}` } })
//     if (favVid) {
//       const dmId = favVid.get('dmId')
//       const dmChannel = instance.client.channels.cache.get(`${(await user.createDM()).id}`)
//       if (!dmChannel || !dmChannel.isTextBased()) return
//       await VCUser.destroy({ where: { guild: `${react.message.guildId}`, user: `${user.id}`, guildId: `${message.id}`, dmId: `${dmId}` } })
//       try { (await dmChannel.messages.fetch(`${dmId}`)).delete() } catch (why) { console.error(why) }
//     }

//     VCUser.create({
//       guild: `${react.message.guildId}`,
//       user: `${user.id}`,
//       guildId: `${message.id}`,
//       dmId: `${dmMsg}`
//     }).catch((why) => { console.error(why) })
//   }
// } as Event