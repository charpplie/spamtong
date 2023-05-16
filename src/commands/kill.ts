import { SlashCommand } from '../comx'
import { SlashCommandBuilder } from 'discord.js'

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('kill')
    .setDescription('The Heavy is Dead!'),
  callback: async interaction => {
    interaction.reply('The Heavy is Dead!')
    await sleep(4)
    process.exit()
  },
  isOwnerOnly: true
}

export default command
