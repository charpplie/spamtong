import { SlashCommand } from 'comx'
import { CommandInteraction } from 'discord.js'

export default {
  name: 'meta',
  description: 'sdfdsf',
  // dm_permission: true,
  guilds: ['1185089418395123763'],
  cooldown: {
    amount: 1,
    multiplier: 'Minutes',
    type: 'Per User',
    ownerBypass: true
  },
  callback: async (interaction: CommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })
  }
} as SlashCommand