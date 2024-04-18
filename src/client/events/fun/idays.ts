import { Event, Events } from 'public/comx'
import { Sleep } from 'public/utils'

const GIF = 'https://tenor.com/view/happy-birthday-cat-cute-birthday-cake-second-birthday-gif-16100991'

let NAMP = 0
let LUMEE = 0
// let VELOSIBOBE = 0
let NOVUSORBIS = 0
let STAKAN = 0
let DEWUH = 0
let YIKEES = 0
let NEWYEAR = 0
let NEWBLOOM = 0

export default {
  name: Events.ClientReady,
  callback: async ({ client }) => {
    const guild = client.guilds.cache.get('1150427580734906368')
    const channel = guild?.channels.cache.get('1150427581296935006')
    if (!channel || !channel.isTextBased()) return

    while (true) {
      const month = new Date().getMonth()
      const day = new Date().getDate()

      if (month === 0) {
      } else if (month === 1) {
        if (day === 22) {
          if (!NAMP) {
            await channel.send(`Мистер Немп? Вам [поздравления](${GIF}) от Спемтона!\n`)
            NAMP = 1
          }
        } else NAMP = 0
      } else if (month === 2) {
        if (day === 25) {
          if (!YIKEES) {
            await channel.send('👀')
            YIKEES = 1
          }
        } else YIKEES = 0
        if (day === 31) {
          if (!LUMEE) {
            await channel.send(`Хорошему парню и отважной тройке: от чистого сердца из нержавеющей стали лично [вам](${GIF}), Мистер Люми!`)
            LUMEE = 1
          }
        } else LUMEE = 0
      }
      await Sleep(60000)
    }
  }
} as Event