import { Event } from '@/comx'
import { Logger } from 'logger'

export default {
  name: 'ready',
  once: true,
  callback: async (client) => {
    Logger.info('Ok!')
    client.user.setPresence({
      status: 'dnd',
      activities: [{
        name: 'Neon Prime',
        type: 3,
      }]
    })
  }
} as Event