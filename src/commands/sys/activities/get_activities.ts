import { SlashCommand } from '@/comx'
import { EmbedBuilder } from 'discord.js'

export default {
  name: 'get-activities',
  description: 'Get all activities',
  guilds: ['1150427580734906368'],
  cooldown: '10s',
  callback: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true })
    if (!client) return

    let commands = ''
    for (let i = 0; i < client?.commands.size; i++) {
      commands += `${client.commands.at(i)?.name}\n`
    }

    let events = ''
    for (let i = 0; i < client?.events.size; i++) {
      events += `${client.events.at(i)?.name}\n`
    }

    const embed = new EmbedBuilder()
      .setColor('DarkPurple')
      .setFooter({ text: `${process.env.footer }`, iconURL: `${process.env.icon}` })
      .setTitle(`List of All Activities`)
      .addFields(
        { name: 'Commands', value: `${commands ?? undefined}`, inline: true },
        { name: 'Events', value: `${events ?? undefined}`, inline: true },
      )

    await interaction.editReply({
      embeds: [embed],
    })
  },
} as SlashCommand