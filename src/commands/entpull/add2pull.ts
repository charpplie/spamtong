import { Command } from 'comx'
import { CommandInteraction, MessageFlags, TextChannel } from 'discord.js'
import { g_Prisma } from 'comx'

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
      description: 'Ссылки на объект(страница в Steam, страница на Kinopoisk и т.п.)',
      type: 'String',
      required: false,
      maxLength: 500,
    }
  ],
  dm_permission: false,
  guilds: ['1335656368241119352'],
  callback: async (interaction: CommandInteraction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    const category = interaction.options.get('category')?.value! as string
    const name = interaction.options.get('name')?.value! as string
    const nameFmt = name.toLowerCase()
    const links = interaction.options.get('links')?.value! as string

    const obj = await g_Prisma.activities.findFirst({ where: { guildId: interaction.guildId!, category: category, nameFmt: nameFmt } })

    if (obj) {
      await interaction.editReply({
        content: `Похоже, что этот объект уже был добавлен пользователем ${interaction.guild?.members.cache.get(obj.creatorId)} ${new Date(obj.createdAt).toLocaleDateString('ru-RU')}`
      })

      return
    }

    await g_Prisma.activities.create({
      data: {
        guildId: interaction.guildId!,
        creatorId: interaction.user.id,
        name: name,
        nameFmt: nameFmt,
        category: category,
        links: links ? links : ''
      }
    })

    await interaction.editReply('Ваш объект успешно сохранен и будет использован во благо PodStolik! Спасибо за ваш вклад <:respect:1168156721982754947>')

    const channel = interaction.guild?.systemChannel

    if (channel) await channel.send(`Пользователь ${interaction.user.username} добавил объект ${name} в категорию ${category === 'game' ? 'Игры' : category === 'film' ? 'Фильмы' : 'Сериалы'}`)
  }
} as Command