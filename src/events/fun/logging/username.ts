import { Event, Events, Constants } from 'comx'

export default {
  name: Events.GuildMemberUpdate,
  callback: async (instance, Old, New) => {
    if (Old.user.bot) return

    if (Old.nickname !== New.nickname) {
      const guild = instance.client.guilds.cache.get(Constants.funlog_guild)
      const channel = guild?.channels.cache.get(Constants.funlog_channel)
      if (!channel || !channel.isTextBased()) return

      await channel.send({
        content: `${new Date()} | ${Old.nickname === null ? `${Old.user.username} ${New.nickname === null ? ` убрал никнейм` : ` сменил имя на ${New.nickname}`}` : `${Old.nickname} (${Old.user.username}) ${New.nickname === null ? ` убрал никнейм` : ` сменил имя на ${New.nickname}`}`}`
      })
    }
  }
} as Event