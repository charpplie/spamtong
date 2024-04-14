import { Event, Events } from 'public/comx'
import { GUILD, CHANNEL } from './!logging'
import { uploadToBucket } from 'public/s3storage'
import { createWriteStream, unlinkSync } from 'fs'
import { join } from 'path'
import axios from 'axios'

export default {
  name: Events.UserUpdate,
  dev: true,
  callback: async (client, Old, New) => {
    if (Old.bot) return

    if (Old.avatar !== New.avatar) {
      const guild = client.guilds.cache.get(GUILD)
      const channel = guild?.channels.cache.get(CHANNEL)

      if (!channel || !channel.isTextBased()) return

      const date = new Date()
      const username = Old.username

      if (New.avatar === null) {
        await channel.send(`${date} | ${username} убрал аватар`)
      } else {
        if (Old.avatar === null) {
          const filePath = join(__dirname, `${New.avatar}.png`)
          const writer = createWriteStream(filePath)

          const r = await axios({
            url: New.avatarURL({ forceStatic: true }),
            method: 'GET',
            responseType: 'stream',
          })

          r.data.pipe(writer)

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
          })

          const res = await uploadToBucket(filePath).then(async (location) => {
            unlinkSync(filePath)
            await channel.send(`${date} | ${username} поставил [аватар](${location})`)
          })
        } else {
          const filePath = join(__dirname, `${New.avatar}.png`)
          const writer = createWriteStream(filePath)

          const r = await axios({
            url: New.avatarURL({ forceStatic: true }),
            method: 'GET',
            responseType: 'stream',
          })

          r.data.pipe(writer)

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
          })

          const res = await uploadToBucket(filePath).then(async (location) => {
            unlinkSync(filePath)
            await channel.send(`${date} | ${username} сменил [аватар](${process.env.bucketURL}/${process.env.bucketName}/${Old.avatar}.png) на [новый](${location})`)
          })
        }
      }
    }
  }
} as Event