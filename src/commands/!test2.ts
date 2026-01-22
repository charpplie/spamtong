import { Command, Prisma, Utils } from 'comx'
import { MessageFlags } from 'discord.js'

const ROLE_ID = '1422947433209663568'
// const ROLE_ID = '1422976063587352576'
const CHAT_ID = '-1002800988001'

export default {
    name: 'verify',
    description: 'test verify',
    dev: true,
    guilds: ['1335656368241119352'],
    callback: async (interaction, instance) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        const id = interaction.user.id
        const user = await Prisma.wls_private.findFirst({ where: { discord: id } })

        if (!user) {
            await interaction.editReply('Боюсь, что доступ в приватку тебе закрыт')
            return
        }

        if (user.added) {
            await interaction.editReply('Ты уже состоишь в клубе любителей сансика')
            return
        }

        const chatMember = await instance.tgClient.api.getChatMember(CHAT_ID, user.telegram as unknown as number)

        if (!chatMember) {
            await interaction.editReply('Боюсь, что доступ в приватку тебе закрыт')
            return
        }

        const guild = interaction.guild
        const role = guild?.roles.cache.find(role => role.id == ROLE_ID)!
        const member = guild?.members.cache.get(id)
        member?.roles.add(role)
        await Prisma.wls_private.update({ where: { id: user.id }, data: { added: true } })

        await interaction.editReply('Добро пожаловать в мир похоти и разврата, любитель подрюкать писюльку на красивых мужчин!')
    }
} as Command