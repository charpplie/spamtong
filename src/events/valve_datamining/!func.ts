import { Utils, g_Prisma } from 'comx'
import { IAppInfo } from './!apps'
import { TextChannel } from 'discord.js'
import { default as axios } from 'axios'
import https from 'https'

export async function __scrap(app: IAppInfo, channel: TextChannel) {
    while (true) {
        try {
            const {
                url,
                appid,
                appid_server,
                fmt_name,
                interval,
            } = app

            const r = axios.create({ timeout: 60000, httpsAgent: new https.Agent({ keepAlive: true }), headers: { 'Content-Type': 'application/json' } })

            let obj = await g_Prisma.cVersions.findFirst({ where: { appId: appid } })

            let last_known_version_server = '0'
            let last_known_version = '0'

            if (obj) {
                last_known_version_server = obj.lastVersionServer
                last_known_version = obj.lastVersion
            } else {
                await g_Prisma.cVersions.create({
                    data: {
                        appId: appid,
                        lastVersion: last_known_version,
                        lastVersionServer: last_known_version_server,
                    }
                })
            }

            obj = await g_Prisma.cVersions.findFirst({ where: { appId: appid } })

            while (true) {
                const resp = (await r.request({ url: url }))

                const active_ver_server = resp.data.result.deploy_version
                const active_ver = resp.data.result.active_version

                let msg = ''

                if (active_ver_server != last_known_version_server) {
                    msg += `\`${appid_server} — ${fmt_name} Server  ${last_known_version_server} => ${active_ver_server}\`\n`
                    last_known_version_server = active_ver_server
                    await g_Prisma.cVersions.update({ where: { id: obj?.id, appId: appid }, data: { lastVersionServer: `${last_known_version_server}` } })
                }

                if (active_ver != last_known_version) {
                    msg += `\`${appid} — ${fmt_name}  ${last_known_version} => ${active_ver}\``
                    last_known_version = active_ver
                    await g_Prisma.cVersions.update({ where: { id: obj?.id, appId: appid }, data: { lastVersion: `${last_known_version}` } })
                }

                if (msg != '') {
                    await channel.send(msg)
                }

                await Utils.Sleep(interval)
            }
        } catch (why) {
            console.error(`[${(new Date()).toLocaleString()}] Error from ${app.fmt_name}:\n${why}`)
        }
    }
}