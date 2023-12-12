import { SlashCommand } from '@/comx'
import { IComModel, IComData } from '@models/activities'

export default {
  name: 'delete-variable',
  description: 'Delete a variable from activity',
  options: [
    {
      name: 'activity',
      description: 'The activity name to remove the variable from',
      type: 'STRING',
      required: true,
    },
    {
      name: 'variable-name',
      description: 'The variable name to delete',
      type: 'STRING',
      required: true,
    },
  ],
  isOwnerOnly: true,
  guilds: ['1150427580734906368'],
  cooldown: '10s',
  callback: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true })

    const activity = interaction.options.get('activity')?.value as string
    const varName = interaction.options.get('variable-name')?.value as string

    if (!client?.commands.has(activity) && !client?.events.has(activity)) {
      await interaction.editReply({
        content: '<:poel:1168156790245040169>',
      })
      return
    }

    const activityDb = await IComModel.findOne({ where: { activity: activity }})
    const activityData: any = activityDb?.get('data')

    let data: IComData = {}

    for (let i = 0; i < Object.keys(activityData).length; i++) {
      if (varName == `${Object.keys(activityData)[i]}`) continue
      else data[`${Object.keys(activityData)[i]}`] = `${Object.values(activityData)[i]}`
    }

    activityDb?.update({
      data: data,
    })

    await interaction.editReply({
      content: 'Ok!',
    })
  },
} as SlashCommand