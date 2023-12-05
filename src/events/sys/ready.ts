import { Event, Events } from '@/comx'
import { g_Logger } from 'logger'

export default {
  name: Events.ClientReady,
  once: true,
  callback: async (client) => {
    g_Logger.info('Ok!')
    client.user.setPresence({
      activities: [{ name: 'Dota 2' }],
      status: 'online',
    })
  }
} as Event