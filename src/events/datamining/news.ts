import { Event, Events, Utils } from 'comx'
import { TextChannel } from 'discord.js'
import { default as axios } from 'axios'
import https from 'https'
import Parser = require('rss-parser')

const GUILD = '1150427580734906368'
const CHANNEL = '1173213492153688098'

// const curl = 'https://api.steampowered.com/IGCVersion_570/GetServerVersion/v1/'
// const c_url = 'https://api.steampowered.com/IGCVersion_570/GetClientVersion/v1/'

export default {
    name: Events.ClientReady,
    // dev: true,
    callback: async (instance) => {
        const guild = instance.client.guilds.cache.get(GUILD)!
        const channel = guild.channels.cache.get(CHANNEL)! as TextChannel

        // const r = axios.create({ timeout: 60000, httpsAgent: new https.Agent({ keepAlive: true }), headers: { 'Content-Type': 'application/json' } })

        // const resp = (await r.request({url: 'https://store.steampowered.com/feeds/news/app/570/?cc=KZ&l=english'}))

        let last_guid = ''

        while (true) {
            const parser = new Parser()
            const resp = await parser.parseURL('https://store.steampowered.com/feeds/news/app/570/?cc=KZ&l=english')
            const guid = resp.items[0].guid?.replace('https://store.steampowered.com/news/app/570/view/', '')!

            if (guid != last_guid) {
                await channel.send(`News ${last_guid} => ${guid}\nLink: ${resp.items[0].guid}`)
                last_guid = guid
            }
        }

        // let last_known_version_server = 0
        // let last_known_version = 0
        // while (true) {
        //     const resp_server = (await r.request({ url: curl }))
        //     const resp = (await r.request({ url: c_url }))

        //     const active_ver_server = resp_server.data.result.active_version
        //     const active_ver = resp.data.result.active_version

        //     let msg = ''

        //     if (active_ver_server != last_known_version_server) {
        //         msg += `[373310] Dota 2 Server ${last_known_version_server} => ${active_ver_server}\n`
        //         last_known_version_server = active_ver_server
        //     }

        //     if (active_ver != last_known_version) {
        //         msg += `[570] Dota 2 ${last_known_version} => ${active_ver}`
        //         last_known_version = active_ver
        //     }

        //     if (msg !== '') {
        //         await channel.send(msg)
        //     }

        //     await Utils.Sleep(60000)
        // }
    }
} as Event