import { Event, Events, Utils, g_Prisma } from 'comx'
import { TextChannel } from 'discord.js'
import { default as axios } from 'axios'
import https from 'https'

const GUILD = '1150427580734906368'
const CHANNEL = '1173213492153688098'

const curl = 'https://api.steampowered.com/IGCVersion_2305270/GetServerVersion/v1/'
const c_url = 'https://api.steampowered.com/IGCVersion_2305270/GetClientVersion/v1/'

const appId = '2305270'

export default {
    name: Events.ClientReady,
    callback: async (instance) => {
        try {
            const guild = instance.client.guilds.cache.get(GUILD)!
            const channel = guild.channels.cache.get(CHANNEL)! as TextChannel

            const r = axios.create({ timeout: 60000, httpsAgent: new https.Agent({ keepAlive: true }), headers: { 'Content-Type': 'application/json' } })

            const obj = await g_Prisma.cVersions.findFirst({ where: { appId: appId } })

            let last_known_version_server = '0'
            let last_known_version = '0'

            if (obj) {
                last_known_version_server = obj.lastVersionServer
                last_known_version = obj.lastVersion
            } else {
                await g_Prisma.cVersions.create({
                    data: {
                        appId: appId,
                        lastVersion: last_known_version,
                        lastVersionServer: last_known_version_server,
                    }
                })
            }

            while (true) {
                console.log(`Current version: ${last_known_version}. Looking for staging updates...`)
                const resp_server = (await r.request({ url: curl }))
                const resp = (await r.request({ url: c_url }))

                const active_ver_server = resp_server.data.result.active_version
                const active_ver = resp.data.result.active_version

                let msg = ''

                if (active_ver_server != last_known_version_server) {
                    msg += `[2305290] Dota 2 Staging Server ${last_known_version_server} => ${active_ver_server}\n`
                    last_known_version_server = active_ver_server
                    await g_Prisma.cVersions.update({ where: { id: obj?.id, appId: appId }, data: { lastVersionServer: `${last_known_version_server}` } })
                }

                if (active_ver != last_known_version) {
                    msg += `[2305270] Dota 2 Staging ${last_known_version} => ${active_ver}`
                    last_known_version = active_ver
                    await g_Prisma.cVersions.update({ where: { id: obj?.id, appId: appId }, data: { lastVersion: `${last_known_version}` } })
                }

                if (msg !== '') {
                    await channel.send(msg)
                }

                await Utils.Sleep(60000)
            }
        } catch (why) {
            console.error(why)
        }
    }
} as Event