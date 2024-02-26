import { Event, Events } from 'comx'
import { ActivityType } from 'discord.js'
import { Spamtong } from 'index'

let startTime: number

export default {
  name: Events.ClientReady,
  callback: async (client) => {
    startTime = Date.now()
    updateUptime()
  }
} as Event

function updateUptime() {
  const currentTime = Date.now()
  const uptimeInMillis = currentTime - startTime
  const uptimeInSeconds = Math.floor(uptimeInMillis / 1000)

  const days = Math.floor(uptimeInSeconds / (3600 * 24))
  const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((uptimeInSeconds % 3600) / 60)

  const uptimeString = `${days}d ${hours}h ${minutes}m`

  Spamtong.client.user?.setPresence({
    activities: [{ name: `${uptimeString}`, type: ActivityType.Watching }],
    status: 'online',
  })

  setTimeout(updateUptime, 60000)
}