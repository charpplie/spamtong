import { Command } from 'comx'
import { CommandInteraction, MessageFlags, TextChannel } from 'discord.js'
import { g_Prisma } from 'comx'

export default {
  name: 'removeobj',
  description: 'removeobj',
  options: [
    {
      name: 'category',
      name_localizations: {
        ru: 'категория',
      },
      description: 'Из какой категории удалить объект',
      type: 'String',
      required: true,
      choices: [
        {
          name: 'Игры',
          value: 'game'
        },
        {
          name: 'Фильмы',
          value: 'film'
        },
        {
          name: 'Сериалы',
          value: 'tvshow'
        }
      ]
    },
    {
      name: 'name',
      name_localizations: {
        ru: 'имя'
      },
      description: 'Имя удаляемого объекта',
      type: 'String',
      required: true,
    },
  ],
  dm_permission: false,
  guilds: ['1150427580734906368'],
  callback: async (interaction: CommandInteraction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    const category = interaction.options.get('category')?.value! as string
    const name = (interaction.options.get('name')?.value! as string).toLowerCase()

    const obj = await g_Prisma.activities.findFirst({ where: { guildId: interaction.guildId!, category: category, name: name } })

    const channel = interaction.guild?.systemChannel

    if (obj) {
      if (interaction.user.id != obj.creatorId) {
        if (channel)
          await channel.send(`Пользователь ${interaction.user.username} попытался убрать объект ${name} из категории ${category === 'game' ? 'Игры' : category === 'film' ? 'Фильмы' : 'Сериалы'} <:hmmmm:1168156798495244329>`)
        await interaction.editReply({
          content: 'https://tenor.com/view/kenny-south-park-acess-denied-denied-sky-gif-14035528'
        })

        return
      } else {
        await g_Prisma.activities.delete({ where: { id: obj.id } })
        await interaction.editReply({
          content: `Объект был успешно удален <:roflanpominki:1172648781213343795>. А жаль, я бы еще как-нибудь ${category === 'game' ? 'перепрошел' : 'пересмотрел'}`
        })
      }
    } else {
      await interaction.editReply({
        content: 'Ты уверен[?](https://tenor.com/view/sus-cat-sus-cat-suspicious-cat-suspicious-gif-14666859353905804588)'
      })

      return
    }
  }
} as Command