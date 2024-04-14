import { Event, Events } from 'index'

const GUILD = '1150427580734906368'
const CHANNEL = '1204439974766706698'

export default {
  name: Events.GuildMemberUpdate,
  callback: async (client, Old, New) => {
    if (Old.user.bot) return
 
    if (Old.nickname !== New.nickname) {
      const guild = client.guilds.cache.get(GUILD)
      const channel = guild?.channels.cache.get(CHANNEL)
      if (!channel || !channel.isTextBased()) return

      await channel.send({
        content: `${new Date()} | ${Old.nickname === null? `${Old.user.username} ${New.nickname === null ? ` убрал никнейм` : ` сменил имя на ${New.nickname}`}` : `${Old.nickname} (${Old.user.username}) ${New.nickname === null ? ` убрал никнейм` : ` сменил имя на ${New.nickname}`}`}`
      })
    }
  }
} as Event