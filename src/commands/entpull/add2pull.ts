import { Command } from 'comx'
import { CommandInteraction } from 'discord.js'
import { EntPullModel } from 'models/entpull'

export default {
  name: 'add2pull',
  description: 'add2pull',
  options: [
    {
      name: 'category',
      name_localizations: {
        ru: 'категория',
      },
      description: 'В какую категорию добавить объект',
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
      description: 'Имя добавляемого объекта',
      type: 'String',
      required: true,
    },
    {
      name: 'links',
      name_localizations: {
        ru: 'ссылки'
      },
      description: 'Ссылки на объект(страница в Steam, страница на Kinopoisk и т.д.)',
      type: 'String',
      required: false,
    }
  ],
  guilds: ['1150427580734906368'],
  callback: async (interaction: CommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })

    const category = interaction.options.get('category')?.value!
    const name = interaction.options.get('name')?.value!
    const links = interaction.options.get('links')?.value

    const _obj = await EntPullModel.findOne({ where: { category: category, name: name } })

    if (_obj) {
      const creatorId: any = _obj.get('creatorId')
      const createdAt: any = _obj.get('createdAt')
      await interaction.editReply({
        content: `Похоже, что этот объект уже был добавлен пользователем ${interaction.guild?.members.cache.get(creatorId)?.user.username} ${new Date(createdAt).toLocaleDateString('ru-RU')}`
      })

      return
    }

    if (links) {
      EntPullModel.create({
        category: category,
        name: name,
        links: links,
        creatorId: interaction.user.id
      })
    } else {
      EntPullModel.create({
        category: category,
        name: name,
        creatorId: interaction.user.id
      })
    }

    await interaction.editReply('Ваш объект успешно сохранен и будет использован во благо PodStolik! Спасибо за Ваш вклад <:respect:1168156721982754947>')
  }
} as Command