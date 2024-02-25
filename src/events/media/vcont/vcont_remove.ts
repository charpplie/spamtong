import { Event, Events } from 'comx'
import { TextChannel } from 'discord.js'
import { Spamtong } from 'index'

const reactions = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
]

const CHANNELS = ['1181427849303965768']

export default {
  name: Events.MessageReactionRemove,
  callback: async (react, user) => {
    if (!CHANNELS.includes(react.message.channelId)) return

    if (user.bot) return

    const message = await (Spamtong.client.channels.cache.get(react.message.channelId) as TextChannel).messages.fetch(react.message.id)

    if (!message.content.startsWith(`v${react.message.id}`)) return

    const channel = Spamtong.client.channels.cache.get('1173213492153688098') as TextChannel

    const emoji = react._emoji.id ? `<:${react._emoji.name}:${react._emoji.id}>` : react._emoji.name
    await channel.send(`${user.username} убрал реакцию ${emoji} с видео v${react.message.id}`)
  }
} as Event