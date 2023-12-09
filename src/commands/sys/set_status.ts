import { SlashCommand } from '@/comx'
import { PresenceStatusData } from 'discord.js'

export default {
  name: 'sys-set-status',
  description: 'Selfdescriptive',
  options: [
    {
      name: 'status',
      description: 'Selfdescriptive',
      type: 'STRING',
      required: true,
      choices: [
        { name: 'Online',         value: 'online' },
        { name: 'Idle',           value: 'idle'},
        { name: 'Do not disturb', value: 'dnd'},
        { name: 'Invisible',      value: 'invisible'}
      ],
    },
    {
      name: 'application',
      description: 'Selfdescriptive',
      type: 'STRING',
      required: false,
    },
    {
      name: 'application-action',
      description: 'Selfdescriptive',
      type: 'INTEGER',
      required: false,
      minValue: 0,
      maxValue: 5,
      choices: [
        { name: 'Playing',    value: 0 },
        { name: 'Streaming',  value: 1 },
        { name: 'Listening',  value: 2 },
        { name: 'Watching',   value: 3 },
        { name: 'Custom',     value: 4 },
        { name: 'Competing',  value: 5 },
      ],
    },
  ],
  isOwnerOnly: true,
  guilds: ['1150427580734906368'],
  cooldown: '1m',
  callback: async (interaction) => {
    await interaction.deferReply({ ephemeral: true})
    const status  = interaction.options.get('status')?.value
    const app     = interaction.options.get('application')?.value
    const app_act = interaction.options.get('application-action')?.value

    if (app && app_act) {
      interaction.client.user.setPresence({
        status: status as PresenceStatusData,
        activities: [
          {
            name: app as string,
            type: app_act as number
          }
        ]
      })
    } else if (app) {
      interaction.client.user.setPresence({
        status: status as PresenceStatusData,
        activities: [
          {
            name: app as string,
            type: 0
          }
        ]
      })
    } else if (!app_act) {
      interaction.client.user.setPresence({
        status: status as PresenceStatusData,
      })
    }

    await interaction.editReply({
      content: 'Ok!'
    })
  },
} as SlashCommand