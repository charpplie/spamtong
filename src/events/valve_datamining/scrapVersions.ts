import { Event, Events } from 'comx'
import { Apps } from './!apps'
import { __scrap } from './!func'
import { TextChannel } from 'discord.js'

const GUILD = '1335656368241119352'
const CHANNEL = '1340374435294740560'

export default {
    name: Events.ClientReady,
    // dev: true,
    callback: async (instance) => {
        const guild = instance.client.guilds.cache.get(GUILD)!
        // const channel = guild.channels.cache.get(CHANNEL) as TextChannel
        // channel.send('\`21312313 Dota 2 Staging 3124234 => 213123\`')
        for (const app of Apps) {
            const channel = guild.channels.cache.get(app.channel) as TextChannel

            __scrap(app, channel)
        }
    }
} as Event