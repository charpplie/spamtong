import { Event, Events, Utils } from 'comx'
import { EmbedBuilder } from 'discord.js'

const GUILD = '1335656368241119352'
const CHANNEL = '1340374435294740560'

const response_new = [
  'Ого, это что новый рофельный никнейм?',
  'Опа, ребрендинг подъехал!',
  '~~Пидорас~~ Новый ник обнаружен',
]

const emojis_new = [
  '<:ogo:1168156719642333314>',
  '<:stonks:1167075410543136869>',
  '<:krutoi:1168156744237727746>',
  '<:rzhanik:1151897282153824276>',
  '<:pepewow:1168156738638319696>',
  '<:bubilda:1171232710799401060>',
  '<:gigachad:1168156777620189215>'
]

const response_delete = [
  'Мы никогда не забудем это прекрасное имя',
  'В этот день мы потеряли не просто ник, а целую эпоху',
  'Мир уже не будет прежним...',
  'Мирного решения не будет, либо ты возвращаешь ник, либо...',
  'The Flash на TSource-Engine трахнул таймлайн и мы потеряли такой прекрасный никнейм',
  'Никнейм пал, но легенда останется в архивах',
  'Очередная ветвь истории завершена',
  'Всё, теперь ты персонаж прекрасного далеко',
  '*Ник отправился в Better Call Saul Ending*',
  'The ~~heavy~~ nickname is dead'
]

const emojis_delete = [
  '<:roflanpominki:1172648781213343795>',
  '<:invalid:1168156758586425344>',
  '<:chel:1168156795324354650>',
  '<:klas:1168156791977291776>',
  '<:nebubilda:1254795532312776775>'
]

export default {
  name: Events.GuildMemberUpdate,
  dev: true,
  callback: async (instance, Old, New) => {
    if (Old.user.bot) return

    const guild = instance.client.guilds.cache.get(GUILD)!

    if (Old.nickname !== New.nickname) {
      // console.log(Utils.Random(response_delete.length - 1))
      const title = New.nickname === null ? `${response_delete[Utils.Random(response_delete.length - 1)]} ${emojis_delete[Utils.Random(emojis_delete.length - 1)]}` : `${response_new[Utils.Random(response_new.length - 1)]} ${emojis_new[Utils.Random(emojis_new.length - 1)]}`

      const embed = new EmbedBuilder()
        .setColor('DarkPurple')
        .setFooter({ text: `${process.env.copyright}`, iconURL: instance.getOwnerIcon() })
        .setTitle(title)
        // .setAuthor({ name: `${Old.user.id}` })
        .setDescription(`${Old.nickname === null ? `${Old.user.username} ${New.nickname === null ? ` убрал никнейм` : ` сменил имя на ${New.nickname}`}` : `${Old.nickname} (${Old.user.username}) ${New.nickname === null ? ` убрал никнейм` : ` сменил имя на ${New.nickname}`}`}`)

      const channel = guild?.channels.cache.get(CHANNEL)!

      if (!channel || !channel.isTextBased()) return

      await channel.send({
        embeds: [embed]
      })
    }
  }
} as Event