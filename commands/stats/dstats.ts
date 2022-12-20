import { Message } from 'discord.js'
import axios from 'axios'
import https from 'https'
import * as fs from 'fs'

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

export default {
    callback: async function f(message: Message, ...args: string[]) {
        if (message.author.id != '783443296382746672') return 0

        const dota_url = 'https://zumvzhjvopgyallrtymo.supabase.co/rest/v1/patches?select=*&releasedAt=not.is.null&order=number.desc&limit=1'
        const dota_req = axios.create({baseURL: dota_url, timeout: 60000, httpsAgent: new https.Agent({keepAlive: true}), headers: {'Content-Type':'application/json'}})
        let dota_resp

        let dota_chid
        let everyone = message.guild?.roles.cache.find(r => r.name  === "@everyone")
        while (true) {
            dota_resp = (await dota_req.request({url: dota_url, headers: {
                apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1bXZ6aGp2b3BneWFsbHJ0eW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjA1ODA4NjEsImV4cCI6MTk3NjE1Njg2MX0.dUj7wiTkNEbyuOsoLqj2VfP7_kkJfJzWuF2AZe2i36Y',
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1bXZ6aGp2b3BneWFsbHJ0eW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjA1ODA4NjEsImV4cCI6MTk3NjE1Njg2MX0.dUj7wiTkNEbyuOsoLqj2VfP7_kkJfJzWuF2AZe2i36Y',
                dnt: '1',
            }}))

            dota_chid = ""

            message.guild?.channels.create("Patch " + dota_resp.data[0].id, {
                type: 'GUILD_VOICE'
            }).then((channel) => {
                channel.setParent('1054858933493301268')
                channel.permissionOverwrites.set([{
                    id: everyone!,
                    deny: ['CONNECT'],
                }])
                dota_chid = channel.id
                fs.writeFileSync('dchannel.txt', channel.name)
            })

            await sleep(2.16e+7)

            message.channel.delete(dota_chid)
        }
    }
}