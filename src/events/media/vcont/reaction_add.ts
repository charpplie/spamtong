import { Event, Events } from 'comx'
import { TextChannel } from 'discord.js'
import { Spamtong } from 'index'
import { VCONT_CHANNELS } from './vcont'

export default {
  name: Events.MessageReactionAdd,
  callback: async (react, user) => {
    if (user.bot) return
    if (!VCONT_CHANNELS.includes(react.message.channelId)) return

    const message = await (Spamtong.client.channels.cache.get(react.message.channelId) as TextChannel).messages.fetch(react.message.id)

    if (!message.content.startsWith(`v${react.message.id}`)) return

    const channel = Spamtong.client.channels.cache.get('1173213492153688098') as TextChannel

    const emoji = react._emoji.id ? `<:${react._emoji.name}:${react._emoji.id}>` : react._emoji.name
    if (emoji === '⭐') return
    await channel.send(`${user.username} поставил реакцию ${emoji} на видео [v${react.message.id}](https://discord.com/channels/${message.guildId}/${message.channelId}/${react.message.id})`)
  }
} as Event