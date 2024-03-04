import { TextChannel, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events } from 'discord.js'
import { Event } from 'comx'
import { IContModel } from 'models/icont'
import { VK } from 'vk-io'
import { AppInfo } from 'index'

const reacts = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
]

const treacts = [
  'react1',
  'react2',
  'react3',
  'react4',
  'react5',
]

const rates = [
  '1.0',
  '2.0',
  '3.0',
  '4.0',
  '5.0',
]

const stars = [
  '1 star',
  '2 stars',
  '3 stars',
  '4 stars',
  '5 stars',
]

const vk = new VK({
  token: `${process.env.vkUsr}`
})

function Sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

function calculateWeightedAverage(ratings: number[], coefficient: number): number {
  let weightedSum = 0
  let weightSum = 0

  for (let i = 0; i < ratings.length; i++) {
      const weight = Math.pow(coefficient, i)
      weightedSum += ratings[i] * weight
      weightSum += weight
  }

  return weightedSum / weightSum
}

const GUILD = '1150427580734906368'
const CHANNEL = '1177374466448302180'
const NIKITA = 255594607
const SAVEDPHOTOS = '-15'
const RATE_COEF = 0.7

export default {
  name: Events.ClientReady,
  callback: async (client) => {
    const guild = client.guilds.cache.get(GUILD)
    const channel = guild?.channels.cache.get(CHANNEL) as TextChannel

    const react1 = new ButtonBuilder()
      .setCustomId('react1')
      .setLabel(`${reacts[0]}`)
      .setStyle(ButtonStyle.Secondary)

    const react2 = new ButtonBuilder()
      .setCustomId('react2')
      .setLabel(`${reacts[1]}`)
      .setStyle(ButtonStyle.Secondary)

    const react3 = new ButtonBuilder()
      .setCustomId('react3')
      .setLabel(`${reacts[2]}`)
      .setStyle(ButtonStyle.Secondary)

    const react4 = new ButtonBuilder()
      .setCustomId('react4')
      .setLabel(`${reacts[3]}`)
      .setStyle(ButtonStyle.Secondary)

    const react5 = new ButtonBuilder()
      .setCustomId('react5')
      .setLabel(`${reacts[4]}`)
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder()
      .addComponents(react1, react2, react3, react4, react5)

    const nikita = await vk.api.users.get({
      user_id: NIKITA,
      fields: ['photo_100']
    })

    const authorName = `${nikita[0].first_name} ${nikita[0].last_name}`
    const authorIcon = `${nikita[0].photo_100}`
    const ownerIcon = client.users.cache.get(`${AppInfo.owner}`)?.avatarURL({ forceStatic: true })

    const embed = new EmbedBuilder()
      .setColor('DarkPurple')
      .setAuthor({ name: authorName, iconURL: authorIcon, url: `https://vk.com/id${NIKITA}`})
      .setTitle('Новая сохранёнка для ценителей Гигаскусства!')
      .setFooter({ text: `${process.env.copyright}`, iconURL: `${ownerIcon}`})

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
              .setFooter({ text: `${process.env.copyright}`, iconURL: `${ownerIcon}`})
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
      await Sleep(30000)
    }
  }
} as Event
