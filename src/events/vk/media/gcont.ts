import { ChannelType, EmbedBuilder, TextChannel } from 'discord.js'
import { Event, Events } from 'public/event'
import { GIContModel } from 'models/gcont'
import { COPYRIGHT, IMGUR } from 'public/vars'
import { Sleep } from 'public/utils'
import { VK } from 'vk-io'
import axios from 'axios'
import { writeFileSync, readFileSync, unlinkSync } from 'fs'

const vk = new VK({ token: `vk1.a.ReFa-HmnP0GQ-hczNzEl-hpwEbtof_DIaQ48XUEZZ_-mEqVpcuh8mWXPafjdLQxPaieARaGOgweakF6UzLBc9bFdLJsNtA7Dn4g7JnejegpwxPwsnTfvWvgwaN6Gs_7_mlcZNc7PnxHRhZeLLmDBEjU7fPFnjOeHjnwoAAlPrsZak6dFd2v6BIllEMQ0DWoVVO-CuJAF_iJir05HJdI8oA` })

const GUILDS: { guild: string, channel: string, groups: { id: string, domain: string }[] }[] = [
  {
    guild: '1150427580734906368',
    channel: '1220325347699195965',
    groups: [
      {
        id: '135729590',
        domain: 'surs_pls',
      },
    ]
  },
]

async function uploadToImgur(accessToken: string, filename: string) {
  try {
    const response = await axios.post(
      'https://api.imgur.com/3/image',
      {
        image: readFileSync(filename, 'base64'),
        type: 'base64',
      },
      {
        headers: {
          Authorization: `Client-ID ${accessToken}`,
        },
      }
    )
    return response.data.data.link
  } catch (why) {}
}

export default {
  name: Events.ClientReady,
  callback: async (client) => {
    const ownerIcon = client.users.cache.get('783443296382746672')?.avatarURL({ forceStatic: true })

    GUILDS.forEach(async (_guildInfo) => {
      const guild = client.guilds.cache.get(_guildInfo.guild)
      if (!guild) return

      const channel = guild.channels.cache.get(_guildInfo.channel)
      if (!channel || !channel.isTextBased() || channel.type !== ChannelType.GuildText) return

      _guildInfo.groups.forEach(async (group) => {
        const groupInfo = await vk.api.groups.getById({ group_id: group.id, fields: ['photo_100']})
        const groupName = groupInfo.groups[0].name

        const r = await axios.get(groupInfo.groups[0].photo_100, { responseType: 'arraybuffer' })
        const fileData = Buffer.from(r.data, 'binary')
        writeFileSync(`${group.id}.png`, fileData)
        const groupIcon = await uploadToImgur(IMGUR, `${group.id}.png`)
        unlinkSync(`${group.id}.png`)

        const embed = new EmbedBuilder().setColor('DarkPurple').setFooter({ text: COPYRIGHT, iconURL: `${ownerIcon}` })

        async function main(id: number, domain: string, guildId: string, channel: TextChannel) {
          const wall = await vk.api.wall.get({ owner_id: id, domain: domain, count: 11 })

          const lastId: number = +((await GIContModel.findOne({ where: { guildId: guildId, groupId: id } }))?.get('lastId') || 0)

          const newPosts = wall.items.filter(item => item.id > lastId).reverse()

          for (const post of newPosts) {
            if (post.is_pinned) continue

            if (post.attachments[0] === undefined || post.attachments[0].photo === undefined || post.attachments[0].photo.sizes === undefined) continue

            const imageUrl = post.attachments[0].photo?.sizes[post.attachments[0].photo.sizes.length - 1].url

            if (imageUrl) {
              await channel.send({
              embeds: [
                post.text?
                embed
                  .setAuthor({ name: `${groupName}`, iconURL: groupIcon, url: `https://vk.com/public${id}`})
                  .setDescription(`${post.text}`)
                  .setImage(imageUrl)
                :
                embed
                  .setAuthor({ name: `${groupName}`, iconURL: groupIcon, url: `https://vk.com/public${id}`})
                  .setImage(imageUrl)
              ]
            })

            if (!(await GIContModel.findOne({ where: { guildId: guildId, groupId: id } })))
              await GIContModel.create({ guildId: guildId, groupId: id, lastId: post.id })
            else
              await GIContModel.update({ lastId: post.id }, { where: { guildId: guildId, groupId: id }})

            await Sleep(1125) 
            }
          }
        }

        while (true) {
          await main(parseInt(group.id), group.domain, _guildInfo.guild, channel)
          await Sleep(120000)
        }
      })
    })
  }
} as Event