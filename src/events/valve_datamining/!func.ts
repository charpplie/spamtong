import { Prisma, Utils } from 'comx'
import { IAppInfo } from './!apps'
import { TextChannel } from 'discord.js'
import axios from 'axios'

const TgBaseUrl = `https://api.telegram.org/bot${process.env.token_tg}`

export async function __scrapVersions(app: IAppInfo, channelDiscord: TextChannel, channelTelegramId: string, retry: boolean = false) {
    try {
        const {
            url,
            appid,
            appid_server,
            fmt_name,
        } = app

        let obj = await Prisma.cversions.findFirst({ where: { appId: appid } })

        let last_known_version_server = '0'
        let last_known_version = '0'

        if (obj) {
            last_known_version_server = obj.lastVersionServer
            last_known_version = obj.lastVersion
        } else {
            await Prisma.cversions.create({
                data: {
                    appId: appid,
                    lastVersion: last_known_version,
                    lastVersionServer: last_known_version_server,
                }
            })
        }

        obj = await Prisma.cversions.findFirst({ where: { appId: appid } })

        const resp = await Utils.safeAxios(url,
            {
                maxRetries: 10,
                retryDelay: 1000,
            },
            {
                method: 'POST'
            }
        )

        const active_ver_server = resp.data.result.deploy_version
        const active_ver = resp.data.result.active_version

        let msg = ''
        let msg_tg = ''

        if (active_ver_server != last_known_version_server) {
            msg += `\`${appid_server} — ${fmt_name} Server  ${last_known_version_server} => ${active_ver_server}\`\n`
            msg_tg += `\`[v]\`  *${appid_server} — ${fmt_name} Server*  \`${last_known_version_server} => ${active_ver_server}\`\n`
        }

        if (active_ver != last_known_version) {
            msg += `\`${appid} — ${fmt_name}  ${last_known_version} => ${active_ver}\``
            msg_tg += `\`[v]\`  *${appid} — ${fmt_name}*  \`${last_known_version} => ${active_ver}\``
        }

        if (msg != '' || msg_tg != '') {
            await Utils.safeAxios(`${TgBaseUrl}/sendMessage`,
                {
                    maxRetries: 10,
                    retryDelay: 1000,
                },
                {
                    data: {
                        chat_id: channelTelegramId,
                        text: msg_tg,
                        parse_mode: 'markdown',
                    }
                })

            await channelDiscord.send(msg)

            await Prisma.cversions.update({ where: { id: obj!.id, appId: appid }, data: { lastVersionServer: `${active_ver_server}` } })
            await Prisma.cversions.update({ where: { id: obj!.id, appId: appid }, data: { lastVersion: `${active_ver}` } })
        }
    } catch (err) {
        console.error(`[${(new Date()).toLocaleString()}] Error from ${app.fmt_name}:\n${err}`)
    }
}