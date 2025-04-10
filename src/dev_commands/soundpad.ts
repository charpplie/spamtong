import { Command, i18n } from 'comx'
import { CommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js'

export default {
    name: 'snd',
    description: 'Soundpad для братков',
    callback: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })
        i18n.setLocale(interaction.locale)

        console.log(`${i18n.__('test.t')}`)
        // const mainEmbed = new EmbedBuilder()
        //     .setColor('DarkPurple')
    },
    guilds: ['1335656368241119352'],
    isOwnerOnly: true,
} as Command