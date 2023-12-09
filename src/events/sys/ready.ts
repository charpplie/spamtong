import { Event } from '@/comx'
import { Logger } from 'logger'

export default {
  name: 'ready',
  once: true,
  callback: async (client) => {
    Logger.info('Ok!')
    client.user.setPresence({
      activities: [{ name: 'Dota 2' }],
      status: 'online',
    })
  }
} as Event