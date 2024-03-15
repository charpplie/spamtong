import { Event } from 'jukai'
import { VCONT_CHANNELS, VCONT_REACTIONS } from './vcont'
import { TextChannel } from 'discord.js'
import { Sleep, fetchMessages } from '../../../utils'

export default {
  name: 'ready',
  callback: async (client) => {
    while (true) {
      VCONT_CHANNELS.forEach(async (_channel) => {
        const channel = client.channels.cache.get(`${_channel}`) as TextChannel
        const messages = await fetchMessages(channel, 1000)
        messages.forEach(message => {
          if (message.member?.user.bot) {
            if (message.member.user.id === client.application?.id) {
              if (message.content.startsWith(`v${message.id}`)) {
                let reactions: string[] = []
                message.reactions.cache.forEach(async (react) => { if (react.emoji.name) reactions.push(react.emoji.name) })
                if (!VCONT_REACTIONS.every(react => reactions.includes(react))) for (let i = 0; i < VCONT_REACTIONS.length; i++) message.react(VCONT_REACTIONS[i])
                reactions = []
              }
            }
          }
        })
      })

      await Sleep(12 * 60 * 60 * 1000)
    }
  }
} as Event