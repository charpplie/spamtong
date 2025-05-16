import { Event, Events, g_Prisma, Utils } from 'comx'
import { TextChannel } from 'discord.js'
import { default as axios } from 'axios'
import https from 'https'

const GUILD = '1150427580734906368'
const CHANNEL = '1173213492153688098'

const curl = 'https://api.steampowered.com/IGCVersion_247040/GetServerVersion/v1/'
const c_url = 'https://api.steampowered.com/IGCVersion_247040/GetClientVersion/v1/'

const appId = '247040'

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
                const resp_server = (await r.request({ url: curl }))
                const resp = (await r.request({ url: c_url }))

                const active_ver_server = resp_server.data.result.active_version
                const active_ver = resp.data.result.active_version

                let msg = ''

                if (active_ver_server != last_known_version_server) {
                    msg += `[247060] Dota 2 Test Server ${last_known_version_server} => ${active_ver_server}\n`
                    last_known_version_server = active_ver_server
                    await g_Prisma.cVersions.update({ where: { id: obj?.id, appId: appId }, data: { lastVersionServer: `${last_known_version_server}` } })
                }

                if (active_ver != last_known_version) {
                    msg += `[247040] Dota 2 Test ${last_known_version} => ${active_ver}`
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