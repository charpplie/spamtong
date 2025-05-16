import { Event, Events, Utils } from 'comx'
import { default as axios } from 'axios'
import https from 'https'
import { TextChannel } from 'discord.js'

const GUILD = '1150427580734906368'
const CHANNEL = '1173213492153688098'

const curl = 'https://api.steampowered.com/IGCVersion_2305270/GetServerVersion/v1/'
const c_url = 'https://api.steampowered.com/IGCVersion_2305270/GetClientVersion/v1/'

export default {
    name: Events.ClientReady,
    // dev: true,
    callback: async (instance) => {
        const guild = instance.client.guilds.cache.get(GUILD)!
        const channel = guild.channels.cache.get(CHANNEL)! as TextChannel

        const r = axios.create({ timeout: 60000, httpsAgent: new https.Agent({ keepAlive: true }), headers: { 'Content-Type': 'application/json' } })

        let last_known_version_server = 0
        let last_known_version = 0
        while (true) {
            const resp_server = (await r.request({ url: curl }))
            const resp = (await r.request({ url: c_url }))

            const active_ver_server = resp_server.data.result.active_version
            const active_ver = resp.data.result.active_version

            let msg = ''

            if (active_ver_server != last_known_version_server) {
                msg += `[2305290] Dota 2 Staging Server ${last_known_version_server} => ${active_ver_server}\n`
                last_known_version_server = active_ver_server
            }

            if (active_ver != last_known_version) {
                msg += `[2305270] Dota 2 Staging ${last_known_version} => ${active_ver}`
                last_known_version = active_ver
            }

            if (msg !== '') {
                await channel.send(msg)
            }
            
            await Utils.Sleep(60000)
        }
    }
} as Event