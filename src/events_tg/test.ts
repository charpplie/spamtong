import { EventTg, Prisma, Utils } from 'comx'

const ROLE_ID = '1422947433209663568'
const CHAT_ID = '-1002800988001'

export default {
    name: 'message',
    dev: true,
    callback: async (instance, ctx) => {
        const msg = ctx.update.message!

        if (msg.chat.type != 'private') return

        const guild = instance.client.guilds.cache.get('1335656368241119352')
        if (msg.text?.length != 64) {
            ctx.reply('ты чет не то отправил, проверь еще раз')
            return
        }

        const id = Utils.decrypt(msg.text!, true)
        const user = await Prisma.wls_private.findFirst({ where: { discord: id } })

        if (!user) return

        if (user.added) {
            ctx.reply('Ты уже состоишь в клубе любителей сансика')
            return
        }

        // if (user.telegram) {
        //     ctx.reply('в самом деле не наглей-то')
        //     return
        // }

        if (!guild?.members.cache.get(id)) {
            ctx.reply('чет не нахожу такого, ты точно есть на нашем крутом дискорд сервере?')
            return
        } else {
            ctx.reply('нашел брата, записал брата')
            await Prisma.wls_private.update({ where: { id: user.id }, data: { telegram: `${ctx.message?.from.id}` } })

            const tgUser = await instance.tgClient.api.getChatMember(CHAT_ID, ctx.message?.from.id!)
            if (!tgUser || tgUser.status == 'left' || tgUser.status == 'restricted' || tgUser.status == 'kicked') {
                ctx.reply('не брат ты мне гнида черножопая')
                return
            } else {
                const guild = await instance.client.guilds.cache.get('1335656368241119352')
                const role = guild?.roles.cache.find(role => role.id == ROLE_ID)!
                const member = guild?.members.cache.get(id)
                member?.roles.add(role)
                ctx.reply('Добро пожаловать в мир похоти и разврата, любитель подрюкать писюльку на красивых мужчин!')
                await Prisma.wls_private.update({ where: { id: user.id }, data: { added: true } })
            }
        }
    }
} as EventTg