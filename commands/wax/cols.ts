import { Message } from 'discord.js'
import axios from 'axios'
import https from 'https'

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

interface ICollectionMeta {
    [key: string]: string,
    name: string,
    desc: string,
    url: string
}

export default {
    callback: async function f(message: Message, ...args: string[]) {
        if (message.author.id != '783443296382746672') return 0
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
        if (col_meta.url.includes('http')) { message.reply(`@everyone\n\nCollection: ${col_meta.name}\n\nDescription: ${col_meta.desc}\n\nURL: ${col_meta.url}`) }
        await sleep(120000)
    }
}}        