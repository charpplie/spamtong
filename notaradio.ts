import 'dotenv/config'

import axios from 'axios'
import fs from 'fs'

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
import Ffmpeg from 'fluent-ffmpeg'

const INT32MAX = 2147483647

////////////////////////////////////////////////////////////////

import { Collection, GatewayIntentBits, Events, TextChannel } from 'discord.js'
import { CustomClient, SlashCommand } from './comx'
import { ppSlashCommandHandler } from './cmdx'

const client = new CustomClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  shards: 'auto',
})

client.slashCommands = new Collection<string, SlashCommand>()

client.once(Events.ClientReady, async () => {
  //await ppSlashCommandHandler(client)
})

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return

  const random_id = Math.floor(Math.random() * INT32MAX)

  if (msg.attachments.size > 0) {
    let attachments = []
    let files: any[] = []
    let types: any[] = []
    let ext: any[] = []

    for (let i = 0; i < msg.attachments.size; i++) {
      attachments.push(msg.attachments.at(i)?.url)
      types.push(msg.attachments.at(i)?.contentType?.substring(0, Number((msg.attachments.at(i)?.contentType)?.indexOf('/'))))
      ext.push(msg.attachments.at(i)?.contentType?.substring(Number((msg.attachments.at(i)?.contentType)?.indexOf('/')) + 1, (msg.attachments.at(i)?.contentType)?.length))
    }

    for (let i = 0; i < attachments.length; i++) {
      await axios({
        url: `${attachments[i]}`,
        method: 'GET',
        responseType: 'stream',
      }).then(async response => {
        let file = `${i}${random_id}.${ext[i]}`
        const filename = `${i}${random_id}`
        const writeStream = fs.createWriteStream(file)

        response.data.pipe(writeStream)
        await new Promise((resolve, reject) => {
          writeStream.on('finish', () => {
            resolve(null)
          })
          writeStream.on('error', (error) => {
            reject(error)
          })
        })

        try {
          let uploadedFile = '' as any
          switch (types[i]) {
            case 'image': {
              uploadedFile = await upload.messagePhoto({
                source: {
                  value: file,
                  filename: file
                }
              })
              files[i] = `photo${uploadedFile.ownerId}_${uploadedFile.id}`
              break
            }
            case 'video': {
              uploadedFile = await vkc.api.video.save({})

              const videoFileBuffer = await fs.promises.readFile(file)
              const videoFileBlob = new Blob([videoFileBuffer])

              const formData = new FormData()
              formData.append('video_file', videoFileBlob)

              const video = await axios.post(`${uploadedFile.upload_url}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })

              files[i] = `video${video.data.owner_id}_${video.data.video_id}`
              break
            }
            case 'audio': {
              if (ext[i] == 'ogg') {
                Ffmpeg(file)
                .setFfmpegPath(ffmpegPath)
                .output(`${filename}.mpeg`)
                .audioCodec('libmp3lame')
                .on('end', async () => {
                  uploadedFile = await vkc.upload.audio({
                    source: {
                      value: `${filename}.mpeg`,
                      filename: `${filename}.mpeg`
                    },
                    artist: 'Спентон Г. Спентон',
                    title: 'Голосовое от лошка'
                  })
                })
                .run()
              } else {
                uploadedFile = await vkc.upload.audio({
                  source: {
                    value: file,
                    filename: file
                  },
                })
              }
              files[i] = `audio${uploadedFile.ownerId}_${uploadedFile.id}`
              break
            }
          }
        } catch (why) { console.error(why) } //finally { fs.unlinkSync(file) }
      }).catch(error => console.error(error))
    }

    vk.api.messages.send({
      chat_id: 1,
      random_id: random_id,
      message: `${msg.author.tag}: ${msg.content}`,
      attachment: files.join(',')
    })
  } else {
    vk.api.messages.send({
      chat_id: 1,
      random_id: random_id,
      message: `${msg.author.tag}: ${msg.content}`
    })
  }
})

client.login(process.env.token)

////////////////////////////////////////////////////////////////

import { VK, API, Upload } from 'vk-io'

const vk = new VK({
  token: String(process.env.vkToken)
})

const vkc = new VK({
  token: String(process.env.vkcToken)
})

const vkApi = new API({
  token: String(process.env.vkToken)
})

const upload = new Upload({
  api: vkApi
})

vk.updates.on('message_new', async (context) => {
  if (context.isOutbox) return


  const sender = await vk.api.users.get({
    user_ids: [context.senderId]
  })

  if (context.hasAllAttachments('photo')) {
    const random_id = Math.floor(Math.random() * INT32MAX)
    let attachments = []
    let files = []
    for (let i = 0; i < context.getAllAttachments('photo').length; i++) { attachments[i] = context.getAllAttachments('photo').at(i)?.mediumSizeUrl}
    for (let i = 0; i < attachments.length; i++) {
      await axios({
        url: `${attachments[i]}`,
        method: 'GET',
        responseType: 'stream',
      }).then(async response => {

      })
    }
  } else {
    (client.channels.cache.get('1058064189610020914') as TextChannel).send(
      `${sender[0].first_name} ${sender[0].last_name} отправил сообщение: ${context.text}`
    )
  }
})

vk.updates.start()
