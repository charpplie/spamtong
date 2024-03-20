import { APIButtonComponentWithCustomId, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, Interaction, TextChannel, ChannelType } from 'discord.js'
import { Event, Events } from 'public/event'
import { IContModel } from 'models/icont'
import { Sleep } from 'public/utils'
import { VK } from 'vk-io'

const vk = new VK({ token: `vk1.a.ReFa-HmnP0GQ-hczNzEl-hpwEbtof_DIaQ48XUEZZ_-mEqVpcuh8mWXPafjdLQxPaieARaGOgweakF6UzLBc9bFdLJsNtA7Dn4g7JnejegpwxPwsnTfvWvgwaN6Gs_7_mlcZNc7PnxHRhZeLLmDBEjU7fPFnjOeHjnwoAAlPrsZak6dFd2v6BIllEMQ0DWoVVO-CuJAF_iJir05HJdI8oA` })

const react1 = new ButtonBuilder().setCustomId('react1').setLabel('1️⃣').setStyle(ButtonStyle.Secondary)
const react2 = new ButtonBuilder().setCustomId('react2').setLabel('2️⃣').setStyle(ButtonStyle.Secondary)
const react3 = new ButtonBuilder().setCustomId('react3').setLabel('3️⃣').setStyle(ButtonStyle.Secondary)
const react4 = new ButtonBuilder().setCustomId('react4').setLabel('4️⃣').setStyle(ButtonStyle.Secondary)
const react5 = new ButtonBuilder().setCustomId('react5').setLabel('5️⃣').setStyle(ButtonStyle.Secondary)
const row = new ActionRowBuilder().addComponents(react1, react2, react3, react4, react5)

const GUILDS: { guild: string, channel: string, users: string[] }[] = [
  {
  guild: '1150427580734906368',
  channel: '1177374466448302180',
  users: ['255594607'],
  },
]

const ALBUM_ID = '-15' // Saved photos

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

const COPYRIGHT = 'xyerssisya (C) 2021-2024. All kromers reserved.'

