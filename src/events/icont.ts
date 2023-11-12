import { TextChannel, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, CommandInteraction, messageLink } from 'discord.js'
import { Event, Events, CustomClient } from '../comx'
import { VK } from 'vk-io'
import config from '..'

const vk = new VK({
  token: config.vkToken
})

const reactions = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
]

const reacts = [
  'react1',
  'react2',
  'react3',
  'react4',
  'react5',
]

const text = [
  '1 star',
  '2 stars',
  '3 stars',
  '4 stars',
  '5 stars'
]

function Sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

export default {
  name: Events.ClientReady,
  callback: async (client: CustomClient) => {
    const guild = client.guilds.cache.get('1150427580734906368')
    const channel = guild?.channels.cache.get('1173213492153688098') as TextChannel
    if (!channel) return

    const react1 = new ButtonBuilder()
      .setCustomId('react1')
      .setLabel(`${reactions[0]}`)
      .setStyle(ButtonStyle.Secondary)

    const react2 = new ButtonBuilder()
      .setCustomId('react2')
      .setLabel(`${reactions[1]}`)
      .setStyle(ButtonStyle.Secondary)

    const react3 = new ButtonBuilder()
      .setCustomId('react3')
      .setLabel(`${reactions[2]}`)
      .setStyle(ButtonStyle.Secondary)

    const react4 = new ButtonBuilder()
      .setCustomId('react4')
      .setLabel(`${reactions[3]}`)
      .setStyle(ButtonStyle.Secondary)

    const react5 = new ButtonBuilder()
      .setCustomId('react5')
      .setLabel(`${reactions[4]}`)
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder()
      .addComponents(react1, react2, react3, react4, react5)

    // await channel.send({
    //   embeds: [
    //     new EmbedBuilder()
    //     .setColor('DarkPurple')
    //     .setTitle('457262982')
    //     .setImage(`https://images-ext-1.discordapp.net/external/cTZP4mV1IDumWtPztqyALX4pKmodgkX3s8BjyWovqDI/%3Fsize%3D1080x810%26quality%3D96%26sign%3D8ac90a51316a45b4c14eb2ab8a968a6b%26c_uniq_tag%3DhNBZSa8HgJkubewLaB96uLvYzdXRksBiYWgThZMwF5k%26type%3Dalbum/https/sun1-88.userapi.com/impf/c850124/v850124918/1bb316/I6TxMli7lhY.jpg`)
    //     .setDescription(':star:: 0.0/5.0')
    //   ],
    //   components: [row as any]
    // })

    client.on('interactionCreate', async interaction => {
      if (interaction.isButton()) {
        const button = interaction.customId
        for (let i = 0; i < reacts.length; i++) {
          if (button == reacts[i]) {
            await interaction.reply({
              ephemeral: true,
              content: `you rated this photo with ${text[i]}`
            })
          }
        }
      }
    })

    async function main() {
      const response = await vk.api.photos.get({
        owner_id: 255594607,
        album_id: '-15',
        rev: 1,
      })

      let lastId = 0
      let i = 1
      let j = 0
      while (true) {
        await channel.messages.fetch({ limit: i }).then(messages => {
          if (messages.at(j)?.author.id != '912326828574773299') {
            i++
            j++
          } else {
            lastId = Number(messages.at(j)?.embeds[0].data.title)
          }
        })
        if (lastId != 0) break
      }

      let new_photos: number[] = []
      i = 0
      while (response.items[i].id != lastId) {
        new_photos.push(Number(response.items[i].id))
        i++
      }
      new_photos = new_photos.reverse()

      for (let i = 0; i < new_photos.length; i++) {
        const r = await vk.api.photos.get({
          owner_id: 255594607,
          album_id: '-15',
          photo_ids: `${new_photos[i]}`,
          rev: 1,
        })

        const url = r.items[0].sizes?.slice(-1)[0].url

        await channel.send({
          embeds: [
            new EmbedBuilder()
            .setColor('DarkPurple')
            .setTitle(`${new_photos[i]}`)
            .setImage(`${url}`)
            .setDescription(':star:: 0.0/5.0')
          ],
          components: [row as any]
        })

        await Sleep(1500)
      }
    }

    while (true) {
      await main()
      await Sleep(30000)
    }
  }
} as Event