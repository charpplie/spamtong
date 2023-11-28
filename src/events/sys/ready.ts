import { Event, Events } from '@/comx'
import { g_Logger } from 'logger'

export default {
  name: Events.ClientReady,
  once: true,
  callback: async () => {
    g_Logger.info('Ok!')
  }
} as Event