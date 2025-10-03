import { Command, Prisma, Utils } from 'comx'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js'

export default {
    name: 'link',
    description: 'test link',
    dev: true,
    guilds: ['1335656368241119352'],
    callback: async (interaction, instance) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral, withResponse: true })

        const id = interaction.user.id
        const user = await Prisma.wls_private.findFirst({ where: { discord: id } })

        if (user) {
            const rereg = new ButtonBuilder().setCustomId('rereg').setLabel('рега заново').setStyle(ButtonStyle.Primary)

            const row: any = new ActionRowBuilder().addComponents(rereg)

            const response = await interaction.editReply({
                content: 'Братанчик, ты уже зареган.\nЭто не так? Можешь начать процесс регистрации заново с помощью кнопОчки ниже или написать любому администратору для решения этого вопроса, лох ебанный',
                components: [row],

            })

            const collectorFilter = (i: any) => i.user.id === interaction.user.id

            try {
                const confirmation = await interaction.channel?.awaitMessageComponent({
                    filter: collectorFilter,
                    time: 60_000,
                })

                if (confirmation?.customId == 'rereg') {
                    await Prisma.wls_private.delete({ where: { id: user.id } })
                    await confirmation.reply({ content: 'Можешь пробовать еще раз', flags: MessageFlags.Ephemeral})
                }
            } catch {
                await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
            }
        } else {
            await Prisma.wls_private.create({
                data: {
                    discord: id,
                    telegram: '',
                    added: false,
                }
            })

            const hash = Utils.encrypt(`${interaction.user.id}`, true)
            await interaction.editReply(`Услышал брат, отправь вот этот вот текстик ${hash} вот этому ботику в телеграмике @wholelottalocsobot`)
        }
    }
} as Command