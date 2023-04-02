import { SlashCommandBuilder } from 'discord.js'
import { ISlashCommand } from '../types'

const command : ISlashCommand = {
  command: new SlashCommandBuilder().setName('test').setDescription('test command'),
  execute: interaction => {
    interaction.reply({
      content: 'Works!',
      ephemeral: true
    })
  },
  cooldown: 10
}

export default command
