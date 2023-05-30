import { ActivityType, Client } from 'discord.js'
import { Event, Events } from '../comx'
import axios from 'axios'

async function getLatestCommitId(): Promise<string> {
  const url = `https://api.github.com/repos/charpplie/SpamtongTracking/commits`

  const response = await axios.get(url).catch(why => {
    console.error(why)
  })

  if (response) {
    const latestCommit = response.data[0]
    const version = String(latestCommit.sha).slice(0, 7)
    return version
  }

  return 'undefined'
}

export default {
  name: Events.ClientReady,
  callback: async (client: Client) => {
    client.user?.setStatus('idle')

    const version = await getLatestCommitId()

    if (version && version !== 'undefined') {
      client.user?.setActivity({
        name: `build ${version}`,
        type: ActivityType.Playing,
      })
    }
  }
} as Event