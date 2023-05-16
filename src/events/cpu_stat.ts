import { ActivityType } from 'discord.js'
import { Event, Events, CustomClient } from '../comx'
import * as si from 'systeminformation'

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms * 1000 * 60))}

export default {
  name: Events.ClientReady,
  once: true,
  callback: async (cclient) => {
    const client = cclient as CustomClient

    while (true) {
      let temp = (await si.cpuTemperature()).max
      client.user?.setPresence({
        status: 'idle',
        activities: [{
          type: ActivityType.Watching,
          name: `${temp}°C`
        }]
      })
      sleep(2)
    }
  }
} as Event