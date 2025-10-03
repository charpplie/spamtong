import { Event, Events, Prisma, Utils } from 'comx'

// //dev
// const ROLE_ID = '1422947433209663568'
// const CHAT_ID = '-1002800988001'
// const GUILD_ID = '1335656368241119352'

// main
const ROLE_ID = '1422976063587352576'
const CHAT_ID = ''
const GUILD_ID = '1421557240476729417'

export default {
    name: Events.ClientReady,
    // dev: true,
    callback: async (instance) => {
        const guild = await instance.client.guilds.cache.get(GUILD_ID)
        const role = guild?.roles.cache.find(role => role.id == ROLE_ID)!
        while (true) {
            await Utils.Sleep(300000)

            const users = await Prisma.wls_private.findMany({ where: { added: true } })

            users.forEach(async user => {
                await Utils.Sleep(1500)
                const tguser = await instance.tgClient.api.getChatMember(CHAT_ID, user.telegram as unknown as number)
                const dsuser = guild?.members.cache.get(user.discord)

                console.log(tguser)

                if (!tguser || tguser.status == 'left' || tguser.status == 'restricted' || tguser.status == 'kicked') {
                    if (!dsuser) {
                        await Prisma.wls_private.delete({ where: { id: user.id } })
                    } else {
                        await Prisma.wls_private.update({ where: { id: user.id }, data: { added: false } })
                        await dsuser.roles.remove(role)
                    }
                }
            })
        }
    }
} as Event