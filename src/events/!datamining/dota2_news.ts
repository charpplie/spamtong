import { Event, Events, Utils, g_Prisma } from 'comx'
import { TextChannel } from 'discord.js'
import { default as axios } from 'axios'
import https from 'https'

const GUILD = '1150427580734906368'
const CHANNEL = '1173213492153688098'

const curl = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=570&count=1&feeds=steam_community_announcements'

const appId = 'dota2_news'

export default {
    name: Events.ClientReady,
    // dev: true,
    callback: async (instance) => {
        while (true) {
            try {
                const guild = instance.client.guilds.cache.get(GUILD)!
                const channel = guild.channels.cache.get(CHANNEL)! as TextChannel

                await Parse(channel)
            } catch (why) {
                console.error(`error from d2news:\n${why}`)
            }
        }
    }
} as Event

async function Parse(channel: TextChannel) {
    const r = axios.create({ timeout: 60000, httpsAgent: new https.Agent({ keepAlive: true }), headers: { 'Content-Type': 'application/json' } })

    const obj = await g_Prisma.cVersions.findFirst({ where: { appId: appId } })

    let last_guid = '0'

    if (obj) {
        last_guid = obj.lastVersion
    } else {
        await g_Prisma.cVersions.create({
            data: {
                appId: appId,
                lastVersion: last_guid,
                lastVersionServer: '',
            }
        })
    }

    while (true) {
        const resp = (await r.request({ url: curl }))
        const guid = resp.data.appnews.newsitems[0].gid

        if (guid != last_guid) {
            await channel.send(`News ${last_guid} => ${guid}\nLink: ${resp.data.appnews.newsitems[0].url}`)
            last_guid = guid
            await g_Prisma.cVersions.update({ where: { id: obj?.id, appId: appId }, data: { lastVersion: `${last_guid}` } })
        }

        await Utils.Sleep(15000)
    }
}