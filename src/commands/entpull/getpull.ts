import { Command } from 'comx'
import { CommandInteraction, MessageFlags } from 'discord.js'
import { Prisma } from 'comx'

export default {
  name: 'getpull',
  description: 'getpull',
  options: [
    {
      name: 'category',
      name_localizations: {
        ru: 'категория',
      },
      description: 'Какую категорию просмотреть',
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
  ],
  dm_permission: false,
  guilds: ['1150427580734906368'],
  callback: async (interaction: CommandInteraction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    const category = interaction.options.get('category')?.value! as string

    const objects = await Prisma.activities.findMany({ where: { guildId: interaction.guildId!, category: category } })

    if (objects.length == 0) {
      await interaction.editReply({
        content: `Похоже, что вы ничегошеньки не добавили в эту категорию! Вы опечалить спамтона, он хотел весело провести вечер с друзьями ${category === 'game' ? 'в какой-нибудь игрушке' : category === 'film' ? 'за просмотром классного фильма' : 'попивая чай и смотря новый сезон пацанов'}`
      })

      return
    } else {
      let response = ''
      for (let i = 0; i < objects.length; i++) {
        response = response + `\nИмя: ${objects[i].name}${objects[i].links == ''? '' : `\nСссылки: ${objects[i].links}`}\nСоздан: ${interaction.guild?.members.cache.get(objects[i].creatorId)} ${new Date(objects[i].createdAt).toLocaleDateString('ru-RU')}\n`
      }

      await interaction.editReply({
        content: response
      })
    }
  }
} as Command