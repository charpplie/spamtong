import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, Interaction, TextChannel } from 'discord.js'
import { Event, Events, Utils } from 'jukai'
import { ICPhoto } from 'models/media/vk/icont'
import { ICPhotoIDs } from 'models/media/vk/icont_lastIds'
import { vk } from './!vk'

const reactButtons = Array.from({ length: 5 }, (_, i) => new ButtonBuilder().setCustomId(`react${i + 1}`).setLabel(`${i + 1}️⃣`).setStyle(ButtonStyle.Secondary))
const row = new ActionRowBuilder().addComponents(...reactButtons)

interface IUserSettings {
  id: string,
  channelOverride?: string,
}

interface IGuildSettings {
  guildId: string,
  channelId: string,
  users: IUserSettings[],
}

const GUILDS: IGuildSettings[] = [
  {
    guildId: '1150427580734906368',
    channelId: '1177374466448302180',
    users: [
      {
        id: '255594607'
      },
    ]
  }
]

const ALBUM_ID = '-15' // Saved photos

export default {
  name: Events.ClientReady,
  callback: async ({ client, instance }) => {
    for (const guild of GUILDS) {
      const _guild = client.guilds.cache.get(guild.guildId)
      if (!_guild) continue

      const channel = _guild.channels.cache.get(guild.channelId)
      if (!channel || !channel.isTextBased() || channel.type !== ChannelType.GuildText) continue

      const embed = new EmbedBuilder()
        .setColor('DarkPurple')
        .setTitle('Новая сохранёнка для ценителей Гигаскусства!')
        .setFooter({ text: `${process.env.copyright}`, iconURL: instance.getOwnerIcon()})
        .setFields(
          { name: 'Rating', value: '0', inline: true },
          { name: 'Total rates', value: '0', inline: true },
        )

      async function main(userId: number, guildId: string, channel: TextChannel) {
        const authors = await vk.api.users.get({ user_id: userId, fields: ['photo_100', 'has_photo', 'counters'] }).catch((why) => { console.error(why) })
        if (!authors) return

        const author = authors[0]

        const authorName = `${author.first_name} ${author.last_name}`
        const authorIcon = `${author.photo_100}`

        const r = await vk.api.photos.get({ owner_id: userId, album_id: ALBUM_ID, rev: 1 }).catch((why) => { console.error(why) })
        if (!r) return

        const lastIds = await ICPhotoIDs.findOne({ where: { guildId: guildId, userId: userId } })
        const lastId = lastIds?.get('lastId') as number
        const lastPhotoId = lastId ? lastId : 0

        const newPhotos = r.items.filter(item => item.id > lastPhotoId).reverse()

        for (const photo of newPhotos) {
          const imageUrl = photo.sizes[photo.sizes.length - 1].url

          const sentMessage = await channel.send({
            embeds: [
              embed
                .setAuthor({ name: authorName, iconURL: authorIcon, url: `https://vk.com/id${userId}` })
                .setFields(
                  { name: 'Rating', value: '0.0', inline: true },
                  { name: 'Total rates', value: '0', inline: true },
                )
                .setImage(imageUrl)
            ],
            components: [row as any]
          })

          await ICPhoto.create({ messageId: sentMessage.id, photoId: photo.post_id })

          if (!(await ICPhotoIDs.findOne({ where: { guildId: guildId, userId: userId } })))
            await ICPhotoIDs.create({ guildId: guildId, userId: userId, lastId: photo.id })
          else
            await ICPhotoIDs.update({ lastId: photo.id }, { where: { guildId: guildId, userId: userId } })

          await Utils.Sleep(1125)
        }
      }

      client.on(Events.InteractionCreate, async (interaction: Interaction) => {
        if (!interaction.isButton() || interaction.channelId !== channel.id) return

        await interaction.deferReply({ ephemeral: true })

        const button = interaction.customId
        if (!button.startsWith('react')) return

        const rating = parseInt(button.charAt(button.length - 1))

        const photo = await ICPhoto.findOne({ where: { messageId: `${interaction.message.id}` } })
        if (!photo) return

        const users: any = photo.get('users')

        if (!users) {
          await ICPhoto.update({ users: { [interaction.user.id]: `${rating}` } }, { where: { messageId: interaction.message.id } })

          embed
            .setAuthor({ name: `${interaction.message.embeds[0].data.author?.name}`, iconURL: `${interaction.message.embeds[0].data.author?.icon_url}`, url: `${interaction.message.embeds[0].data.author?.url}` })
            .setFields(
              { name: 'Rating', value: `${rating}.0`, inline: true },
              { name: 'Total rates', value: '1', inline: true },
            )
            .setImage(`${interaction.message.embeds[0].data.image?.url}`)

          const msg = channel.messages.cache.get(interaction.message.id)
          if (msg) msg.edit({ embeds: [embed] })

          await interaction.editReply(`You rated this photo with ${rating === 1 ? `1 star` : `${rating} stars`}`)
        } else {
          const prevUserRating = users[interaction.user.id] !== undefined ? users[interaction.user.id] : 0

          await ICPhoto.update({ users: { ...users, [interaction.user.id]: users[interaction.user.id] == rating ? 0 : rating } }, { where: { messageId: interaction.message.id } })

          const _photo = await ICPhoto.findOne({ where: { messageId: interaction.message.id } })
          if (!_photo) return

          const _users: any = _photo.get('users')

          const totalRates = Object.values(_users).filter((user: any) => user !== 0).length
          const totalRatesArray = Object.values(_users).map((user: any) => user).filter((rate: number) => rate !== 0)

          const averageRating = totalRatesArray.length === 0 ? 0 : calculateWeightedAverage(totalRatesArray)

          embed
            .setAuthor({ name: `${interaction.message.embeds[0].data.author?.name}`, iconURL: `${interaction.message.embeds[0].data.author?.icon_url}`, url: `${interaction.message.embeds[0].data.author?.url}` })
            .setFields(
              { name: 'Rating', value: `${averageRating.toFixed(1)}`, inline: true },
              { name: 'Total rates', value: `${totalRates}`, inline: true }
            )
            .setImage(`${interaction.message.embeds[0].data.image?.url}`)

          const msg = await channel.messages.fetch(interaction.message.id)
          if (msg) await msg.edit({ embeds: [embed] })

          await interaction.editReply(`${prevUserRating === 0 ? `You rated this photo with ${rating === 1 ? `1 star` : `${rating} stars`}` : `${_users[`${interaction.user.id}`].rate === 0 ? `убрана оценка` : `изменена оценка`}`}`)
        }
      })

      while (true) {
        for (const user of guild.users) {
          await main(parseInt(user.id), guild.guildId, channel)
        }
        await Utils.Sleep(120000)
      }
    }
  }
} as Event

function calculateWeightedAverage(ratings: number[], coefficient: number = 0.7): number {
  let weightedSum = 0
  let weightSum = 0

  for (let i = 0; i < ratings.length; i++) {
    const weight = Math.pow(coefficient, i)
    weightedSum += ratings[i] * weight
    weightSum += weight
  }

  return weightedSum / weightSum
}