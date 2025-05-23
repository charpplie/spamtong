import { Event, Events, Prisma, Utils } from 'comx'
import { Apps } from './!apps'
import { __scrap } from './!func'
import { TextChannel } from 'discord.js'
import SteamUser from 'steam-user'

const GUILD = '1335656368241119352'
const CHANNEL = '1340374435294740560'

const apps = [
    '570',
    '2305270',
    '247040',
    '1422450',
    '3488080',
    '440',
    '232250',
    '3488100',
    '1422460',
    '247060',
    '2305290',
    '373310',
]

export default {
    name: Events.ClientReady,
    // dev: true,
    callback: async (instance) => {
        const guild = instance.client.guilds.cache.get(GUILD)!

        const user = new SteamUser()
        user.logOn({ anonymous: true })

        user.once('loggedOn', async () => {
            let obj = await Prisma.cVersions.findFirst({ where: { appId: '0' } })

            let lastChangeNumber = 0

            if (obj) {
                lastChangeNumber = obj.lastChangeNumber
            } else {
                await Prisma.cVersions.create({
                    data: {
                        appId: '0',
                        lastVersion: '0',
                        lastVersionServer: '0',
                    }
                })
            }

            obj = await Prisma.cVersions.findFirst({ where: { appId: '0' } })

            while (true) {
                try {
                    await user.getProductChanges(lastChangeNumber, async (error, currentChangeNumber, appChanges) => {
                        if (error) {
                            console.error(error)
                        }

                        if (appChanges.length !== 0) {
                            for (const app of appChanges) {
                                if (apps.includes(app.appid.toString())) {
                                    
                                    const idx = Apps.findIndex(entry => entry.appid === app.appid.toString() || entry.appid_server === app.appid.toString())
                                    const channel = guild.channels.cache.get(Apps[idx].channel) as TextChannel

                                    await __scrap(Apps[idx], channel)
                                }
                            }
                        }

                        lastChangeNumber = currentChangeNumber
                        await Prisma.cVersions.update({ where: { id: obj!.id, appId: '0'}, data: {
                            lastChangeNumber: lastChangeNumber
                        }})
                    })

                    await Utils.Sleep(10000)
                } catch (why) {
                    console.error(`[${(new Date).toLocaleString()}] ${why}`)
                }
            }
        })
        // const channel = guild.channels.cache.get(CHANNEL) as TextChannel

        // channel.send('\`21312313 Dota 2 Staging 3124234 => 213123\`')
        // for (const app of Apps) {
        //     const channel = guild.channels.cache.get(app.channel) as TextChannel

        //     __scrap(app, channel)
        // }
    }
} as Event