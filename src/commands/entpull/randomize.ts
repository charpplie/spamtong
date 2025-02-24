import { Command, Utils } from 'comx'
import { CommandInteraction } from 'discord.js'
import { g_Prisma } from 'comx'

export default {
  name: 'randz',
  description: 'randz',
  options: [
    {
      name: 'category',
      name_localizations: {
        ru: 'категория',
      },
      description: 'Из какой категории выбрать объект',
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
  guilds: ['1150427580734906368'],
  callback: async (interaction: CommandInteraction) => {
    await interaction.deferReply()

    const category = interaction.options.get('category')?.value! as string

    const objects = await g_Prisma.activities.findMany({ where: { category: category } })

    if (objects.length > 0) {
      const activity = objects[Utils.Random(objects.length)]

      await interaction.editReply({
        content: `Сегодня я хочу ${category === 'game' ? 'поиграть в' : 'посмотреть'} ${activity.name}. Эту замечательную идею предложил наш любимый пользователь ${interaction.guild?.members.cache.get(activity.creatorId)} <:stonks:1167075410543136869>`
      })
    } else {
      await interaction.editReply({
        content: `Похоже, что вы ничегошеньки не добавили в эту категорию!<:invalid:1168156758586425344>\nВы опечалить спамтона, он хотел весело провести вечер с друзьями ${category === 'game' ? 'в какой-нибудь игрушке' : category === 'film' ? 'за просмотром классного фильма' : 'попивая чай и смотря новый сезон пацанов'}`
      })
      return
    }
  }
} as Command