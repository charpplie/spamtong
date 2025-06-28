import { Command } from 'comx'
import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalActionRowComponentBuilder, Events } from 'discord.js'

export default {
    name: 'test',
    description: 'test',
    isOwnerOnly: true,
    guilds: ['1335656368241119352'],
    callback: async (interaction, instance) => {
        const modal = new ModalBuilder()
            .setCustomId('testModal')
            .setTitle('bebranuh')

        const sansKto = new TextInputBuilder()
            .setCustomId('sansKto')
            .setLabel('Sans ktuuuuuuu')
            .setStyle(TextInputStyle.Short)

        const firstRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(sansKto)

        modal.addComponents(firstRow)

        await interaction.showModal(modal)

        instance.client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isModalSubmit()) return

            if (interaction.customId === 'testModal') {
                console.log('a')
                if (interaction.fields.fields.at(0)?.value === 'loh') {
                    await interaction.reply('чеееееееееееееееее *звуки уничтоженного стола*')
                }
            }
        })
    }
} as Command