import { Event, Events, Utils, g_Prisma } from 'comx'
import { TextChannel } from 'discord.js'
import Parser = require('rss-parser')
import { Jukai } from '../../public/classes/jukai'

const GUILD = '1150427580734906368'
const CHANNEL = '1173213492153688098'

const appId = 'dota2_news'

export default {
    name: Events.ClientReady,
    callback: async (instance) => {
        while (true) {
            try {
                await Parse(instance)
            } catch (why) {
                console.error(why)
            }
        }
    }
} as Event

async function Parse(instance: Jukai) {
    const guild = instance.client.guilds.cache.get(GUILD)!
    const channel = guild.channels.cache.get(CHANNEL)! as TextChannel

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
        const parser = new Parser()
        const resp = await parser.parseURL('https://store.steampowered.com/feeds/news/app/570/?cc=KZ&l=english')
        const guid = resp.items[0].guid?.replace('https://store.steampowered.com/news/app/570/view/', '')!
        console.log(`[DOTA2_NEWS] Last known news: ${last_guid}\tLast RSS feed news: ${guid}\tLooking for news...\n`)

        if (guid != last_guid) {
            await channel.send(`News ${last_guid} => ${guid}\nLink: ${resp.items[0].guid}`)
            last_guid = guid
            await g_Prisma.cVersions.update({ where: { id: obj?.id, appId: appId }, data: { lastVersion: `${last_guid}` } })
        }

        await Utils.Sleep(60000)
    }
}