import { ChannelType, EmbedBuilder, TextChannel } from 'discord.js'
import { Event, Events } from 'public/event'
import { GIContModel } from 'models/gcont'
import { COPYRIGHT } from 'public/vars'
import { Sleep } from 'public/utils'
import { VK } from 'vk-io'

const vk = new VK({ token: `vk1.a.ReFa-HmnP0GQ-hczNzEl-hpwEbtof_DIaQ48XUEZZ_-mEqVpcuh8mWXPafjdLQxPaieARaGOgweakF6UzLBc9bFdLJsNtA7Dn4g7JnejegpwxPwsnTfvWvgwaN6Gs_7_mlcZNc7PnxHRhZeLLmDBEjU7fPFnjOeHjnwoAAlPrsZak6dFd2v6BIllEMQ0DWoVVO-CuJAF_iJir05HJdI8oA` })

const GUILDS: { guild: string, channel: string, groups: { id: string, domain: string }[] }[] = [
  {
    guild: '1150427580734906368',
    channel: '1220325347699195965',
    groups: [
      {
        id: '135729590',
        domain: 'surs_pls',
      }
    ]
  },
]

export default {
  name: Events.ClientReady,
  callback: async (client) => {
    const ownerIcon = client.users.cache.get('783443296382746672')?.avatarURL({ forceStatic: true })

    for (const _guildInfo of GUILDS) {
      const guild = client.guilds.cache.get(_guildInfo.guild)
      if (!guild) continue

      const channel = guild.channels.cache.get(_guildInfo.channel)
      if (!channel || !channel.isTextBased() || channel.type !== ChannelType.GuildText) continue

      for (const group of _guildInfo.groups) {
        const embed = new EmbedBuilder()
          .setColor('DarkPurple')
          .setTitle('Отдельный щитпостинг')
          .setFooter({ text: COPYRIGHT, iconURL: `${ownerIcon}` })

        async function main(id: number, domain: string, guildId: string, channel: TextChannel) {
          const wall = (await vk.api.wall.get({ owner_id: id, domain: domain, count: 1 })).items[0].is_pinned? await vk.api.wall.get({ owner_id: id, domain: domain, count: 1, offset: 1}) : await vk.api.wall.get({ owner_id: id, domain: domain, count: 1 })

          const lastId: number = +((await GIContModel.findOne({ where: { guildId: guildId, groupId: id } }))?.get('lastId') || 0)

          if (wall.items[0].id !== lastId) {
            await channel.send({
              embeds: [
                embed.setImage(wall.items[0].attachments[0].photo.sizes[wall.items[0].attachments[0].photo.sizes.length - 1].url)
              ]
            })

            if (!(await GIContModel.findOne({ where: { guildId: guildId} })))
              await GIContModel.create({ guildId: guildId, groupId: id, lastId: wall.items[0].id })
            else
              await GIContModel.update({ lastId: wall.items[0].id }, { where: { guildId: guildId, groupId: id }})

            await Sleep(2500)
          }
        }

        while (true) {
          await main(parseInt(group.id), group.domain, _guildInfo.guild, channel)
          await Sleep(120000)
        }
      }
    }
  }
} as Event