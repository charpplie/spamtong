import { Event, Events } from 'jukai'
import { VCONT_CHANNELS, VCONT_REACTIONS } from './vcont'
import { TextChannel } from 'discord.js'

export default {
  name: Events.ClientReady,
  callback: async (instance, client) => {
    while (true) {
      VCONT_CHANNELS.forEach(async (_channel) => {
        const channel = client.channels.cache.get(`${_channel}`) as TextChannel
        const messages = await instance.utils.fetchMessages(channel, 1000)
        messages.forEach(message => {
          if (!message.member?.user.bot) return
          if (message.member.user.id !== client.application?.id) return
          if (message.content.startsWith(`v${message.id}`)) {
            let reactions: string[] = []
            message.reactions.cache.forEach(async (react) => { if (react.emoji.name) reactions.push(react.emoji.name) })
            if (!VCONT_REACTIONS.every(react => reactions.includes(react))) for (let i = 0; i < VCONT_REACTIONS.length; i++) message.react(VCONT_REACTIONS[i])
            reactions = []
          }
        })
      })

      await instance.utils.Sleep(12 * 60 * 60 * 1000)
    }
  }
} as Event