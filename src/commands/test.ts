import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../comx'

export default {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test'),
  callback: async interaction => {
    
  }
} as SlashCommand