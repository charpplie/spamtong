import { Event, Events } from 'comx'
import { Sleep, generateRandomText } from 'utils'

export default {
  name: Events.ClientReady,
  once: true,
  callback: async (client) => {
    while (true) {
      const text = generateRandomText(12)
      client.user?.setPresence({
        status: 'dnd',
        activities: [{
          name: text,
          type: 0,
        }]
      })
      await Sleep(5000)
    }
  }
} as Event