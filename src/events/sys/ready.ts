import { Event, Events } from 'comx'
import { ActivityType } from 'discord.js'
import { Sleep } from 'utils'

export default {
  name: Events.ClientReady,
  once: true,
  callback: async (client) => {
    while (true) {
      client.user?.setPresence({
        status: 'dnd',
        activities: [{
          name: `API Latency: ${Math.round(client.ws.ping)}`,
          type: ActivityType.Watching,
        }]
      })
      await Sleep(5000)
    }
  }
} as Event