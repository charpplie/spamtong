import { Command } from 'comx'
import { CommandInteraction } from 'discord.js'
import { EntPullModel } from 'models/entpull'

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
  guilds: ['1150427580734906368'],
  callback: async (interaction: CommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })

    const category = interaction.options.get('category')?.value!

    const _obj = await EntPullModel.findAll({ where: { category: category } })

    if (_obj && _obj.length !== 0) {
      let objs: {
        name: string,
        creator: string,
        links: string,
        createdAt: string,
      }[] = []
      for (let i = 0; i < _obj.length; i++) {

        const name: any = _obj[i].get('name')
        const links: any = _obj[i].get('links')
        const creatorId: any = _obj[i].get('creatorId')
        const rawCreatedAt: any = _obj[i].get('createdAt')
        const createdAt = new Date(rawCreatedAt).toLocaleDateString('ru-RU')
        const creator = interaction.guild?.members.cache.get(creatorId)?.user.username!

        objs.push({
          name: name,
          creator: creator,
          links: links,
          createdAt: createdAt,
        })
      }
      


      let response = ''
      for (let i = 0; i < objs.length; i++) {
        response = response + `\nИмя: ${objs[i].name}\nСссылки: ${objs[i].links}\nСоздан: ${objs[i].creator} ${objs[i].createdAt}\n`
      }

      if (response.length > 4000) {
        await interaction.editReply({
          content: 'Упс! Ваш контент получился больше, чем я могу отправить. А мой создатель ленивая скотина, что не сделает эмбеды со страницами. Уж извините!'
        })
      }

      await interaction.editReply({
        content: response
      })
    } else {
      await interaction.editReply({
        content: `Похоже, что вы ничегошеньки не добавили в эту категорию! Вы опечалить спамтона, он хотел весело провести вечер с друзьями ${category === 'game' ? 'в какой-нибудь игрушке' : category === 'film' ? 'за просмотром классного фильма' : 'попивая чай и смотря новый сезон пацанов'}`
      })
    }
  }
} as Command