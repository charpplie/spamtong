import { Event, Events } from 'comx'
import { RADIO_DSTG_DS_CHANNEL, RADIO_DSTG_DS_GUILD, RADIO_DSTG_TG_GROUP } from 'eshared'
import { Message } from 'discord.js'
import { Bot } from 'grammy'
import { InputMediaAudio, InputMediaDocument, InputMediaPhoto, InputMediaVideo } from 'grammy/types'

// async function DsMedia2Tg(client: Bot, message: Message, chatId: number | string) {
//     let media: Array<InputMediaAudio | InputMediaDocument | InputMediaPhoto | InputMediaVideo> = []
//     let audio: Array<InputMediaAudio | InputMediaDocument | InputMediaPhoto | InputMediaVideo> = []

//     message.attachments.forEach(async (attachment: any) => {
//         const type = attachment.contentType.includes('gif') ? 'document' : attachment.contentType.includes('image') ? 'photo' : attachment.contentType.includes('video') ? 'video' : attachment.contentType.includes('audio') ? 'audio' : 'unkown'

//         if (type !== 'unkown' && type !== 'audio') {
//             media.push(
//                 {
//                     type: type,
//                     media: attachment.attachment
//                 }
//             )
//         } else if (type === 'audio') {
//             audio.push(
//                 {
//                     type: type,
//                     media: attachment.attachment
//                 }
//             )
//         }
//     })

//     let msgLongId = undefined
//     if (message.content.length > 1024) {
//         const _msg = await client.api.sendMessage(chatId, message.content, { parse_mode: 'Markdown' })

//         msgLongId = _msg.message_id
//     }
//     else {
//         if (media.length !== 0) {
//             media[0].caption = message.content
//             media[0].parse_mode = 'Markdown'
//         } else {
//             audio[0].caption = message.content
//             audio[0].parse_mode = 'Markdown'
//         }
//     }

//     if (msgLongId !== undefined) {
//         if (media.length != 0 && audio.length != 0) {
//             await client.api.sendMediaGroup(chatId, media, {
//                 reply_parameters: {
//                     message_id: msgLongId,
//                 }
//             })

//             await client.api.sendMediaGroup(chatId, audio, {
//                 reply_parameters: {
//                     message_id: msgLongId,
//                 }
//             })
//         } else {
//             await client.api.sendMediaGroup(chatId, media.length !== 0 ? media : audio, {
//                 reply_parameters: {
//                     message_id: msgLongId,
//                 }
//             })
//         }
//     } else {
//         if (media.length != 0 && audio.length != 0) {
//             const _msg = await client.api.sendMediaGroup(chatId, media)

//             const _msgId = _msg[0].message_id

//             await client.api.sendMediaGroup(chatId, audio, {
//                 reply_parameters: {
//                     message_id: _msgId,
//                 }
//             })
//         } else {
//             await client.api.sendMediaGroup(chatId, media.length !== 0 ? media : audio)
//         }
//     }
// }

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

export default {
    name: Events.MessageCreate,
    // dev: true,
    callback: async (instance, message: Message) => {
        if (message.content.length === 0 || message.author.bot || (message.guild && message.guild.id != RADIO_DSTG_DS_GUILD) || message.channel.id != RADIO_DSTG_DS_CHANNEL) return

        const name = Names[message.author.id]

        if (message.content.length > 4000) {
            await instance.tgClient.api.sendMessage(RADIO_DSTG_TG_GROUP, `${name} потревожил нас из другого измерения:`, { parse_mode: 'Markdown' })
        } else {
            await instance.tgClient.api.sendMessage(RADIO_DSTG_TG_GROUP, `${name}: ${message.content}`, { parse_mode: 'Markdown' })
        }
    }
} as Event