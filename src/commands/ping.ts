import { Command, Heleprs } from 'comx'

export default {
    name: 'ping',
    description: 'pong!',
    dev: true,
    callback: async (interaction) => {
        interaction.reply({ embeds: [Heleprs.createEmbed({ title: 'Pong!' })] })
    }
} as Command