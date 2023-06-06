import 'dotenv/config'

import { ActivityType, Events } from 'discord.js'
import { CustomClient, Event } from '../comx'
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
  callback: async (client: CustomClient) => {
    client.user?.setStatus('idle')

    const build_version = await getLatestCommitId()

    if (build_version && build_version !== 'undefined') {
      client.user?.setActivity({
        name: `build ${build_version} | se ${process.env.VERSION}`,
        type: ActivityType.Playing,
      })
    }
  }
} as Event