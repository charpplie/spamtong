import { Event, Events, Utils } from 'comx'
import { TextChannel } from 'discord.js'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { createHash } from 'crypto'
import axios from 'axios'
import https from 'https'

interface ICollectionMeta {
  [key: string]: string,
  name: string,
  desc: string,
  url: string
}

// const GUILD = '1335656368241119352'
// const COLS_CHANNEL = '1340374435294740560'

const GUILD = '877902071968460830'
const COLS_CHANNEL = '913130017117044807'

const BaseUrl = 'https://wax.api.atomicassets.io/atomicassets/v1/collections?page=1&limit=1&order=desc&sort=created'

const FILENAME = './last_col'

export default {
  name: Events.ClientReady,
  // dev: true,
  callback: async (instance) => {
    let last_hash = ''

    if (!existsSync(FILENAME)) {
      writeFileSync(FILENAME, 'test')
    } else {
      last_hash = readFileSync(FILENAME, 'utf8')
    }

    const guild = instance.client.guilds.cache.get(GUILD)!
    const channel = guild.channels.cache.get(COLS_CHANNEL)! as TextChannel

    let r = axios.create({ baseURL: BaseUrl, timeout: 60000, httpsAgent: new https.Agent({ keepAlive: true }), headers: { 'Content-Type': 'application/json' } })

    let col_meta: ICollectionMeta = { name: '', desc: '', url: '' }

    while (true) {
      let resp = (await r.request({ url: BaseUrl }))

      col_meta.desc = ''
      col_meta.url = ''

      if (resp.data?.data[0].data.name) col_meta.name = resp.data?.data[0].data.name
      if (resp.data?.data[0].data.description) col_meta.desc = resp.data?.data[0].data.description
      if (resp.data?.data[0].data.url) col_meta.url = resp.data?.data[0].data.url

      const new_hash = createHash('sha256').update(JSON.stringify(col_meta)).digest('hex')
      if (new_hash === last_hash) continue

      if (col_meta.url.includes('http')) {
        await channel.send(`@everyone\nCollection: ${col_meta.name}\n\nDescription: ${col_meta.desc}\n\nURL: ${col_meta.url}`)
        writeFileSync(FILENAME, new_hash)
        last_hash = new_hash
      }

      await Utils.Sleep(120000)
    }
  }
} as Event