import { Event, Events } from '../comx'
import * as fs from 'fs'
import * as path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import axios from 'axios'

const reactions = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
]

export default {
  name: Events.MessageCreate,
  once: false,
  callback: async (interaction) => {
    if (interaction.channel.id === '1004117985830649976') {
      if (interaction.attachments.size > 0) {
        for (let i = 0; i < interaction.attachments.size; i++) {
          const attachment = interaction.attachments.at(i)
          if (attachment && attachment.contentType?.startsWith('video')) {
            const filePath = path.join(__dirname, attachment.name)
            const writer = fs.createWriteStream(filePath)

            const response = await axios({
              url: attachment.url,
              method: 'GET',
              responseType: 'stream'
            })

            response.data.pipe(writer)

            await new Promise((resolve, reject) => {
              writer.on('finish', resolve)
              writer.on('error', reject)
            })

            if (!attachment.name.endsWith('.mov')) {
              const convertedFilePath = path.join(__dirname, attachment.name.replace(/\.[^/.]+$/, '.mov'))
              ffmpeg(filePath)
                .setFfmpegPath(String(require('@ffmpeg-installer/ffmpeg').path))
                .output(convertedFilePath)
                .on('end', function () {
                  fs.unlinkSync(filePath)
                  const convertedFile = fs.readFileSync(convertedFilePath)
                  interaction.channel.send({
                    files: [{
                      attachment: convertedFile,
                      name: attachment.name.replace(/\.[^/.]+$/, '.mov')
                    }]
                  }).then(() => {
                    for (let j = 0; j < reactions.length; j++) {
                      interaction.react(reactions[j]).catch((error: any) => {})
                    }
                  }).catch((error: any) => {})
                })
                .run()
            } else {
              fs.unlinkSync(filePath)
              for (let j = 0; j < reactions.length; j++) {
                interaction.react(reactions[j]).catch((error: any) => {})
              }
            }
          }
        }
        await interaction.delete()
      }
    }
  }
} as Event
