import { Events } from 'discord.js'
import { Event } from '../comx'
import { existsSync, mkdirSync, createWriteStream, unlinkSync, readFileSync } from 'fs'
import { join } from 'path'
import ffmpeg from 'fluent-ffmpeg'
import axios from 'axios'
import os from 'os'

const reactions = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
]

const tmp_folder = `${__dirname}\\..\\..\\temp`

export default {
  name: Events.MessageCreate,
  callback: async (interaction) => {
interaction.client.users.send('783443296382746672', 'vcont triggered')
    if (interaction.channel.id === '1004117985830649976') {
      if (interaction.attachments.size > 0) {
        for (let i = 0; i < interaction.attachments.size; i++) {
          const attachment = interaction.attachments.at(i)
          if (attachment && attachment.contentType?.startsWith('video')) {
            if (!existsSync(tmp_folder)) mkdirSync(tmp_folder)
            const filePath = join(tmp_folder, attachment.name)
            const writer = createWriteStream(filePath)

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
              let ffmpegPath = '/usr/bin/ffmpeg'
              if (os.type() === 'Windows_NT') {
                ffmpegPath = String(require('@ffmpeg-installer/ffmpeg').path)
                console.log('bweb')
              }
              const channel = interaction.channel
              await interaction.delete()
              const convertedFilePath = join(tmp_folder, attachment.name.replace(/\.[^/.]+$/, '.mov'))
              ffmpeg(filePath)
                .setFfmpegPath(ffmpegPath)
                .output(convertedFilePath)
                .on('end', async function () {
                  unlinkSync(filePath)
                  const convertedFile = readFileSync(convertedFilePath)
                  await channel.send({
                    files: [{
                      attachment: convertedFile,
                      name: attachment.name.replace(/\.[^/.]+$/, '.mov')
                    }]
                  }).then(async () => {
                    for (let j = 0; j < reactions.length; j++) {
                      await interaction.react(reactions[j]).catch((error: any) => {})
                    }
                  }).catch((error: any) => {})
                })
                .run()
            } else {
              unlinkSync(filePath)
              for (let j = 0; j < reactions.length; j++) {
                await interaction.react(reactions[j]).catch((error: any) => {})
              }
            }
          }
        }
      }
    }
  }
} as Event