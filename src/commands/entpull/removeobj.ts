import { Command } from 'comx'
import { CommandInteraction } from 'discord.js'
import { EntPullModel } from 'models/entpull'

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
  guilds: ['1150427580734906368'],
  callback: async (interaction: CommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })

    const category = interaction.options.get('category')?.value!
    const name = interaction.options.get('name')?.value!

    const _obj = await EntPullModel.findOne({ where: { category: category, name: name } })

    if (_obj) {
      _obj.destroy()
      await interaction.editReply({
        content: `Объект был успешно удален <:roflanpominki:1172648781213343795>. А жаль, я бы еще как-нибудь ${category === 'game'? 'перепрошел' : 'пересмотрел'}`
      })
    } else {
      await interaction.editReply({
        content: 'Ты уверен[?](https://tenor.com/view/sus-cat-sus-cat-suspicious-cat-suspicious-gif-14666859353905804588)'
      })
    }
  }
} as Command