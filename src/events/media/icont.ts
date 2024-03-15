import { APIButtonComponentWithCustomId, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, Interaction } from 'discord.js'
import { Event, Events } from 'comx'
import { IContModel } from 'models/icont'
import { Sleep } from '../../utils'
import { i18n } from 'locales'
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
  channel: '1173213492153688098',
  users: ['255594607'],
  },
]

const ALBUM_ID = -15 // Saved photos

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

export default {
  name: Events.ClientReady,
  callback: async (client) => {
    const ownerIcon = client.users.cache.get('783443296382746672')?.avatarURL({ forceStatic: true })

    for (const _guildInfo of GUILDS) {
      const guild = client.guilds.cache.get(_guildInfo.guild)
      if (!guild) continue

      const channel = guild?.channels.cache.get(_guildInfo.channel)
      if (!channel?.isTextBased()) continue

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
          .setFooter({ text: `${i18n.__({ phrase: 'bot.copyright', locale: 'en' })}`, iconURL: `${ownerIcon}` })

        client.on(Events.InteractionCreate, async (interaction: Interaction) => {
          if (!interaction.isButton()) return
          if (interaction.channel?.id !== channel.id) return

          const button = interaction.customId
          for (let i = 0; i < row.components.length; i++) {
            if (button === (row.components[i].data as APIButtonComponentWithCustomId).custom_id) {
              await interaction.deferReply({ ephemeral: true })

              const photo = await IContModel.findOne({ where: { msg_id: `${interaction.message.id}` }})
              if (!photo) return

              const users = photo.get('users')
            }
          }
        })
      }
    }


    client.on('interactionCreate', async (interaction: any) => {
      if (interaction.isButton()) {
        if (interaction.channel?.id != channel.id) return
        const button = interaction.customId
        for (let i = 0; i < reacts.length; i++) {
          if (button == treacts[i]) {
            await interaction.deferReply({ ephemeral: true })
            const photo = await IContModel.findOne({ where: { msg_id: `${interaction.message.id}` }})

            if (photo) {
              const users = photo.get('users')

              if (!users) {
                await IContModel.update({ users: interaction.member?.user.id }, { where: { msg_id: `${interaction.message.id}` }})

                const total_rates = 1
                await IContModel.update({ rates: total_rates }, { where: { msg_id: `${interaction.message.id}` }})

                embed
                  .setFields(
                    { name: 'Rating', value: `${rates[i]}`, inline: true },
                    { name: 'Total rates', value: `${total_rates}`, inline: true}
                  )
                  .setImage(`${interaction.message.embeds[0].data.image?.url}`) 

                const msg = channel.messages.cache.get(interaction.message.id)
                await msg?.edit({
                  embeds: [ embed ]
                })

                await interaction.editReply({
                  content: `You rated this photo with ${stars[i]}`
                })

                // const user_rates = {
                //   [`${interaction.member?.user.id}`]: Number(rates[i])
                // }

                // await IContModel.update({ user_rates: user_rates}, {where: { msg_id: interaction.message.id}})
              } else {
                const usersArr = String(users).split(',')
                for (let j = 0; j < usersArr.length; j++) {
                  if (interaction.member?.user.id == usersArr[j]) {
                    await interaction.editReply('You have already rated this photo')
                    return
                  }
                }

                const new_users = String(users) + `,${interaction.member?.user.id}`
                await IContModel.update({ users: new_users }, { where: { msg_id: `${interaction.message.id}` }})

                const total_rates = 1 + Number(photo.get('rates'))
                await IContModel.update({ rates: total_rates }, { where: { msg_id: `${interaction.message.id}` }}) 

                const user_rate = rates[i]
                const current_rate = interaction.message.embeds[0].data.fields?.at(0)?.value
                const new_rate = calculateWeightedAverage([Number(user_rate), Number(current_rate)], RATE_COEF)

                embed
                  .setFields(
                    { name: 'Rating', value: `${new_rate.toFixed(1)}`, inline: true },
                    { name: 'Total rates', value: `${total_rates}`, inline: true}
                  )
                  .setImage(`${interaction.message.embeds[0].data.image?.url}`) 

                const msg = channel.messages.cache.get(interaction.message.id)
                await msg?.edit({
                  embeds: [ embed ]
                })

                await interaction.editReply({
                  content: `You rated this photo with ${stars[i]}`
                })
              }
            } else {
              await interaction.editReply({
                content: 'Ой-ой-ой... Вы столкнулись с неизвестной ошибкой! Я рял не ебу че случилось, отпишите мне если она вылезла.'
              })
            }
          }
        }
      }
    })

    async function main() {
      try {
        const response = await vk.api.photos.get({
          owner_id: NIKITA,
          album_id: SAVEDPHOTOS,
          rev: 1,
        })

        let lastId
        const lastPhoto = await IContModel.findOne({
          order: [['createdAt', 'DESC']]
        })

        if (lastPhoto) {
          lastId = lastPhoto.get('photo_id')
        } else {
          lastId = 0
        }

        let new_photos: number[] = []
        let j = 0
        if (lastId) {
          while (response.items[j].id != lastId) {
            if (response.items[j].id == lastId) break
            new_photos.push(Number(response.items[j].id))
            j++
          }
        } else {
          for (let k = 0; k < response.items.length; k++) {
            new_photos.push(Number(response.items[k].id))
          }
        }

        new_photos = new_photos.reverse()

        for (let i = 0; i < new_photos.length; i++) {
          const r = await vk.api.photos.get({
            owner_id: NIKITA,
            album_id: SAVEDPHOTOS,
            photo_ids: `${new_photos[i]}`,
            rev: 1,
          })

          const url = r.items[0].sizes?.slice(-1)[0].url

          await channel.send({
            embeds: [
              new EmbedBuilder()
              .setColor('DarkPurple')
              .setAuthor({ name: authorName, iconURL: authorIcon, url: `https://vk.com/id${NIKITA}`})
              .setTitle(`Новая сохранёнка для ценителей Гигаскусства!`)
              .setImage(`${url}`)
              .addFields(
                { name: 'Rating', value: '0.0', inline: true},
                { name: 'Total rates', value: '0', inline: true}
              )
            ],
            components: [row as any]
          }).then(async (reply) => {
            await IContModel.create({
              lastId: `${new_photos[i]}`,
              photo_id: `${new_photos[i]}`,
              msg_id: `${reply.id}`,
            })
          })

          await Sleep(1500)
        }
      } catch (why) {
        await Sleep(30000)
        await main()
      }
    }

    while (true) {
      await main()
      await Sleep(60000)
    }
  }
} as Event
