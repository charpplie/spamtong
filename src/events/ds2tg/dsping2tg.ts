import { Event, Events, Utils } from 'comx'

const TgBaseUrl = `https://api.telegram.org/bot${process.env.token_tg}`
const TgMainChannel = '-1002258088628'

interface INames {
    [key: string]: string
}

const Names: INames = {
    '445661951238995998': 'Никита',
    '783443296382746672': 'Максим',
    '299586224031662085': 'Руслан',
    '440868250335576074': 'Артем Младший',
    '222355127850369024': 'Артем Старший'
}

export default {
    name: Events.MessageCreate,
    callback: async (instance, msg) => {
        if (msg.guild.id != '1150427580734906368' || msg.author.bot) return

        if (msg.content.includes('@everyone') || msg.content.includes('@here')) {
            try {
                await Utils.safeAxios(`${TgBaseUrl}/sendMessage`,
                    {
                        maxRetries: 5,
                        retryDelay: 1500,
                    },
                    {
                        method: 'POST',
                        data: {
                            chat_id: TgMainChannel,
                            text: `${Names[msg.author.id]} потревожил нас из другого измерения:\n${msg.content}`,
                            parse_mode: 'markdown',
                        }
                    })
            } catch (why) {
                msg.reply('Не смог продублировать сообщение ;(\nСкорее всего это какая-то ошибка на стороне Телеграма. Попробуйте опять чуть попозже.')
                return
            }
        }
    }
} as Event