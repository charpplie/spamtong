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

const CHANNELS = ['1173213492153688098']

export default {
  name: Events.MessageReactionRemove,
  callback: async (react, user) => {
    if (!CHANNELS.includes(react.message.channelId)) return

    if (user.bot) return

    if (!reactions.includes(react._emoji.name)) return

    const channel = Logger.client.channels.cache.get('1173213492153688098') as TextChannel

    await channel.send(`${user.username} убрал реакцию ${react._emoji.name} с видео v${react.message.id}`)
  }
} as Event