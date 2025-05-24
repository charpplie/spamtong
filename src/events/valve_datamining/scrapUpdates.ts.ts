import { Event, Events, Prisma, Utils } from 'comx'
import { AppIds, AppInfos } from './!apps'
import { __scrapVersions } from './!func'
import { TextChannel } from 'discord.js'
import SteamUser from 'steam-user'

const GUILD = '1335656368241119352'
// const CHANNEL = '1340374435294740560'

const CHANNEL_TG = '-1002308379884' //main
// const CHANNEL_TG = '-1002566844049'

export default {
    name: Events.ClientReady,
    dev: true,
    callback: async (instance) => {
        const guild = instance.client.guilds.cache.get(GUILD)!
        // const channel = guild.channels.cache.get(CHANNEL) as TextChannel

        // await __scrapVersions(AppInfos[0], channel, CHANNEL_TG)

        const user = new SteamUser()
        user.logOn({ anonymous: true })

        user.once('loggedOn', async () => {
            let obj = await Prisma.cVersions.findFirst({ where: { appId: '0' } })

            let lastChangeNumber = 0

            if (obj) {
                lastChangeNumber = obj.lastChangeNumber!
            } else {
                await Prisma.cVersions.create({
                    data: {
                        appId: '0',
                        lastVersion: '0',
                        lastVersionServer: '0',
                        lastChangeNumber: 0
                    }
                })
            }

            // console.log(lastChangeNumber)

            obj = await Prisma.cVersions.findFirst({ where: { appId: '0' } })

            while (true) {
                try {
                    await user.getProductChanges(29158837, async (error, currentChangeNumber, appChanges) => {
                        if (error) {
                            console.error(error)
                        }

                        console.log(appChanges)

                        if (appChanges.length !== 0) {
                            for (const app of appChanges) {
                                if (AppIds.includes(app.appid.toString())) {

                                    const idx = AppInfos.findIndex(entry => entry.appid === app.appid.toString() || entry.appid_server === app.appid.toString())
                                    const channel = guild.channels.cache.get(AppInfos[idx].channel) as TextChannel

                                    await __scrapVersions(AppInfos[idx], channel, CHANNEL_TG)
                                }
                            }
                        }

                        lastChangeNumber = currentChangeNumber
                        await Prisma.cVersions.update({
                            where: { id: obj!.id, appId: '0' }, data: {
                                lastChangeNumber: lastChangeNumber
                            }
                        })
                    })

                    await Utils.Sleep(10000)
                } catch (why) {
                    console.error(`[${(new Date).toLocaleString()}] ${why}`)
                }
            }
        })
    }
} as Event