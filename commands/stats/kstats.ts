import { Message } from 'discord.js'
import axios from 'axios'
import https from 'https'
import * as fs from 'fs'

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

export default {
    callback: async function f(message: Message, ...args: string[]) {
        if (message.author.id != '783443296382746672') return 0

        const tm_url = 'https://tf2.tm/api/v2/prices/RUB.json'
        const tm_r = axios.create({baseURL: tm_url, timeout: 60000, httpsAgent: new https.Agent({keepAlive: true}), headers: {'Content-Type':'application/json'}})
        let tm_resp

        const st_url = 'https://steamcommunity.com/market/priceoverview/?appid=440&currency=5&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key'
        const st_r = axios.create({baseURL: st_url, timeout: 60000, httpsAgent: new https.Agent({keepAlive: true}), headers: {'Content-Type':'application/json'}})
        let st_resp

        let tm_cprice
        let tm_price
        let st_fcprice
        let st_pcprice
        let st_pfcprice
        let st_cprice
        let st_price

        let stchid
        let tmchid
        let everyone = message.guild?.roles.cache.find(r => r.name  === "@everyone")
        while (true) {
            tm_resp = (await tm_r.request({url: tm_url}))

            for (let i = 0; i < (tm_resp.data.items).length; i++) {
                if (tm_resp.data.items[i].market_hash_name != 'Mann Co. Supply Crate Key') {
                } else {
                    tm_cprice = tm_resp.data.items[i].price
                    tm_price = ((Number(tm_cprice) + ((Number(tm_cprice) / 100) * 5.26))).toFixed(2)
                }
            }

            st_resp = (await st_r.request({url: st_url}))

            st_fcprice      = String(st_resp.data.median_price).slice(0, 3)
            st_pcprice      = String(st_resp.data.median_price).slice(4, 6)
            st_pfcprice     = Number(st_pcprice) / 100
            st_cprice       = Number(st_fcprice) + Number(st_pfcprice)
            st_price        = (Number(st_cprice) / 1.15 - 0.01).toFixed(2)

            tmchid = "NULL"

            message.guild?.channels.create("tf2tm " + tm_price, {
                type: 'GUILD_VOICE'
            }).then((channel) => {
                channel.setParent('1054858903768289330')
                channel.permissionOverwrites.set([{
                    id: everyone!,
                    deny: ['CONNECT']
                }])
                tmchid = channel.id
                fs.writeFileSync('tmchannel.txt', channel.name)
            })

            stchid = "NULL"

            message.guild?.channels.create("steam " + st_price, {
                type: 'GUILD_VOICE'
            }).then((channel) => {
                channel.setParent('1054858903768289330')
                channel.permissionOverwrites.set([{
                    id: everyone!,
                    deny: ['CONNECT']
                }])
                stchid = channel.id
                fs.writeFileSync('stchannel.txt', channel.name)
            })

            await sleep(300000)

            message.guild?.channels.delete(tmchid)
            message.guild?.channels.delete(stchid)
        }
    }
}