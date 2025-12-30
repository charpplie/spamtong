import { Event, Events } from 'comx'
import { CHANNELS } from './!mediathreadsdata'

export default {
    name: Events.MessageCreate,
    // dev: true,
    callback: async (instance, message) => {
        if (!CHANNELS.includes(message.channelId)) return

        // const guild = instance.client.guilds.cache.get(GUILD)!
        // const channel = guild.channels.cache.get(message.channelId)! as TextChannel

        // message.attachments.every(async (attachment: any) => {
        //     if (!attachment.contentType.includes('image')) return

        //     const msg = await channel.send(`${attachment.attachment}`)

        if (message.attachments.size != 0) {
            await message.react('🧵')
        }
        // })
        // if (message.attachments.every((attach: any) => attach.contentType.includes('image'))) {
        //     await channel.send()
        //     for (let i = 0; i < Config.EvO.Vcont.Reactions.length; i++) {
        //         await message.react(Config.EvO.Vcont.Reactions[i]).catch((why: any) => console.error(why))
        //     }
        // }
    }
} as Event