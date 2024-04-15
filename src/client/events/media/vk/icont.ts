import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, Interaction, TextChannel } from 'discord.js'
import { Event, Events } from 'public/comx'
import { Sleep } from 'public/utils'
import { ICPhoto } from 'models/media/icont'
import { vk } from './!vk'

const reactButtons = Array.from({ length: 5 }, (_, i) => new ButtonBuilder().setCustomId(`react${i + 1}`).setLabel(`${i + 1}️⃣`).setStyle(ButtonStyle.Secondary))
const row = new ActionRowBuilder().addComponents(...reactButtons)

const GUILDS: { guild: string, channel: string, users: string[] }[] = [
  {
    guild: '1150427580734906368',
    channel: '1177374466448302180',
    users: ['255594607'],
  },
]

const ALBUM_ID = '-15' // Saved photos

export default {
  name: Events.ClientReady,
  callback: async (client) => {
    const ownerIcon = client.users.cache.get('783443296382746672')?.avatarURL({ forceStatic: true })

    for (const _guildInfo of GUILDS) {
      const guild = client.guilds.cache.get(_guildInfo.guild)
      if (!guild) continue

      const channel = guild.channels.cache.get(_guildInfo.channel)
      if (!channel || !channel.isTextBased() || channel.type !== ChannelType.GuildText) continue

      for (const user of _guildInfo.users) {
        const author = await vk.api.users.get({ user_id: user, fields: ['photo_100'] }).catch((why) => {})
        if (!author) return
        const authorName = `${author[0].first_name} ${author[0].last_name}`
        const authorIcon = `${author[0].photo_100}`

        const embed = new EmbedBuilder()
          .setColor('DarkPurple')
          .setTitle('Новая сохранёнка для ценителей Гигаскусства!')
          .setAuthor({ name: authorName, iconURL: authorIcon, url: `https://vk.com/id${user}` })
          .setFooter({ text: `${process.env.copyright}`, iconURL: `${ownerIcon}` })
          .setFields(
            { name: 'Rating', value: '0', inline: true },
            { name: 'Total rates', value: '0', inline: true },
          )

        async function main(ownerId: number, guildId: string, channel: TextChannel) {
          const r = await vk.api.photos.get({ owner_id: ownerId, album_id: ALBUM_ID, rev: 1 }).catch((why) => {})
          if (!r) return

          const lastPhotoId: number = +((await ICPhoto.findOne({ where: { messageId: `g${guildId}` } }))?.get('photoId') || 0)

          const newPhotos = r.items.filter(item => item.id > lastPhotoId).reverse()

          for (const photo of newPhotos) {
            const imageUrl = photo.sizes[photo.sizes.length - 1].url

            const sentMessage = await channel.send({
              embeds: [
                embed
                  .setFields(
                    { name: 'Rating', value: '0', inline: true },
                    { name: 'Total rates', value: '0', inline: true },
                  )
                  .setImage(imageUrl)
              ],
              components: [row as any]
            })

            await ICPhoto.create({ messageId: sentMessage.id, photoId: photo.post_id})

            if (!(await ICPhoto.findOne({ where: { messageId: `g${guildId}`} })))
              await ICPhoto.create({ messageId: `g${guildId}`, photoId: photo.id })
            else
              await ICPhoto.update({ photoId: photo.id }, { where: { messageId: `g${guildId}` }})

            await Sleep(1125)
          }
        }

        client.on(Events.InteractionCreate, async (interaction: Interaction) => {
          if (!interaction.isButton() || interaction.channelId !== channel.id) return

          await interaction.deferReply({ ephemeral: true })

          const button = interaction.customId
          if (!button.startsWith('react')) return

          const rating = parseInt(button.charAt(button.length - 1))

          const photo = await ICPhoto.findOne({ where: { messageId: `${interaction.message.id}` }})
          if (!photo) return

          const users: any = photo.get('users')

          if (!users) {
            await ICPhoto.update({ users: { [interaction.user.id]: `${rating}` }}, { where: { messageId: interaction.message.id }})
  
            embed
              .setFields(
                { name: 'Rating', value: `${rating}`, inline: true },
                { name: 'Total rates', value: '1', inline: true },
              )
              .setImage(`${interaction.message.embeds[0].data.image?.url}`)

            const msg = channel.messages.cache.get(interaction.message.id)
            if (msg) msg.edit({ embeds: [embed] })

            await interaction.editReply(`You rated this photo with ${rating === 1 ? `1 star` : `${rating} stars`}`)
          } else {
            const prevUserRating = users[interaction.user.id] !== undefined? users[interaction.user.id] : 0

            await ICPhoto.update({ users: { ...users, [interaction.user.id]: users[interaction.user.id] == rating? 0 : rating }}, { where: { messageId: interaction.message.id }})

            const _photo = await ICPhoto.findOne({ where: { messageId: interaction.message.id }})
            if (!_photo) return
    
            const _users: any = _photo.get('users')

            const totalRates = Object.values(_users).filter((user: any) => user !== 0).length
            const totalRatesArray = Object.values(_users).map((user: any) => user).filter((rate: number) => rate !== 0)

            const averageRating = totalRatesArray.length === 0 ? 0 : calculateWeightedAverage(totalRatesArray)

            embed
              .setFields(
                { name: 'Rating', value: `${averageRating.toFixed(1)}`, inline: true },
                { name: 'Total rates', value: `${totalRates}`, inline: true }
              )
              .setImage(`${interaction.message.embeds[0].data.image?.url}`)

            const msg = await channel.messages.fetch(interaction.message.id)
            if (msg) await msg.edit({ embeds: [embed] })

            await interaction.editReply(`${prevUserRating === 0? `You rated this photo with ${rating === 1? `1 star` : `${rating} stars`}` : `${_users[`${interaction.user.id}`].rate === 0? `убрана оценка`: `изменена оценка`}`}`)
          }
        })

        while (true) {
          await main(parseInt(user), _guildInfo.guild, channel)
          await Sleep(120000)
        }
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