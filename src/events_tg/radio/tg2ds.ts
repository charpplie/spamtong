import { EventTg, Prisma, Config } from 'comx'
import { TextChannel } from 'discord.js'

interface INames {
    [key: string]: string
}

const Names: INames = {
    '1279410794': 'Никита',
    '1553839003': 'Максим',
    '5098404528': 'Руслан',
    '7049487492': 'Артем Младший',
    '985450956': 'Артем Старший',
}

export default {
    name: 'message',
    // dev: true,
    callback: async (instance, ctx) => {
        const message = ctx.update.message!

        if (`${message.chat.id}` !== Config.EvO.Radio.Telegram.Channel) return

        const guild = instance.client.guilds.cache.get(Config.EvO.Radio.Discord.Guild)
        const channel = guild?.channels.cache.get(Config.EvO.Radio.Discord.Channel) as TextChannel

        const emoji_obj = await Prisma.radio_emojis.findFirst({ where: { userId: `${message.from.id}` } })
        const emoji = emoji_obj?.emoji ?? ''
        const name = `${Names[message.from.id]}`

        if (message.text) {
            if (message.text.length > 2000) {
                await channel.send(`**<${name}${emoji}>** потревожил нас из другого измерения:`)

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
                await channel.send(`**<${name}${emoji}>** ${message.text}`)
            }
        }
    }
} as EventTg