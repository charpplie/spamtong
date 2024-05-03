import { ChannelType, EmbedBuilder, TextChannel } from 'discord.js'
import { Event, Events } from 'jukai'
import { GIContModel } from 'models/media/vk/gcont'
import { unlinkSync, createWriteStream } from 'fs'
import { vk } from './!vk'
import axios from 'axios'
import { join } from 'path'

const GUILDS: { guild: string, channel: string, groups: { id: string }[] }[] = [
  {
    guild: '1150427580734906368',
    channel: '1220325347699195965',
    groups: [
      {
        id: '135729590'
      },
    ]
  },
]

export default {
  name: Events.ClientReady,
  callback: async (instance, client) => {
    GUILDS.forEach(async (_guildInfo) => {
      const guild = client.guilds.cache.get(_guildInfo.guild)
      if (!guild) return

      const channel = guild.channels.cache.get(_guildInfo.channel)
      if (!channel || !channel.isTextBased() || channel.type !== ChannelType.GuildText) return

      _guildInfo.groups.forEach(async (group) => {
        async function main(groupId: string, guildId: string, channel: TextChannel) {
          const ownerIcon = client.users.cache.get(`${process.env.owner}`)?.avatarURL({ forceStatic: true })

          const embed = new EmbedBuilder().setColor('DarkPurple').setFooter({ text: `${process.env.copyright}`, iconURL: `${ownerIcon}` })

          const groups = await vk.api.groups.getById({ group_id: groupId, fields: ['photo_100', 'has_photo'] }).catch((why) => { console.error(why) })
          if (!groups) return

          const groupInfo = groups.groups[0]

          const groupName = groupInfo.name
          const groupDomain = groupInfo.screen_name
          const groupHasPhoto = groupInfo.has_photo
          const groupPhoto = groupInfo.photo_100

          let groupIcon: string | undefined
          if (groupHasPhoto) {
            const hash = `${instance.utils.hashCode(groupPhoto)}`
            const photos = await instance.utils.bucket?.fetchObjects()

            if (!photos?.includes(`${groupId}_${hash}.png`)) {
              const filePath = join(__dirname, `${groupId}_${hash}.png`)
              const writer = createWriteStream(filePath)

              const r = await axios({
                url: groupPhoto,
                method: 'GET',
                responseType: 'stream',
              })

              r.data.pipe(writer)

              await new Promise((resolve, reject) => {
                writer.on('finish', resolve)
                writer.on('error', reject)
              })

              const groupIcon = await instance.utils.bucket?.uploadObject(filePath).then(() => {
                unlinkSync(filePath)
              })
            }

            const groupPhotos = photos?.filter((photo: string) => {
              return photo.startsWith(`${groupId}`)
            })

            if (groupPhotos && groupPhotos.length > 1) {
              groupPhotos.forEach(async (photo: string) => {
                if (photo === `${groupId}_${hash}.png`) {
                } else {
                  await instance.utils.bucket?.deleteObject(photo)
                }
              })
            }

            groupIcon = `${process.env.bucketURL}/${process.env.bucketName}/${groupId}_${hash}.png`
          }

          const wall = await vk.api.wall.get({ owner_id: parseInt(groupId), domain: groupDomain, count: 11 }).catch((why) => { console.error(why) })
          if (!wall) return

          const lastId: number = +((await GIContModel.findOne({ where: { guildId: guildId, groupId: groupId } }))?.get('lastId') || 0)

          const newPosts = wall.items.filter(item => item.id > lastId).reverse()

          for (const post of newPosts) {
            if (post.is_pinned) continue

            if (post.attachments[0] === undefined || post.attachments[0].photo === undefined || post.attachments[0].photo.sizes === undefined) continue

            const imageUrl = post.attachments[0].photo?.sizes[post.attachments[0].photo.sizes.length - 1].url

            if (imageUrl) {
              if (groupIcon !== undefined) {
                embed.setAuthor({ name: `${groupName}`, iconURL: `${groupIcon}`, url: `https://vk.com/public${groupId}` })
              } else {
                embed.setAuthor({ name: `${groupName}`, url: `https://vk.com/public${groupId}` })
              }

              if (post.text) {
                embed.setDescription(`${post.text}`)
              } else {
                embed.setDescription(null)
              }

              await channel.send({
                embeds: [embed.setImage(imageUrl)]
              })

              if (!(await GIContModel.findOne({ where: { guildId: guildId, groupId: groupId } })))
                await GIContModel.create({ guildId: guildId, groupId: groupId, lastId: post.id })
              else
                await GIContModel.update({ lastId: post.id }, { where: { guildId: guildId, groupId: groupId } })

              await instance.utils.Sleep(1125)
            }
          }
        }

        while (true) {
          await main(group.id, _guildInfo.guild, channel)
          await instance.utils.Sleep(120000)
        }
      })
    })
  }
} as Event