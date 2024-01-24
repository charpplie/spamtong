import { Event } from 'comx'
import { generateRandomText } from 'utils'
import { createWriteStream, unlinkSync, readFileSync } from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import { join } from 'path'
import axios from 'axios'
import os from 'os'
import { Logger } from 'logger'

const reactions = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
]

const CHANNELS = ['1173213492153688098']

export default {
  name: 'messageCreate',
  callback: async (interaction) => {
    if (interaction.member.user.id === `${process.env.appId}`) return
    if (!CHANNELS.includes(interaction.channel.id)) return

    if (interaction.attachments.size > 0) {
      const _channel = interaction.channel
      const _author = interaction.member.nickname ? interaction.member.nickname : interaction.member.user.username
      const _text = interaction.content ? interaction.content : ''
      const _interaction = interaction
      await interaction.delete()
      for (let i = 0; i < _interaction.attachments.size; i++) {
        const attachment = _interaction.attachments.at(i)
        if (attachment && attachment.contentType?.startsWith('video')) {
          const filePath = join(__dirname, `${_interaction.id}${generateRandomText(6)}${attachment.name}`)
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

          const ffmpegPath = os.type() === 'Windows_NT' ? String(require('@ffmpeg-installer/ffmpeg').path) : '/usr/bin/ffmpeg'
          const convertedFilePath = join(__dirname, `${_interaction.id}${generateRandomText(6)}${attachment.name.replace(/\.[^/.]+$/, '.mov')}`)
          ffmpeg(filePath)
            .setFfmpegPath(ffmpegPath)
            .output(convertedFilePath)
            .on('end', async function () {
              unlinkSync(filePath)
              const convertedFile = readFileSync(convertedFilePath)
              await _channel.send({
                files: [{
                  attachment: convertedFile,
                  name: attachment.name.replace(/\.[^/.]+$/, '.mov')
                }]
              }).then(async (interaction: any) => {
                unlinkSync(convertedFilePath)
                for (let j = 0; j < reactions.length; j++) {
                  await interaction.edit(`v${interaction.id} | ${_author}: ${_text}`)
                  await interaction.react(reactions[j]).catch((error: any) => {
                    Logger.error(error)
                  })
                }
              }).catch((error: any) => {
                Logger.error(error)
              })
            })
            .run()
        }
      }
    }
  }
} as Event