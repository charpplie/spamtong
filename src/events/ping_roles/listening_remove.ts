import { Event, Events } from 'comx'
import { MessageReaction, TextChannel } from 'discord.js'
import { EmojiKeys, EmojiSets } from './!content'


// const GUILD_ID = '1430913640525201501'
// const CHANNEL_ID = '1430913643091853334'
// const AUTHOR_ID = '1334933369837846548'

const AUTHOR_ID = '912326828574773299'
const GUILD_ID = '1150427580734906368'
const CHANNEL_ID = '1435241553152184392'

const MSG_VALIDATE_SEQ = '#PingRoles'

export default {
    name: Events.MessageReactionRemove,
    // dev: true,
    callback: async (instance, react: MessageReaction, user) => {
        if (react.message.guildId != GUILD_ID || react.message.channelId != CHANNEL_ID || !EmojiKeys.includes(react.emoji.id!)) return

        const guild = instance.client.guilds.cache.get(GUILD_ID)!
        const channel = guild.channels.cache.get(CHANNEL_ID) as TextChannel
        const msg = await channel.messages.fetch(react.message.id)
        if (msg.author.id != AUTHOR_ID || !msg.content.startsWith(MSG_VALIDATE_SEQ)) return

        const member = guild.members.cache.get(user.id)
        const role = guild.roles.cache.get(EmojiSets[react.emoji.id!])!

        member?.roles.remove(role)

    }
} as Event
