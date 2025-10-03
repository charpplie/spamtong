import { EventTg, Prisma, Utils } from 'comx'

//dev
// const ROLE_ID = '1422947433209663568'
// const CHAT_ID = '-1002800988001'
// const GUILD_ID = '1335656368241119352'

//main
const ROLE_ID = '1422976063587352576'
const CHAT_ID = '-1002800988001'
const GUILD_ID = '1421557240476729417'

export default {
    name: 'message',
    // dev: true,
    callback: async (instance, ctx) => {
        const msg = ctx.update.message!

        if (msg.chat.type != 'private') return

        const guild = instance.client.guilds.cache.get(GUILD_ID)
        if (msg.text?.length != 64) {
            ctx.reply('Получен неправильный код авторизации. Проверьте правильность введенных данных или обратитесь к администрации для получения помощи')
            return
        }

        const id = Utils.decrypt(msg.text!, true)
        const user = await Prisma.wls_private.findFirst({ where: { discord: id } })

        if (!user) return

        if (user.added) {
            ctx.reply('Вы уже являетесь участником приватной группы')
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
            ctx.reply('Получен верный код авторизации, проверяю наличествование пользователя в приватной группе Telegram...')
            await Prisma.wls_private.update({ where: { id: user.id }, data: { telegram: `${ctx.message?.from.id}` } })

            const tgUser = await instance.tgClient.api.getChatMember(CHAT_ID, ctx.message?.from.id!)
            if (!tgUser || tgUser.status == 'left' || tgUser.status == 'restricted' || tgUser.status == 'kicked') {
                ctx.reply('Вы или не состоите в приватной группе Telegram, или исключены из нее')
                return
            } else {
                const guild = await instance.client.guilds.cache.get(GUILD_ID)
                const role = guild?.roles.cache.find(role => role.id == ROLE_ID)!
                const member = guild?.members.cache.get(id)
                member?.roles.add(role)
                ctx.reply('Регистрация успешна пройдена')
                await Prisma.wls_private.update({ where: { id: user.id }, data: { added: true } })
            }
        }
    }
} as EventTg