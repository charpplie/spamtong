import { Command, Prisma, Utils } from 'comx'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js'

export default {
    name: 'link',
    description: 'Привязать Telegram к Discord аккаунта',
    // dev: true,
    guilds: ['1421557240476729417'],
    callback: async (interaction, instance) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral, withResponse: true })

        const id = interaction.user.id
        const user = await Prisma.wls_private.findFirst({ where: { discord: id } })

        if (user) {
            const rereg = new ButtonBuilder().setCustomId('rereg').setLabel('Запросить повторную регистрацию').setStyle(ButtonStyle.Primary)

            const row: any = new ActionRowBuilder().addComponents(rereg)

            const response = await interaction.editReply({
                content: 'Вы уже зарегистрированы.\nЭто не так? Можете начать процесс регистрации заново с помощью кнопки ниже или написать любому администратору для решения данного вопроса',
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
                    await confirmation.reply({ content: 'Успешно! Можете пробовать пройти регистрацию повторно', flags: MessageFlags.Ephemeral })
                }
            } catch {
                await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] })
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
            await interaction.editReply(`Запрос на регистрацию получен. Для прохождения регистрации отправьте данный код авторизации \`\`\`${hash}\`\`\` нашему боту в Telegram - @wholelottalocsobot`)
        }
    }
} as Command