import { Event } from 'jukai'
import { TextChannel } from 'discord.js'
import { VCONT_CHANNELS } from './vcont'

export default {
  name: 'messageReactionAdd',
  callback: async (client, react, user) => {
    if (user.bot) return
    if (!VCONT_CHANNELS.includes(react.message.channelId)) return

    const message = await (client.channels.cache.get(react.message.channelId) as TextChannel).messages.fetch(react.message.id)

    if (!message.content.startsWith(`v${react.message.id}`)) return

    const channel = client.channels.cache.get('1173213492153688098') as TextChannel

    const emoji = react._emoji.id ? `<:${react._emoji.name}:${react._emoji.id}>` : react._emoji.name
    if (emoji === '⭐') return
    await channel.send(`${user.username} поставил реакцию ${emoji} на видео [v${react.message.id}](https://discord.com/channels/${message.guildId}/${message.channelId}/${react.message.id})`)
  }
} as Event