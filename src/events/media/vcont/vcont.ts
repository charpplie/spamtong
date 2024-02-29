import { Event, Events } from 'comx'
import { generateRandomText } from 'utils'
import { createWriteStream, unlinkSync, readFileSync } from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import { join } from 'path'
import axios from 'axios'
import os from 'os'
import { Spamtong } from 'index'
import { Message } from 'discord.js'

const reactions = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
  '⭐',
]

export const VCONT_CHANNELS = ['1181427849303965768']
export const VCONT_CRITICAL = '1212476779743285258'

export default {
  name: Events.MessageCreate,
  callback: async (message: Message) => {
    if (message.author.bot) return
    if (!message.guild) return
    if (!VCONT_CHANNELS.includes(message.channel.id)) return

    if (message.attachments.size > 0) {
      const _guild = message.guild
      const _channel = message.channel
      const _user = _guild.members.cache.get(message.author.id)
      const _author = _user?.nickname ? _user?.nickname :_user?.user.username
      const _text = message.content ? message.content : ''
      const _message = message
      await message.delete()
      for (let i = 0; i < _message.attachments.size; i++) {
        const attachment = _message.attachments.at(i)
        if (attachment && attachment.contentType?.startsWith('video')) {
          const filePath = join(__dirname, `${_message.id}${generateRandomText(6)}${attachment.name}`)
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
          const convertedFilePath = join(__dirname, `${_message.id}${generateRandomText(6)}${attachment.name.replace(/\.[^/.]+$/, '.mov')}`)
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
                  await interaction.react(reactions[j]).catch((error: any) => { Spamtong.error(error) })
                }
              }).catch((error: any) => { Spamtong.error(error) })
            }).run()
        }
      }
    }
  }
} as Event