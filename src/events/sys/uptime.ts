import { CustomClient, Event, Events } from '@/comx'
import { ActivityType } from 'discord.js'
import { g_Logger } from 'logger'

let startTime: number

export default {
  name: Events.ClientReady,
  once: true,
  callback: async (client) => {
    g_Logger.info('Ok!')
    startTime = Date.now()
    updateUptime(client)
  }
} as Event

function updateUptime(client: CustomClient) {
  const currentTime = Date.now()
  const uptimeInMillis = currentTime - startTime
  const uptimeInSeconds = Math.floor(uptimeInMillis / 1000)

  const days = Math.floor(uptimeInSeconds / (3600 * 24))
  const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((uptimeInSeconds % 3600) / 60)
  const seconds = uptimeInSeconds % 60

  const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`

  client.user?.setPresence({
    activities: [{ name: `Dota 2 | ${uptimeString}`, type: ActivityType.Playing }],
    status: 'online',
  })

  setTimeout(updateUptime, 60000)
}