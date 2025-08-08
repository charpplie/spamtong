// import { createWriteStream, unlinkSync, readFileSync } from 'fs'
// import { Event, Events, Config, Utils } from 'comx'
// import { FFmpeggy } from 'ffmpeggy'
// import { join } from 'path'
// import axios from 'axios'

// export default {
//   name: Events.MessageCreate,
//   dev: true,
//   callback: async (instance, message) => {
//     if (message.author.bot || !message.guild || message.channel.id != '1340374435294740560') return

//     if (message.attachments.every((attach: any) => !attach.contentType.startsWith('video'))) {
//       if (message.content.includes('http') && (message.content.includes('vk.com') || message.content.includes('youtu'))) {
//         for (let i = 0; i < Config.EvO.Vcont.Reactions.length; i++) {
//           await message.react(Config.EvO.Vcont.Reactions[i]).catch((why: any) => console.error(why))
//         }
//       }

//       return
//     }

//     const _message = message
//     for (let i = 0; i < _message.attachments.size; i++) {
//       const attachment = _message.attachments.at(i)
//       if (!attachment || !attachment.contentType?.startsWith('video')) continue
//       const filePath = join(__dirname, `${_message.id}${Utils.RandomText(6)}${attachment.name}`)
//       const writer = createWriteStream(filePath)

//       const response = await axios({
//         url: attachment.url,
//         method: 'GET',
//         responseType: 'stream'
//       })

//       response.data.pipe(writer)

//       await new Promise((resolve, reject) => {
//         writer.on('finish', () => resolve)
//         writer.on('error', reject)
//       })

//       const convertedFilePath = join(__dirname, `${_message.id}${Utils.RandomText(6)}${attachment.name.replace(/\.[^/.]+$/, '.mov')}`)

//       // FFmpeggy.DefaultConfig = { ...FFmpeggy.DefaultConfig, ffmpegBin: 'C:\\Users\\charlie\\GitHub\\spamtong\\ffmpeg.exe' }
//       FFmpeggy.DefaultConfig = { ...FFmpeggy.DefaultConfig, ffmpegBin: '/usr/bin/ffmpeg' }

//       new FFmpeggy({
//         autorun: true,
//         input: `${filePath}`,
//         output: `${convertedFilePath}`,
//       })
//         .on('error', (error) => console.error(error.cause))
//         .on('done', async () => {
//           unlinkSync(filePath)
//           const convertedFile = readFileSync(convertedFilePath)
//           await _message.channel.send({
//             files: [{
//               attachment: convertedFile,
//               name: attachment.name.replace(/\.[^/.]+$/, '.mov')
//             }]
//           }).then(async (interaction: any) => {
//             unlinkSync(convertedFilePath)
//             const guild = _message.guild
//             const user = guild.members.cache.get(_message.author.id)
//             await interaction.edit(`v${interaction.id}\n${user?.nickname ? user?.nickname : user?.user.username}: ${_message.content ? _message.content : ''}`).catch((why: any) => console.error(why))
//             for (let j = 0; j < Config.EvO.Vcont.Reactions.length; j++) {
//               await interaction.react(Config.EvO.Vcont.Reactions[j]).catch((why: any) => console.error(why))
//             }

//             await message.delete()
//           })
//         })
//     }
//   }
// } as Event

import { Config, Event, Events } from 'comx'

export default {
  name: Events.MessageCreate,
  // dev: true,
  callback: async (instance, message) => {
    if (message.author.bot || !message.guild.id || message.channel.id != Config.EvO.Vcont.Channel) return

    if (message.attachments.every((attach: any) => attach.contentType.startsWith('video') || message.content.contains('vk.com') || message.content.contains('youtube.com'))) {
      for (let i = 0; i < Config.EvO.Vcont.Reactions.length; i++) {
        await message.react(Config.EvO.Vcont.Reactions[i]).catch((why: any) => console.error(why))
      }
    }
  }
} as Event