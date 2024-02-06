import { Event, Events } from 'comx'
import { TextChannel } from 'discord.js'
import { Logger } from 'logger'

const GUILD = '1150427580734906368'
const CHANNEL = '1204439974766706698'

export default {
  name: Events.GuildMemberUpdate,
  callback: async (Old, New) => {
    if (Old.user.bot) return

    if (Old.nickname !== New.nickname) {
      const guild = Logger.client.guilds.cache.get(GUILD)
      const channel = guild?.channels.cache.get(CHANNEL) as TextChannel

      await channel.send({
        content: `${new Date()} | ${Old.nickname === null? `${Old.user.username} ${New.nickname === null ? ` убрал никнейм` : ` сменил имя на ${New.nickname}`}` : `${Old.nickname} (${Old.user.username}) ${New.nickname === null ? ` убрал никнейм` : ` сменил имя на ${New.nickname}`}`}`
      })
    }
  }
} as Event