import { Event, Events, Constants } from 'comx'
import { TextChannel } from 'discord.js'

export default {
  name: Events.MessageReactionAdd,
  callback: async (instance, react, user) => {
    if (user.bot || !Constants.vcont_channels.includes(react.message.channelId)) return

    const message = await (instance.client.channels.cache.get(react.message.channelId) as TextChannel).messages.fetch(react.message.id)

    if (!message.content.startsWith(`v${react.message.id}`)) return

    const channel = instance.client.channels.cache.get('1173213492153688098') as TextChannel

    const emoji = react._emoji.id ? `<:${react._emoji.name}:${react._emoji.id}>` : react._emoji.name
    if (emoji === '⭐') return
    await channel.send(`${user.username} поставил реакцию ${emoji} на видео [v${react.message.id}](https://discord.com/channels/${message.guildId}/${message.channelId}/${react.message.id})`)
  }
} as Event