import { Event, Events } from 'comx'
import { MessageReaction, TextChannel } from 'discord.js'

const URL = 'https://libretranslate.com/translate'

const GUILD = '1335656368241119352'

// const GUILD = ''

export default {
    name: Events.MessageReactionAdd,
    dev: true,
    callback: async (instance, reaction: MessageReaction, user) => {
        if (user.bot ||
            reaction.message.guildId != GUILD ||
            reaction.emoji.name != '✨') {
            return
        }

        const guild = await instance.client.guilds.fetch(GUILD)
        const channel = await guild.channels.fetch(reaction.message.channelId) as TextChannel
        const msg = await channel.messages.fetch(reaction.message.id)

        await msg.reactions.cache.find(reaction => reaction.emoji.name == '✨')?.remove()

        const msgContent = reaction.message.content

        if (!msg.hasThread) {
            const translated = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    q: msgContent,
                    source: "auto",
                    target: "en",
                    format: "text",
                    alternatives: 3,
                    api_key: ""
                }),
                headers: { "Content-Type": "application/json" }
            })

            console.log(await translated.json())
            // reaction.message.startThread({
            //     name: 'Нейроржакич'
            // })
            // }).then(async channel => { await channel.send(`${await translated.json()}`) })
        } else {
            // const thread_channel = 
        }
    }
} as Event