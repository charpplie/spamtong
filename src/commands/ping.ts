import { Command } from 'comx'

export default {
    name: 'ping',
    description: 'pong!',
    callback: async (interaction) => {
        interaction.reply('pong!')
    }
} as Command