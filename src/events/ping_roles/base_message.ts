import { Event, Events, Utils } from 'comx'
import { TextChannel } from 'discord.js'
import { writeFileSync } from 'fs'
import { EmojiSets, PING_ROLES_FILENAME } from './!content'

// const GUILD_ID = '1430913640525201501'
// const CHANNEL_ID = '1430913643091853334'
// const AUTHOR_ID = '1334933369837846548'

const AUTHOR_ID = '912326828574773299'
const GUILD_ID = '1150427580734906368'
const CHANNEL_ID = '1435241553152184392'

const MSG_VALIDATE_SEQ = '#PingRoles'
const MSG_CONTENT = '\nВыбираем себе крутые роли'

export default {
    name: Events.ClientReady,
    // dev: true,
    callback: async (instance) => {
        const guild = instance.client.guilds.cache.get(GUILD_ID)
        const channel = guild?.channels.cache.get(CHANNEL_ID) as TextChannel
        let msg = (await Utils.fetchMessages(channel, 1)).at(0)!

        if (!msg || !msg.content.startsWith(MSG_VALIDATE_SEQ) || msg.author.id != AUTHOR_ID) {
            msg = await channel.send(MSG_VALIDATE_SEQ + MSG_CONTENT)
            // writeFileSync(PING_ROLES_FILENAME, msg.id)

            for (let EmojiSet in EmojiSets) {
                await msg.react(EmojiSet)
            }

            return
        }

        const emojis = msg.reactions.cache.map(react => react.emoji.id)

        for (let EmojiSet in EmojiSets) {
            if (!emojis.includes(EmojiSet)) {
                await msg.react(EmojiSet)
            }
        }
    }
} as Event