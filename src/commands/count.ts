import { SlashCommand } from '../comx'
import { SlashCommandBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('count')
    .setDescription('count'),
  callback: async interaction => {
    await interaction.reply('1')
  },
  isOwnerOnly: true,
  cooldown: '1d'
} as SlashCommand