export default {
  name: Events.ClientReady,
  callback: async (client) => {
    const ownerIcon = client.users.cache.get('783443296382746672')?.avatarURL({ forceStatic: true })

    for (const _guildInfo of GUILDS) {
      const guild = client.guilds.cache.get(_guildInfo.guild)
      if (!guild) continue

      const channel = guild.channels.cache.get(_guildInfo.channel)
      if (!channel || !channel?.isTextBased() || channel.type !== ChannelType.GuildText) continue

      for (const user of _guildInfo.users) {
        const author = await vk.api.users.get({
          user_id: user,
          fields: ['photo_100'],
        })

        const authorName = `${author[0].first_name} ${author[0].last_name}`
        const authorIcon = `${author[0].photo_100}`

        const embed = new EmbedBuilder()
          .setColor('DarkPurple')
          .setTitle('Новая сохранёнка для ценителей Гигаскусства!')
          .setAuthor({ name: authorName, iconURL: authorIcon, url: `https://vk.com/id${user}` })
          .setFields(
            { name: 'Rating', value: '0', inline: true },
            { name: 'Total rates', value: '0', inline: true },
          )
          .setFooter({ text: COPYRIGHT, iconURL: `${ownerIcon}` })

        async function main(ownerId: number, guildId: string, channel: TextChannel) {
          const r = await vk.api.photos.get({
            owner_id: ownerId,
            album_id: ALBUM_ID,
            rev: 1,
          })

          const lastPhoto = (await IContModel.findOne({ where: { messageId: `g${guildId}` }}) === null)? 0 : (await IContModel.findOne({ where: { messageId: `g${guildId}` }}))?.get('photoId')

          let new_photos: string[] = []
          let new_photos_ids: number[] = []

          if (lastPhoto) {
            let i = 0
            while (r.items[i].id != lastPhoto) {
              if (r.items[i].id == lastPhoto) break
              new_photos.push(r.items[i].sizes[r.items[i].sizes.length - 1].url)
              new_photos_ids.push(r.items[i].id)
              i++
            }
          } else {
            for (let i = 0; i < r.items.length; i++) {
              new_photos.push(r.items[i].sizes[r.items[i].sizes.length - 1].url)
              new_photos_ids.push(r.items[i].id)
            }
          }

          new_photos = new_photos.reverse()
          new_photos_ids = new_photos_ids.reverse()

          for (let i = 0; i < new_photos.length; i++) {
            await channel.send({
              embeds: [
                embed
                  .setFields(
                    { name: 'Rating', value: '0', inline: true },
                    { name: 'Total rates', value: '0', inline: true },
                  )
                  .setImage(`${new_photos[i]}`)
              ],
              components: [row as any]
            }).then(async (reply: any) => {
              await IContModel.create({
                messageId: `${reply.id}`,
              })

              if (!(await IContModel.findOne({ where: { messageId: `g${guildId}`} }))) await IContModel.create({ messageId: `g${guildId}`, photoId: `${new_photos_ids[i]}`})
              else await IContModel.update({ photoId: `${new_photos_ids[i]}` }, { where: { messageId: `g${guildId}` }})
            })

            await Sleep(2500)
          }
        }

        client.on(Events.InteractionCreate, async (interaction: Interaction) => {
          if (!interaction.isButton()) return
          if (interaction.channel?.id !== channel.id) return

          const button = interaction.customId
          for (let i = 0; i < row.components.length; i++) {
            if (button === (row.components[i].data as APIButtonComponentWithCustomId).custom_id) {
              await interaction.deferReply({ ephemeral: true })

              const rate = parseInt(button.charAt(button.length - 1))

              const photo = await IContModel.findOne({ where: { messageId: `${interaction.message.id}` }})
              if (!photo) return

              const users: any = photo.get('users')

              if (Object.entries(users).length === 0) {
                await IContModel.update({
                  users: {
                    [`${interaction.user.id}`]: {
                      rate: rate
                    }
                  }
                }, { where: { messageId: `${interaction.message.id}` }})

                embed
                  .setFields(
                    { name: 'Rating', value: `${rate}`, inline: true },
                    { name: 'Total rates', value: '1', inline: true },
                  )
                  .setImage(`${interaction.message.embeds[0].data.image?.url}`)

                const msg = channel.messages.cache.get(interaction.message.id)
                if (!msg) continue

                await msg.edit({ embeds: [embed] })

                await interaction.editReply(`You rated this photo with ${rate === 1? `1 star` : `${rate} stars`}`)
              } else {
                const prev_rate = users[`${interaction.user.id}`].rate? users[`${interaction.user.id}`]?.rate : 0
                if (users[`${interaction.user.id}`]?.rate == rate) {
                  await IContModel.update({
                    users: {
                      [`${interaction.user.id}`]: {
                        rate: 0
                      }
                    }
                  }, { where: { messageId: `${interaction.message.id}` }})
                } else {
                  await IContModel.update({
                    users: {
                      [`${interaction.user.id}`]: {
                        rate: rate
                      }
                    }
                  }, { where: { messageId: `${interaction.message.id}` }})
                }

                let total_rates = 0
                let total_rate: number[] = []

                const _photo = await IContModel.findOne({ where: { messageId: `${interaction.message.id}` }})
                if (!_photo) return
                const _users: any = _photo.get('users')

                for (const user of Object.values<{ [user: string]: number }>(_users)) {
                  if (user.rate != 0) {
                    total_rates++
                    total_rate.push(user.rate)
                  }
                }

                embed
                .setFields(
                  { name: 'Rating', value: `${total_rate.length === 0? 0 : calculateWeightedAverage(total_rate)}`, inline: true },
                  { name: 'Total rates', value: `${total_rates}`, inline: true },
                )
                .setImage(`${interaction.message.embeds[0].data.image?.url}`)

                const msg = channel.messages.cache.get(interaction.message.id)
                if (!msg) continue

                await msg.edit({ embeds: [embed] })

                await interaction.editReply(`${prev_rate === 0? `You rated this photo with ${rate === 1? `1 star` : `${rate} stars`}` : `${_users[`${interaction.user.id}`].rate === 0? `убрана оценка`: `изменена оценка`}`}`)
              }
            }
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