import { ActivityType } from 'discord.js'
import { Event, Events, CustomClient } from '../comx'
import * as si from 'systeminformation'

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

export default {
  name: Events.ClientReady,
  once: true,
  callback: async (cclient) => {
    const client = cclient as CustomClient

    while (true) {
      const temp = (await si.cpuTemperature()).max
      
      if (temp >= 50) process.exit()

      client.user?.setPresence({
        status: 'idle',
        activities: [{
          type: ActivityType.Watching,
          name: `${temp}°C`
        }]
      })
      await sleep(120000)
    }
  }
} as Event