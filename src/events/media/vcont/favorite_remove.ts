import { Event, Events } from 'jukai'
import { VCUser } from 'models/media/vcont_fav'
import { VCONT_CHANNELS } from './vcont'
import { TextChannel } from 'discord.js'

export default {
  name: Events.MessageReactionRemove,
  callback: async ({ client }, react, user) => {
    if (user.bot) return
    if (!VCONT_CHANNELS.includes(react.message.channelId)) return
    if (react._emoji.name !== '⭐') return

    const message = await (client.channels.cache.get(react.message.channelId) as TextChannel).messages.fetch(react.message.id)

    if (!message.content.startsWith(`v${message.id}`)) return

    const dmChannel = client.channels.cache.get(`${(await user.createDM()).id}`) as TextChannel
    const dmMessage = await VCUser.findOne({ where: { guild: `${react.message.guildId}`, user: `${user.id}`, guildId: `${message.id}`}}).catch(() => {})

    if (dmMessage) {
      const id = dmMessage.get('dmId')
      ;(await dmChannel.messages.fetch(`${id}`)).delete()
      await VCUser.destroy({ where: { guild: `${react.message.guildId}`, user: `${user.id}`, guildId: `${message.id}`, dmId: `${id}`}})
    }
  }
} as Event