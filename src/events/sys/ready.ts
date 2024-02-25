import { Event, Events } from 'comx'
import { ActivityType } from 'discord.js'
import { Spamtong } from 'index'

let startTime: number

export default {
  name: Events.ClientReady,
  once: true,
  callback: async (client) => {
    Spamtong.info('Ok!')
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
  const seconds = uptimeInSeconds % 60

  const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`

  Spamtong.client.user?.setPresence({
    activities: [{ name: `${uptimeString}`, type: ActivityType.Watching }],
    status: 'online',
  })

  setTimeout(updateUptime, 10000)
}