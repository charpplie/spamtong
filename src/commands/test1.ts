import { SlashCommand } from '../comx'

export default {
  name: 'test',
  description: 'teedsfdsfdsfst',
  callback: async interaction => {
    await interaction.reply('ok')
  }
} as SlashCommand