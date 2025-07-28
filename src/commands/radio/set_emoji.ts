import { Command, Prisma } from 'comx'
import { CommandInteraction, MessageFlags } from 'discord.js'

interface IUserIds {
    [id: string]: string
}

const IdDs2Tg: IUserIds = {
    '445661951238995998': '1279410794',
    '783443296382746672': '1553839003',
    '299586224031662085': '5098404528',
    '440868250335576074': '7049487492',
    '222355127850369024': '985450956',
}

export default {
    name: 'set_emoji',
    description: 'set_emoji',
    // isOwnerOnly: true,
    guilds: ['1150427580734906368'],
    // guilds: ['1335656368241119352'],
    options: [
        {
            name: 'emoji',
            description: 'emoji',
            type: 'String',
            required: true,
            maxLength: 4,
        }
    ],
    // dev: true,
    callback: async (interaction: CommandInteraction, instance) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        const emoji = interaction.options.get('emoji')?.value as string

        try {
            let user = await Prisma.radio_emojis.findFirst({ where: { userId: `${interaction.user.id}` } })
            let user_tg = await Prisma.radio_emojis.findFirst({ where: { userId: `${IdDs2Tg[interaction.user.id]}` } })

            if (user && user_tg) {
                await Prisma.radio_emojis.update({
                    where: { id: user.id }, data: {
                        emoji: emoji
                    }
                })

                await Prisma.radio_emojis.update({
                    where: { id: user_tg.id }, data: {
                        emoji: emoji
                    }
                })
            } else {
                await Prisma.radio_emojis.create({
                    data: {
                        userId: interaction.user.id,
                        emoji: emoji
                    }
                })

                await Prisma.radio_emojis.create({
                    data: {
                        userId: IdDs2Tg[interaction.user.id],
                        emoji: emoji
                    }
                })
            }

            await interaction.editReply('Ok!')
        } catch (why) {
            await interaction.editReply('чет хуйня какая-то произошла, попробуй еще раз')
            console.error(why)
        }
    }
} as Command