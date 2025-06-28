import { Prisma, Utils } from 'comx'
import { IAppInfo } from './!apps'
import { TextChannel } from 'discord.js'
import axios, { AxiosResponse } from 'axios'
import https from 'https'

export async function __scrapVersions(app: IAppInfo, channelDiscord: TextChannel, channelTelegramId: string, isServer: boolean) {
    try {
        await Utils.Sleep(500)

        const {
            url,
            appid,
            appid_server,
            fmt_name,
        } = app

        let obj = await Prisma.cversions.findFirst({ where: { appId: appid } })

        if (!obj) {
            await Prisma.cversions.create({
                data: {
                    appId: appid,
                    version: '0',
                    versionServer: '0'
                }
            })

            obj = await Prisma.cversions.findFirst({ where: { appId: appid } })
        }

        const last_known_version = isServer ? obj!.versionServer : obj!.version

        const r = axios.create({ timeout: 60000, httpsAgent: new https.Agent({ keepAlive: true }), headers: { 'Content-Type': 'application/json' } })

        const resp = await Utils.retry(() => r.request({ url }), 0)

        const active_version = isServer ? resp.data.result.deploy_version : resp.data.result.active_version

        let data: IAppMsgData | undefined

        if (active_version != last_known_version) {
            data = {
                newVer: active_version,
                oldVer: last_known_version!,
                type: 'STEAM_API',
                appId: isServer ? appid : appid_server,
                fmtName: fmt_name,
                isServer: isServer,
            }
        }

        if (data) {
            while (true) {
                try {
                    await sendMsgTg(data, channelTelegramId)
                    break
                } catch (why) {
                    console.error(why)
                    await Utils.Sleep(2000)
                }
            }

            while (true) {
                try {
                    await sendMsgDs(data, channelDiscord)
                    break
                } catch (why) {
                    console.error(why)
                    await Utils.Sleep(2000)
                }
            }
        }
    } catch (err) {
        console.error(`[${(new Date()).toLocaleString()}] Error from ${app.fmt_name}:\n${err}`)
    }
}

interface IAppMsgData {
    newVer: string,
    oldVer: string,
    type: MsgType,
    appId: string,
    fmtName?: string,
    isServer?: boolean,
}

type MsgType = 'STEAM_API'

const TgBaseUrl = `https://api.telegram.org/bot${process.env.token_tg}`

async function sendMsgTg(data: IAppMsgData, chatId: string): Promise<boolean> {
    try {
        let msg = ''

        switch (data.type) {
            case 'STEAM_API': {
                msg = `\`[v]\`  *${data.appId} — ${data.fmtName}${data.isServer ? ' Server' : ''}*  \`${data.oldVer} => ${data.newVer}\``
                break
            }
        }

        const r = await axios.post(`${TgBaseUrl}/sendMessage`, {
            chat_id: chatId,
            text: msg,
            parse_mode: 'markdown',
        })

        if (r.data.ok) {
            return true
        }

        return false
    } catch (why) {
        console.error(why)

        return false
    }
}

async function sendMsgDs(data: IAppMsgData, channel: TextChannel): Promise<boolean> {
    try {
        let msg = ''

        switch (data.type) {
            case 'STEAM_API': {
                msg = `\`${data.appId} — ${data.fmtName}${data.isServer ? ' Server' : ''}  ${data.oldVer} => ${data.newVer}\``
                break
            }
        }

        const r = await channel.send(msg)

        if (r) {
            return true
        }

        return false
    } catch (why) {
        console.error(why)

        return false
    }
}