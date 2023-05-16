import { SlashCommand } from '../comx'
import { SlashCommandBuilder } from 'discord.js'
import * as si from 'systeminformation'


export default {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test'),
  callback: async interaction => {
    await interaction.deferReply()
    const temp = await si.cpuTemperature()
    await interaction.editReply({
      content: `${temp}`
    })
  },
  isOwnerOnly: true,
} as SlashCommand