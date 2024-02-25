import { Event, Events } from 'comx'
import { TextChannel } from 'discord.js'
import { Spamtong } from 'index'
import { Sleep } from 'utils'

const GIF = 'https://tenor.com/view/happy-birthday-cat-cute-birthday-cake-second-birthday-gif-16100991'

let NAMP = 0

export default {
  name: Events.ClientReady,
  callback: async () => {
    const guild = Spamtong.client.guilds.cache.get('1150427580734906368')
    const channel = guild?.channels.cache.get('1150427581296935006') as TextChannel

    while (true) {
      const month = new Date().getMonth()
      const day = new Date().getDate()

      if (month === 1) {
        if (day === 22) {
          if (!NAMP) {
            await channel.send(`Мистер Немп? Вам [поздравления](${GIF}) от Спемтона\n`)
            NAMP = 1
          }
        } else {
          NAMP = 0
        }
      }

      await Sleep(15000)
    }
  }
} as Event