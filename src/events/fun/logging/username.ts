import { Event, Events, Constants } from 'comx'
import { EmbedBuilder } from 'discord.js'

export default {
  name: Events.GuildMemberUpdate,
  callback: async (instance, Old, New) => {
    if (Old.user.bot) return

    if (Old.nickname !== New.nickname) {
      const title = `${Old.nickname === null ? `${New.nickname === null ? ` Мы никогда не забудем это прекрасное имя <:roflanpominki:1172648781213343795>` : ` Ого, это что новый рофельный никнейм? <:ogo:1168156719642333314>`}` : `${New.nickname === null ? ` Мы никогда не забудем это прекрасное имя <:roflanpominki:1172648781213343795>` : ` Ого, это что новый рофельный никнейм? <:ogo:1168156719642333314>`}`}`
      const embed = new EmbedBuilder()
        .setColor('DarkPurple')
        .setFooter({ text: `${Constants.copyright}`, iconURL: instance.getOwnerIcon() })
        .setTitle(title)
        .setTimestamp()
        .setAuthor({ name: `${Old.user.id}` })
        .setDescription(`**${Old.nickname === null ? `${Old.user.username} ${New.nickname === null ? ` убрал никнейм` : ` сменил имя на ${New.nickname}`}` : `${Old.nickname} (${Old.user.username}) ${New.nickname === null ? ` убрал никнейм` : ` сменил имя на ${New.nickname}`}`}**`)

      const guild = instance.client.guilds.cache.get(Constants.funlog_guild)!
      const channel = guild?.channels.cache.get(Constants.funlog_channel)!

      if (!channel || !channel.isTextBased()) return

      await channel.send({
        embeds: [embed]
      })
    }
  }
} as Event