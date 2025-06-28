import { Prisma, Utils } from 'comx'
import { IAppInfo } from './!apps'
import { TextChannel } from 'discord.js'
import axios from 'axios'
import https from 'https'

const TgBaseUrl = `https://api.telegram.org/bot${process.env.token_tg}`

export async function __scrapVersions(app: IAppInfo, channelDiscord: TextChannel, channelTelegramId: string, retry: boolean = false) {
    try {
        await Utils.Sleep(1000)

        const {
            url,
            appid,
            appid_server,
            fmt_name,
        } = app

        const r = axios.create({ timeout: 60000, httpsAgent: new https.Agent({ keepAlive: true }), headers: { 'Content-Type': 'application/json' } })

        let obj = await Prisma.cVersions.findFirst({ where: { appId: appid } })

        let last_known_version_server = '0'
        let last_known_version = '0'

        let pendingDs = true
        let pendingTg = true

        if (obj) {
            last_known_version_server = obj.lastVersionServer
            last_known_version = obj.lastVersion

            if (retry) {
                pendingDs = obj.pendingDs
                pendingTg = obj.pendingTg
            } else {
                await Prisma.cVersions.update({
                    where: { id: obj?.id, appId: appid },
                    data: {
                        pendingDs: true,
                        pendingTg: true,
                    }
                })
            }
        } else {
            await Prisma.cVersions.create({
                data: {
                    appId: appid,
                    lastVersion: last_known_version,
                    lastVersionServer: last_known_version_server,
                    lastChangeNumber: 0,
                    pendingDs: true,
                    pendingTg: true,
                }
            })
        }

        obj = await Prisma.cVersions.findFirst({ where: { appId: appid } })

        const resp = (await r.request({ url: url }))

        const active_ver_server = resp.data.result.deploy_version
        const active_ver = resp.data.result.active_version

        let msg = ''
        let msg_tg = ''

        if (active_ver_server != last_known_version_server) {
            if (pendingDs) msg += `\`${appid_server} — ${fmt_name} Server  ${last_known_version_server} => ${active_ver_server}\`\n`
            if (pendingTg) msg_tg += `\`[v]\`  *${appid_server} — ${fmt_name} Server*  \`${last_known_version_server} => ${active_ver_server}\`\n`
        }

        if (active_ver != last_known_version) {
            if (pendingDs) msg += `\`${appid} — ${fmt_name}  ${last_known_version} => ${active_ver}\``
            if (pendingTg) msg_tg += `\`[v]\`  *${appid} — ${fmt_name}*  \`${last_known_version} => ${active_ver}\``
        }

        if (msg != '' || msg_tg != '') {
            if (pendingTg) {
                const rTg = await axios.post(`${TgBaseUrl}/sendMessage`, {
                    chat_id: channelTelegramId,
                    text: msg_tg,
                    parse_mode: 'markdown',
                }).catch(err => {
                    console.error(err)
                })

                if (rTg?.data.ok) {
                    await Prisma.cVersions.update({
                        where: { id: obj?.id, appId: appid },
                        data: {
                            pendingTg: false,
                        }
                    })
                }
            }

            if (pendingDs) {
                const rDs = await channelDiscord.send(msg)

                if (rDs) {
                    await Prisma.cVersions.update({
                        where: { id: obj?.id, appId: appid },
                        data: {
                            pendingDs: false,
                        }
                    })
                }
            }

            await Prisma.cVersions.update({ where: { id: obj!.id, appId: appid }, data: { lastVersionServer: `${active_ver_server}` } })
            await Prisma.cVersions.update({ where: { id: obj!.id, appId: appid }, data: { lastVersion: `${active_ver}` } })
        }
    } catch (err) {
        console.error(`[${(new Date()).toLocaleString()}] Error from ${app.fmt_name}:\n${err}`)
    }
}