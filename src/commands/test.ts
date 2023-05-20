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
      content: `Core#1: ${temp.cores[0]}\tCore#2: ${temp.cores[1]}\nSocket: ${temp.socket}`
    })
  },
  isOwnerOnly: true,
  cooldown: '5s'
} as SlashCommand