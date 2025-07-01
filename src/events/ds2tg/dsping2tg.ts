import { AxiosResponse } from 'axios'
import { Event, Events, Utils } from 'comx'

const TgBaseUrl = `https://api.telegram.org/bot${process.env.token_tg}`
const TgMainChannel = '-1002258088628'
// const TgMainChannel = '-4729112297'

interface INames {
    [key: string]: string
}

const Names: INames = {
    '445661951238995998': 'Никита',
    '783443296382746672': 'Максим',
    '299586224031662085': 'Руслан',
    '440868250335576074': 'Артем Младший',
    '222355127850369024': 'Артем Старший',
}

interface IMedia {
    type: string,
    caption?: string,
    media: string,
}

type Method = 'sendMessage' | 'sendMediaGroup'

async function sendMessage(method: Method, msg: any, data: {}): Promise<AxiosResponse<any, any> | undefined> {
    try {
        return await Utils.safeAxios(`${TgBaseUrl}/${method}`,
            {
                maxRetries: 5,
                retryDelay: 1500,
            },
            {
                method: 'POST',
                data: data
            }
        )
    } catch (why) {
        console.error(why)
        msg.reply('Не смог продублировать сообщение ;( \nСкорее всего это какая-то ошибка на стороне Телеграма. Попробуйте еще раз чуть позже.')
        return undefined
    }
}

export default {
    name: Events.MessageCreate,
    // dev: true,
    callback: async (instance, msg) => {
        if (msg.guild.id != '1150427580734906368'
        || msg.author.bot
        || !(msg.content.includes('@everyone') || msg.content.includes('@here'))) return

        await sendMessage('sendMessage', msg, {
            chat_id: TgMainChannel,
            text: `${Names[msg.author.id]} потревожил нас из другого измерения:`,
        })

        if (msg.attachments.size == 0) {
            await sendMessage('sendMessage', msg, {
                chat_id: TgMainChannel,
                text: `${msg.content}`,
                parse_mode: 'markdown'
            })
        } else {
            let media: IMedia[] = []
            let audio: IMedia[] = []

            msg.attachments.forEach(async (attachment: any) => {
                const type = attachment.contentType.includes('gif') ? 'document' : attachment.contentType.includes('image') ? 'photo' : attachment.contentType.includes('video') ? 'video' : attachment.contentType.includes('audio') ? 'audio' : 'unkown'

                if (type != 'unkown' && type != 'audio') {
                    media.push(
                        {
                            type: type,
                            media: attachment.attachment
                        }
                    )
                } else if (type == 'audio') {
                    audio.push(
                        {
                            type: type,
                            media: attachment.attachment
                        }
                    )
                }
            })

            let msgLongId = undefined
            if (msg.content.length > 1024) {
                const _msg = await sendMessage('sendMessage', msg, {
                    chat_id: TgMainChannel,
                    text: msg.content
                })

                msgLongId = _msg!.data.result.message_id
            } else {
                if (media.length != 0) {
                    media[0].caption = msg.content
                } else {
                    audio[0].caption = msg.content
                }
            }

            if (msgLongId != undefined) {
                if (media.length != 0 && audio.length != 0) {
                    await sendMessage('sendMediaGroup', msg, {
                        chat_id: TgMainChannel,
                        media: media,
                        reply_parameters: {
                            message_id: msgLongId,
                        }
                    })

                    await sendMessage('sendMediaGroup', msg, {
                        chat_id: TgMainChannel,
                        media: audio,
                        reply_parameters: {
                            message_id: msgLongId,
                        }
                    })
                } else {
                    await sendMessage('sendMediaGroup', msg, {
                        chat_id: TgMainChannel,
                        media: media.length != 0 ? media : audio,
                        reply_parameters: {
                            message_id: msgLongId,
                        }
                    })
                }
            } else {
                if (media.length != 0 && audio.length != 0) {
                    const _msg = await sendMessage('sendMediaGroup', msg, {
                        chat_id: TgMainChannel,
                        media: media,
                    })

                    const _msgId = _msg!.data.result[0].message_id

                    await sendMessage('sendMediaGroup', msg, {
                        chat_id: TgMainChannel,
                        media: audio,
                        reply_parameters: {
                            message_id: _msgId,
                        }
                    })
                } else {
                    await sendMessage('sendMediaGroup', msg, {
                        chat_id: TgMainChannel,
                        media: media.length != 0 ? media : audio,
                    })
                }
            }
        }
    }
} as Event