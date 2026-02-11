import { Event, Events } from 'comx'
import { MessageReaction, TextChannel, User } from 'discord.js'

// const GUILD = '1335656368241119352'
// const EXCLUDE_CHANNELS = ['1471118916364406857']
// const PHOTO_CHANNEL = '1471118916364406857'
// const VIDEO_CHANNEL = '1340374435294740560'

const GUILD = '1150427580734906368'
const EXCLUDE_CHANNELS = ['1181427849303965768', '1387774526967910591', '1384511705219862598', '1387772569561731143']
const PHOTO_CHANNEL = '1387774526967910591'
const VIDEO_CHANNEL = '1181427849303965768'

export default {
    name: Events.MessageReactionAdd,
    // dev: true,
    callback: async (instance, reaction: MessageReaction, user: User) => {
        if (user.bot ||
            reaction.message.guildId != GUILD ||
            EXCLUDE_CHANNELS.includes(reaction.message.channelId) ||
            reaction.emoji.name != '🔟') {
            return
        }

        const guild = instance.client.guilds.cache.get(GUILD)
        const channel = guild?.channels.cache.get(reaction.message.channelId) as TextChannel
        const message = await channel.messages.fetch(reaction.message.id)

        let isProccessedAlready = false
        const reactions = message.reactions.cache.get('🔟')
        const reactsCount = (await reaction.users.fetch()).size
        if (reactsCount > 1) isProccessedAlready = true

        if (isProccessedAlready) {
            return
        }

        if (message.attachments.size == 0) {
            return
        }

        if (message.attachments.at(0)?.contentType?.startsWith('image/')) {
            const media_channel = await guild?.channels.fetch(PHOTO_CHANNEL) as TextChannel
            await media_channel.send(`[Фоторжамба](${message.attachments.at(0)?.url}) от нашего любимчика ${message.author.displayName}`).then(msg => msg.react('🧵'))
        } else if (message.attachments.at(0)?.contentType?.startsWith('video/')) {
            const media_channel = await guild?.channels.fetch(VIDEO_CHANNEL) as TextChannel
            await media_channel.send(`[Видеапрекол](${message.attachments.at(0)?.url}) от нашего любимчика ${message.author.displayName}`).then(msg => msg.react('🧵'))
        }
    }
} as Event