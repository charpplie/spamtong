import { Event, Events } from 'comx'
import { TextChannel } from 'discord.js'
import { Logger } from 'logger'
import { Sleep } from 'utils'

const GIF = 'https://tenor.com/view/happy-birthday-cat-cute-birthday-cake-second-birthday-gif-16100991'

export default {
  name: Events.ClientReady,
  callback: async () => {
    const guild = Logger.client.guilds.cache.get('1185089418395123763')
    const channel = guild?.channels.cache.get('1185089419422732371') as TextChannel

    while (true) {
      const month = new Date().getMonth()
      const day = new Date().getDate()

      if (month === 1) {
        if (day === 22) {
          await channel.send(`Мистер Немп? Вам [поздравления](${GIF}) от Спемтона\n`)
        }
      }

      await Sleep(15000)
    }
  }
} as Event