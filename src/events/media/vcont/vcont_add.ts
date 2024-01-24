import { Event, Events } from 'comx'
import { TextChannel } from 'discord.js'
import { Logger } from 'logger'

const reactions = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
]

const CHANNELS = ['1181427849303965768']

export default {
  name: Events.MessageReactionAdd,
  callback: async (react, user) => {
    if (!CHANNELS.includes(react.message.channelId)) return

    if (user.bot) return

    if (!reactions.includes(react._emoji.name)) return

    const message = await (Logger.client.channels.cache.get(react.message.channelId) as TextChannel).messages.fetch(react.message.id)

    if (!message.content.startsWith(`v${react.message.id}`)) return

    const channel = Logger.client.channels.cache.get('1173213492153688098') as TextChannel

    await channel.send(`${user.username} поставил реакцию ${react._emoji.name} на видео v${react.message.id}`)
  }
} as Event