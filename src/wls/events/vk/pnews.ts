import { Event, Events, Utils } from 'comx'
import { ChannelType, EmbedBuilder, TextChannel } from 'discord.js'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { vk } from './!vk'
import { WallWallpostFull } from 'vk-io/lib/api/schemas/objects'

const NEWS_GUILD = '1335656368241119352' //dev
const NEWS_CHANNEL = '1340374435294740560'

// const NEWS_GUILD = '1336787298385399830' //prod
// const NEWS_CHANNEL = ''

// const VK_GROUP = 'lspamtongdevpub' //dev

const VK_GROUP = '169055861' //prod

const FILE = '.wls_lastpost'

export default {
  name: Events.ClientReady,
  dev: true,
  callback: async (instance) => {
    const guild = instance.client.guilds.cache.get(NEWS_GUILD)
    if (!guild) return

    const channel = guild.channels.cache.get(NEWS_CHANNEL)
    if (!channel || !channel.isTextBased() || channel.type !== ChannelType.GuildText) return

    const embed = new EmbedBuilder().setColor('Yellow').setFooter({ text: 'test', iconURL: instance.getOwnerIcon() })

    const group = await vk.api.groups.getById({ group_id: VK_GROUP }).catch((why) => { console.error(why) })
    if (!group) return

    const groupInfo = group.groups[0]

    const groupName = groupInfo.name
    const groupDomain = groupInfo.screen_name

    async function main(groupId: string, guildId: string, channel: TextChannel, depth: number) {
      const wall = await vk.api.wall.get({ owner_id: parseInt(groupId), domain: groupDomain, count: depth }).catch((why) => { console.error(why) })
      if (!wall || wall.count == 0) return

      // const processedText = wall.items[0].text.replace(/\[\*\|(\*)\]/g, '[*]($1)')

      embed.setDescription(`${wall.items[5].text}`)

      const isFirstLaunch = !existsSync(join(__dirname, `${FILE}`))

      // if (isFirstLaunch) {
      //   if (wall.items.length == 1 && depth == 1) {
      //     if (wall.items[0].is_pinned) {
      //       await main(groupId, guildId, channel, depth + 1)
      //       return
      //     }
      //     else
      //     formatEmbed(embed, wall.items[0])
      //   }
      //   else
      //     formatEmbed(embed, wall.items[1])
      // } else {

      // }

      await channel.send({
        embeds: [embed]
      })


      // if (wall[0].is_pinned && wall[0].date < lastPost.date)
    }

    while (true) {
      await main(VK_GROUP, NEWS_GUILD, channel, 6)
      await Utils.Sleep(15000)
    }
  }
} as Event

function formatEmbed(embed: EmbedBuilder, post: WallWallpostFull): EmbedBuilder {
  embed.setDescription(post.text)

  return embed
}