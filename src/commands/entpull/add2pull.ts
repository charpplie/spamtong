import { Command } from 'comx'
import { CommandInteraction, TextChannel } from 'discord.js'
import { EntPullModel } from 'models/entpull'

const LOG_CHANNEL = '1173213492153688098'

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
      maxLength: 255,
    },
    {
      name: 'links',
      name_localizations: {
        ru: 'ссылки'
      },
      description: 'Ссылки на объект(страница в Steam, страница на Kinopoisk и т.д.)',
      type: 'String',
      required: false,
      maxLength: 500,
    }
  ],
  dev: true,
  guilds: ['1150427580734906368'],
  callback: async (interaction: CommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })

    const category = interaction.options.get('category')?.value!
    const name = interaction.options.get('name')?.value!
    const links = interaction.options.get('links')?.value!

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

    const channel = interaction.guild?.channels.cache.get(LOG_CHANNEL)! as TextChannel

    await channel.send(`Пользователь ${interaction.user.username} добавил объект ${name} в категорию ${category === 'game' ? 'Игры' : category === 'film' ? 'Фильмы' : 'Сериалы'}`)
    await interaction.editReply('Ваш объект успешно сохранен и будет использован во благо PodStolik! Спасибо за Ваш вклад <:respect:1168156721982754947>')
  }
} as Command