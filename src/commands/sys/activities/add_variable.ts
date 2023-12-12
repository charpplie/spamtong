import { SlashCommand } from '@/comx'
import { IComModel, IComData } from '@models/activities'

export default {
  name: 'add-variable',
  description: 'GET LOST',
  options: [
    {
      name: 'activity',
      description: 'get lost',
      required: true,
      type: 'STRING',
    },
    {
      name: 'variable-name',
      description: 'get lost',
      required: true,
      type: 'STRING',
    },
    {
      name: 'variable-value',
      description: 'get lost',
      required: true,
      type: 'STRING',
    },
  ],
  isOwnerOnly: true,
  guilds: ['1150427580734906368'],
  cooldown: '10s',
  callback: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true })

    const activity = interaction.options.get('activity')?.value as string
    const varName = interaction.options.get('variable-name')?.value as string
    const varValue = interaction.options.get('variable-value')?.value as string

    if (!client?.commands.has(activity) && !client?.events.has(activity)) {
      await interaction.editReply({
        content: '<:poel:1168156790245040169>',
      })
      return
    }

    const data: IComData = {
      [varName]: varValue
    }

    const activityDb = await IComModel.findOne({where: { activity: activity }})
    const activityData: any = activityDb?.get('data')
    if (activityData === null) {
      activityDb?.update({
        data: data,
      })
    } else {
      let new_data: IComData = data
      for (let i = 0; i < Object.keys(activityData).length; i++) {
        new_data[`${Object.keys(activityData)[i]}`] = `${Object.values(activityData)[i]}`
      }

      activityDb?.update({
        data: new_data,
      })
    }
    await interaction.editReply({
      content: 'Ok!'
    })
  },
} as SlashCommand