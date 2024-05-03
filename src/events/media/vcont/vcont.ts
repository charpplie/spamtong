import { createWriteStream, unlinkSync, readFileSync } from 'fs'
import { Event, Events, Utils } from 'jukai'
import { join } from 'path'
import axios from 'axios'
import { FFmpeggy } from 'ffmpeggy'

export const VCONT_REACTIONS = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
  '⭐',
]

export const VCONT_CHANNELS = ['1173213492153688098']

export default {
  name: Events.MessageCreate,
  callback: async ({ }, message) => {
    if (message.author.bot || !message.guild || !VCONT_CHANNELS.includes(message.channel.id) || message.attachments.every((attach: any) => !attach.contentType.startsWith('video'))) return

    const _message = message
    await message.delete()
    for (let i = 0; i < _message.attachments.size; i++) {
      const attachment = _message.attachments.at(i)
      if (!attachment || !attachment.contentType?.startsWith('video')) continue
      const filePath = join(__dirname, `${_message.id}${Utils.RandomText(6)}${attachment.name}`)
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

      const convertedFilePath = join(__dirname, `${_message.id}${Utils.RandomText(6)}${attachment.name.replace(/\.[^/.]+$/, '.mov')}`)

      FFmpeggy.DefaultConfig = { ...FFmpeggy.DefaultConfig, ffmpegBin: '/usr/bin/ffmpeg' }

      new FFmpeggy({
        autorun: true,
        input: `${filePath}`,
        output: `${convertedFilePath}`,
      })
        .on('error', (error) => console.error(error))
        .on('done', async () => {
          unlinkSync(filePath)
          const convertedFile = readFileSync(convertedFilePath)
          await _message.channel.send({
            files: [{
              attachment: convertedFile,
              name: attachment.name.replace(/\.[^/.]+$/, '.mov')
            }]
          }).then(async (interaction: any) => {
            unlinkSync(convertedFilePath)
            const guild = _message.guild
            const user = guild.members.cache.get(_message.author.id)
            await interaction.edit(`v${interaction.id}\n${user?.nickname ? user?.nickname : user?.user.username}: ${_message.content ? _message.content : ''}`).catch((why: any) => console.error(why))
            for (let j = 0; j < VCONT_REACTIONS.length; j++) {
              await interaction.react(VCONT_REACTIONS[j]).catch((why: any) => console.error(why))
            }
          })
        })
    }
  }
} as Event