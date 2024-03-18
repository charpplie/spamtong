import { Event, Events } from 'public/event'
import { IVcontFavModel } from 'models/vcont'
import { VCONT_CHANNELS, VCONT_CRITICAL } from './vcont'

export default {
  name: Events.MessageReactionAdd,
  callback: async (client, react, user) => {
    if (user.bot) return
    if (!VCONT_CHANNELS.includes(react.message.channelId)) return
    if (react._emoji.name !== '⭐') return

    const channel = client.channels.cache.get(VCONT_CRITICAL)
    if (!channel || !channel.isTextBased()) return

    const msgChannel = client.channels.cache.get(react.message.channelId)
    if (!msgChannel || !msgChannel.isTextBased()) return

    const message = await msgChannel.messages.fetch(react.message.id)

    if (!message.content.startsWith(`v${message.id}`)) return

    const dmMsg = await user.send(`[v${message.id}](https://discord.com/channels/${message.guildId}/${message.channelId}/${react.message.id}) | [#избранное](${message.attachments.at(0)?.url})`).then ((message: { id: any }) => message.id)
    .catch(() => { channel.send(`<@${user.id}> Не смог отправить вам видева ;(( Откройте, пожалуйста, личные сообщения для простых ботов. Сделать это можно нажав на название сервера -> Настройки конфиденциальности -> Личные сообщения`) })

    const favVid = await IVcontFavModel.findOne({ where: { user: `${user.id}`, guildId: `${message.id}`}})
    if (favVid) {
      const id = favVid.get('dmId')
      const dmChannel = client.channels.cache.get(`${(await user.createDM()).id}`)
      if (!dmChannel || !dmChannel.isTextBased()) return
      ;(await dmChannel.messages.fetch(`${id}`)).delete()
      await IVcontFavModel.destroy({ where: { user: `${user.id}`, guildId: `${message.id}`, dmId: `${id}`}})
    }

    IVcontFavModel.create({
      user: `${user.id}`,
      guildId: `${message.id}`,
      dmId: `${dmMsg}`
    }).catch(() => {})
  }
} as Event