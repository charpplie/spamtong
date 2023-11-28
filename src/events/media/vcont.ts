import { Event, Events } from '@/comx'
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

const tmp_folder = './temp'

const MAIN_CHANNEL = '1168131163123093544'
const TEST_CHANNEL = '1172652787843207200'

export default {
  name: Events.MessageCreate,
  callback: async (interaction) => {
    if (interaction.channel.id === MAIN_CHANNEL || interaction.channel.id == TEST_CHANNEL) {
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
              }
              const channel = interaction.channel
              let author = interaction.member.user.username
              if (interaction.member.nickname) author = interaction.member.nickname
              await interaction.delete()
              const convertedFilePath = join(tmp_folder, attachment.name.replace(/\.[^/.]+$/, '.mov'))
              ffmpeg(filePath)
                .setFfmpegPath(ffmpegPath)
                .output(convertedFilePath)
                .on('end', async function () {
                  unlinkSync(filePath)
                  const convertedFile = readFileSync(convertedFilePath)
                  await channel.send({
                    content: `${author}:`,
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
              unlinkSync(convertedFilePath)
            } else {
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