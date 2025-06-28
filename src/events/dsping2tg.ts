import { Event, Events, Utils } from 'comx'

const TgBaseUrl = `https://api.telegram.org/bot${process.env.token_tg}`

const TgMainChannel = '-1002258088628'

export default {
    name: Events.MessageCreate,
    // dev: true,
    callback: async (instance, msg) => {
        if (msg.guild.id != '1150427580734906368') return

        if (msg.content.includes('@everyone') || msg.content.includes('@here')) {
            try {
                await Utils.safeAxios(`${TgBaseUrl}/sendMessage`, {
                    maxRetries: 5,
                    retryDelay: 1500,
                }, {
                    method: 'POST',
                    data: {
                        chat_id: TgMainChannel,
                        text: `${msg.author.username} потревожил нас из другого измерения:\n${msg.content}`,
                        parse_mode: 'markdown',
                    }
                })
            } catch (why) {
                msg.reply('Не смог продублировать сообщение ;(. Скорее всего это какая-то ошибка на стороне Телеграма. Попробуйте опять чуть попозже.')
                return
            }
        }
    }
} as Event