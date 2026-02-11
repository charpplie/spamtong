import { Event, Events } from 'comx'
import { GUILD, CHANNELS } from './!data'
import { TextChannel } from 'discord.js'

export default {
    name: Events.MessageReactionAdd,
    // dev: true,
    callback: async (instance, reaction, user) => {
        if (user.bot || reaction.message.guildId != GUILD || !CHANNELS.includes(reaction.message.channelId) || reaction._emoji.name != '🧵') return

        const guild = instance.client.guilds.cache.get(GUILD)
        const channel = guild?.channels.cache.get(reaction.message.channelId) as TextChannel
        const msg = await channel.messages.fetch(reaction.message.id)

        if (!msg.hasThread) {
            msg.startThread({
                name: 'Ржаксорофлс',
                reason: 'захотелось'
            })
            
            await msg.reactions.cache.find(reaction => reaction.emoji.name == '🧵')?.remove()
        }
    }
} as Event