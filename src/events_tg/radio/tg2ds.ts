import { EventTg } from 'comx'
import { TextChannel } from 'discord.js'
import { RADIO_DSTG_DS_CHANNEL, RADIO_DSTG_DS_GUILD, RADIO_DSTG_TG_GROUP } from 'eshared'

interface INames {
    [key: string]: string
}

const Names: INames = {
    '1279410794': 'Никита',
    '1553839003': 'Максим',
    '5098404528': 'Руслан',
    '440868250335576074': 'Артем Младший',
    '222355127850369024': 'Артем Старший',
}

export default {
    name: 'message',
    dev: true,
    callback: async (instance, ctx) => {
        const message = ctx.update.message!

        console.log(message.chat.id)
        if (message.chat.id !== RADIO_DSTG_TG_GROUP as unknown as Number) return
        const guild = instance.client.guilds.cache.get(RADIO_DSTG_DS_GUILD)
        const channel = guild?.channels.cache.get(RADIO_DSTG_DS_CHANNEL) as TextChannel

        console.log(message.chat.id)

        const name = Names[message.from.id]

        if (message.text) {
            if (message.text.length > 2000) {
                await channel.send(`${name} потревожил нас из другого измерения:`)

                if (message.text.length > 4000) {
                    const p1 = message.text.slice(0, 2000)
                    const p2 = message.text.slice(2000, 4000)
                    const p3 = message.text.slice(4000, 96)

                    await channel.send(p1)
                    await channel.send(p2)
                    await channel.send(p3)
                } else {
                    const p1 = message.text.slice(0, 2000)
                    const p2 = message.text.slice(2000, 4000)

                    await channel.send(p1)
                    await channel.send(p2)
                }
            } else {
                await channel.send(`${name}: ${message.text}`)
            }
        }
    }
} as EventTg