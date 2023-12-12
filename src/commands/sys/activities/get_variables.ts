import { SlashCommand } from '@/comx'
import { IComModel } from '@models/activities'
import { EmbedBuilder } from 'discord.js'

export default {
  name: 'get-variables',
  description: 'Get all the activity variables',
  options: [
    {
      name: 'activity',
      description: 'The activity name to get the variables from',
      type: 'STRING',
      required: true,
    },
  ],
  guilds: ['1150427580734906368'],
  cooldown: '10s',
  callback: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true })

    const activity = interaction.options.get('activity')?.value as string

    if (!client?.commands.has(activity) && !client?.events.has(activity)) {
      await interaction.editReply({
        content: '<:poel:1168156790245040169>',
      })
      return
    }

    const activityDb = await IComModel.findOne({ where: { activity: activity }})
    const activityData: any = activityDb?.get('data')

    let output = ''
    if (activityData !== null) {
      for (let i = 0; i < Object.keys(activityData).length; i++) {
        output += `${Object.keys(activityData)[i]}: ${Object.values(activityData)[i]} \n`
      }
    }

    const embed = new EmbedBuilder()
      .setColor('DarkPurple')
      .setFooter({ text: `${process.env.footer }`, iconURL: `${process.env.icon}` })
      .setTitle(`List of Variables for ${activity}`)
      .setDescription(output || 'undefined')

    await interaction.editReply({
      embeds: [embed],
    })
  },
} as SlashCommand