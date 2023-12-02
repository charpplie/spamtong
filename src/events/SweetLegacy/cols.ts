import { Event, Events } from '@/comx'
import axios from 'axios'
import https from 'https'

interface ICollectionMeta {
    [key: string]: string,
    name: string,
    desc: string,
    url: string
}

function Sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

const GUILD = '1150427580734906368'
const COLS_CHANNEL = '1176649719213211751'

export default {
  name: Events.ClientReady,
  once: false,
  callback: async (client) => {
    const guild = client.guilds.cache.get(GUILD)
    const channel = guild.channels.cache.get(COLS_CHANNEL)
    const URL_XMT_ = 'https://wax.api.atomicassets.io/atomicassets/v1/collections?page=1&limit=1&order=desc&sort=created'
    let r = axios.create({ baseURL: URL_XMT_, timeout: 60000, httpsAgent: new https.Agent({ keepAlive: true }), headers: {'Content-Type':'application/json'} })
    let col_meta_name_ = "NULL"
    let col_meta: ICollectionMeta = { name: '', desc: '', url: '' }
    while (true) {
      let resp = (await r.request({url: URL_XMT_}))
      col_meta.desc = ''
      col_meta.url = ''
      if(resp.data?.data[0].data.name) col_meta.name = resp.data?.data[0].data.name
      if(resp.data?.data[0].data.description) col_meta.desc = resp.data?.data[0].data.description
      if(resp.data?.data[0].data.url) col_meta.url = resp.data?.data[0].data.url
      if (col_meta.name == col_meta_name_) continue
      col_meta_name_ = col_meta.name
      if (col_meta.url.includes('http')) { channel.send(`Collection: ${col_meta.name}\n\nDescription: ${col_meta.desc}\n\nURL: ${col_meta.url}`) }
      await Sleep(120000)
    }
  }
} as Event