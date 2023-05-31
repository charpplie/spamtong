import { SlashCommand } from '../comx'
import { SlashCommandBuilder } from 'discord.js'


export default {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test'),
  callback: async interaction => {
    await interaction.deferReply()
    await interaction.editReply({
      content: `Ok!`
    })
  },
  isOwnerOnly: true,
  cooldown: '5s'
} as SlashCommand