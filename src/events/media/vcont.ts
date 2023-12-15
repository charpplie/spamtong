import { Event } from '@/comx'
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

export default {
  name: 'messageCreate',
  callback: async (interaction) => {
    if (interaction.channel.id === `${process.env.vcont_channel}`) {
      if (interaction.attachments.size > 0) {
        for (let i = 0; i < interaction.attachments.size; i++) {
          const attachment = interaction.attachments.at(i)
          if (attachment && attachment.contentType?.startsWith('video')) {
            const filePath = join(__dirname, `${interaction.id}${attachment.name}`)
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
              const convertedFilePath = join(__dirname, `${interaction.id}${attachment.name.replace(/\.[^/.]+$/, '.mov')}`)
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
                    unlinkSync(convertedFilePath)
                  }).catch((error: any) => {})
                })
                .run()
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