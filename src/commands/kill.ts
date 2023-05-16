import { SlashCommand } from '../comx'
import { SlashCommandBuilder } from 'discord.js'

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('kill')
    .setDescription('The Heavy is Dead!'),
  callback: async interaction => {
    exit(0)
  },
  isOwnerOnly: true
}

export default command
