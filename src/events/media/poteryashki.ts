import { Event, Events } from 'comx'
import { MessageReaction, TextChannel, User } from 'discord.js'

const GUILD = '1335656368241119352'
const EXCLUDE_CHANNELS = ['1471118916364406857']
const PHOTO_CHANNEL = '1471118916364406857'
const VIDEO_CHANNEL = '1340374435294740560'

// const GUILD = '1150427580734906368'
// const EXCLUDE_CHANNELS = ['1181427849303965768', '1387774526967910591', '1384511705219862598', '1387772569561731143']
// const PHOTO_CHANNEL = '1387774526967910591'
// const VIDEO_CHANNEL = '1181427849303965768'

export default {
    name: Events.MessageReactionAdd,
    dev: true,
    callback: async (instance, reaction: MessageReaction, user: User) => {
        if (user.bot ||
            reaction.message.guildId != GUILD ||
            EXCLUDE_CHANNELS.includes(reaction.message.channelId) ||
            reaction.emoji.name != '🔟') {
            return
        }

        const guild = instance.client.guilds.cache.get(GUILD)!
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

        const member = await guild.members.fetch(user.id)

        const attachmentsCount = message.attachments.size

        let photos: string[] = []
        let videos: string[] = []
        for (let i = 0; i < attachmentsCount; i++) {
            if (message.attachments.at(i)?.contentType?.startsWith('image/')) {
                photos.push(message.attachments.at(i)?.url!)
            }

            if (message.attachments.at(i)?.contentType?.startsWith('video/')) {
                videos.push(message.attachments.at(i)?.url!)
            }
        }

        const fromUser = `от нашего любимчика ${member.nickname} (${message.author.displayName})`

        const photosSize = photos.length
        if (photosSize > 0) {
            let text = ''

            for (let i = 0; i < photosSize; i++) {
                text += `[${i + 1}](${photos[i]}) `
            }

            text += `\n${photosSize == 1 ? 'Фоторжамба' : 'Фоторжамбы'}`

            const mediaChannel = await guild.channels.fetch(PHOTO_CHANNEL) as TextChannel
            await mediaChannel.send(`${text} ${fromUser}`).then(msg => msg.react('🧵'))
        }

        const videosSize = videos.length
        if (videosSize > 0) {
            let text = ''

            for (let i = 0; i < videosSize; i++) {
                text += `[${i + 1}](${videos[i]}) `
            }

            text += `\n${videosSize == 1 ? 'Видеапрекол' : 'Видеапреколы'}`

            const mediaChannel = await guild.channels.fetch(VIDEO_CHANNEL) as TextChannel
            await mediaChannel.send(`${text} ${fromUser}`).then(msg => msg.react('🧵'))
        }
    }
} as Event